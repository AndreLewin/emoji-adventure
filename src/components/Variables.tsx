import { useMemo } from "react";
import store from "../store";

const Variables: React.FC<{}> = ({ }) => {
  const map = store(state => state.map)

  const toDisplay = useMemo<{ 0: string, 1: any }[]>(() => {
    const array = [...map]
    return array.filter(pair => {
      const [key, value] = pair
      if (typeof key !== "string") return false
      if (key.startsWith("_")) return false
      if (typeof value !== "number" && typeof value !== "string") return false
      return true
    })
  }, [map])

  return (
    <>
      {`Variables `}
      {JSON.stringify(toDisplay)}

      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </>
  )
}

export default Variables
