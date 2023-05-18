<template>
  <!-- :maskStyle="{'visibility': 'visible'}" -->
  <a-drawer v-model:visible="visible" :headerStyle="{ 'background-color': '#faf9f8' }"
    :bodyStyle="{ 'background-color': '#faf9f8' }" :footerStyle="{ 'background-color': '#faf9f8' }" class="custom-class"
    placement="right" @close="onClose">
    <div class="detail">
      <div class="detail-header">
        <a-checkbox @change="onDoneChange" :checked="data.done"></a-checkbox>
        <a-input v-model:value="data.title" :bordered="false" @compositionstart="lock = false"
          @compositionend="lock = true" @keydown.enter="inputEnter" />
      </div>
      <div class="section">
        <div class="section-item">
          <dropdown-calendar ref="dropdownRef" :calendarList="calendarList" @clickMenu="clickDue" :showCustomItem="true">
            <button class="section-innerClick">
              <div class="section-inner">
                <div class="section-icon">
                  <icon-font :type="'icon-calendar'" />
                </div>
                <div class="section-content">
                  <div class="section-title">
                    <span class="date">{{ pickDateText ? t(`calendar.${pickDateText}`) : t('footer.calendar') }}</span>
                  </div>
                  <div class="section-description">
                    <span class="data"></span>
                  </div>
                </div>
              </div>
            </button>
          </dropdown-calendar>
        </div>
        <div class="section-item">
          <DropdownCalendar :calendarList="remindList" @clickMenu="clickRemind" :showTimePick="true"
            :showCustomItem="true">
            <button class="section-innerClick">
              <div class="section-inner">
                <div class="section-icon">
                  <icon-font :type="'icon-remind'" />
                </div>
                <div class="section-content">
                  <div class="section-title">
                    <span class="date"> {{ remindText ? calendarPipe(remindText) : t('footer.remind') }}</span>
                  </div>
                </div>
              </div>
            </button>
          </DropdownCalendar>
        </div>
        <div class="section-item">
          <DropdownCalendar :calendarList="repeadList" @clickMenu="clickRepeat" :showTimePick="true">
            <button class="section-innerClick">
              <div class="section-inner">
                <div class="section-icon">
                  <icon-font :type="'icon-repeat'" />
                </div>
                <div class="section-content">
                  <div class="section-title">
                    <span class="date"> {{ repeatType ? t(`calendar.${repeatType}`) : t('footer.repeat') }}</span>
                  </div>
                </div>
              </div>
            </button>
          </DropdownCalendar>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="detailFooter">
        <span class="date">
          {{ t('created_time', { time: overduePipe(createTime) }) }}
        </span>
      </div>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { DropdownCalendar, Tooltips } from "@/components";
import { useDate, useTodos } from '@/hooks';
import { Calendar, DateType, Remind, Repeat, Todo } from '@/models';
import { Dayjs, dayjs, IconFont } from '@/shared';
import { ComputedRef, reactive, ref, unref } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n();
let { duePipe, overduePipe, calendarPipe, getCalendarList, getRemindList, getRepeadList, transfromDuePipe } = useDate();
// const { todo } = useTodos();
const props = defineProps<{
  visible: Boolean,
  todo: Todo
}>()
// todo.value!
let data = unref(props.todo);
let lock = ref(true);
let calendarList: ComputedRef<Calendar[]> = getCalendarList();
let remindList: ComputedRef<Remind[]> = getRemindList();
let repeadList: Repeat[] = getRepeadList();

let pickDateText = ref<string>(transfromDuePipe(data.overdueTime)),
  remindText = ref<string | undefined>(data.remindTime),
  repeatType = ref<string | undefined>(data.repeatType),
  createTime = ref(data.createTime);

const emits = defineEmits<{
  (e: 'close', data): void
}>()

const onClose = (bool: boolean) => {
  emits('close', data);
};

const onDoneChange = () => data.done = !data.done;
const inputEnter = () => {
  emits('close', data);
}

function clickDue(type: string, date?: Dayjs): void {
  const dueType = [DateType.TODAY, DateType.TOMORROW, DateType.NEXT_WEEK];
  const dateFormat = dueType.some((s) => s === type)
    ? duePipe(type as DateType)
    : date;

  data.overdueTime = dateFormat?.endOf("d").format();
  pickDateText.value = type;
}

function clickRemind(type: string, date?: Dayjs): void {
  const _remindTime = duePipe(type as DateType);
  const dateFormat =
    type === DateType.LATER_TODAY
      ? _remindTime.format("YYYY-MM-DD HH:mm")
      : [DateType.TOMORROW, DateType.NEXT_WEEK].includes(type as DateType)
        ? _remindTime.format("YYYY-MM-DD 9:00")
        : date?.format("YYYY-MM-DD HH:mm");

  data.remindTime = dayjs(dateFormat).format();
  remindText.value = dateFormat;
}

function clickRepeat(type: string): void {
  data.repeatType = type;
}
</script>

<style scoped lang="scss">
.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  // border-bottom: 0;

  &:hover {
    background-color: #edebe9;
  }

  >input {
    font-size: 1.6rem;
  }
}

.section-innerClick {
  padding-top: 8px;
  padding-bottom: 8px;
}

.detail {
  // height: 100%;
  // position: relative;
  // background: --bg-primary-accent;
  // background: var(--bg-primary-accent);
  // display: flex;
  // flex-direction: column;
  // overflow: hidden;
  // width: 360px;
  // box-sizing: border-box;
  // flex: 1;
  // box-shadow: 0px 1.2px 3.6px rgba(0, 0, 0, 0.1), 0px 6.4px 14.4px rgba(0, 0, 0, 0.1);
  // box-shadow: 0px 1.2px 3.6px var(--bg-shadow), 0px 6.4px 14.4px var(--bg-shadow);

  .section-item {
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    box-shadow: 0px 0.5px 0px 0px #edebe9;

    // box-shadow: 0px 0.5px 0px 0px var(--bg-separator);
    &:hover {
      background-color: #edebe9;
      // #f6f6f5
      // background-color: var(--bg-hover-tertiary);
    }

    .section-innerClick {
      height: auto;
      padding: 16px;
    }

    button {
      background: none;
      width: 100%;
      height: 100%;
      border: none;
      box-shadow: none;
    }

    .section-inner {
      display: flex;
    }

    .section-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      text-align: center;
      fill: #797775;
      color: #797775;
      // fill: var(--font-color-secondary);
      // color: var(--font-color-secondary);
      font-size: 20px;
    }

    .section-content {
      flex: auto;
      overflow: hidden;
      margin-right: 16px;
      margin-left: 16px;
      text-align: left;
    }
  }
}

.detailFooter {
  text-align: center;
  padding: 6px 0;
  font-size: 1.2rem;
  line-height: 20px;
  color: #797775;
  // color: var(--font-color-secondary);

  .date {
    height: 20px;
  }
}

.section {
  z-index: 5;
  position: relative;
  background: #fff;
  background: var(--bg-tertiary);
  margin: 8px 0;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 245px;
  flex: 1;
}
</style>