<template>
  <a-dropdown :trigger="['contextmenu']" overlayClassName="todo-item">
    <div class="todo-item">
      <a-checkbox @change="onDoneChange($event, todo)" :checked="todo.done"></a-checkbox>
      <button class="todo-item__title-wrapper">
        <span :class="{ done: todo.done }"> {{ todo.title }} </span>
        <div class="meta-data-info-group">
          <span class="meta-data-info" v-if="todo.overdueTime">
            <span class="todo-info__date" :class="isOverdue(todo.overdueTime)">
              <icon-font :type="'icon-calendar'" :style="{ 'font-size': '1.6rem' }" />
              <span class="todo-info__label">{{
                overduePipe(todo.overdueTime)
              }}</span>
            </span>
          </span>
          <span class="meta-data-info" v-if="todo.remindTime">
            <span class="todo-info__reminder">
              <icon-font :type="'icon-remind'" :style="{ 'font-size': '1.6rem' }" />
              <span class="todo-info__label">{{
                calendarPipe(todo.remindTime)
              }}</span>
            </span>
          </span>
          <span class="meta-data-info" v-if="todo.completionTime">
            <span class="todo-info__date">
              <icon-font :type="'icon-sun'" />
              <span class="todo-info__label">{{
                calendarPipe(todo.remindTime)
              }}</span>
            </span>
          </span>
        </div>
      </button>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1" @click="onRemove(todo.id)">
          删除任务
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script lang="ts">
export default {
  name: "TodoItem"
}
</script>
<script setup lang="ts">
// import modal from "./modal.vue";
import { Todo } from "@/models";
import { Dayjs, dayjs, IconFont } from "@/shared";
import { useDate } from "@/hooks/useDate";
let { calendarPipe, overduePipe } = useDate();

const emits = defineEmits<{ (e: 'onRemove', id: string): void }>()

let props = defineProps<{ todo: Todo }>();

function isOverdue(date: string | Dayjs) {
  if (dayjs(date).isToday()) return "dueToday";
  else if (dayjs(date) < dayjs()) return "overdue";
  else return "";
}

const onDoneChange = (e: Event, todo: Todo) => {
  todo.done = !todo.done;
  todo.completionTime = todo.done ? dayjs().format() : "";
};

const onRemove = (id: string) => emits('onRemove', id);

</script>

<style lang="scss" scoped>
button {
  background: none;
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: none;
}

.todo-item {
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

@media (hover: hover) {
  .todo-item:hover {
    background-color: #eff6fc;
    // background-color: $--bg-hover;
  }
}

::v-deep() {
  .ant-checkbox-inner {
    border-radius: 10px;
  }

  .ant-checkbox-checked::after {
    border-radius: 10px;
  }

  .ant-checkbox-wrapper {
    padding: 0px;
    cursor: pointer;
    height: 32px;
    width: 32px;
    position: relative;
    line-height: 32px;
  }
}
</style>