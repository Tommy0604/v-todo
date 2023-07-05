import { defineAsyncComponent } from "vue";
import DropdownCalendar from "./dropdown/dropdown.vue";
const Drawer = defineAsyncComponent(() => import('./drawer/drawer.vue'))
const TodoList = defineAsyncComponent(() => import('./TodoList.vue'))
const Tooltips = defineAsyncComponent(() => import('./tooltips/tooltips.vue'))
export {
  TodoList,
  Tooltips,
  DropdownCalendar,
  Drawer,
}