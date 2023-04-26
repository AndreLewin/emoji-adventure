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


// config proxy

export type Config = {
  isVisible?: boolean,
  displayName?: string
}

const proxyTarget3 = {};
const handler3 = {
  get(_target: any, variable: string) {
    // @ts-ignore
    const configs = window._s.getState().configs
    return configs?.[variable] ?? {}
  },
  set(_target: any, variable: string, newConfigPartial: any) {
    // @ts-ignore
    const oldConfigs = window._s.getState().configs
    const configs = {
      ...oldConfigs,
      [variable]: {
        ...oldConfigs[variable],
        ...newConfigPartial
      }
    }

    // @ts-ignore
    window._s.setState({ configs })
    return true
  },
};

export const configProxy = new Proxy(proxyTarget3, handler3);


// data proxy

// TODO: handle map update with this syntax: $12
// TODO: handle adventure update with thi syntax: $ 

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
const getIndexesFromString = (string: string): number[] => {
  let tempNumber: number | null = null
  let tempLetter = ""
  let remainingString = string
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

/*
cells mode
cell mode
grids mode
grid mode
adventure mode

gridId
-> {{}}
gridId + cellIndex
-> {{}}
gridId + cellIndexes
-> {{}}
gridIds
-> [{{}}, {{}}]
gridIds + cellIndex
-> [{{}}, {{}}]
gridIds + cellIndexes
-> [{{}}, {{}}]

grid


*/

const proxyTarget5 = {};
const handler5 = {
  get(_target: any, variable: string) {
    // const regex = /(?:\_([\datx]*))?(?:\_([\datx]*))?([a-zA-Z_$]*)/
    const regex = /(?:\_((?:(?![atx]$)[\datx])*))?(?:\_((?:(?![atx]$)[\datx])*))?([a-zA-Z_$]*)/
    const match = regex.exec(variable)

    let cellIndex: number | null = null
    let cellIndexes: number[] = []

    const cellIndexString = match?.[2] ?? ""
    const hasCellIdStringALetter = /[atx]/.test(cellIndexString)
    if (hasCellIdStringALetter) {
      cellIndexes = getIndexesFromString(cellIndexString)
    } else {
      cellIndex = parseInt(match?.[2] ?? "")
    }

    let gridId: number | null = null
    let gridIds: number[] = []

    const gridIdString = match?.[1] ?? ""
    const hasGridIdStringALetter = /[atx]/.test(gridIdString)
    if (hasGridIdStringALetter) {
      gridIds = getIndexesFromString(gridIdString)
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

    if (!hasGridId && !hasGridIds) {
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

    if (hasGridId) {
      if (!hasCellIndex && !hasCellIndexes) {
        // return only grid data
        // @ts-ignore
        const grid = window._s.getState().getGrid({ gridId }) as Grid
        // TODO: refactor to add function "addShortGridPropertyNames"
        const { onViewGScript: vs, onInitGScript: is } = grid
        const gridWithShortNames: { [key: string]: any } = {
          is,
          vs,
          ...grid
        }
        return property === "" ? gridWithShortNames : gridWithShortNames[property]
      }

      if (hasCellIndex) {
        // return only cell data
        // @ts-ignore
        const cell = window._s.getState().getCell({ gridId, cellIndex }) as Cell
        // TODO: refactor to add function "addShortCellPropertyNames"
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

      if (hasCellIndexes) {
        // return data of the selected cells in the selected grid
        return cellIndexes.map(cellIndex => {
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
        })
      }
    }

    if (hasGridIds) {
      if (!hasCellIndex && !hasCellIndexes) {
        // return only grids data
        return gridIds.map(gridId => {
          // @ts-ignore
          const grid = window._s.getState().getGrid({ gridId }) as Grid
          const { onViewGScript: vs, onInitGScript: is } = grid
          const gridWithShortNames: { [key: string]: any } = {
            is,
            vs,
            ...grid
          }
          return property === "" ? gridWithShortNames : gridWithShortNames[property]
        })
      }

      if (hasCellIndex) {
        // return an array of cell data (one element per grid)
        return gridIds.map(gridId => {
          // @ts-ignore
          const cell = window._s.getState().getCell({ gridId, cellIndex }) as Cell
          // TODO: refactor to add function "addShortCellPropertyNames"
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
        })
      }

      if (hasCellIndexes) {
        // return an array of cells data (basically an array of array)
        // the parent array is for each grid
        // the child array is for each cell
        return gridIds.map(gridId => {
          return cellIndexes.map(cellIndex => {
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
          })
        })
      }
    }
    throw "Unexpected way of using #$, @$ or ^$. Please check the documentation."
  },
  set(_target: any, variable: string, value: any) {
    const regex = /(?:\_((?:(?![atx]$)[\datx])*))?(?:\_((?:(?![atx]$)[\datx])*))?([a-zA-Z_$]*)/
    const match = regex.exec(variable)

    let cellIndex: number | null = null
    let cellIndexes: number[] = []

    const cellIndexString = match?.[2] ?? ""
    const hasCellIdStringALetter = /[atx]/.test(cellIndexString)
    if (hasCellIdStringALetter) {
      cellIndexes = getIndexesFromString(cellIndexString)
    } else {
      cellIndex = parseInt(match?.[2] ?? "")
    }

    let gridId: number | null = null
    let gridIds: number[] = []

    const gridIdString = match?.[1] ?? ""
    const hasGridIdStringALetter = /[atx]/.test(gridIdString)
    if (hasGridIdStringALetter) {
      gridIds = getIndexesFromString(gridIdString)
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

    const setGridData = (id: number) => {
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
      window._s.getState().updateGrid({ id, gridUpdate })
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