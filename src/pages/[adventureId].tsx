import { Adventure } from ".prisma/client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import GridInfoViewer from "../components/viewers/GridInfoViewer"
import GridViewer from "../components/viewers/GridViewer"
import store, { emptyHistory, Store } from "../store"
import { evalScript } from "../utils/evalScript"
import DisplayText from "../components/DisplayText"
import Viewers from "../components/viewers/Viewers"

export default function AdventurePage() {
  const router = useRouter()

  const reset = store(state => state.reset)
  useEffect(() => {
    // make sure that data in store from other adventures don't spill on this one
    reset()
    emptyHistory()
  }, [])

  const [adventure, setAdventure] = useState<Adventure | null>(null)

  useEffect(() => {
    // the query is an empty object at the first render before Router.isReady
    // https://github.com/vercel/next.js/issues/10521#issuecomment-760926715
    if (!router.isReady) return
    const { adventureId } = router.query
    if (typeof adventureId !== "string" || adventureId === "") {
      router.push('/')
      return
    }

    const af = async () => {
      const res = await fetch(`/api/adventure/${adventureId}`)
      const adventure = (await res.json())[0] as Adventure | undefined
      if (adventure === undefined) {
        router.push("/")
        return
      }
      setAdventure(adventure)
      const { data, ...rest } = adventure
      const dataParsed = JSON.parse(data)

      const grids = dataParsed.grids as Store["grids"]
      const firstGridId = dataParsed.firstGridId as Store["firstGridId"]
      const activeGridId = dataParsed.firstGridId as Store["activeGridId"]
      const onInitAScript = dataParsed?.onInitAScript ?? "" as Store["onInitAScript"]

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
      grids.forEach(g => evalScript(g?.onInitGScript ?? "", { gridId: g.id }))
      // cells
      grids.forEach(g => {
        g.cells.forEach((c, index) => {
          evalScript(c?.onInitCScript ?? "", { gridId: g.id, cellIndex: index })
        })
      })
      store.setState({ isInitFinished: true })
    }
    af()
  }, [router.query])

  // you should be able to play on emoji-adventure-retejo.vercel.app BUT NOT emoji-adventure so adventures can't steal your credentials
  if (location?.hostname === "emoji-adventure.vercel.app") {
    router.push("/")
    return <div />
  }

  if (typeof window === "undefined") return <div />
  // don't display anything before the adventure is fetched
  if (adventure === null) return <div>Loading...</div>

  return (
    <div className="container">
      <Viewers />

      <style jsx>
        {`
          .container {

          }
        `}
      </style>
    </div>
  )
}