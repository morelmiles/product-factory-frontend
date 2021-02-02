export interface CAPABILITY_CHILDREN_TYPE {
  productId?: number;
  capabilityId?: number;
}

export type TaskType = {
  id?: number,
  title?: any,
  status: string
}

export type TagType = {
  id: number;
  name: string;
}

export const PARTNER_TYPES = ["", "Creator", "Service Provider", "Supporter"];
export const USER_TYPES = ["", "Admin", "Contributor", "Watcher"];
export const TASK_CLAIM_TYPES = ["Done", "Active", "Failed"];
export const TASK_TYPES = ["Draft", "Pending", "Available", "Claimed", "Done"];
export const INITIATIVE_TYPES = ["Active", "Completed"];
