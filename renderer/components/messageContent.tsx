import {Message} from "../utils/types"
import displayTime from "../utils/utils";

export default function MessageContent({id, message}: { id: string, message: Message }) {
  return (
    <div id={id} className={`chat ${message.sender === "You" ? "chat-end" : "chat-start"}`}>
      <div className="chat-header select-none">
        {message.sender}
        <time className="ml-1.5 text-xs opacity-50" suppressHydrationWarning>
          {displayTime(message.time)}
        </time>
      </div>
      <div className="chat-bubble min-h-0">
        {message.content}
      </div>
    </div>
  )
}