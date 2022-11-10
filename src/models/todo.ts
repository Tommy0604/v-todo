export interface Todo {
  id: string;
  title: string;
  done: boolean;
  type: string;
  createTime: string;
  overdueTime?: string;
  remindTime?: string;
  reminded?: boolean;
  repeatType?: string;
}

export enum TodoType {
  MYDAY = "myday",
  ALL = "all",
  PLANS = "plans",
  COMPLETED = "completed",
}

export interface Calendar {
  icon: string;
  key: string;
  text: string;
  secondaryText?: string;
}

export interface Remind extends Calendar {}
export interface Repeat extends Calendar {}
