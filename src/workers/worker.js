import { timeoutFunc } from "../hooks/useDate";
import { RepeatType } from "../models";

let intervalId = null;

onmessage = (e) => {
  if (typeof e.data.type === "stop") {
    return clearInterval(intervalId);
  }
  const todoList = e.data.todoList;
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
            break;
          case RepeatType.MONTHLY:
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

onerror = () => clearInterval(intervalId);
