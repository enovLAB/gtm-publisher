import { Auth, google } from 'googleapis';
import { Args } from './types';

const tagmanager = google.tagmanager('v2');

export const createAuth = (argv: Args) => {
    const scopes = [
        'https://www.googleapis.com/auth/tagmanager.edit.containers',
        'https://www.googleapis.com/auth/tagmanager.edit.containerversions',
        'https://www.googleapis.com/auth/tagmanager.publish',
    ];
    
    const credentials = JSON.parse(argv.googleJWT) 
    return new google.auth.GoogleAuth({
        credentials: credentials, scopes
    });
}

export const getAccountInfo = async (argv: any, auth: Auth.GoogleAuth) => {
    let accountId = argv.accountId || await getAccountId(auth) 
    if (!accountId) {
       throw "Account not found"
    }

    let containerId = argv.containerId || await getContainerId(accountId, auth) 
    if (!containerId) {
        throw "container not found"
    }

    let workspaceId = argv.workspaceId || await getWorkspaceId(accountId, containerId, auth) 
    if (!workspaceId) {
        throw "workspace not found"
    }

    return { accountId, containerId, workspaceId }
}

const getAccountId = async (auth: Auth.GoogleAuth) => {
    const authClient = await auth.getClient();
    const accounts = await tagmanager.accounts.list({ auth: authClient });
    return (accounts.data.account|| [])[0]?.accountId 
}

const getContainerId = async (accountId: string, auth: Auth.GoogleAuth) => {
    const authClient = await auth.getClient();
    const containers = await tagmanager.accounts.containers.list({
        parent: `accounts/${accountId}`, auth: authClient 
    });

    return (containers.data.container || [])[0]?.containerId
}

const getWorkspaceId = async (accountId: string, containerId: string, auth: Auth.GoogleAuth) => {
    const authClient = await auth.getClient();
    const workspaces = await tagmanager.accounts.containers.workspaces.list({
        parent: `accounts/${accountId}/containers/${containerId}`, auth: authClient
    })

    return (workspaces.data.workspace || [])[0].workspaceId
}