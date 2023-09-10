import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {settingsStore} from "../utils/store";
import useWebSocket from "react-use-websocket";
import getSocketUrl from "../utils/getSocketUrl";

const Settings = forwardRef((_, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [nickname, setNickname] = useState("")
  const [port, setPort] = useState(8080)

  const {sendJsonMessage} = useWebSocket(getSocketUrl, {
    share: true
  })

  function save() {
    settingsStore.set('port', port)
    settingsStore.set('nickname', nickname)
    sendJsonMessage({
      type: "setNickname",
      nickname: nickname
    })
  }

  useEffect(() => {
    setNickname(settingsStore.get('nickname') as string)
    setPort(settingsStore.get('port') as number)
  }, []);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialogRef.current?.showModal()
      }
    }
  })

  return (
    <dialog ref={dialogRef} id="settings" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Settings</h3>
        <div className="pt-3">
          <label htmlFor="nickname">Nickname:</label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            className="ml-2 input input-bordered input-sm"
          />
        </div>
        <div className="pt-3">
          <label htmlFor="port">Port:</label>
          <input
            id="port"
            type="number"
            min={1000}
            max={9999}
            value={port}
            onChange={e => setPort(parseInt(e.target.value))}
            className="ml-2 input input-bordered input-sm"
          />
        </div>
        <p className="text-xs pt-3 pb-0">Press ESC key to undo, or click the button below to save setting</p>
        <div className="modal-action">
          <button className="btn btn-sm" onClick={() => save()}>Save</button>
        </div>
      </form>
    </dialog>
  )
})

export default Settings