import {Fragment, KeyboardEvent, useEffect, useState} from 'react'
import {useRouter} from "next/router";
import {Chat, Message} from "../../utils/types";
import Head from "next/head";
import {chatsStore, messagesStore} from "../../utils/store";
import getSocketUrl from "../../utils/getSocketUrl";
import useWebSocket from "react-use-websocket";
import MessageContent from "../../components/messageContent";
import ContextMenu from "../../components/contextMenu";

export default function ChatPage() {
  const duration = 500

  const router = useRouter()
  const {id} = router.query

  const [messages, setMessages] = useState<Message[]>([])

  const {sendJsonMessage} = useWebSocket(getSocketUrl, {
    share: true,
    onMessage: (event) => {
      const data = JSON.parse(event.data)
      if (data.chat === id) {
        setMessages((prevState) => {
          return [
            ...prevState,
            data.message
          ]
        })
        animateScroll(duration)
      }
    }
  })

  useEffect(() => {
    if (!id) return
    if (messagesStore.get(id as string) !== undefined && Object.keys(messagesStore.get(id as string) as Message[]).length > 0) {
      setMessages(messagesStore.get(id as string) as Message[])
    }
    animateScroll(duration)
  }, [id]);

  useEffect(() => {
    if (messages.length > 0 && id !== undefined) {
      messagesStore.set(id as string, messages)
      chatsStore.set("chats", [
        ...(chatsStore.get("chats") as Chat[]).filter(chat => chat.title !== id),
        {
          title: id as string,
          lastMessage: messages[messages.length - 1]
        }
      ])
    }
  }, [messages]);

  function animateScroll(duration: number) {
    const element = document.getElementById("messages")
    if (element === null) return
    const start = element.scrollTop
    const change = element.scrollHeight - start
    const increment = 20

    function easeInOut(currentTime: number, start: number, change: number, duration: number) {
      currentTime /= duration / 2
      if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + start
      }
      currentTime--
      return -change / 2 * (currentTime * (currentTime - 2) - 1) + start
    }

    function animate(elapsedTime: number) {
      elapsedTime += increment
      element.scrollTop = easeInOut(elapsedTime, start, change, duration)
      if (elapsedTime < duration) {
        setTimeout(() => {
          animate(elapsedTime)
        }, increment)
      }
    }

    animate(0)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      const input = event.target as HTMLTextAreaElement
      if (input.value === "") return
      const message: Message = {
        sender: "You",
        content: input.value,
        time: Date.now()
      }
      sendJsonMessage({
        type: "message",
        chat: id,
        content: message.content
      })
      setMessages((prevState) => {
        return [
          ...prevState,
          message
        ]
      })
      animateScroll(duration)
      input.value = ""
    }
  }

  function deleteMessage(index: number) {
    setMessages((prevState) => {
      return [
        ...prevState.slice(0, index),
        ...prevState.slice(index + 1)
      ]
    })
  }

  return (
    <Fragment>
      <Head>
        <title>{id}</title>
      </Head>
      <div id={`chatPage-${id}`} className="flex flex-col flex-auto">
        <div className="bg-base-100 h-12 w-full drop-shadow flex items-center z-10">
          <h2 className="pl-4 font-sans select-none">{id}</h2>
        </div>
        <div id="messages" className="bg-base-100 w-full flex-auto p-3 h-0 overflow-y-auto">
          {
            messages &&
            messages.length > 0 &&
            messages.map((message, index) => (
              <Fragment key={index}>
                <MessageContent id={`message-content-${index}`} message={message}/>
                <ContextMenu targetId={`message-content-${index}`} options={[{
                  text: "Delete",
                  onClick: () => {
                    deleteMessage(index)
                  }
                }]}/>
              </Fragment>
            ))
          }
        </div>
        <textarea
          name="input"
          id="input"
          className="textarea text-lg pt-3 w-full h-40 bg-base-100 drop-shadow z-10 rounded-none focus:outline-none"
          placeholder="Type a message..."
          onKeyDown={handleKeyDown}
        />
      </div>
    </Fragment>
  )
}