'use client';
import React, { useEffect } from 'react';
import BaseDialog from './BaseDialog';
import { Coin } from '@/types/types';
import WalletAddressChip from '../chips/WalletAddressChip';

import PriceButton from '../buttons/PriceButton';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PresaleTimer from '@/components/elements/PresaleTimer';

import { dispatch, IRootState, useSelector } from '@/store';
import { useCoinData } from '@/components/coin/CoinDataProvider';

type PresaleDialogProps = {
    coin: Coin;
    open: any;
    setOpen: React.Dispatch<any>;
};

// Yup schema for input validation
const schema = yup.object().shape({
    amount: yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required'),
});

const PresaleDialog = ({ coin, open, setOpen }: PresaleDialogProps) => {
    const { buyPresale, sendingSOL } = useCoinData();

    // const { provider } = useAuth();
    const { createPresaleTransactionStatus } = useSelector((state: IRootState) => state.coin);
    const isPresaleEnded = coin?.presaleEndAt && new Date(coin?.presaleEndAt) < new Date();

    const { control, handleSubmit, reset, setValue, register, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            amount: 0,
        },
    });

    const onSubmit = async (data: { amount: number }) => {
        // TODO: check if provider is available, not null
        if (coin && coin?._id) {
            await buyPresale(coin._id.toString(), data.amount);
        }
    };

    // action after success of presale transaction
    useEffect(() => {
        if (createPresaleTransactionStatus === 'success') {
            reset(); // reset the form value after success
            setOpen(false);
        }
    }, [createPresaleTransactionStatus]);

    return (
        <BaseDialog open={open} setOpen={setOpen}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6">
                    <div className="flex flex-col justify-between">
                        <div className="flex justify-between border-b border-dashed border-white/10">
                            <div className="flex items-start">
                                <img className="w-12 h-12 rounded-[5px]" loading="lazy" src={coin?.imageUri || '/assets/images/token-default-avatar.jpeg'} alt={coin?.name} />
                                <div className="ml-3.5 flex flex-col justify-between">
                                    <div className="base text-white/90 font-semibold text-lg lg:text-[22px] mr-1 mb-1.5">{coin?.symbol}</div>
                                    <div className="flex flex-row justify-start flex-wrap gap-2.5">
                                        <WalletAddressChip address={`${coin.mint}`} prefix="CA:" />
                                        <WalletAddressChip address={`${coin.solCollectionWallet}`} prefix="FUND:" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative my-6">
                            <input
                                {...register('amount')}
                                className="h-[80px] py-3 px-4 pr-28 block w-full border-none shadow-none rounded-lg !text-blue-200 text-[46px] disabled:opacity-50 disabled:pointer-events-none placeholder:text-blue-200/20 bg-blue-200/5"
                                placeholder="0.00"
                                type="text"
                                pattern="^\d+(\.\d{0,6})?$" // Updated pattern to allow up to 6 decimal places
                                onKeyDown={(e) => {
                                    // Allow Backspace and Delete keys
                                    if (e.key === 'Backspace' || e.key === 'Delete') {
                                        return; // Allow these keys
                                    }

                                    // Prevent input if it is not a number or a decimal point
                                    if (!/[0-9]/.test(e.key) && e.key !== '.') {
                                        e.preventDefault();
                                    }

                                    // Prevent multiple decimal points
                                    const currentValue = (e.target as HTMLInputElement)?.value;
                                    if (e.key === '.' && currentValue.includes('.')) {
                                        e.preventDefault();
                                    }

                                    // Prevent entering more than 6 decimal places
                                    if (currentValue.includes('.')) {
                                        const decimalPart = currentValue.split('.')[1];
                                        if (decimalPart.length >= 6 && !/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }
                                }}
                            />

                            <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-4 text-blue-200 text-2xl font-medium font-figtree leading-snug space-x-2">
                                <div>SOL</div>
                                <span className="icon-solana" />
                            </div>
                        </div>

                        <div className="button-group flex flex-row items-center gap-x-2">
                            {['Reset', '1 SOL', '5 SOL', '10 SOL', '100 SOL'].map((label) => (
                                <PriceButton
                                    key={label}
                                    label={label}
                                    onClick={() => {
                                        if (label === 'Reset') {
                                            setValue('amount', 0);
                                        } else {
                                            const value = parseFloat(label.split(' ')[0]);
                                            setValue('amount', value);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="w-full h-[50px] bg-[#03e1ff] rounded-[10px] mt-5 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isPresaleEnded || watch('amount') <= 0 || sendingSOL}
                        >
                            {coin?.presaleEndAt && (
                                <PresaleTimer presaleEndAt={coin?.presaleEndAt} className="text-center text-black text-base font-bold font-figtree" wrapText={`Buy Presale (Ends in %) ⏳`} />
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </BaseDialog>
    );
};

export default PresaleDialog;
