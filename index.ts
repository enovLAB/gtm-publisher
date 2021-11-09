#!/usr/bin/env node
import { google } from 'googleapis';
import { exit } from 'process';
import  * as fs from '@supercharge/fs';

import * as yargs from 'yargs'

const scopes =  [
    'https://www.googleapis.com/auth/tagmanager.edit.containers',
    'https://www.googleapis.com/auth/tagmanager.edit.containerversions',
    'https://www.googleapis.com/auth/tagmanager.publish'
]
const tagmanager = google.tagmanager('v2');

const auth = new google.auth.GoogleAuth({
    keyFile: './yoop-dev1-na-4dcd624a8fe9.json', scopes
});

const getAccountId = async () => {
    const authClient = await auth.getClient();
    const accounts = await tagmanager.accounts.list({ auth: authClient });
    return (accounts.data.account|| [])[0]?.accountId 
}

const getContainerId = async (accountId: string) => {
    const authClient = await auth.getClient();
    const containers = await tagmanager.accounts.containers.list({
        parent: `accounts/${accountId}`, auth: authClient 
    });

    return (containers.data.container || [])[0]?.containerId
}

const getWorkspaceId = async (accountId: string, containerId: string) => {
    const authClient = await auth.getClient();
    const workspaces = await tagmanager.accounts.containers.workspaces.list({
        parent: `accounts/${accountId}/containers/${containerId}`, auth: authClient
    })

    return (workspaces.data.workspace || [])[0].workspaceId
}

async function main () {
    const argv = await yargs
    .option('googleJWT', {
        alias: 'j',
        description: 'The path of the google service token in JSON format',
        type: 'string',
        demandOption: true,
    })
    .option('templateId', {
        alias: 't',
        description: 'The tag template Id',
        type: 'string',
        demandOption: true,
    })
    .option('templatePath', {
        alias: 'p',
        description: 'the path to the template file',
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

    let account = argv.accountId || await getAccountId() 
    if (!account) {
        console.error("Account not found")
        exit(1)
    }

    let container = argv.containerId || await getContainerId(account) 
    if (!container) {
        console.error("container not found")
        exit(1)
    }

    let workspace = argv.workspaceId || await getWorkspaceId(account, container) 
    if (!container) {
        console.error("workspace not found")
        exit(1)
    }

    if (!argv.templateId) {
        console.error("missing template id")
        exit(1)
    }

    if (!argv.templatePath || !(await fs.exists(argv.templatePath))) {
        console.error("invalid path provided")
        exit(1)
    }


    let path = `accounts/${account}/containers/${container}/workspaces/${workspace}/templates/${argv.templateId}`
    console.log(`updating template at path ${path}`)

    const authClient = await auth.getClient();
    const data = await fs.content(argv.templatePath)
    const res = await tagmanager.accounts.containers.workspaces.templates.update({
        path: path, auth: authClient, requestBody: {
            templateData: data
        }
    })

    let template = res?.data?.templateData || ""

    const tempAvatar = await fs.tempFile('test.tpl')
    await fs.writeFile(tempAvatar, template)

    console.log(`update completed with status code ${JSON.stringify(res.statusText)}`);
}

(async () => {
    try { 
        await main()
    } catch(e) {
        console.error(`Failed to update template: ${e}`)
        exit(2)
    }
})()
