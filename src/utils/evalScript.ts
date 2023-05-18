export const getRegexes = (
  // if present, grid or cell context
  gridId?: number | string,
  // if present, cell context
  cellIndex?: number | string
): ([string | RegExp, string, string?, string?])[] => {
  return [
    [
      "^$$",
      `window._cellSubscriberProxy._${gridId}_${cellIndex}`,
      "Get list of cell subscribers to the current cell (example: use ^$$)"
    ],
    [
      "@$$",
      `window._cellSubscriberProxy._${gridId}_`,
      "Get list of cell subscribers in the current grid (example: use @$$0 for the first cell of current grid)"
    ],
    [
      "#$$",
      `window._cellSubscriberProxy._`,
      "Get list of cell subscribers in the adventure (example: use #$$0_2 for the third cell of the first grid) (equivalent of window._cellSubscriberProxy._)"
    ],
    [
      /\^\:\[(.*?)\]/g,
      `window._dataProxy[\`_${gridId ?? "???"}_${cellIndex ?? "???"}\`+$1]`,
      "Local cell data",
      "^:[$1]"
    ],
    [
      "^:",
      `window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}`,
      "Local cell data"
    ],
    [
      /\@\:\[(.*?)\]/g,
      `window._dataProxy[\`_${gridId ?? "???"}_\`+$1]`,
      "Local grid data",
      "@:[$1]"
    ],
    [
      "@:",
      `window._dataProxy._${gridId ?? "???"}_`,
      "Local grid data"
    ],
    [
      /\#\:\[(.*?)\]/g,
      `window._dataProxy[\`_\`+$1]`,
      "Adventure data",
      "#:[$1]"
    ],
    [
      "#:",
      `window._dataProxy._`,
      "Adventure data"
    ],
    [
      "^%.",
      `window._visibleVariablesProxy.${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
      "Config cell variable (use only in a Cell)"
    ],
    [
      "@%.",
      `window._visibleVariablesProxy.${gridId === null ? `` : `gridId${gridId}`}`,
      "Config grid variable (use only in a Grid or Cell)"
    ],
    [
      "#%.",
      `window._visibleVariablesProxy.`,
      "Config global (adventure) variable (such for displaying or display name)"
    ],
    [
      "^$.",
      `window._subscriberProxy.${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
      "Add a subscriber to a cell variable. (e.g. ^$.life = v => v <= 0 && ^d)"
    ],
    [
      "@$.",
      `window._subscriberProxy.${gridId === null ? `` : `gridId${gridId}`}`,
      "Add a subscriber to a grid variable. (e.g. @$.count = v => v > 10 && _g(2))"
    ],
    [
      "#$.",
      `window._subscriberProxy.`,
      "Add a subscriber to a global (adventure) variable. (example: #$.score.push(v => console.log(`score: ${v}`)))"
    ],
    [
      "^.",
      `window._variableProxy.${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`,
      "Cell variable (use only in a Cell)"
    ],
    [
      "@.",
      `window._variableProxy.${gridId === null ? `` : `gridId${gridId}`}`,
      "Grid variable (use only in a Grid or Cell)"
    ],
    [
      "#.",
      `window._variableProxy.`,
      "Global (adventure) variable"
    ],
    [
      "^ci",
      `${cellIndex}`,
      "Get cellId (in a Cell)"
    ],
    [
      "@gi",
      `${gridId}`,
      "Get gridId (in a Grid or Cell)"
    ],
    [
      "^dcs",
      `window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}cs = ""`,
      "Delete click script of the cell (no () needed)"
    ],
    [
      "^dvs",
      `window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}vs = ""`,
      "Delete view script of the cell"
    ],
    [
      "^dc",
      `window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}c = ""`,
      "Delete color of the cell"
    ],
    [
      "^de",
      `window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}e = ""`,
      "Delete emoji of the cell"
    ],
    [
      "^dd",
      `window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}e = ""; window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}c = ""; window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}cs = ""; window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}vs = "";`,
      "Delete emoji, click script and view script of the cell (equivalent to ^:e = '', ^:c = '', ^:cs = '' and ^:vs = '')"
    ],
    [
      "^d",
      `window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}e = ""; window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}cs = ""; window._dataProxy._${gridId ?? "???"}_${cellIndex ?? "???"}vs = "";`,
      "Delete emoji, click script and view script of the cell (equivalent to ^:e = '', ^:cs = '' and ^:vs = '')"
    ],
    [
      /\#\((.*?)\)/g,
      `window._setText("text1", \`$1\` )`,
      "Display text under the grid (no quotes needed)",
      "#($1)"
    ],
    [
      "^a(",
      `window._getAnimatePrefilled({ cellIndex: ${cellIndex} })(`,
      "Animate prefilled with the current cell"
    ],
    [
      "#a",
      `window._animate`,
      "Animate (shortcut for _animate)"
    ],
    [
      "^m(",
      `window._getMovementPrefilled({ gridId: ${gridId}, cellIndex: ${cellIndex} })(`,
      "Movement prefilled with gridId and cellIndex"
    ],
    [
      "@m(",
      `window._getMovementPrefilled({ gridId: ${gridId} })(`,
      "Movement prefilled with gridId"
    ],
    [
      "#m(",
      `window._movement(`,
      "Movement (shortcut for _movement)"
    ],
    [
      "^move(",
      `window._getMovePrefilled({ gridId: ${gridId}, cellIndex: ${cellIndex} })(`,
      "Move prefilled with gridId and cellIndex"
    ],
    [
      "@move(",
      `window._getMovePrefilled({ gridId: ${gridId} })(`,
      "Move prefilled with gridId"
    ],
  ]
}

export const evalScript = (
  script: string | undefined,
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
  if (script === "" || typeof script === "undefined") return
  // will unravel shorthands

  const regexes = getRegexes(gridId, cellIndex)

  let newScript = script
  regexes.forEach(regex => {
    // don't replace shorthands that are called in the wrong context
    const shorthandLetter = regex[0] instanceof RegExp ? regex[0].toString()[2] : regex[0][0]
    if (shorthandLetter === "^" && (typeof gridId === "undefined" || typeof cellIndex === "undefined")) return
    if (shorthandLetter === "@" && (typeof gridId === "undefined")) return

    newScript = newScript.replaceAll(regex[0], regex[1])
  })

  // in order to be able to use "await" in scripts
  const asyncScript = `
    const af = async () => {
      ${newScript}
    }
    af()
  `

  eval(asyncScript);
}