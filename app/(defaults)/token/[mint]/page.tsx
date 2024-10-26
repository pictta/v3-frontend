// react & next
import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

// ui
import ChatClientProvider from '@/components/chat/ChatClientProvider';
import { ChatRoomProvider } from '@/components/chat/ChatRoomProvider';
import CoinContentPage from '@/components/coin/layouts/CoinContentPage';
// import PageViewTracker from '@/components/coin/elements/pageview-tracker';

import { CoinService } from '@/services/coin.service';
import { Coin } from '@/types/types';
import { CoinDataProvider } from '@/components/coin/CoinDataProvider';

type Props = {
    params: { mint: string };
    // searchParams: { [key: string]: string | string[] | undefined };
};

async function getData(mint: string): Promise<Coin> {
    try {
        // const res = await new TokenService().getTokenByMintAddress(mint);
        const { data }: { data: Coin } = await new CoinService().getCoinByMintAddress(mint);
        return data;
    } catch (error) {
        console.error('Error fetching coin data:', error);
        throw error;
    }
}

// Fetch the coin data and generate metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const coin: Coin = await getData(params.mint);

    if (!coin) {
        // Redirect if coin is not found
        redirect('/');
    }

    return {
        title: `${coin.name} - HYPE3`,
        description: coin.description || '',
        openGraph: {
            title: `{coin.name} - HYPE3`,
            description: coin.description || '',
            url: 'https://hype3.cool',
            images: [
                {
                    url: coin.imageUri || '',
                    width: 256,
                    height: 256,
                    alt: `{coin.name} - HYPE3`,
                },
            ],
            siteName: 'Hype3.Cool',
        },
        // twitter: {
        //     card: 'summary_large_image',
        //     title: coin.name || 'Token',
        //     description: coin.description || '',
        //     images: [coin.imageUri || '/default-image.jpg'],
        // },
    };
}

export default async function Page({ params }: Props) {
    let coin: Coin | null = null;
    try {
        coin = await getData(params.mint);

        if (!coin) {
            return redirect('/');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Redirect to home or show an error page
        redirect('/');
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CoinDataProvider mint={coin?.mint} solCollectionWallet={coin?.solCollectionWallet}>
                <ChatClientProvider>
                    <ChatRoomProvider roomId={coin?.mint} amountToChat={0}>
                        <CoinContentPage coin={coin} />
                        {/* <PageViewTracker coin={coin} /> */}
                    </ChatRoomProvider>
                </ChatClientProvider>
            </CoinDataProvider>
        </Suspense>
    );
}
