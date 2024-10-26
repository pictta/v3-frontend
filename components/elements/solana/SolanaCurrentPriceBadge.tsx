'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type SolanaCurrentPriceProps = {
    className?: string;
};

const SolanaCurrentPriceBadge = ({ className }: SolanaCurrentPriceProps) => {
    const [price, setPrice] = useState<number>(0);

    const getSolanaPrice = async () => {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
            setPrice(response.data.solana.usd);
        } catch (error) {
            // console.log(error);
        }
    };

    // initial
    useEffect(() => {
        getSolanaPrice();
    }, []);

    // every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            getSolanaPrice();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex flex-row items-center gap-x-2 px-2 ${className}`}>
            <span className="icon-solana text-sm text-blue-400"></span>
            <div className="text-right text-white text-opacity-70 text-sm font-semibold font-figtree leading-snug">$ {price > 0 ? price : '--'}</div>
        </div>
    );
};

export default SolanaCurrentPriceBadge;
