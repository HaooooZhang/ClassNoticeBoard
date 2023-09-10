import displayTime from "../utils/utils";
import Link from "next/link";
import ContextMenu from "./contextMenu";
import {Fragment} from "react";
import useWebSocket from "react-use-websocket";
import getSocketUrl from "../utils/getSocketUrl";
import {chatsStore, messagesStore} from "../utils/store";
import {useRouter} from "next/router";

type Chat = {
  title: string;
  time: number;
  lastMessage: string;
}

export default function chatPreview(props: Chat) {
  const router = useRouter()

  const {sendJsonMessage} = useWebSocket(getSocketUrl, {
    share: true,
  })

  function leaveChat() {
    sendJsonMessage({
      type: "leaveChat",
      chat: props.title
    })
    chatsStore.set("chats", (chatsStore.get("chats") as Chat[]).filter(chat => chat.title !== props.title))
    messagesStore.delete(props.title)
    router.push("/home").then()
  }

  return (
    <Fragment>
      <li id={`chat-${props.title}`}>
        <Link href={`/chat/${props.title}`}>
          <a className="px-4 py-3">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold max-w-full">{props.title}</h4>
              <p className="text-xs opacity-50">{props.lastMessage}</p>
              <time className="text-xs absolute top-3 right-3 opacity-50"
                    suppressHydrationWarning>{displayTime(props.time)}</time>
            </div>
          </a>
        </Link>
      </li>
      <ContextMenu targetId={`chat-${props.title}`} options={[{
        text: "Delete",
        onClick: leaveChat
      }]}/>
    </Fragment>
  )
}