export const useNoticeStore = defineStore('notice', () => {
  const state = reactive({
    notice: [
      { id: 1, type: 1, title: '你收到了 8 份日报', date: '2020-10-10 10:00:00' },
      { id: 2, type: 1, title: '你收到了 8 份日报', date: '2020-10-10 10:00:00' },
      { id: 3, type: 1, title: '你收到了 8 份日报', date: '2020-10-10 10:00:00' },
      { id: 4, type: 1, title: '你收到了 8 份日报', date: '2020-10-10 10:00:00' },
      { id: 5, type: 1, title: '你收到了 8 份日报', date: '2020-10-10 10:00:00' },
      { id: 6, type: 1, title: '你收到了 8 份日报', date: '2020-10-10 10:00:00' },
      { id: 7, type: 1, title: '你收到了 8 份日报', date: '2020-10-10 10:00:00' },

    ],
    todolist: [
      { id: 11, type: 2, title: '见客户', date: '2020-10-10 10:00:00' },
    ],
  })

  const totalUnread = computed(() => state.notice.length + state.todolist.length)

  return {
    ...toRefs(state),
    noticeState: state,
    totalUnread,
  }
})
