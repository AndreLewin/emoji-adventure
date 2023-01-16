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
import AdventureInfo from "../../components/AdventureInfo";

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
        const { data, ...rest } = adventure
        const dataParsed = JSON.parse(data)

        set({
          grids: dataParsed.grids,
          firstGridId: dataParsed.firstGridId,
          initialScript: dataParsed.initialScript,
          adventure: rest,
          isChanged: false
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
      {/* TODO: to move adventure info edit into /editor */}
      {/* Those info do not need to be in the store */}
      <AdventureInfo />
    </>
  );
};

export default EditorAdventureId;