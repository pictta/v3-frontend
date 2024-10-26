import React, { Suspense } from 'react';
import { Metadata } from 'next';

import ChatClientProvider from '@/components/chat/ChatClientProvider';
import { ChatRoomProvider } from '@/components/chat/ChatRoomProvider';
import HomePage from '@/components/layouts/home/HomePage';

export const metadata: Metadata = {
    title: 'Hype3',
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatClientProvider>
                <ChatRoomProvider roomId="hype3">
                    <HomePage />
                </ChatRoomProvider>
            </ChatClientProvider>
        </Suspense>
    );
}
