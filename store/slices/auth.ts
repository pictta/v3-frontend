// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import { User } from 'types/types';

import { EmptyUser, INITIAL_STATUS } from 'constants/constants';
import { StatusType } from '@/types/types';
import { UserService } from '@/services/user.service';
import { AuthService } from '@/services/auth.service';

export interface AuthStateProps {
    authUser: User;
    getMeStatus: StatusType;
    updateProfileStatus: StatusType;
    removeUserTwitterStatus: StatusType;
    prevPublicKey: string | null;
}

const initialState: AuthStateProps = {
    authUser: EmptyUser,
    getMeStatus: INITIAL_STATUS,
    updateProfileStatus: INITIAL_STATUS,
    removeUserTwitterStatus: INITIAL_STATUS,
    prevPublicKey: null,
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getMeStart(state) {
            state.getMeStatus = 'loading';
        },
        getMeSuccess(state, action) {
            state.getMeStatus = 'success';
            state.authUser = action.payload;
        },
        getMeFailure(state) {
            state.getMeStatus = 'failure';
        },
        getMeReset(state) {
            state.getMeStatus = 'idle';
        },

        updateProfileStart(state) {
            state.updateProfileStatus = 'idle';
            state.updateProfileStatus = 'loading';
        },
        updateProfileSuccess(state, action) {
            state.updateProfileStatus = 'success';
            state.authUser = action.payload;
        },
        updateProfileFailure(state) {
            state.updateProfileStatus = 'failure';
        },
        updateProfileReset(state) {
            state.updateProfileStatus = 'idle';
        },

        removeUserTwitterStart(state) {
            state.removeUserTwitterStatus = 'idle';
            state.removeUserTwitterStatus = 'loading';
        },
        removeUserTwitterSuccess(state, action) {
            state.removeUserTwitterStatus = 'success';
            state.authUser = action.payload;
        },
        removeUserTwitterFailure(state) {
            state.removeUserTwitterStatus = 'failure';
        },
        removeUserTwitterReset(state) {
            state.removeUserTwitterStatus = 'idle';
        },

        resetAuthState(state) {
            // state.authUser = EmptyUser;
        },

        setPrevPublicKey: (state, action) => {
            state.prevPublicKey = action.payload;
        },
        clearUser: (state) => {
            state.authUser = EmptyUser;
            state.getMeStatus = INITIAL_STATUS;
            state.prevPublicKey = null;
        },

    },
});

export default slice.reducer;
export const { getMeReset, updateProfileReset, removeUserTwitterReset, resetAuthState, setPrevPublicKey, clearUser } = slice.actions;

// ACTIONS ----------------------------------------------------------------------

export function getMe() {
    return async (dispatch: any) => {
        dispatch(slice.actions.getMeStart());
        try {
            const res = await new AuthService().getMe();
            dispatch(slice.actions.getMeSuccess(res.data));
        } catch (error) {
            dispatch(slice.actions.getMeFailure());
            // dispatch(slice.actions.hasError(error));
        }
    };
}



/**
 * Update authenticated user profile
 * @param id | user id
 * @param data | user data
 * @returns
 */
export function updateProfile(id: string, data: Partial<User>) {
    return async (dispatch: any, getState: any) => {
        dispatch(slice.actions.updateProfileStart());
        try {
            const res = await new UserService().update(id, data);
            if (res && res.data) {
                dispatch(slice.actions.updateProfileSuccess(res.data));
                dispatch(getMe());
            }
        } catch (error) {
            dispatch(slice.actions.updateProfileFailure());
            // handleError(error);
        }
    };
}

export function removeUserTwitter(id: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(slice.actions.removeUserTwitterStart());
        try {
            const res = await new AuthService().removeTwitter(id);
            if (res && res.data) {
                dispatch(slice.actions.removeUserTwitterSuccess(res.data));
            }
        } catch (error) {
            dispatch(slice.actions.removeUserTwitterFailure());
            // handleError(error);
        }
    };
}
