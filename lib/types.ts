export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const SAVE_TAGS = "SAVE_TAGS";
export const SET_CURRENT_PROJECT = "SET_CURRENT_PROJECT";
export const SET_USER_ROLE = "SET_USER_ROLE";
export const SET_WORK_STATE = "SET_WORK_STATE";
export const ADD_REPOSITORY = "ADD_REPOSITORY";
export const SET_CAPABILITIES = "SET_CAPABILITIES";
export const ADD_CAPABILITY = "ADD_CAPABILITY";

export interface BaseAction {
  type: string;
  payload?: any;
}
