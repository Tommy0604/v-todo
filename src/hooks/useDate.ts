import dayjs, { Dayjs } from "dayjs";
import { DateType, RepeatType } from "@/models";
import { i18nDayjs, useI18nStore } from ".";
import { LANG_VALUE, i18n } from "../i18n";
import { computed, watch } from "vue";
const { t } = i18n.global;

function useDate() {

  let isZH;
  watch(() => useI18nStore().language, (_val,) => {
    isZH = _val === LANG_VALUE.Zh;
  }, {
    immediate: true,
  })

  function duePipe(dateType: DateType): Dayjs {
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

  function transfromDuePipe(date: string | Dayjs | undefined) {
    if (!date) return;
    const isToday = dayjs(date).isSame(dayjs(), "day");
    const isTomorrow = dayjs(date).isSame(dayjs().add(1, "day"), "day");
    const isNextWeek = dayjs(date).isSame(dayjs().add(1, "week"), "week");
    let dateType;
    if (isToday) {
      dateType = DateType.TODAY;
    } else if (isTomorrow) {
      dateType = DateType.TOMORROW;
    } else if (isNextWeek) {
      dateType = DateType.LATER_TODAY;
    }
    return dateType;
  }

  function calendarPipe(
    date?: string | number | dayjs.Dayjs | Date | null | undefined
  ): string {
    const formats = isZH ?
      {
        sameDay: `[${t("calendar.today")}], A h:mm`,
        nextDay: `[${t("calendar.tomorrow")}], A h:mm`,
        nextWeek: "MMMM D, ddd, h:mm A",
        lastDay: "MMMM D, h:mm A",
        lastWeek: "MMMM D, ddd, h:mm A",
        sameElse: "YYYY, MMMM D, h:mm A",
      } : {
        sameDay: `h:mm A, [${t("calendar.today")}] `, // The same day ( 2:30 AM, Today )
        nextDay: `h:mm A, [${t("calendar.tomorrow")}]`, // The next day ( 2:30 AM, Tomorrow )
        nextWeek: "h:mm A, ddd, MMMM D", // The next week ( 2:30 AM, Mon, October 31 )
        lastDay: "h:mm A, MMMM D", // The day before ( 2:30 AM, Yesterday )
        lastWeek: "h:mm A, ddd, MMMM D", // The last week ( 2:30 AM, Mon, XXX 17 )
        sameElse: "h:mm A, MMMM D, YYYY", // Everything else ( 2:30 AM, Mon 1, 2022 )
      }
    return i18nDayjs(date).calendar(null, formats);
  }

  function overduePipe(date: string | Dayjs) {
    const formats = isZH ?
      {
        sameDay: `[${t("calendar.today")}]`,
        nextDay: `[${t("calendar.tomorrow")}]`,
        nextWeek: "MMMM D, ddd",
        lastDay: "MMMM D, h:mm A",
        lastWeek: "MMMM D, ddd, h:mm A",
        sameElse: "YYYY, MMMM D, h:mm A",
      } : {
        sameDay: `[${t("calendar.today")}]`,
        nextDay: `[${t("calendar.tomorrow")}]`,
        nextWeek: "ddd, MMMM D",
        lastDay: "h:mm A, MMMM D",
        lastWeek: "h:mm A, ddd, MMMM D",
        sameElse: "h:mm A, MMMM D, YYYY",
      }
    return i18nDayjs(date).calendar(null, formats);
  }

  function getCalendarList() {
    const day = dayjs().day();
    return computed(() => [
      {
        key: DateType.TODAY,
        icon: "today",
        text: "today",
        secondaryText: i18nDayjs().isoWeekday(day).format("ddd"),
      },
      {
        key: DateType.TOMORROW,
        icon: "tomorrow",
        text: "tomorrow",
        secondaryText: i18nDayjs()
          .isoWeekday(day + 1)
          .format("ddd"),
      },
      {
        key: DateType.NEXT_WEEK,
        icon: "next-week",
        text: "next_week",
        secondaryText: i18nDayjs().isoWeekday(1).format("ddd"),
      },
    ]);
  }

  function getRemindList() {
    return computed(() => {
      return [
        {
          key: DateType.LATER_TODAY,
          icon: "later-today",
          text: "later_today",
          secondaryText: i18nDayjs()
            .add(dayjs().minute() >= 30 ? 4 : 3, "h")
            .format(isZH ? "A h:00" : "h:00 A"),
        },
        {
          key: DateType.TOMORROW,
          icon: "later-tomorrow",
          text: "tomorrow",
          secondaryText:
            i18nDayjs().add(1, "day").format("ddd, 9 ") + t("calendar.am"),
        },
        {
          key: DateType.NEXT_WEEK,
          icon: "later-next-week",
          text: "next_week",
          secondaryText:
            i18nDayjs().isoWeekday(1).format("ddd, 9 ") + t("calendar.am"),
        },
      ];
    });
  }

  function getRepeadList() {
    return [
      {
        key: RepeatType.DAILY,
        icon: "daily",
        text: RepeatType.DAILY,
      },
      {
        key: RepeatType.WEEKDAYS,
        icon: "weekdays",
        text: RepeatType.WEEKDAYS,
      },
      {
        key: RepeatType.WEEKLY,
        icon: "weekly",
        text: RepeatType.WEEKLY,
      },
      {
        key: RepeatType.MONTHLY,
        icon: "monthly",
        text: RepeatType.MONTHLY,
      },
      // feeling not used
      // {
      //   key: RepeatType.YEARLY,
      //   icon: "yearly",
      //   text: RepeatType.YEARLY,
      // },
    ];
  }

  return {
    duePipe, calendarPipe, overduePipe, transfromDuePipe,
    getCalendarList, getRemindList, getRepeadList
  };
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
  const nowTime = new Date().getTime();
  const timePoints = time.split(":").map((i) => parseInt(i)) || ["00"];
  let recent = new Date().setHours(...(timePoints as [number, ...number[]]));

  recent >= nowTime || (recent += 24 * 3600000);

  setTimeout(() => {
    func();
    intervalId = setInterval(func, interval * 3600000);
  }, recent - nowTime);
  return intervalId;
}

export { useDate, timeoutFunc };
