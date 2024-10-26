import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

export function useTokenBalances(tokens: { mint: string; symbol: string }[]) {
    const [balances, setBalances] = useState<{ symbol: string; mint: string; balance: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { connection } = useConnection();
    const wallet = useWallet();

    useEffect(() => {
        const getBalances = async () => {
            if (wallet?.publicKey) {
                setIsLoading(true);

                try {
                    // Fetch token accounts for both token programs
                    const tokenAccountResults = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_PROGRAM_ID });
                    const tokenAccountResults2022 = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_2022_PROGRAM_ID });

                    // Combine results from both token programs
                    const allTokenAccounts = [...tokenAccountResults.value, ...tokenAccountResults2022.value];

                    // Create an array to hold the balances
                    const tokenBalances = [];

                    // Check each token for its balance
                    for (const { mint, symbol } of tokens) {
                        const tokenAccount = allTokenAccounts.find(({ account }) => account.data.parsed.info.mint === mint);
                        const tokenAmount = tokenAccount?.account.data.parsed.info.tokenAmount.uiAmount || 0;

                        // Only add to the balances array if the balance is greater than 0
                        if (tokenAmount > 0) {
                            tokenBalances.push({ symbol, mint, balance: tokenAmount });
                        }
                    }

                    setBalances(tokenBalances);
                } catch (error) {
                    console.error('Error fetching balances:', error);
                    setBalances([]); // Reset balances on error
                } finally {
                    setIsLoading(false);
                }
            } else {
                setBalances([]); // Reset balances if wallet is not connected
            }
        };

        getBalances();
    }, [connection, wallet?.publicKey, tokens]);

    return {
        balances,
        isLoading,
    };
}

// import { useEffect, useState } from 'react';
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import { PublicKey } from '@solana/web3.js';
// import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

// export function useTokenBalances(tokenAddresses: string[]) {
//     const [balances, setBalances] = useState<{ mint: string; balance: number }[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const { connection } = useConnection();
//     const wallet = useWallet();

//     useEffect(() => {
//         const getBalances = async () => {
//             if (wallet?.publicKey) {
//                 setIsLoading(true);

//                 try {
//                     // Fetch token accounts for both token programs
//                     const tokenAccountResults = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_PROGRAM_ID });
//                     const tokenAccountResults2022 = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_2022_PROGRAM_ID });

//                     // Combine results from both token programs
//                     const allTokenAccounts = [...tokenAccountResults.value, ...tokenAccountResults2022.value];

//                     // Create an array to hold the balances
//                     const tokenBalances = [];

//                     // Check each mint address for its balance
//                     for (const mintAddress of tokenAddresses) {
//                         const tokenAccount = allTokenAccounts.find(({ account }) => account.data.parsed.info.mint === mintAddress);
//                         const tokenAmount = tokenAccount?.account.data.parsed.info.tokenAmount.uiAmount || 0;

//                         // Only add to the balances array if the balance is greater than 0
//                         if (tokenAmount > 0) {
//                             tokenBalances.push({ mint: mintAddress, balance: tokenAmount });
//                         }
//                     }

//                     setBalances(tokenBalances);
//                 } catch (error) {
//                     console.error('Error fetching balances:', error);
//                     setBalances([]); // Reset balances on error
//                 } finally {
//                     setIsLoading(false);
//                 }
//             } else {
//                 setBalances([]); // Reset balances if wallet is not connected
//             }
//         };

//         getBalances();
//     }, [connection, wallet?.publicKey, tokenAddresses]);

//     return {
//         balances,
//         isLoading,
//     };
// }