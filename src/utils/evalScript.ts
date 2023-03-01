export const getRegexes = (
  // if present, grid or cell context
  gridId?: number | string,
  // if present, cell context
  cellIndex?: number | string
): ([string | RegExp, string, string?, string?])[] => {
  // I tried to use $ instead of !, but the $ triggers the undo feature of 'react-simple-code-editor' (on BÉPO keyboard)
  // so... avoid using _ in your normal variables :shrug:
  return [
    [
      "#.",
      `window._proxy.`,
      "Global (adventure) variable"
    ],
    [
      "@.",
      `window._proxy.${gridId === null ? `` : `gridId${gridId}`}`,
      "Grid variable (use only in a Grid or Cell)"
    ],
    [
      "^.",
      `window._proxy.${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
      "Cell variable (use only in a Cell)"
    ],
    [
      "@gi",
      `${gridId}`,
      "Get gridId (in a Grid or Cell)"
    ],
    [
      "^ci",
      `${cellIndex}`,
      "Get cellId (in a Cell)"
    ],
    [
      /\^ucs\((.*?)\)/g,
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { onClickCScript: $1 }})`,
      "Update click script of the cell",
      "^ucs($1)"
    ],
    [
      /\^uc\((.*?)\)/g,
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { color: $1 }})`,
      "Update color of the cell",
      "^uc($1)"
    ],
    [
      /\^ue\((.*?)\)/g,
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { emoji: $1 }})`,
      "Update emoji/characters of the cell",
      "^ue($1)"
    ],
    [
      /\^u\((.*?)\)/g,
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: $1})`,
      "Update the cell (you must provide an update object)",
      "^u($1)"
    ],
    [
      "^dcs",
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { onClickCScript: "" }})`,
      "Delete click script of the cell (no () needed)"
    ],
    [
      "^dvs",
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { onViewCScript: "" }})`,
      "Delete view script of the cell"
    ],
    [
      "^dc",
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { color: "" }})`,
      "Delete color of the cell"
    ],
    [
      "^de",
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { emoji: "" }})`,
      "Delete emoji of the cell"
    ],
    [
      "^d",
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { emoji: "", onClickCScript: "", onViewScript: "" }})`,
      "Delete emoji, click script and view script of the cell (equivalent to @de, @dcs and @dvs)"
    ],
    [
      /\#\((.*?)\)/g,
      `window.alert(\`$1\`)`,
      "Display alert dialog",
      "#($1)"
    ],
    [
      "#mg(",
      `window._ss().mapGet(`,
      "Get value of a map variable (e.g. #mg('hp'))."
    ],
    [
      "#ms(",
      `window._ss().mapSet(`,
      "Set value of a map variable (e.g. #ms('hp', 10))"
    ],
    [
      "#msb(",
      `window._ss().mapSubscribe(`,
      "Add a subscriber to a map variable (e.g. #msb('hp', value => value <= 0 && #(dead) ) )"
    ],
    [
      "#g(",
      `window._s.getState(`,
      "Get the state of the Zustand store (all data used by the adventure)"
    ],
    [
      "#s(",
      `window._s.setState(`,
      "Set the state of the Zustand store (you can reactively change everything)"
    ],
    [
      "#u(",
      `window._ss().updateCell(`,
      "Update cell (you have to provide gridId, cellId, and the update object)"
    ],
    [
      "#a(",
      `window.alert(`,
      "Display alert dialog (compatible with variables and string interpolation)"
    ],
    [
      "#p(",
      `window.prompt(`,
      "Display prompt dialog"
    ],
    [
      "#c(",
      `window.confirm(`,
      "Display confirm dialog"
    ],
    [
      /\#m\((.*?)\)/g,
      `window._s.setState({ activeGridId: $1 })`,
      "Move to specified gridId",
      "#m($1)"
    ]
  ]
}

export const evalScript = (
  script: string,
  {
    gridId,
    cellIndex
  }: {
    // if present, grid or cell context
    gridId?: number
    // if present, cell context
    cellIndex?: number
  } = {}
) => {
  if (script === "") return
  // will unravel shorthands

  const regexes = getRegexes(gridId, cellIndex)

  let newScript = script
  regexes.forEach(regex => {
    newScript = newScript.replaceAll(regex[0], regex[1])
  })

  eval(newScript)
}