import { useCallback, useMemo } from "react"
import store from "../../../store"

const EmojiSquare: React.FC<{ emoji: string }> = ({ emoji }) => {

  const selectedEmoji = store(state => state.selectedEmoji)
  const isEmojiSelected = useMemo<boolean>(() => {
    return emoji === selectedEmoji
  }, [selectedEmoji])

  const set = store(state => state.set)

  const handleClick = useCallback<any>(() => {
    set({ selectedEmoji: emoji, selectedColor: null })
  }, [emoji, selectedEmoji])

  return (
    <>
      <div
        className={`emojiChoice ${isEmojiSelected ? "selected" : ""} ${emoji === "" ? "checkerboard" : ""}`}
        onClick={() => handleClick()}
      >
        {emoji}
      </div>
      <style jsx>
        {`
          .emojiChoice {
            width: 30px;
            height: 30px;
            border: 1px solid rgba(160,160,160,1);
            padding: 2px 2px 2px 2px;
            /* make the effect of background-emoji begin only at after margin */
            /* https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip */
            background-clip: content-box;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .emojiChoice.selected {
            border: 3px solid var(--highlighter-blue);
            padding: 0
          }
          .checkerboard {
            background-image:
              linear-gradient(45deg, #ccc 25%, transparent 25%), 
              linear-gradient(135deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(135deg, transparent 75%, #ccc 75%);
            background-size:10px 10px; /* Must be a square */
            background-position:0 0, 5px 0, 5px -5px, 0px 5px; /* Must be half of one side of the square */
          }
        `}
      </style>
    </>
  )
}

export default EmojiSquare