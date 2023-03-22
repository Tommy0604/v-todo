import dayjs, { Dayjs } from "dayjs";
import { DateType } from "../models/base";

function useDate() {
  function datePipe(dateType: DateType): Dayjs {
    let date = dayjs();
    switch (dateType) {
      case DateType.TODAY:
        break;
      case DateType.TOMORROW:
        date = dayjs().add(1, "day");
        break;
      case DateType.NEXT_WEEK:
        date = dayjs().add(1, "week").day(1);
        break;
      case DateType.LATER_TODAY:
        date = dayjs()
          .add(dayjs().minute() >= 30 ? 4 : 3, "h")
          .startOf("h");
        break;
      default:
        break;
    }
    return date;
  }

  function calendarPipe(
    date?: string | number | dayjs.Dayjs | Date | null | undefined
  ): string {
    return dayjs(date).locale("en").calendar(null, {
      sameDay: "h:mm A, [Today] ", // The same day ( 2:30 AM, Today )
      nextDay: "h:mm A, [Tomorrow] ", // The next day ( 2:30 AM, Tomorrow )
      nextWeek: "h:mm A, ddd, MMMM D", // The next week ( 2:30 AM, Mon, October 31 )
      lastDay: "h:mm A, MMMM D", // The day before ( 2:30 AM, Yesterday )
      lastWeek: "h:mm A, ddd, MMMM D", // The last week ( 2:30 AM, Mon, XXX 17 )
      sameElse: "h:mm A, MMMM D, YYYY", // Everything else ( 2:30 AM, Mon 1, 2022 )
    });
  }

  function overduePipe(date: string | Dayjs) {
    return dayjs(date).locale("en").calendar(null, {
      sameDay: "[Today]",
      nextDay: "[Tomorrow]",
      nextWeek: "ddd, MMMM D",
      lastDay: "h:mm A, MMMM D",
      lastWeek: "h:mm A, ddd, MMMM D",
      sameElse: "h:mm A, MMMM D, YYYY",
    });
  }
  return { datePipe, calendarPipe, overduePipe };
}

/**
 *
 * @param param0 interval defaut 1 h
 * @param func
 */
function timeoutFunc(
  {
    time,
    interval = 1,
    runNow,
  }: { time: string; interval?: number; runNow?: boolean },
  func
): NodeJS.Timer {
  runNow && func();

  let intervalId;
  let nowTime = new Date().getTime();
  let timePoints = time.split(":").map((i) => parseInt(i)) || ["00"];
  let recent = new Date().setHours(...(timePoints as [number, ...number[]]));

  recent >= nowTime || (recent += 24 * 3600000);

  setTimeout(() => {
    func();
    intervalId = setInterval(func, interval * 3600000);
  }, recent - nowTime);
  return intervalId;
}

export { useDate, timeoutFunc };
