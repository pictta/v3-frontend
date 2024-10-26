import { StatusType, User } from '@/types/types';

export const INITIAL_STATUS: StatusType = 'idle';

export const iconMap = {
    expand: 'icon-expand',
    globe: 'icon-globe',
    twitter: 'icon-x-twitter',
    telegram: 'icon-telegram-no-bg',
    connect: 'icon-chain',
    shrink: 'icon-shrink',
    discord: 'icon-discord',
};

export const iconLabelMap = {
    expand: 'Solscan',
    globe: 'Website',
    twitter: 'Twitter',
    telegram: 'Telegram',
    connect: 'Solscan',
    shrink: 'Token',
    discord: 'Discord',
};

// 0 to 6 , make them as constants
export const DEFAULT_USER_PROFILE_PIC = Array.from({ length: 8 }).map((_, index) => `/assets/images/avatar${index}.png`);

export const MINIMUM_CHAT_BALANCE = 1;

export const TARGET_FUNDING_AMOUNT = 85;        // 85 SOL

export const EmptyUser: User = {
    _id: null,
    uid: 0,
    username: '',
    displayName: '',
    image: '',
    walletAddresses: [],
    isAdmin: false,
    twitter: {
        id: '',
        name: '',
        username: '',
        image: '',
    },
    createdAt: null,
    updatedAt: null,
};


export const PAGE_LINKS = {
    HOME: '/',
    TOKEN: '/token',
    TOKEN_CREATE: '/token-create',
}