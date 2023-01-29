import { Button } from "@mantine/core"
import { useCallback } from "react"
import store, { emptyHistory, gridHistory, pushToGridHistory } from "../store"
import { trpc } from "../utils/trpc"

const SaveAdventure: React.FC<{}> = ({ }) => {
  const adventure = store(state => state.adventure)
  const isChanged = store(state => state.isChanged)
  const set = store(state => state.set)
  const grids = store(state => state.grids)
  const firstGridId = store(state => state.firstGridId)
  const onStartScript = store(state => state.onStartScript)

  const updateMutation = trpc.adventure.update.useMutation({
    async onSuccess(adventure) {
      store.setState({
        isChanged: false
      })
      emptyHistory()
      if (gridHistory.length === 0) {
        pushToGridHistory(store.getState())
      }
    }
  })

  const saveAdventure = useCallback<any>(() => {
    updateMutation.mutate({
      id: adventure?.id ?? "404",
      data: {
        data: JSON.stringify({
          grids,
          firstGridId,
          onStartScript
        })
      }
    })
  }, [updateMutation])

  return (
    <>
      <div className='container'>
        <Button disabled={!isChanged} onClick={saveAdventure}>
          Save Adventure
        </Button>
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

export default SaveAdventure