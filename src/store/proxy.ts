// import { getRegexes } from "../utils/evalScript";

import { Cell, Grid } from ".";
import { twoIndexesIntoIndexesOfSquare } from "../utils/math";

const proxyTarget = {};
const handler = {
  get(_target: any, variable: string) {
    // @ts-ignore
    const variables = window._s.getState().variables
    const value = variables[variable]
    return value === undefined ? 0 : value
  },
  set(_target: any, variable: string, value: any) {
    // @ts-ignore
    const { variables: oldVariables, subscribers } = window._s.getState()

    const variables = {
      ...oldVariables,
      [variable]: value
    }

    // @ts-ignore
    window._s.setState({ variables })

    // trigger subscribers
    const subscribersForVariable = subscribers?.[variable] ?? []
    console.log("subscribersForVariable | proxy.ts l28", subscribersForVariable)

    subscribersForVariable.forEach((subscriber: any) => subscriber(value))
    return true
  },
};

export const variableProxy = new Proxy(proxyTarget, handler);


// subscriber proxy
// used to simplify shorthands
// window._subscriberProxy.xxx = yyy will be translated to subscribers.push({ variable: x, callback: y })

const proxyTarget2 = {};
const subscriberHandler = {
  get(_target: any, variable: string) {
    // @ts-ignore
    const subscribers = window._s.getState().subs
    return subscribers?.[variable] ?? []
  },
  set(_object: any, variable: string, unparsedCallback: (newValue?: any) => {}) {


    /*
    // parse the callback for shorthands
    // do not use function functionName() {} because their content is hard to parse

    const gridId = variable.match(/gridId(\d*)/)?.[1] ?? undefined
    const cellIndex = variable.match(/cellIndex(\d*)/)?.[1] ?? undefined

    const regexes = getRegexes(gridId, cellIndex)

    let newCallbackBody = unparsedCallback.toString()
    regexes.forEach(regex => {
      newCallbackBody = newCallbackBody.replaceAll(regex[0], regex[1])
    })
    const newCallback = eval(newCallbackBody)
    */

    // @ts-ignore
    const oldSubscribers = window._s.getState().subscribers

    console.log("unparsedCallback | proxy.ts l64", unparsedCallback)


    const subscribersForVariable = (oldSubscribers?.[variable] ?? [])

    subscribersForVariable.push(unparsedCallback)

    console.log("subscribersForVariable | proxy.ts l71", subscribersForVariable)


    const subscribers = {
      ...oldSubscribers,
      [variable]: subscribersForVariable
    }

    // @ts-ignore
    window._s.setState({ subscribers })
    return true
  },
};

export const subscriberProxy = new Proxy(proxyTarget2, subscriberHandler)


// visible variables proxy

const proxyTarget3 = {};
const handler3 = {
  get(_target: any, variable: string) {
    // @ts-ignore
    const visibleVariables = window._s.getState().visibleVariables
    return visibleVariables?.[variable] ?? ""
  },
  set(_target: any, variable: string, name: string) {
    // @ts-ignore
    const oldVisibleVariables = window._s.getState().visibleVariables
    const visibleVariables = {
      ...oldVisibleVariables,
      [variable]: name
    }

    // @ts-ignore
    window._s.setState({ visibleVariables })
    return true
  }
};

export const visibleVariablesProxy = new Proxy(proxyTarget3, handler3);


// data proxy

const shorthenCellPropertyName = (n: string): string => {
  if (n === "c") return "color"
  if (n === "e") return "emoji"
  if (n === "cs") return "onClickCScript"
  if (n === "is") return "onInitCScript"
  if (n === "vs") return "onViewCScript"
  return n
}

const lengthenCellPropertyName = (n: string): string => {
  if (n === "color") return "c"
  if (n === "emoji") return "e"
  if (n === "onClickCScript") return "cs"
  if (n === "onInitCScript") return "is"
  if (n === "onViewCScript") return "vs"
  return n
}

const shorthenGridPropertyName = (n: string): string => {
  if (n === "vs") return "onViewGScript"
  if (n === "is") return "onInitGScript"
  return n
}

const lengthenGridPropertyName = (n: string): string => {
  if (n === "onViewGScript") return "vs"
  if (n === "onInitGScript") return "is"
  return n
}

const shorthenAdventurePropertyName = (n: string): string => {
  if (n === "is") return "onInitAScript"
  return n
}

const lengthenAdventurePropertyName = (n: string): string => {
  if (n === "onInitAScript") return "is"
  return n
}

