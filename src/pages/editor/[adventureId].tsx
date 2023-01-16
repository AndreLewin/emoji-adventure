import { type NextPage } from "next";
import ToolSelector from "../../components/selectors/ToolSelector";
import ColorSelector from "../../components/selectors/ColorSelector";
import EmojiSelector from "../../components/selectors/EmojiSelector";
import Grid from "../../components/Grid";
import EmojiPicker from "../../components/selectors/EmojiPicker";
import GridSelector from "../../components/selectors/GridSelector";
import GridInfo from "../../components/GridInfo";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Adventure } from ".prisma/client";
import store, { emptyHistory, gridHistory, pushToGridHistory } from "../../store";

const EditorAdventureId: NextPage = () => {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user?.id ?? null
  const router = useRouter()

  const [adventureId, setAdventureId] = useState<string | null>(null)

  const set = store(state => state.set)
  const reset = store(state => state.reset)
  useEffect(() => {
    // make sure that data in store from other adventures don't spill on this one
    reset()
    emptyHistory()
  }, [])

  useEffect(() => {
    // the query is an empty object at the first render before Router.isReady
    // https://github.com/vercel/next.js/issues/10521#issuecomment-760926715
    if (!router.isReady) return
    const { adventureId } = router.query
    if (typeof adventureId !== "string" || adventureId === "") {
      router.push('/')
    } else {
      setAdventureId(adventureId)
    }
  }, [router.query])

  const adventureQuery = trpc.adventure.find.useQuery({ id: adventureId! },
    {
      enabled: adventureId !== null,
      onSuccess: (adventure) => {
        if (adventure === undefined) return
        console.log("data | [adventureId].tsx l46", adventure)
        const { data } = adventure
        const dataParsed = JSON.parse(data)
        console.log("dataParsed | [adventureId].tsx l51", dataParsed)
        console.log("dataParsed.grids | [adventureId].tsx l52", dataParsed.grids)

        set({
          grids: dataParsed.grids,
          firstGridId: dataParsed.firstGridId,
          initialScript: dataParsed.initialScript
        })
        // so the first change can be undone
        if (gridHistory.length === 0) {
          pushToGridHistory(store.getState())
        }
      }
    }
  )
  const adventure = adventureQuery?.data ?? null

  if (typeof window === "undefined") return <div />
  // don't display anything until the user is authenticated
  if (sessionData === undefined) return <div />
  // if the user is not logged, redirect to home
  if (sessionData === null) {
    router.push("/")
    return <div />
  }

  // don't display anything before the adventure is fetched
  if (adventure === null) return <div />
  // the user should only be able to edit their own adventure
  if (adventure.userId !== userId) {
    router.push("/")
    return <div />
  }

  return (
    <>
      {JSON.stringify(adventure)}
      <ToolSelector />
      <div style={{ display: "flex" }}>
        <ColorSelector />
        <EmojiSelector />
      </div>
      <div style={{ display: "flex" }}>
        <Grid />
        <EmojiPicker />
      </div>
      <GridSelector />
      <GridInfo />
    </>
  );
};

export default EditorAdventureId;