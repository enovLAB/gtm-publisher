import { Auth, google } from 'googleapis';
import { Args } from './types';

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
