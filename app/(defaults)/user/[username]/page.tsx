import * as React from 'react';
import { redirect } from 'next/navigation';

import { UserService } from '@/services/user.service';

import UserBasicProfile from '@/components/user/UserBasicProfile';

import ChatClientProvider from '@/components/chat/ChatClientProvider';
import { ChatRoomProvider } from '@/components/chat/ChatRoomProvider';

async function getUser(username: string): Promise<any> {
    try {
        const res = await new UserService().getProfile(username);
        if (res && res.data) {
            return res.data;
        }
    } catch (error) {
        throw error;
    }
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
    const username = params.username;

    let userData: any;
    try {
        userData = await getUser(username);
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Redirect to home or show an error page
        redirect('/');
    }

    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <ChatClientProvider>
                <ChatRoomProvider roomId="hype3">
                    <div className="flex flex-col justify-center max-w-screen-xl mx-auto mt-[80px]">
                        <UserBasicProfile data={userData} hasTabs={true} />
                    </div>
                </ChatRoomProvider>
            </ChatClientProvider>
        </React.Suspense>
    );
}
