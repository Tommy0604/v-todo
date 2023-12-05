<template>
  <a-dropdown :trigger="['contextmenu']" overlayClassName="content">
    <div class="content">
      <a-checkbox @change="onDoneChange($event, todoItem)" :checked="todoItem.done"></a-checkbox>
      <button class="todo-item__title-wrapper" @click="onClick">
        <span :class="{ done: todoItem.done }"> {{ todoItem?.title }} </span>
        <div class="meta-data-info-group">
          <span class="meta-data-info" v-if="todoItem.overdueTime">
            <span class="todo-info__date" :class="isOverdue(todoItem)">
              <icon-font :type="'icon-calendar'" :style="{ 'font-size': '1.6rem' }" />
              <span class="todo-info__label">
                {{ overduePipe(todoItem.overdueTime) }}
              </span>
            </span>
          </span>
          <span class="meta-data-info" v-if="todoItem.remindTime">
            <span class="todo-info__reminder">
              <icon-font :type="'icon-remind'" :style="{ 'font-size': '1.6rem' }" />
              <span class="todo-info__label">
                {{ calendarPipe(todoItem.remindTime) }}</span>
            </span>
          </span>
          <span class="meta-data-info" v-if="todoItem.completionTime">
            <span class="todo-info__date">
              <icon-font :type="'icon-sun'" />
              <span class="todo-info__label">
                {{ calendarPipe(todoItem.remindTime) }}
              </span>
            </span>
          </span>
        </div>
      </button>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1" @click="onRemove(todoItem.id)">
          {{ $t('delete_task') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <Drawer :visible="visible" :todo="todoItem" @close="afterCloseChange"></Drawer>
</template>
<script lang="ts">
export default {
  name: "TodoItem"
}
</script>
<script setup lang="ts">
import { reactive, ref } from "vue";
// import modal from "./modal.vue";
import { Todo } from "@/models";
import { Dayjs, dayjs, IconFont } from "@/shared";
import { useDate } from "@/hooks";
import { Drawer } from ".";
import { CheckboxChangeEvent } from "ant-design-vue/lib/checkbox/interface";

let { calendarPipe, overduePipe } = useDate();
const emits = defineEmits<{ (e: 'onRemove', id: string): void }>()

let props = defineProps<{ data: Todo }>();
let visible = ref<boolean>(false);

let todoItem = reactive(props.data);
const isOverdue = (date: Todo) => {
  return dayjs(date.overdueTime || null) > dayjs() || dayjs(date.completionTime || null).isToday() ?
    "dueToday" : dayjs(date.overdueTime) < dayjs() ?
      "overdue" : "";
}

const onDoneChange = (e: CheckboxChangeEvent, data: Todo) => {
  data.done = !data.done;
  data.completionTime = data.done ? dayjs().format() : "";
};

const onClick = () => {
  visible.value = true;
}

const onRemove = (id: string) => emits('onRemove', id);

const afterCloseChange = (data: Todo) => {
  visible.value = false;

  todoItem.done = data.done;
  todoItem.title = data.title;
  todoItem.overdueTime = data.overdueTime;
  todoItem.remindTime = data.remindTime;
  todoItem.repeatType = data.repeatType;
  todoItem.createTime = data.createTime;
}
</script>

<style lang="scss" scoped>
button {
  background: none;
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: none;
}

.content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0px 16px;
  min-height: 52px;
  position: relative;
  word-wrap: break-word;
  word-break: break-word;
}

.meta-data-info,
.meta-data-info-group,
.todo-info__date,
.todo-info__reminder {
  display: flex;
  align-items: center;
}

.todo-info__date {
  &.dueToday {
    color: #2564cf;
    // color: var(--font-color-brand);
  }

  &.overdue {
    color: #a80000;
    // color: var(--font-color-warning);
  }
}

.todo-item__title-wrapper {
  font-size: 1.4rem;
  position: relative;
  flex: 1 1 0px;
  min-height: 52px;
  padding: 8px 14px;
  line-height: 2rem;
  overflow: hidden;
  cursor: pointer;
  text-align: left;


  .meta-data-info-group {
    font-size: 1.2rem;
    line-height: 1.6rem;
    color: #797775;
    // color: var(--font-color-secondary);
    flex-wrap: wrap;
  }

  .meta-data-info {
    flex-wrap: wrap;

    .anticon {
      font-size: 1.6rem;
    }

    &::after {
      color: #797775;
      // color: var(--font-color-secondary);
      content: "\2022";
      margin: 0 6px;
    }

    &:last-child::after {
      content: "";
    }
  }

  .todo-info__label {
    margin-left: 4px;
    white-space: nowrap;
  }
}

.done {
  text-decoration: line-through;
  color: #797775;
  // color: var(--font-color-tertiary);
}
</style>