import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            uid: number;
            //   email: string;
            username: string;
            displayName: string;
            image?: string | null;
        };

        backendTokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        };
    }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
    interface JWT {
        user: {
            id: string;
            uid: number;
            //   email: string;
            username: string;
            displayName: string;
            image?: string | null;
        };

        backendTokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        };
    }
}
