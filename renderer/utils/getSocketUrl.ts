import {settingsStore} from "./store";

const getSocketUrl = () => {
  return `ws://localhost:${settingsStore.get("port")}`
}

export default getSocketUrl