// 1t3 -> [1, 2, 3]
// 2a9a12 -> [2, 9, 12]
// 0x11 -> [0, 1, 10, 11]
// 0x11a22 -> [0, 1, 10, 11, 22]
// 0x11a88x99 -> [0, 1, 10, 11, 88, 89, 98, 99]
// 0tt0 -> [0, 1, 2, ..., indexOfLastGrid]
// 3tt0 -> [3, 4, 5, ..., indexOfLastGrid]
const getIndexesFromString = (string: string, indexOfLastGrid: number): number[] => {
  const newString = string.replace("tt0", `t${indexOfLastGrid}`)

  let tempNumber: number | null = null
  let tempLetter = ""
  let remainingString = newString
  const indexes: number[] = []

  const numberAtBeginRegex = /^\d+/
  const firstLetterAtBeginRegex = /^[atx]/

  let checkOnNumberNotLetter = true

  while (remainingString.length > 0) {
    const match = remainingString.match(checkOnNumberNotLetter ? numberAtBeginRegex : firstLetterAtBeginRegex)?.[0]

    if (match === undefined) {
      break;
    }

    if (checkOnNumberNotLetter) {
      const newNumber = parseInt(match)
      if (tempNumber !== null) {
        if (tempLetter === "a") {
          indexes.push(tempNumber)
          indexes.push(newNumber)
        } else if (tempLetter === "t") {
          for (let i = tempNumber; i <= newNumber; i++) {
            indexes.push(i)
          }
        } else if (tempLetter === "x") {
          const squareIndexes = twoIndexesIntoIndexesOfSquare(tempNumber, newNumber, 10, 10)
          squareIndexes.forEach(v => indexes.push(v))
        }
      }
      tempNumber = newNumber
    } else {
      tempLetter = match
    }

    remainingString = remainingString.replace(match, "")
    checkOnNumberNotLetter = !checkOnNumberNotLetter
  }

  return Array.from(new Set(indexes))
}


