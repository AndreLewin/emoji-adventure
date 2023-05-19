import { DragEventHandler, FormEventHandler, MouseEventHandler, useCallback, useMemo, useRef, useState } from "react"
import store, { HoveringText } from "../store"

const HoveringTextInput: React.FC<{
  gridId: number,
  hoveringTextIndex: number,
  hoveringText: HoveringText
}> = ({ gridId, hoveringTextIndex, hoveringText }) => {
  const updateHoveringText = store(state => state.updateHoveringText)
  const deleteHoveringText = store(state => state.deleteHoveringText)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClickOnContainer = useCallback<MouseEventHandler<HTMLInputElement>>((event) => {
    inputRef.current?.focus()
    event.stopPropagation()
  }, [])

  const handleInput = useCallback<FormEventHandler<HTMLInputElement>>((event) => {
    event.stopPropagation()
    updateHoveringText({
      gridId,
      hoveringTextIndex,
      hoveringTextUpdate: {
        // @ts-ignore
        text: event.target.value
      }
    })
  }, [gridId, hoveringTextIndex])

  const handleBlur = useCallback<any>(() => {
    if (hoveringText.text === "") {
      deleteHoveringText({
        gridId,
        hoveringTextIndex
      })
    }
  }, [gridId, hoveringText])

  const [shouldBeTransparent, setShouldBeTransparent] = useState<boolean>(false);

  const [oldPosition, setOldPosition] = useState<{ x: number, y: number }>({
    x: 0,
    y: 0
  });

  const handleDragStart = useCallback<DragEventHandler<HTMLDivElement>>((event) => {
    setShouldBeTransparent(true)
    // screenX and screenY are used instead of clientX and clientY because for some reason, clientX and clientY are 0 on the dragend event
    setOldPosition({
      x: event.screenX,
      y: event.screenY
    })
  }, []);

  const handleDragEnd = useCallback<DragEventHandler<HTMLDivElement>>((event) => {
    const newPosition = {
      x: event.screenX,
      y: event.screenY
    }
    const offset = {
      x: newPosition.x - oldPosition.x,
      y: newPosition.y - oldPosition.y
    }
    updateHoveringText({
      gridId,
      hoveringTextIndex,
      hoveringTextUpdate: {
        x: hoveringText.x + offset.x,
        y: hoveringText.y + offset.y
      }
    })
    setShouldBeTransparent(false)
  }, [oldPosition, hoveringText]);

  return (
    <>
      <div
        className="container"
        style={{
          position: "absolute",
          top: `${hoveringText.y}px`,
          left: `${hoveringText.x}px`,
          cursor: "text",
          opacity: shouldBeTransparent ? 0.7 : 1,
        }}
        onClick={handleClickOnContainer}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        draggable={true}
      >
        <span
          style={{
            position: "relative"
          }}
        >
          {hoveringText.text}
        </span>
        <input
          style={{
            position: "absolute",
            top: "1px",
            left: "-3px",
            width: "0px",
            opacity: 0
          }}
          ref={inputRef}
          value={hoveringText.text}
          onInput={handleInput}
          onBlur={handleBlur}
          autoFocus
        />
      </div>

      <style jsx>
        {`
          .container {
          }

          .container:focus-within {
            outline: 3px solid var(--highlighter-blue);
            border-radius: 3px;
          }
        `}
      </style>
    </>
  )
}

export default HoveringTextInput