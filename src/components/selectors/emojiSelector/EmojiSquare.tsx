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
        className={`emojiChoice ${isEmojiSelected ? "selected" : ""}`}
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
        `}
      </style>
    </>
  )
}

export default EmojiSquare