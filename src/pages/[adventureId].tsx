import { useRouter } from "next/router"
import { useEffect } from "react"
import GridInfoViewer from "../components/viewers/GridInfoViewer"
import GridViewer from "../components/viewers/GridViewer"

export default function AdventurePage() {
  const router = useRouter()

  useEffect(() => {
    // the query is an empty object at the first render before Router.isReady
    // https://github.com/vercel/next.js/issues/10521#issuecomment-760926715
    if (!router.isReady) return

    const { adventureId } = router.query
    // TODO: fetch adventure (adventure is uuid)
    // TODO: redirect if adventureId invalid / no aventure found

  }, [router.query])

  return (
    <div className="container">
      <GridViewer />
      <GridInfoViewer />

      <style jsx>
        {`
          .container {

          }
        `}
      </style>
    </div>
  )
}