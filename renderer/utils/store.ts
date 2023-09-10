import Store from 'electron-store'

const chatsStore = new Store({
  name: 'chats',
  schema: {
    chats: {
      type: 'array',
      items: {
        type: 'object',
      },
      default: []
    }
  },
  watch: true
})
const messagesStore = new Store({
  name: 'messages',
})
const settingsStore = new Store({
  name: 'settings',
  schema: {
    nickname: {
      type: 'string',
      default: 'Anonymous'
    },
    port: {
      type: 'number',
      maximum: 9999,
      minimum: 1000,
      default: 8080
    }
  }
})

export {chatsStore, messagesStore, settingsStore}