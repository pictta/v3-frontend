'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import bs58 from 'bs58';
import { SigninMessage } from '@/utils/SigninMessage';

import { dispatch, useSelector } from '@/store';
import { getMe } from '@/store/slices/auth';
// import { getAppConfig } from '@/store/slices/appConfig';

// web3auth
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WEB3AUTH_NETWORK, IWeb3AuthCoreOptions, IAdapter } from '@web3auth/base';
import { SolanaPrivateKeyProvider, SolanaWallet } from '@web3auth/solana-provider';
import { getDefaultExternalAdapters } from '@web3auth/default-solana-adapter';
import { PhantomAdapter } from '@web3auth/phantom-adapter';


import { AuthAdapter } from '@web3auth/auth-adapter';
import RPC from '@/utils/solanaRPC';
import { closeWalletSelectDialog, openWalletSelectDialog } from '@/store/slices/themeConfigSlice';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!; // get from https://dashboard.web3auth.io

const chainConfig = {
    chainId: process.env.NEXT_PUBLIC_ENV === 'prod' ? '0x1' : '0x3',
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    rpcTarget: process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!,
    tickerName: 'SOLANA',
    ticker: 'SOL',
    decimals: 9,
    blockExplorerUrl: process.env.NEXT_PUBLIC_ENV === 'prod' ? 'https://explorer.solana.com' : 'https://explorer.solana.com/?cluster=devnet',
    logo: 'https://images.toruswallet.io/sol.svg',
};

const phantomAdapter = new PhantomAdapter({
    clientId,
    sessionTime: 3600, // 1 hour in seconds
    web3AuthNetwork: process.env.NEXT_PUBLIC_ENV === 'prod' ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: process.env.NEXT_PUBLIC_ENV === 'prod' ? '0x1' : '0x3',
        rpcTarget: process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!,
    },
});

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthContextValue {
    walletSignIn: () => Promise<void>;
    logout: () => void;
    loggedIn: boolean | null;
    web3Auth: Web3AuthNoModal | null;
    provider?: IProvider | null;
    defaultSolanaAdapters: IAdapter<unknown>[];
    loginWithAdapter: (adapterName: string) => Promise<void>;
    adapaters: IAdapter<unknown>[];
    modalOpen: boolean;
    setModalOpen: (modalOpen: boolean) => void;
}

