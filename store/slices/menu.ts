// third-party
import { EmptyUser } from '@/constants/constants';
import { User } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';

export interface MenuStateProps {
    isUploadProfilePic: boolean;
    isSidePanelOpen: boolean;
    sidePanelType?: string;         // profile | settings | notifications | member |  token | online-user
    sidePanelData: any | User[];
}

const initialState: MenuStateProps = {
    isUploadProfilePic: false,
    isSidePanelOpen: false,
    sidePanelType: '',
    sidePanelData: null,
};

const slice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        openUploadProfilePic(state) {
            state.isUploadProfilePic = true;
        },
        closeUploadProfilePic(state) {
            state.isUploadProfilePic = false;
        },

        openSidePanel(state, action) {
            state.isSidePanelOpen = true;
            state.sidePanelType = action.payload.type;
            state.sidePanelData = action.payload.data;
        },
        closeSidePanel(state) {
            state.isSidePanelOpen = false;
            state.sidePanelType = '';
        },
    },
});

export default slice.reducer;
export const { openUploadProfilePic, closeUploadProfilePic, openSidePanel, closeSidePanel } = slice.actions;

// ACTIONS ----------------------------------------------------------------------

