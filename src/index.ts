#!/usr/bin/env node
import * as fs from '@supercharge/fs';
import { google, tagmanager_v2 } from 'googleapis';
import { exit } from 'process';
import * as yargs from 'yargs';
import { createAuth } from './accountHelper';
import { ListArgs, TemplateArgs } from './types';
const pkj = require('../package.json')

const tagmanager = google.tagmanager('v2');

const updateTagTemplate = async (argv: TemplateArgs) => {
    const { templateId, templatePath } = argv
    if (!templatePath || !(await fs.exists(argv.templatePath))) {
        console.error("invalid path provided")
        exit(1)
    }

    const googleAuth = createAuth(argv)
    const auth = await googleAuth.getClient()
    const { accountId, containerId, workspaceId } = argv

    let parent = `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`

    const data = await fs.content(argv.templatePath);
    const template = parseInt(templateId)
    if (isNaN(template)) {
        console.log(`creating new template in ${parent}`);
        return await tagmanager.accounts.containers.workspaces.templates.create({
            parent, auth, requestBody: {
                templateData: data
            }
        });
    }

    let path = `${parent}/templates/${template}`;
    console.log(`updating template at path ${path}`);
    return await tagmanager.accounts.containers.workspaces.templates.update({
        path: path, auth, requestBody: {
            templateData: data
        }
    });
}

const listVariables = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = argv

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.variables.list({
        parent: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        auth: authClient
    })
}

const createWorkspace = async (argv: any) => {
    const { name } = argv
    const auth = createAuth(argv)
    const { accountId, containerId } = argv

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.create({
        parent: `accounts/${accountId}/containers/${containerId}`,
        auth: authClient,
        requestBody: { name }
    })
}

const deleteWorkspace = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = argv
    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.delete({
        path: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        auth: authClient
    })
}

const createVersion = async (argv: any) => {
    const { name } = argv
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = argv

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.create_version({
        path: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        auth: authClient,
        requestBody: { name }
    })
}

const listTags = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = argv

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.tags.list({
        parent: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        auth: authClient
    })
}

const listTriggers = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = argv

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.triggers.list({
        parent: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        auth: authClient
    })
}

const listTemplates = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = argv

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.templates.list({
        parent: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        auth: authClient
    })
}

const getTemplate = async (argv: any) => {
    const auth = createAuth(argv)
    const { accountId, containerId, workspaceId } = argv

    const authClient = await auth.getClient();
    return await tagmanager.accounts.containers.workspaces.templates.get({
        path: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}/templates/${argv.templateId}`,
        auth: authClient
    })
}

async function main() {
    const argv = await yargs
        .command('updateTagTemplate <templateId> <templatePath> [output]', 'make a get HTTP request', () => { }, async (argv: TemplateArgs) => {
            try {
                const res = await updateTagTemplate(argv)
                const { templateId, name, fingerprint, templateData } = res.data
                const outputData = JSON.stringify(
                    { templateId, name, fingerprint, templateData }
                    , null, 2)
                if (argv.output) {
                    fs.writeFile(argv.output, outputData)
                } else {
                    console.log(outputData)
                }
            } catch (e) {
                console.error(e)
                exit(3)
            }
        })
        .command('getTemplate <templateId>', 'make a get HTTP request', () => { }, async (argv: TemplateArgs) => {
            const res = await getTemplate(argv)
            console.log(res.data.templateData)
        })
        .command('createWorkspace <name>', 'lists the objects of the given type', () => { }, async (argv: ListArgs) => {
            try {
                const res = await createWorkspace(argv);
                console.log(res.data.workspaceId)
            } catch (e) {
                console.error(e)
                exit(3)
            }
        })
        .command('deleteWorkspace', 'lists the objects of the given type', () => { }, async (argv: ListArgs) => {
            try {
                await deleteWorkspace(argv);
            } catch (e) {
                console.error(e)
                exit(3)
            }
        })
        .command('stampVersion <name>', 'lists the objects of the given type', () => { }, async (argv: ListArgs) => {
            try {
                const res = await createVersion(argv);
                console.log(JSON.stringify(res.data.containerVersion))
            } catch (e) {
                console.error(e)
                exit(3)
            }
        })
        .command('list <type> [output]', 'lists the objects of the given type', () => { }, async (argv: ListArgs) => {
            const { output } = argv
            let data: any;
            switch (argv.type) {
                case 'variable': {
                    const res = await listVariables(argv)
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
            type: 'string',
            demandOption: true,
        })
        .option('containerId', {
            alias: 'c',
            description: 'The GTM container Id',
            type: 'string',
            demandOption: true,
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
    } catch (e) {
        console.error(`Failed to update template: ${e}`)
        exit(2)
    }
})()
