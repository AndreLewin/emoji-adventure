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

  // I tried to use $ instead of _, but the $ triggers the undo feature of 'react-simple-code-editor' (on BÉPO keyboard)
  // so... avoid using _ in your normal variables :shrug:
  const regexes: ([string | RegExp, string])[] = [
    ["__.", `window._g.${gridId === null ? `` : `gridId${gridId}`}${cellIndex === null ? `` : `cellIndex${cellIndex}`}`],
    ["__g", `${gridId}`],
    ["__c", `${cellIndex}`],
    [/\_\_ucs\((.*?)\)/g,
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { onClickCScript: $1 }})`
    ],
    [/\_\_uc\((.*?)\)/g,
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { color: $1 }})`
    ],
    [/\_\_ue\((.*?)\)/g,
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { emoji: $1 }})`
    ],
    [/\_\_u\((.*?)\)/g,
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: $1})`
    ],
    ["!dcs",
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { onClickCScript: "" }})`
    ],
    ["!dc",
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { color: "" }})`
    ],
    ["!de",
      `window._ss().updateCell({ gridId: ${gridId ?? "0"}, cellIndex: ${cellIndex ?? "0"}, cellUpdate: { emoji: "" }})`
    ],
    [/\!\((.*?)\)/g,
      `window.alert(\`$1\`)`
    ],
    ["_mg(", `window._ss().mapGet(`],
    ["_ms(", `window._ss().mapSet(`],
    ["_msb(", `window._ss().mapSubscribe(`],
    ["_g(", `_s.getState(`],
    ["_s(", `window._s.setState(`],
    ["_u(", `window._ss().updateCell(`],
    ["_a(", `window.alert(`],
    ["_p(", `window.prompt(`],
    ["_c(", `window.confirm(`],
    [/\_m\((.*?)\)/g,
      `window._s.setState({ activeGridId: $1 })`
    ],
    ["_.", `window._g.`],
  ]

  let newScript = script
  regexes.forEach(regex => {
    newScript = newScript.replaceAll(regex[0], regex[1])
  })

  eval(newScript)
}