'use client';

import App from '@/App';
import { store } from '@/store';
import { Provider } from 'react-redux';
import React, { ReactNode, Suspense, useEffect, useState } from 'react';



// solana
import '@solana/wallet-adapter-react-ui/styles.css';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import { AuthProvider } from '../auth/AuthProvider';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';


interface IProps {
    children?: ReactNode;
}

const SOLANA_CONNECTION_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST;



const ProviderComponent = ({ children }: IProps) => {
    const network = SOLANA_CONNECTION_ENDPOINT;
    const endpoint = useMemo(() => SOLANA_CONNECTION_ENDPOINT, [network]);
    const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [network]);

    // const [web3auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
    // const [provider, setProvider] = useState<IProvider | null>(null);
    // const [loggedIn, setLoggedIn] = useState<boolean | null>(false);
    
    // let defaultSolanaAdapters: IAdapter<unknown>[] = [];

    return (
        <Provider store={store}>
            <ConnectionProvider endpoint={endpoint || clusterApiUrl('mainnet-beta')}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <AuthProvider>
                            <App>{children}</App>
                        </AuthProvider>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </Provider>
    );
};

export default ProviderComponent;
