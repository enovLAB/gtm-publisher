#!/usr/bin/env node
import * as fs from '@supercharge/fs';
import { google, tagmanager_v2 } from 'googleapis';
import { exit } from 'process';
import * as yargs from 'yargs';
import { createAuth, getAccountInfo } from './accountHelper';
import { ListArgs, TemplateArgs } from './types';
const pkj = require('../package.json')

const tagmanager = google.tagmanager('v2');

const updateTagTemplate = async (argv: TemplateArgs) => {
    const { templateId, templatePath} = argv
    if (!templatePath || !(await fs.exists(argv.templatePath))) {
        console.error("invalid path provided")
        exit(1)
    }

    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId} = await getAccountInfo(argv, auth)

    let path = `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}/templates/${templateId}`;
    console.log(`updating template at path ${path}`);

    const authClient = await auth.getClient();
    const data = await fs.content(argv.templatePath);
    const res = await tagmanager.accounts.containers.workspaces.templates.update({
        path: path, auth: authClient, requestBody: {
            templateData: data
        }
    });
}

const listVariables = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = await getAccountInfo(argv, auth)

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.variables.list({
        parent: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        auth: authClient
    })
}

const createWorkspace = async (argv: any) => {
    const { name } = argv
    const auth = createAuth(argv)
    const { accountId, containerId } = await getAccountInfo(argv, auth)

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.create({
        parent: `accounts/${accountId}/containers/${containerId}`,
        auth: authClient, 
        requestBody: { name }
    })
}

const listTags = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = await getAccountInfo(argv, auth)

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.tags.list({
        parent: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        auth: authClient
    })
}

const listTriggers = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = await getAccountInfo(argv, auth)

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.triggers.list({
        parent: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        auth: authClient
    })
}

const listTemplates = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = await getAccountInfo(argv, auth)

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.templates.list({
        parent: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        auth: authClient
    })
}

const getTemplate = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = await getAccountInfo(argv, auth)

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.templates.get({
        path: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}/templates/${argv.templateId}`,
        auth: authClient
    })
}

async function main () {
    const argv = await yargs
    .command('updateTagTemplate <templateId> <templatePath>', 'make a get HTTP request', () => {}, async ( argv: TemplateArgs ) => {
        await updateTagTemplate(argv)
    })
    .command('getTemplate <templateId>', 'make a get HTTP request', () => {}, async ( argv: TemplateArgs ) => {
         const res = await getTemplate(argv)
         console.log(res.data.templateData)
    })
    .command('create workspace <name>', 'lists the objects of the given type', () => {}, async ( argv: ListArgs ) => {
        const res = await createWorkspace(argv);
        console.log(res.data.workspaceId)
    })
    .command('list <type> [output]', 'lists the objects of the given type', () => {}, async ( argv: ListArgs ) => {
        const { output } = argv
        let data: any;
        switch (argv.type) {
            case 'variable': {
                const res =  await listVariables(argv)
                data = res.data.variable
            }; 
            break;
            case 'tag': {
                const res = await listTags(argv)
                data = res.data.tag
            };
            break;  
            case 'trigger': {
                const res = await listTriggers(argv)
                data = res.data.trigger
            }
            break;
            case 'templates': {
                const res = await listTemplates(argv)
                data = res.data.template
            }
            break;
            default:
                console.error(`invalid type ${argv.type}`)
                exit(3)
        }

        const outputData = data ? JSON.stringify(data, null, 2) : ""
        if (output) {
            fs.writeFile(output, outputData)
        } else {
            console.log(outputData)
        }
    })
    .option('googleJWT', {
        alias: 'j',
        description: 'The path of the google service token in JSON format',
        type: 'string',
        demandOption: true,
    })
    .option('accountId', {
        alias: 'a',
        description: 'The GTM account Id',
        type: 'string'
    })
    .option('containerId', {
        alias: 'c',
        description: 'The GTM container Id',
        type: 'string'
    })
    .option('workspaceId', {
        alias: 'w',
        description: 'The GTM workspace Id',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

}

(async () => {
    try { 
        await main()
    } catch(e) {
        console.error(`Failed to update template: ${e}`)
        exit(2)
    }
})()