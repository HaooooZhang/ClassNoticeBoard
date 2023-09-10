import {useEffect, useLayoutEffect, useRef, useState} from "react";

export default function ContextMenu(props: {
  targetId: string;
  options: {
    text: string;
    onClick: () => void;
  }[];
}) {
  const contextMenuRef = useRef(null)

  const [visible, setVisible] = useState(false)
  const [posX, setPosX] = useState(0)
  const [posY, setPosY] = useState(0)

  function contextMenuHandler(event: MouseEvent) {
    const targetElement = document.getElementById(props.targetId)
    if (targetElement && targetElement.contains(event.target as Node)) {
      event.preventDefault()
      setVisible(true)
      setPosX(event.clientX)
      setPosY(event.clientY)
    } else if (contextMenuRef.current && !(contextMenuRef.current as any).contains(event.target)) {
      setVisible(false)
    }
  }

  function offClickHandler(event: MouseEvent) {
    if (contextMenuRef.current && !(contextMenuRef.current as any).contains(event.target)) {
      setVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener("contextmenu", contextMenuHandler)
    document.addEventListener("click", offClickHandler)
    return () => {
      document.removeEventListener("contextmenu", contextMenuHandler)
      document.removeEventListener("click", offClickHandler)
    }
  }, []);

  useLayoutEffect(() => {
    if (visible) {
      const contextMenu = contextMenuRef.current as any
      const contextMenuWidth = contextMenu.offsetWidth
      const contextMenuHeight = contextMenu.offsetHeight
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      if (posX + contextMenuWidth > windowWidth) {
        setPosX(windowWidth - contextMenuWidth)
      }
      if (posY + contextMenuHeight > windowHeight) {
        setPosY(windowHeight - contextMenuHeight)
      }
    }
  }, []);

  return (
    <div ref={contextMenuRef} className={`absolute z-50 transition-all ${visible ? "" : "hidden"}`}
         style={{left: posX, top: posY}}>
      <ul className="menu menu-xs rounded-lg w-36 shadow-lg bg-base-100 p-1.5">
        {props.options.map((option, index) => {
          return (
            <li key={index} onClick={() => {
              setVisible(false);
              option.onClick()
            }}>
              <a>{option.text}</a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}