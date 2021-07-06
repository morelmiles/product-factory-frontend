import {UploadFile} from "antd/es/upload/interface";

export interface CreatePersonProps {
    modal: boolean,
    closeModal: Function,
}

export interface Person {
    firstName: string,
    lastName: string,
    bio: string
}

export interface AvatarUpload {
    open: boolean,
    setOpen: Function,
    fileList: UploadFile[],
    setFileList: Function,
    upload: Function
}
