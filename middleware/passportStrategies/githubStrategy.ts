import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { VerifyCallback } from 'passport-oauth2';
import { Request } from 'express';
import { database } from '../../models/userModel';

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: "",
        clientSecret: "",
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },
    
    /* (FIXED) 😭 */
    async (req: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
        const user = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: '',
            role: "user"
        };
        database.push(user);
        done(null, profile);
    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