export const AuthContext = createContext<AuthContextValue>({
    walletSignIn: async () => {},
    logout: () => {},
    loggedIn: null,
    web3Auth: null,
    provider: null,
    defaultSolanaAdapters: [],
    loginWithAdapter: async () => {},
    adapaters: [],
    modalOpen: false,
    setModalOpen: (modalOpen: boolean) => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter();
    const wallet = useWallet();
    const { connection } = useConnection();
    const walletModal = useWalletModal();

    const { data: session, status } = useSession();
    const { authUser, getMeStatus, prevPublicKey } = useSelector((state: any) => state.auth);

    const [web3Auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean | null>(false);

    const [adapaters, setAdapters] = useState<IAdapter<unknown>[]>([]);
    let defaultSolanaAdapters: IAdapter<unknown>[] = [];

    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

                const web3authOptions: IWeb3AuthCoreOptions = {
                    clientId,
                    privateKeyProvider,
                    web3AuthNetwork: process.env.NEXT_PUBLIC_ENV === 'prod' ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
                };
                const _web3auth = new Web3AuthNoModal(web3authOptions);
                setWeb3Auth(_web3auth);

                // Configure adapters
                const authAdapter = new AuthAdapter({
                    privateKeyProvider,
                    adapterSettings: {
                        uxMode: UX_MODE.REDIRECT,
                    },
                });
                _web3auth.configureAdapter(authAdapter);

                // Fetch and configure default adapters

                defaultSolanaAdapters = await getDefaultExternalAdapters({ options: web3authOptions });
                defaultSolanaAdapters.forEach((adapter) => {
                    _web3auth.configureAdapter(adapter);
                });

                setAdapters(defaultSolanaAdapters);
                await _web3auth.init();

                // Check if already connected
                if (_web3auth.connected) {
                    setLoggedIn(true);
                    setProvider(_web3auth.provider);
                    // setProvider(_web3auth.provider);
                }

                // Listen for connection changes
                _web3auth.on('connected', () => {
                    setLoggedIn(true);
                    setProvider(_web3auth.provider);
                });

                _web3auth.on('disconnected', () => {
                    setLoggedIn(false);
                });
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const signMessage = async () => {
        try {
            if (!provider) return;

            const rpc = new RPC(provider);
            const address = await rpc.getAccounts();

            const csrf = await getCsrfToken();
            if (!web3Auth?.connected || !csrf) return; //  || !wallet.signMessage

            const message = new SigninMessage({
                domain: window.location.host,
                publicKey: address[0],
                statement: `Welcome to Hype3!\n\nClick to sign in and accept the Our Terms of Service: ${process.env.NEXT_PUBLIC_HOST}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`,
                nonce: csrf,
            });

            const data = new TextEncoder().encode(message.prepare());
            const solanaWallet = new SolanaWallet(provider);
            const signature = await solanaWallet.signMessage(data);
            const serializedSignature = bs58.encode(signature);

            signIn('credentials', {
                message: JSON.stringify(message),
                redirect: false,
                signature: serializedSignature,
            });
        } catch (error) {
            console.log('signMessage error', error);
        }
    };

    useEffect(() => {
        if (web3Auth?.connected && status === 'unauthenticated') {
            signMessage();
        }
    }, [web3Auth, status, provider]);

    const walletSignIn = async () => {
        dispatch(openWalletSelectDialog());
    };

    // after sign in
    // const afterSign = async () => {};

    // fetch user data
    useEffect(() => {
        if (session?.user?.id && status === 'authenticated') {
            dispatch(getMe());
        }
    }, [session?.user?.id, status]);

    // detect wallet change, TODO in web3auth
    // useEffect(() => {
    //     if (wallet.connected && wallet.publicKey?.toBase58() !== prevPublicKey) {
    //         dispatch(setPrevPublicKey(wallet.publicKey?.toBase58()));
    //     }
    // }, [wallet.connected, wallet.publicKey]);

    // // ask for wallet sign if wallet is connected
    // // TODO: not trigger if user is just logout
    // useEffect(() => {
    //     if (wallet.connected && wallet.publicKey) {
    //         if (status == 'unauthenticated') {
    //             walletSignIn();
    //         }
    //     }
    // }, [wallet.connected, status]);

    const logout = async () => {
        try {
            if (web3Auth) {
                if (web3Auth.connected) {
                    await web3Auth.logout();
                }

                setProvider(null);
                setLoggedIn(false);
                await signOut({ callbackUrl: '/', redirect: true });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getProvider = () => {
        if (typeof window !== 'undefined') {
            if ('phantom' in window) {
                const provider = window.phantom?.solana;

                if (provider?.isPhantom) {
                    return provider;
                }
            }
        }
        // window.open('https://phantom.app/', '_blank');
    };

    if (typeof window !== 'undefined') {
        const phantom = getProvider();

        if (phantom && wallet?.publicKey) {
            phantom.on('accountChanged', (publicKey) => {

                if (publicKey) {
                    logout();
                }

                if (!publicKey) {
                    logout();
                }
            });
        }
    }

    const loginWithAdapter = async (adapterName: string) => {
        if (!web3Auth) return;
        if (!web3Auth.connected) {
            const web3AuthProvider = await web3Auth?.connectTo(adapterName);
            setProvider(web3AuthProvider);
        } else {
            await signMessage();
        }

        // refresh the page using router hook
        dispatch(closeWalletSelectDialog());
        router.refresh();
    };

    const value: AuthContextValue = {
        walletSignIn,
        logout,
        loggedIn,
        web3Auth,
        provider,
        defaultSolanaAdapters,
        loginWithAdapter,
        adapaters,
        modalOpen,
        setModalOpen,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
