import { useCallback, useMemo } from "react"
import store from "../../../store"

const ColorSquare: React.FC<{ color: string }> = ({ color }) => {

  const selectedColor = store(state => state.selectedColor)
  const isColorSelected = useMemo<boolean>(() => {
    return color === selectedColor
  }, [selectedColor])

  const set = store(state => state.set)

  const handleClick = useCallback<any>(() => {
    // // unselect
    // if (selectedColor === color) {
    //   set({ selectedColor: "" })
    //   return
    // }

    set({ selectedColor: color, selectedEmoji: null })
  }, [color, selectedColor])

  return (
    <>
      <div
        className={`colorChoice ${isColorSelected ? "selected" : ""}`}
        style={{ backgroundColor: color }}
        onClick={() => handleClick()}
      />
      <style jsx>
        {`
          .colorChoice {
              width: 30px;
              height: 30px;
              border: 1px solid rgba(160,160,160,1);
              padding: 2px 2px 2px 2px;
              /* make the effect of background-color begin only at after margin */
              /* https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip */
              background-clip: content-box;
              cursor: pointer;
          }
          .colorChoice.selected {
            border: 3px solid var(--highlighter-blue);
            padding: 2px 2px 2px 2px;
          }
        `}
      </style>
    </>
  )
}

export default ColorSquare