export const evalScript = (
  script: string,
  {
    gridId,
    cellIndex
  }: {
    gridId?: number
    cellIndex?: number
  } = {}
) => {
  if (script === "") return
  // will unravel shorthands

  console.log("script | evalScript.ts l14", script)

  eval(script)
}