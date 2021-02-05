import { BaseAction, USER_LOGGED_IN } from '../types';

export type UserState = {
  isLoggedIn: boolean;
  fullName: string;
};

// const userId = window.localStorage.getItem("user_id");
// const fullName = window.localStorage.getItem("fullName");

export const userReducer = (
  state: any = {
    isLoggedIn: false,//userId ? true : false,
    fullName: ''
  },
  action: BaseAction
) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return {...state, ...action.payload};
  }
  return state;
};
