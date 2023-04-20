import { Button } from "@mantine/core"
import { useCallback, useState } from "react"
import store, { emptyHistory, gridHistory, pushToGridHistory } from "../store"
import { trpc } from "../utils/trpc"
import { IconX, IconCheck } from '@tabler/icons';
import { showNotification } from "@mantine/notifications";

const SaveAdventure: React.FC<{}> = ({ }) => {
  const adventure = store(state => state.adventure)
  const isChanged = store(state => state.isChanged)
  const set = store(state => state.set)
  const grids = store(state => state.grids)
  const firstGridId = store(state => state.firstGridId)
  const onInitAScript = store(state => state.onInitAScript)

  const updateMutation = trpc.adventure.update.useMutation({
    async onSuccess(adventure) {
      showNotification({
        message: 'Your adventure has been saved',
        color: 'green',
        icon: <IconCheck />
      })
      store.setState({
        isChanged: false
      })
      emptyHistory()
      if (gridHistory.length === 0) {
        pushToGridHistory(store.getState())
      }
    },
    async onError() {
      showNotification({
        message: 'An error occured when trying to save your adventure',
        color: 'red',
        icon: <IconX />
      })
    },
  })

  const saveAdventure = useCallback<any>(() => {
    updateMutation.mutate({
      id: adventure?.id ?? "404",
      data: {
        data: JSON.stringify({
          grids,
          firstGridId,
          onInitAScript
        })
      }
    })
  }, [updateMutation])

  return (
    <>
      <Button disabled={!isChanged || updateMutation.isLoading} onClick={saveAdventure}>
        {updateMutation.isLoading ? 'Saving...' : 'Save Adventure'}
      </Button>
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