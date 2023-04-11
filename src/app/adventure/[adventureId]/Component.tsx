"use client";

import { Adventure } from ".prisma/client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import store, { emptyHistory, Store } from "../../../store"
import { evalScript } from "../../../utils/evalScript"
import Viewers from "../../../components/viewers/Viewers";

const Counter: React.FC<{ adventure: Adventure }> = ({ adventure }) => {
  const [isReadyToDisplay, setIsReadyToDisplay] = useState<boolean>(false)

  const reset = store(state => state.reset)
  useEffect(() => {
    // make sure that data in store from other adventures don't spill on this one
    reset()
    emptyHistory()

    const { data, ...rest } = adventure
    const dataParsed = JSON.parse(data)

    const grids = dataParsed.grids as Store["grids"]
    const firstGridId = dataParsed.firstGridId as Store["firstGridId"]
    const activeGridId = dataParsed.firstGridId as Store["activeGridId"]
    const onInitAScript = dataParsed.onInitAScript as Store["onInitAScript"]

    store.setState({
      grids,
      firstGridId,
      activeGridId,
      onInitAScript,
      adventure: rest
    })

    // execute init scripts
    // adventure
    evalScript(onInitAScript)
    // grids
    grids.forEach(g => evalScript(g.onInitGScript, { gridId: g.id }))
    // cells
    grids.forEach(g => {
      g.cells.forEach((c, index) => {
        evalScript(c.onInitCScript, { gridId: g.id, cellIndex: index })
      })
    })
    store.setState({ isInitFinished: true })
    setIsReadyToDisplay(true)
  }, [])

  if (!isReadyToDisplay) return <div>Loading....</div>

  return (
    <Viewers />
  )
}

export default Counter