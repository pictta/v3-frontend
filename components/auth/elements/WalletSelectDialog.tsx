'use client';

import React, { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Z_INDEX } from '@/theme/zIndex';
import { dispatch, useSelector } from '@/store';
import { IRootState } from '@/store';
import { closeWalletSelectDialog } from '@/store/slices/themeConfigSlice';
import { useAuth } from '../AuthProvider';

import { IAdapter } from '@web3auth/base';
// import { useAuth } from '@/hooks/useAuth'; // Adjust this import based on your file structure

const WalletSelectDialog = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const { adapaters, loginWithAdapter } = useAuth(); // Access the web3Auth instance

    const handleClose = () => {
        dispatch(closeWalletSelectDialog());
    };

    return (
        <Transition appear show={themeConfig.walletSelectDialog} as={Fragment}>
            <Dialog as="div" open={themeConfig.walletSelectDialog} onClose={handleClose} className="relative" style={{ zIndex: Z_INDEX.modal }}>
                <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-hidden">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="p-1 w-full max-w-md rounded-[20px] flex items-center justify-center relative overflow-hidden shadow-2xl transition-transform transform-gpu">
                                <div className="px-8 pb-6 text-center flex flex-col justify-start items-center relative z-[1100] bg-[#1f2a37] rounded-2xl">
                                    <div className="base-white text-center text-2xl font-semibold my-9">Connect Wallet</div>
                                    {adapaters?.map((adapter: IAdapter<unknown>) => (
                                        <button
                                            key={adapter.name.toUpperCase()}
                                            onClick={() => loginWithAdapter(adapter.name)}
                                            className="hype3-icon-text-btn text-blue-200 h6 font-semibold hype3-bg-emerald-to-teal"
                                        >
                                            {/* <pre className='text-white'>{JSON.stringify(adapter)}</pre> */}
                                            Login with {adapter.name.charAt(0).toUpperCase() + adapter.name.slice(1)} Wallet 
                                        </button>
                                    ))}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default WalletSelectDialog;