const proxyTarget5 = {};
const handler5 = {
  get(_target: any, variable: string) {
    // const regex = /(?:\_([\datx]*))?(?:\_([\datx]*))?([a-zA-Z_$]*)/
    const regex = /(?:\_((?:(?![atx]$)[\datx])*))?(?:\_((?:(?![atx]$)[\datx])*))?([a-zA-Z_$]*)/
    const match = regex.exec(variable)
    console.log("variable | proxy.ts l224", variable)
    console.log("match | proxy.ts l225", match)

    let cellIndex: number | null = null
    let cellIndexes: number[] = []

    // @ts-ignore
    const indexOfLastGrid = window._ss().grids.length - 1

    const cellIndexString = match?.[2] ?? ""
    const hasCellIdStringALetter = /[atx]/.test(cellIndexString)
    if (hasCellIdStringALetter) {
      cellIndexes = getIndexesFromString(cellIndexString, indexOfLastGrid)
    } else {
      cellIndex = parseInt(match?.[2] ?? "")
    }

    let gridId: number | null = null
    let gridIds: number[] = []

    const gridIdString = match?.[1] ?? ""
    const hasGridIdStringALetter = /[atx]/.test(gridIdString)
    if (hasGridIdStringALetter) {
      gridIds = getIndexesFromString(gridIdString, indexOfLastGrid)
    } else {
      gridId = parseInt(match?.[1] ?? "")
    }

    const property = match?.[3] ?? ""

    // react thing that triggers the proxy for some reason
    if (property === "$$typeof") return "react"

    console.log("cellIndex | proxy.ts l241", cellIndex)
    console.log("cellIndexes | proxy.ts l242", cellIndexes)
    console.log("gridId | proxy.ts l243", gridId)
    console.log("gridIds | proxy.ts l244", gridIds)
    console.log("property | proxy.ts l247", property)

    const hasCellIndexes = cellIndexes.length > 0
    const hasCellIndex = cellIndex !== null && !Number.isNaN(cellIndex)
    const hasGridIds = gridIds.length > 0
    const hasGridId = gridId !== null && !Number.isNaN(gridId)

    const getAdventureData = () => {
      // return only adventure data
      // @ts-ignore
      const adventure = window._s.getState()
      const { onInitAScript: is } = adventure
      const gridWithShortNames: { [key: string]: any } = {
        is,
        grids: adventure.grids,
        ...adventure
      }
      return property === "" ? gridWithShortNames : gridWithShortNames[property]
    }

    const getGridData = (gridId: number) => {
      // return only grid data
      // @ts-ignore
      const grid = window._s.getState().getGrid({ gridId }) as Grid
      // grid can be null if the grid was deleted
      if (grid === null) return null
      const { onViewGScript: vs, onInitGScript: is } = grid
      const gridWithShortNames: { [key: string]: any } = {
        is,
        vs,
        ...grid
      }
      return property === "" ? gridWithShortNames : gridWithShortNames[property]
    }

    const getCellData = (gridId: number, cellIndex: number) => {
      // return only cell data
      // @ts-ignore
      const cell = window._s.getState().getCell({ gridId, cellIndex }) as Cell
      const { color: c, emoji: e, onClickCScript: cs, onInitCScript: is, onViewCScript: vs } = cell
      const cellWithShortNames: { [key: string]: any } = {
        c,
        e,
        cs,
        is,
        vs,
        ...cell
      }
      return property === "" ? cellWithShortNames : cellWithShortNames[property]
    }

    console.log("hasGridId | proxy.ts l313", hasGridId)
    console.log("hasGridIds | proxy.ts l314", hasGridIds)
    console.log("hasCellIndex | proxy.ts l315", hasCellIndex)
    console.log("hasCellIndexes | proxy.ts l316", hasCellIndexes)


    if (!hasGridId && !hasGridIds) return getAdventureData()
    if (hasGridId) {
      if (!hasCellIndex && !hasCellIndexes) return getGridData(gridId!)
      if (hasCellIndex) return getCellData(gridId!, cellIndex!)
      if (hasCellIndexes) return cellIndexes.map(cellIndex => getCellData(gridId!, cellIndex))
    }
    if (hasGridIds) {
      if (!hasCellIndex && !hasCellIndexes) return gridIds!.map(getGridData)
      if (hasCellIndex) return gridIds.map(gridId => getCellData(gridId, cellIndex!))
      if (hasCellIndexes) {
        return gridIds.map(gridId => {
          return cellIndexes.map(cellIndex => getCellData(gridId!, cellIndex))
        })
      }
    }

    throw "Unexpected way of using #$, @$ or ^$. Please check the documentation."
  },
  set(_target: any, variable: string, value: any) {
    const regex = /(?:\_((?:(?![atx]$)[\datx])*))?(?:\_((?:(?![atx]$)[\datx])*))?([a-zA-Z_$]*)/
    const match = regex.exec(variable)

    console.log("variable | proxy.ts l224", variable)
    console.log("match | proxy.ts l225", match)

    let cellIndex: number | null = null
    let cellIndexes: number[] = []

    // @ts-ignore
    const indexOfLastGrid = window._ss().grids.length - 1

    const cellIndexString = match?.[2] ?? ""
    const hasCellIdStringALetter = /[atx]/.test(cellIndexString)
    if (hasCellIdStringALetter) {
      cellIndexes = getIndexesFromString(cellIndexString, indexOfLastGrid)
    } else {
      cellIndex = parseInt(match?.[2] ?? "")
    }

    let gridId: number | null = null
    let gridIds: number[] = []

    const gridIdString = match?.[1] ?? ""
    const hasGridIdStringALetter = /[atx]/.test(gridIdString)
    if (hasGridIdStringALetter) {
      gridIds = getIndexesFromString(gridIdString, indexOfLastGrid)
    } else {
      gridId = parseInt(match?.[1] ?? "")
    }

    const property = match?.[3] ?? ""

    console.log("cellIndex | proxy.ts l241", cellIndex)
    console.log("cellIndexes | proxy.ts l242", cellIndexes)
    console.log("gridId | proxy.ts l243", gridId)
    console.log("gridIds | proxy.ts l244", gridIds)
    console.log("property | proxy.ts l247", property)

    const hasCellIndexes = cellIndexes.length > 0
    const hasCellIndex = cellIndex !== null && !Number.isNaN(cellIndex)
    const hasGridIds = gridIds.length > 0
    const hasGridId = gridId !== null && !Number.isNaN(gridId)

    const setAdventureData = () => {
      let adventureUpdate: { [key: string]: any } = {}
      if (property === "") {
        const { is: onInitAScript, ...rest } = value
        adventureUpdate = {
          onInitAScript,
          ...rest
        }
      } else {
        adventureUpdate[shorthenAdventurePropertyName(property)] = value
      }
      // @ts-ignore
      window._s.setState(adventureUpdate)
    }

    const setGridData = (gridId: number) => {
      let gridUpdate: { [key: string]: any } = {}

      if (property === "") {
        const { vs: onViewGScript, is: onInitGScript, ...rest } = value
        gridUpdate = {
          onViewGScript,
          onInitGScript,
          ...rest
        }
      } else {
        gridUpdate[shorthenGridPropertyName(property)] = value
      }
      // @ts-ignore
      window._s.getState().updateGrid({ gridId, gridUpdate })
    }

    const setCellData = (gridId: number, cellIndex: number) => {
      let cellUpdate: { [key: string]: any } = {}

      if (property === "") {
        const { c: color, e: emoji, cs: onClickCScript, is: onInitCScript, vs: onViewCScript, ...rest } = value
        cellUpdate = {
          color,
          emoji,
          onClickCScript,
          onInitCScript,
          onViewCScript,
          ...rest
        }
      } else {
        cellUpdate[shorthenCellPropertyName(property)] = value
      }
      // @ts-ignore
      window._s.getState().updateCell({ gridId, cellIndex, cellUpdate })
    }

    if (!hasGridId && !hasGridIds) setAdventureData()
    if (hasGridId) {
      if (!hasCellIndex && !hasCellIndexes) setGridData(gridId!)
      if (hasCellIndex) setCellData(gridId!, cellIndex!)
      if (hasCellIndexes) cellIndexes.forEach(cellIndex => setCellData(gridId!, cellIndex))
    }
    if (hasGridIds) {
      if (!hasCellIndex && !hasCellIndexes) gridIds!.forEach(setGridData)
      if (hasCellIndex) gridIds.forEach(gridId => setCellData(gridId, cellIndex!))
      if (hasCellIndexes) gridIds.forEach(gridId => {
        cellIndexes.forEach(cellIndex => setCellData(gridId!, cellIndex))
      })
    }

    return true
  },
};

export const dataProxy = new Proxy(proxyTarget5, handler5);