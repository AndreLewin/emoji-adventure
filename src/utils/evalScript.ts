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
      "$#.",
      `window._subscriberProxy.`,
      "Add a subscriber to a global (adventure) variable. (e.g. $#.score = v => console.log(`score: ${v}`))"
    ],
    [
      "%#.",
      `window._configProxy.`,
      "Config global (adventure) variable (such for displaying or display name)"
    ],
    [
      "#.",
      `window._variableProxy.`,
      "Global (adventure) variable"
    ],
    [
      "$@.",
      `window._subscriberProxy.${gridId === null ? `` : `gridId${gridId}`}`,
      "Add a subscriber to a grid variable. (e.g. $@.count = v => v > 10 && #m(2))"
    ],
    [
      "%@.",
      `window._configProxy.${gridId === null ? `` : `gridId${gridId}`}`,
      "Config grid variable (use only in a Grid or Cell)"
    ],
    [
      "@.",
      `window._variableProxy.${gridId === null ? `` : `gridId${gridId}`}`,
      "Grid variable (use only in a Grid or Cell)"
    ],
    [
      "$^.",
      `window._subscriberProxy.${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
      "Add a subscriber to a cell variable. (e.g. $^.life = v => v <= 0 && ^d)"
    ],
    [
      "%^.",
      `window._configProxy.${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
      "Config cell variable (use only in a Cell)"
    ],
    [
      "^.",
      `window._variableProxy.${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
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
      "^cs",
      `window._updateProxy.onClickCScript_${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
      "Update click script of the cell"
    ],
    [
      "^vs",
      `window._updateProxy.onViewCScript_${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
      "Update view script of the cell"
    ],
    [
      "^c",
      `window._updateProxy.color_${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
      "Update color of the cell"
    ],
    [
      "^e",
      `window._updateProxy.emoji_${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
      "Update emoji/character of the cell"
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
      "Delete emoji, click script and view script of the cell (equivalent to ^e = '', ^cs = '' and ^vs = '')"
    ],
    [
      /\#tt\((.*?)\)/g,
      `window._s.setState({ text2: $1 })`,
      "Display text under the grid (second position)",
      "#tt($1)"
    ],
    [
      /\#t\((.*?)\)/g,
      `window._s.setState({ text1: $1 })`,
      "Display text under the grid",
      "#t($1)"
    ],
    [
      /\#\((.*?)\)/g,
      `window._s.setState({ text1: \`$1\` })`,
      "Display text under the grid (no quotes needed)",
      "#($1)"
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