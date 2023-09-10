import {Fragment, useEffect, useRef, useState, MouseEvent} from "react";
import {Chat} from "../utils/types";
import {chatsStore, settingsStore} from "../utils/store";
import dynamic from "next/dynamic";
import useWebSocket, {ReadyState} from "react-use-websocket";
import getSocketUrl from "../utils/getSocketUrl";

const ChatPreview = dynamic(() => import("./chatPreview"), {ssr: false})

export default function Sidebar(props: {
  openSettings: () => void
}) {
  const newChatRef = useRef(null)

  const [chats, setChats] = useState<Chat[]>([])
  const [newChat, setNewChat] = useState<string>("")

  let [status, setStatus] = useState<string>("Disconnected")

  const {sendJsonMessage, readyState} = useWebSocket(getSocketUrl, {
    share: true,
    onMessage: (event) => {
      const data = JSON.parse(event.data)
      setChats((prevState) => {
        return prevState.map(chat => {
          if (chat.title === data.chat) {
            return {
              ...chat,
              lastMessage: data.message
            }
          } else {
            return chat
          }
        })
      })
    }
  })

  useEffect(() => {
    setChats(chatsStore.get("chats") as Chat[])
    sendJsonMessage({
      type: "setChats",
      chats: (chatsStore.get("chats") as Chat[]).map(chat => chat.title)
    })
    chatsStore.onDidAnyChange(() => {
      setChats(chatsStore.get("chats") as Chat[])
    })
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      chatsStore.set("chats", chats)
    }
  }, [chats])

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      setStatus("Connected")
    } else if (readyState === ReadyState.CLOSED) {
      setStatus("Disconnected")
    } else if (readyState === ReadyState.CONNECTING) {
      setStatus("Connecting")
    } else if (readyState === ReadyState.CLOSING) {
      setStatus("Disconnecting")
    } else {
      setStatus("Unknown")
    }
  }, [readyState]);

  function createNewChat(event: MouseEvent<HTMLButtonElement>) {
    if (newChat === "") {
      event.preventDefault()
      return
    }
    setChats((prevState) => {
      return [
        ...prevState,
        {
          title: newChat,
          lastMessage: {
            sender: settingsStore.get("nickname") as string,
            content: "Joined the chat",
            time: Date.now()
          }
        }
      ]
    })
    sendJsonMessage({
      type: "joinChat",
      chat: newChat
    })
    setNewChat("")
  }

  return (
    <Fragment>
      <aside className="z-20 overflow-y-auto scroll-smooth bg-base-200 w-[235px] h-screen pr-2 shadow select-none">
        <ul className="menu">
          <div className="sticky top-0 bg-base-200 z-30">
            <h2 className="menu-title">Chats <span>({status})</span></h2>
            <button className="absolute top-1.5 right-0 btn btn-xs btn-ghost btn-square text-neutral"
                    onClick={() => props.openSettings()}>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48"
                   className="fill-current">
                <path
                  d="M 24 4 C 22.423103 4 20.902664 4.1994284 19.451172 4.5371094 A 1.50015 1.50015 0 0 0 18.300781 5.8359375 L 17.982422 8.7382812 C 17.878304 9.6893592 17.328913 10.530853 16.5 11.009766 C 15.672739 11.487724 14.66862 11.540667 13.792969 11.15625 L 13.791016 11.15625 L 11.125 9.9824219 A 1.50015 1.50015 0 0 0 9.4257812 10.330078 C 7.3532865 12.539588 5.7626807 15.215064 4.859375 18.201172 A 1.50015 1.50015 0 0 0 5.4082031 19.845703 L 7.7734375 21.580078 C 8.5457929 22.147918 9 23.042801 9 24 C 9 24.95771 8.5458041 25.853342 7.7734375 26.419922 L 5.4082031 28.152344 A 1.50015 1.50015 0 0 0 4.859375 29.796875 C 5.7625845 32.782665 7.3519262 35.460112 9.4257812 37.669922 A 1.50015 1.50015 0 0 0 11.125 38.015625 L 13.791016 36.841797 C 14.667094 36.456509 15.672169 36.511947 16.5 36.990234 C 17.328913 37.469147 17.878304 38.310641 17.982422 39.261719 L 18.300781 42.164062 A 1.50015 1.50015 0 0 0 19.449219 43.460938 C 20.901371 43.799844 22.423103 44 24 44 C 25.576897 44 27.097336 43.800572 28.548828 43.462891 A 1.50015 1.50015 0 0 0 29.699219 42.164062 L 30.017578 39.261719 C 30.121696 38.310641 30.671087 37.469147 31.5 36.990234 C 32.327261 36.512276 33.33138 36.45738 34.207031 36.841797 L 36.875 38.015625 A 1.50015 1.50015 0 0 0 38.574219 37.669922 C 40.646713 35.460412 42.237319 32.782983 43.140625 29.796875 A 1.50015 1.50015 0 0 0 42.591797 28.152344 L 40.226562 26.419922 C 39.454197 25.853342 39 24.95771 39 24 C 39 23.04229 39.454197 22.146658 40.226562 21.580078 L 42.591797 19.847656 A 1.50015 1.50015 0 0 0 43.140625 18.203125 C 42.237319 15.217017 40.646713 12.539588 38.574219 10.330078 A 1.50015 1.50015 0 0 0 36.875 9.984375 L 34.207031 11.158203 C 33.33138 11.54262 32.327261 11.487724 31.5 11.009766 C 30.671087 10.530853 30.121696 9.6893592 30.017578 8.7382812 L 29.699219 5.8359375 A 1.50015 1.50015 0 0 0 28.550781 4.5390625 C 27.098629 4.2001555 25.576897 4 24 4 z M 24 7 C 24.974302 7 25.90992 7.1748796 26.847656 7.3398438 L 27.035156 9.0644531 C 27.243038 10.963375 28.346913 12.652335 30 13.607422 C 31.654169 14.563134 33.668094 14.673009 35.416016 13.904297 L 37.001953 13.207031 C 38.219788 14.669402 39.183985 16.321182 39.857422 18.130859 L 38.451172 19.162109 C 36.911538 20.291529 36 22.08971 36 24 C 36 25.91029 36.911538 27.708471 38.451172 28.837891 L 39.857422 29.869141 C 39.183985 31.678818 38.219788 33.330598 37.001953 34.792969 L 35.416016 34.095703 C 33.668094 33.326991 31.654169 33.436866 30 34.392578 C 28.346913 35.347665 27.243038 37.036625 27.035156 38.935547 L 26.847656 40.660156 C 25.910002 40.82466 24.973817 41 24 41 C 23.025698 41 22.09008 40.82512 21.152344 40.660156 L 20.964844 38.935547 C 20.756962 37.036625 19.653087 35.347665 18 34.392578 C 16.345831 33.436866 14.331906 33.326991 12.583984 34.095703 L 10.998047 34.792969 C 9.7799772 33.330806 8.8159425 31.678964 8.1425781 29.869141 L 9.5488281 28.837891 C 11.088462 27.708471 12 25.91029 12 24 C 12 22.08971 11.087719 20.290363 9.5488281 19.160156 L 8.1425781 18.128906 C 8.8163325 16.318532 9.7814501 14.667839 11 13.205078 L 12.583984 13.902344 C 14.331906 14.671056 16.345831 14.563134 18 13.607422 C 19.653087 12.652335 20.756962 10.963375 20.964844 9.0644531 L 21.152344 7.3398438 C 22.089998 7.1753403 23.026183 7 24 7 z M 24 16 C 19.599487 16 16 19.59949 16 24 C 16 28.40051 19.599487 32 24 32 C 28.400513 32 32 28.40051 32 24 C 32 19.59949 28.400513 16 24 16 z M 24 19 C 26.779194 19 29 21.220808 29 24 C 29 26.779192 26.779194 29 24 29 C 21.220806 29 19 26.779192 19 24 C 19 21.220808 21.220806 19 24 19 z"></path>
              </svg>
            </button>
            <div className="ml-2 join top-0">
              <input className="input input-sm input-bordered join-item focus:outline-none" type="text"
                     placeholder="Search"/>
              <button className="btn btn-sm btn-neutral btn-square join-item"
                      onClick={() => newChatRef.current?.showModal()}>+
              </button>
            </div>
          </div>
          <li/>
          {
            chats &&
            chats.length > 0 &&
            chats.map((chat, index) => (
              <ChatPreview
                key={index}
                title={chat.title}
                time={chat.lastMessage.time}
                lastMessage={`${chat.lastMessage.sender}: ${chat.lastMessage.content}`}
              />
            ))
          }
        </ul>
      </aside>
      <dialog ref={newChatRef} id="newChat" className="modal">
        <form method="dialog" className="modal-box w-min">
          <div className="mt-2 join">
            <input
              id="newChat"
              type="text"
              value={newChat}
              onChange={e => setNewChat(e.target.value)}
              className="input input-sm input-bordered join-item focus:outline-none"
            />
            <div className="modal-action">
              <button className="join-item btn btn-sm" onClick={createNewChat}>Create</button>
            </div>
          </div>
          <p className="text-xs pt-3 pb-0">Press ESC key to cancel, or click the button to create new chat</p>
        </form>
      </dialog>
    </Fragment>
  )
}