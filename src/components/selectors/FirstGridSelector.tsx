import { Select, SelectItem } from "@mantine/core"
import { useMemo } from "react"
import store from "../../store"

const FirstGridSelector: React.FC<{}> = ({ }) => {
  const firstGridId = store(state => state.firstGridId)
  const grids = store(state => state.grids)

  const choices = useMemo<SelectItem[]>(() => {
    return grids.map(g => {
      const text = g?.text ?? ""
      return {
        label: `${g.id}: ${text.length <= 10 ? text : (text.substring(0, 10) + '...')}`,
        value: `${g.id}`
      }
    })
  }, [grids])

  return (
    <>
      <div className='container'>
        <Select
          label={`Grid on which the adventure starts:`}
          value={`${firstGridId}`}
          onChange={(value) => store.setState({ firstGridId: parseInt(value ?? "0", 10) })}
          data={choices}
        />
      </div>
      <style jsx>
        {`
        .container {
          
        }
      `}
      </style>
    </>
  )
}

export default FirstGridSelector