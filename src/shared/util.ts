import { createFromIconfontCN } from "@ant-design/icons-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import dayjs, { Dayjs  } from "dayjs";
import calendar from 'dayjs/plugin/calendar';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
dayjs.extend(calendar);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

 const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_3638573_lv2y6hxcb5c.js",
});

export {
  IconFont,
  PlusOutlined,
  dayjs, Dayjs,
}