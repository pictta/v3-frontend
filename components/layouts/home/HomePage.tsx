import React from 'react';

// ui
import StartTokenButton from '@/components/elements/buttons/StartTokenButton';
import CoinList from '@/components/coin/layouts/CoinList';

const HomePage = () => {
    return (
        <div className="lg:flex lg:h-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto border-l border-white/10">
                <div className="mx-2 mb-40">
                    <div className="mt-[120px] text-center">
                        <div className="text-center mb-8">
                            <span className="base-white text-[40px] font-semibold">Launch something </span>
                            <span className="text-blue-200 text-[40px] font-semibold base-text">cool</span>
                            <span className="text-[40px] font-semibold base-white"> today</span>
                        </div>
                        <StartTokenButton />
                    </div>
                    <div className="relative py-[80px] flex flex-col justify-center max-w-[1414px] mx-auto">
                        <CoinList fullScreen={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
