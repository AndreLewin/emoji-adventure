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

  eval(script)
}