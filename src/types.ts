export interface Args {
    googleJWT: string;
    accountId: string | undefined;
    containerId: string | undefined;
    workspaceId: string | undefined;
}

export interface TemplateArgs extends Args {
    templatePath: string;
    templateId: string;
}

export interface ListArgs extends Args {
    type: 'variable' | 'tag' | 'trigger' | 'templates';
    output: string | undefined
}

export interface CreateArgs extends Args {
    input: string | undefined
}
