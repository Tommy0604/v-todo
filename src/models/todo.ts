export interface Todo {
  id: string;
  title: string;
  done: boolean;
  type: string;
  createTime: string;
  overdueTime?: string;
  remindTime?: string; 
  reminded?: boolean;
}

export enum TodoType {
  MYDAY = "myday",
  ALL = "all",
  PLANS = "plans",
  COMPLETED = "completed",
}
