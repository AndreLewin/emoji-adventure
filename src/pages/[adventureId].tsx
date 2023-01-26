import { Adventure } from ".prisma/client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import GridInfoViewer from "../components/viewers/GridInfoViewer"
import AdventureInfoViewer from "../components/viewers/AdventureInfoViewer"
import GridViewer from "../components/viewers/GridViewer"
import store, { emptyHistory } from "../store"

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
      store.setState({
        grids: dataParsed.grids,
        firstGridId: dataParsed.firstGridId,
        initialScript: dataParsed.initialScript,
        adventure: rest,
        isChanged: false
      })
    }
    af()
  }, [router.query])


  // you should not be able to play on emoji-adventure-retejo.vercel.app because of your login credentials
  if (location?.hostname === "emoji-adventure-retejo.vercel.app") {
    router.push("/")
    return <div />
  }

  if (typeof window === "undefined") return <div />
  // don't display anything before the adventure is fetched
  if (adventure === null) return <div>Loading...</div>

  return (
    <div className="container">
      <GridViewer />
      <GridInfoViewer />
      <AdventureInfoViewer />

      <style jsx>
        {`
          .container {

          }
        `}
      </style>
    </div>
  )
}