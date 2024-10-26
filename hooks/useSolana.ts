import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const useSolana = () => {
    const [balance, setBalance] = useState<number | null>(null);

    const { connection } = useConnection();
    const wallet = useWallet();
    
    useEffect(() => {
        const getBalance = async () => {
            try {
                if (wallet?.publicKey) {
                    const accountInfo = await connection.getAccountInfo(wallet.publicKey);
                    if (accountInfo) {
                        const lamports = accountInfo.lamports;
                        const solBalance = lamports / 10 ** 9; // Convert lamports to SOL
                        setBalance(solBalance);
                    }
                }
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        if (wallet?.publicKey) {
            getBalance();
        }
    }, [wallet?.publicKey]);

    return balance;
};

export default useSolana;