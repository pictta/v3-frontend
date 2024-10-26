import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getCsrfToken } from 'next-auth/react';

import { JWT } from 'next-auth/jwt';
import { SigninMessage } from '@/utils/SigninMessage';

async function refreshToken(token: JWT): Promise<JWT> {
    const res = await fetch(process.env.NEXT_PUBLIC_API_HOST + '/auth/refresh', {
        method: 'POST',
        headers: {
            authorization: `Refresh ${token.backendTokens.refreshToken}`,
        },
    });

    const response = await res.json();
    return {
        ...token,
        backendTokens: response,
    };
}

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: 'Solana',
            credentials: {
                message: {
                    label: 'Message',
                    type: 'text',
                },
                signature: {
                    label: 'Signature',
                    type: 'text',
                },
            },
            async authorize(credentials, req) {
                try {
                    const signinMessage = new SigninMessage(JSON.parse(credentials?.message || '{}'));
                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);
                    if (signinMessage.domain !== nextAuthUrl.host) {
                        return null;
                    }

                    const csrfToken = await getCsrfToken({ req: { ...req, body: null } });

                    if (signinMessage.nonce !== csrfToken) {
                        return null;
                    }

                    const validationResult = await signinMessage.validate(credentials?.signature || '');

                    if (!validationResult) throw new Error('Could not validate the signed message');

                    const res = await fetch(process.env.NEXT_PUBLIC_API_HOST! + '/auth/signup/solana', {
                        method: 'POST',
                        body: JSON.stringify({
                            wallet: signinMessage.publicKey,
                            autoSignUp: true,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (res.status == 401) {
                        return null;
                    }

                    const user = await res.json();
                    return user;
                } catch (e) {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) return { ...token, ...user };
            if (new Date().getTime() < token.backendTokens.expiresIn) return token;
            return await refreshToken(token);
        },
        async session({ session, token }) {
            session.user = token.user;
            session.backendTokens = token.backendTokens;
            return session;
        },
    },
    logger: {
        error(code, metadata) {
            console.log(code, metadata);
        },
    },
};
