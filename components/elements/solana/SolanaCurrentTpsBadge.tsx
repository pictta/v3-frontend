'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SolanaCurrentTpsBadge = () => {
    const [tps, setTps] = useState<number>(0);

    const getTps = async () => {
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!, {
                jsonrpc: '2.0',
                id: 1,
                method: 'getRecentPerformanceSamples',
                params: [1],
            });

            if (response.data.result.length > 0) {
                setTps(response.data.result[0].numTransactions / response.data.result[0].samplePeriodSecs);
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };

    // initial
    useEffect(() => {
        getTps();
    }, []);

    // every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            getTps();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-row items-center gap-x-2 px-2">
            <div className="text-right text-white text-opacity-70 text-sm font-semibold font-figtree leading-snug">TPS: {tps && Math.floor(tps).toLocaleString()}</div>
        </div>
    );
};

export default SolanaCurrentTpsBadge;
