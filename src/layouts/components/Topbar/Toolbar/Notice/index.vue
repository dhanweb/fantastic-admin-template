<template>
  <el-popover
    placement="bottom"
    :width="300"
    trigger="hover"
    :hide-after="500"
    popper-class="h-tooltip"
  >
    <template #reference>
      <div class="notification cursor-pointer px-2 py-1">
        <div class="relative flex-center inline-flex">
          <SvgIcon name="i-ri:notification-3-line" />

          <span
            v-if="totalUnread > 9"
            class="absolute start-[50%] top-0 z-20 h-1.5 w-1.5 whitespace-nowrap rounded-full bg-ui-primary px-1.5 text-xs text-ui-text ring-1 ring-light before:absolute before:start-0 start-[100%]! before:top-0 before:block before:h-full before:w-full -translate-x-[50%] -translate-y-[50%] rtl:translate-x-[50%] before:animate-ping before:rounded-full before:bg-ui-primary px-0! -indent-9999 dark-ring-dark before:content-empty"
          />
          <span
            v-else-if="totalUnread > 0 "
            class="absolute start-[50%] top-0 z-20 whitespace-nowrap rounded-full bg-ui-primary px-1.5 text-xs text-ui-text ring-1 ring-light -translate-y-[50%] dark-ring-dark"
          >
            {{ totalUnread }}
          </span>
        </div>
      </div>
    </template>
    <template #default>
      <div>
        <div
          class="m-3 inline-flex select-none items-center justify-center rounded-md bg-stone-1 p-1 ring-1 ring-stone-2 flex! dark-bg-stone-9 dark-ring-stone-8"
        >
          <button
            v-for="(item, index) in tabs"
            :key="item.key"
            class="w-full inline-flex cursor-default items-center justify-center gap-1 break-keep border-size-0 rounded-md bg-inherit px-2 py-1.5 text-sm text-dark ring-stone-2 ring-inset dark-bg-dark-9 dark-text-white focus-outline-none focus-ring-2 dark-ring-stone-8"
            :class="{ '!bg-white': currentTab === item.key, 'cursor-pointer opacity-50 hover-opacity-100': currentTab !== item.key }"
            @click="switchTag(item.key, index)"
          >
            {{ item.label }}{{ tabLength(item.key) ? ` (${tabLength(item.key)})` : '' }}
          </button>
        </div>
        <div class="list">
          <div v-for="item in noticeState[currentTab]" :key="item.id" class="item">
            <i
              class="icon mail i-ri:mail-fill relative h-[1em] w-[1em] flex-inline items-center justify-center fill-current leading-[1em]"
            />
            <div class="info">
              <div class="title">
                {{ item.title }}
                <div class="date">
                  {{ item.date }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="tabLength(currentTab) === 0 " class="flex flex-1 flex-col items-center justify-center color-tips">
            暂无更多{{ tabs[currentTabIndex].label }}
          </div>
        </div>
        <div
          class="go cursor-pointer py-4 text-center text-sm text-stone-5 hover-color-#606266"
        >
          进入消息列表
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { useNoticeStore } from '@/store/modules/notice.ts'

defineOptions({
  name: 'Notice',
})

type NoticeKey = 'notice' | 'todolist'

interface Tab {
  label: string
  key: NoticeKey
  value: number
}

const tabs = ref<Tab[]>([{
  label: '消息',
  key: 'notice',
  value: 9,
},
{
  label: '待办',
  key: 'todolist',
  value: 9,
}])

const noticeStore = useNoticeStore()
const { noticeState, totalUnread } = storeToRefs(noticeStore)

const currentTab = ref<NoticeKey>('notice')
const currentTabIndex = ref(0)

function switchTag(key: NoticeKey, index: number) {
  currentTab.value = key
  currentTabIndex.value = index
}

function tabLength(key: NoticeKey) {
  return noticeState.value[key].length
}
</script>

<style lang="scss" scoped>
.notification {
  &:hover {
    animation: ring 1s;
    animation-iteration-count: 3;
  }

  @keyframes ring {
    0% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-15deg) scale(1.1); }
    50% { transform: rotate(0deg) scale(1); }
    75% { transform: rotate(15deg) scale(1.1); }
    100% { transform: rotate(0deg) scale(1); }
  }
}

.list {
  display: flex;
  flex-direction: column;
  min-height: 150px;
  max-height: 240px;
  overflow-y: scroll;
  background-color: transparent;
  border-top: 1px solid #e7e5e4;
  border-bottom: 1px solid #e7e5e4;

  &::-webkit-scrollbar {
    width: 0;
  }

  $size: 14px;

  .item {
    display: flex;
    width: 100%;
    padding: 10px $size;
    cursor: pointer;

    &:not(:last-child) {
      border-bottom: 1px solid #e7e5e4;
    }

    &:hover {
      background-color: #f5f5f4;
    }

    .icon {
      flex-shrink: 0;
      font-size: 22px;
      border-radius: 10px;

      &.mail {
        color: #60a5fa;
      }

      &.service- {
        color: #4ade80;
      }

      &.file-edit {
        color: #fb923c;
      }
    }

    .info {
      margin-left: $size;

      .date {
        margin-top: 4px;
        font-size: 12px;
        color: #97928e;
      }
    }
  }

  .go {
    border-top: 1px solid #e7e5e4;
  }
}
</style>

<style>
.h-tooltip {
  padding: 0 !important;
}
</style>
