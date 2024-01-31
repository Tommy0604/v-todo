console.log("Worker initialized");

import { timeoutFunc } from "../hooks/useDate";
import { RepeatType } from "../models";

let todoList = [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let intervalId;

onmessage = (e) => {
  todoList = e.data.todoList;
  if (e.data.type === "stop") {
    todoList = [];
    return self.close();
  } else if (e.data.type === "update") {
    return (todoList = e.data.todoList);
  }

  intervalId = timeoutFunc({ time: "00:00:00", interval: 1 }, () => {
    todoList.forEach((item) => {
      if (!!item.repeatType && !item.overdue) {
        switch (item.repeatType) {
          case RepeatType.DAILY:
            postMessage(item);
            break;
          case RepeatType.WEEKDAYS:
            const isWeekend = new Date().getDay() % 6 === 0;
            !isWeekend && postMessage(item);
            break;
          case RepeatType.WEEKLY:
            {
              const today = new Date();
              const currentDayOfWeek = today.getDay();
              const daysToMonday = (currentDayOfWeek + 6) % 7;

              const isMonday = currentDayOfWeek === 1;
              const isThisWeekMonday = daysToMonday === 0 && isMonday;

              if (isThisWeekMonday) {
                postMessage(item);
              }
            }
            break;
          case RepeatType.MONTHLY:
            {
              const today = new Date();
              const currentMonth = today.getMonth();

              // 设置日期为1号，获取月份
              today.setDate(1);
              const newMonth = today.getMonth();
              const isNewMonth = currentMonth !== newMonth;

              if (isNewMonth) {
                postMessage(item);
              }
            }
            break;
          case RepeatType.YEARLY:
            break;
          default:
            break;
        }
      }
    });
  });
};

onerror = () => self.close();
