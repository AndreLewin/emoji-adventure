// import { getRegexes } from "../utils/evalScript";

import { Cell, Grid } from ".";
import { twoIndexesIntoIndexesOfSquare } from "../utils/math";

const proxyTarget = {};
const handler = {
  get(_target: any, variable: string) {
    // @ts-ignore
    const variables = window._store.getState().variables
    const value = variables[variable]
    return value === undefined ? 0 : value
  },
  set(_target: any, variable: string, value: any) {
    // @ts-ignore
    const { variables: oldVariables, subscribers } = window._store.getState()
    let oldValue = oldVariables[variable]
    oldValue = oldValue === undefined ? 0 : oldValue

    const variables = {
      ...oldVariables,
      [variable]: value
    }

    // @ts-ignore
    window._store.setState({ variables })

    // trigger subscribers
    const subscribersForVariable = subscribers?.[variable] ?? []

    ///TODO handle async subscribers (respect the order of subscribers?)
    subscribersForVariable.forEach((subscriber: any) => subscriber(value, oldValue))
    return true
  },
};

export const variableProxy = new Proxy(proxyTarget, handler);


// variable subscriber proxy
const proxyTarget2 = {};
const subscriberHandler = {
  get(_target: any, variable: string) {
    // @ts-ignore
    let subscribersOfTheVariable = window._store.getState().subscribers?.[variable]
    // if the subscriber array does not exist for the variable, create it
    if (!Array.isArray(subscribersOfTheVariable)) {
      // @ts-ignore
      const oldSubscribers = window._store.getState().subscribers
      const subscribers = {
        ...oldSubscribers,
        [variable]: []
      }
      // @ts-ignore
      window._store.setState({ subscribers })
      // @ts-ignore
      subscribersOfTheVariable = window._store.getState().subscribers?.[variable]
    }

    return subscribersOfTheVariable
  },
  set(_object: any, variable: string, subscribersOfTheVariable: Function[]) {
    console.log(`Subscriber added to variable: ${variable}`)

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
    const oldSubscribers = window._store.getState().subscribers

    const subscribers = {
      ...oldSubscribers,
      [variable]: subscribersOfTheVariable ?? []
    }

    // @ts-ignore
    window._store.setState({ subscribers })
    return true
  },
};

export const subscriberProxy = new Proxy(proxyTarget2, subscriberHandler)


// visible variables proxy

const proxyTarget3 = {};
const handler3 = {
  get(_target: any, variable: string) {
    // @ts-ignore
    const visibleVariables = window._store.getState().visibleVariables
    return visibleVariables?.[variable] ?? ""
  },
  set(_target: any, variable: string, name: string) {
    // @ts-ignore
    const oldVisibleVariables = window._store.getState().visibleVariables
    const visibleVariables = {
      ...oldVisibleVariables,
      [variable]: name
    }

    // @ts-ignore
    window._store.setState({ visibleVariables })
    return true
  }
};

export const visibleVariablesProxy = new Proxy(proxyTarget3, handler3);


// data proxy

const shorthenCellPropertyName = (n: string): string => {
  if (n === "c") return "color"
  if (n === "e") return "emoji"
  if (n === "cs") return "onClickCScript"
  if (n === "vs") return "onViewCScript"
  if (n === "ls") return "onLeaveCScript"
  if (n === "is") return "onInitCScript"
  return n
}

const lengthenCellPropertyName = (n: string): string => {
  if (n === "color") return "c"
  if (n === "emoji") return "e"
  if (n === "onClickCScript") return "cs"
  if (n === "onViewCScript") return "vs"
  if (n === "onLeaveCScript") return "ls"
  if (n === "onInitCScript") return "is"
  return n
}

const shorthenGridPropertyName = (n: string): string => {
  if (n === "vs") return "onViewGScript"
  if (n === "ls") return "onLeaveGScript"
  if (n === "is") return "onInitGScript"
  return n
}

const lengthenGridPropertyName = (n: string): string => {
  if (n === "onViewGScript") return "vs"
  if (n === "onLeaveGScript") return "ls"
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
    // react thing that triggers the proxy for some reason
    if (variable === "$$typeof") return "react"
    console.log(`data proxy (get handler) got variable: ${variable}`)

    const regex = /(?:_)([\datx]*\d)?(?:_)?([\datx]*\d)?(.*)/
    const match = regex.exec(variable)

    let cellIndex: number | null = null
    let cellIndexes: number[] = []

    // @ts-ignore
    const indexOfLastGrid = window._store.getState().grids.length - 1

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

    const hasCellIndexes = cellIndexes.length > 0
    const hasCellIndex = cellIndex !== null && !Number.isNaN(cellIndex)
    const hasGridIds = gridIds.length > 0
    const hasGridId = gridId !== null && !Number.isNaN(gridId)

    const getAdventureData = () => {
      // return only adventure data
      // @ts-ignore
      const adventure = window._store.getState()
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
      const grid = window._store.getState().getGrid({ gridId }) as Grid
      // grid can be null if the grid was deleted
      if (grid === null) return null
      const { onViewGScript: vs, onLeaveGScript: ls, onInitGScript: is } = grid
      const gridWithShortNames: { [key: string]: any } = {
        vs,
        ls,
        is,
        ...grid
      }
      return property === "" ? gridWithShortNames : gridWithShortNames[property]
    }

    const getCellData = (gridId: number, cellIndex: number) => {
      // return only cell data
      // @ts-ignore
      const cell = window._store.getState().getCell({ gridId, cellIndex }) as Cell
      const { color: c, emoji: e, onClickCScript: cs, onViewCScript: vs, onLeaveCScript: ls, onInitCScript: is } = cell
      const cellWithShortNames: { [key: string]: any } = {
        c,
        e,
        cs,
        vs,
        ls,
        is,
        ...cell
      }
      return property === "" ? cellWithShortNames : cellWithShortNames[property]
    }

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

    throw "Unexpected way of using #:, @: or ^:. Please check the documentation."
  },
  set(_target: any, variable: string, value: any) {
    // react thing that triggers the proxy for some reason
    if (variable === "$$typeof") return true
    console.log(`data proxy (set handler) got variable: ${variable}`)

    const regex = /(?:_)([\datx]*\d)?(?:_)?([\datx]*\d)?(.*)/
    const match = regex.exec(variable)

    let cellIndex: number | null = null
    let cellIndexes: number[] = []

    // @ts-ignore
    const indexOfLastGrid = window._store.getState().grids.length - 1

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
      window._store.setState(adventureUpdate)
    }

    const setGridData = (gridId: number) => {
      let gridUpdate: { [key: string]: any } = {}

      if (property === "") {
        const { vs: onViewGScript, ls: onLeaveGScript, is: onInitGScript, ...rest } = value
        gridUpdate = {
          onViewGScript,
          onLeaveGScript,
          onInitGScript,
          ...rest
        }
      } else {
        gridUpdate[shorthenGridPropertyName(property)] = value
      }
      // @ts-ignore
      window._store.getState().updateGrid({ gridId, gridUpdate })
    }

    const setCellData = (gridId: number, cellIndex: number) => {
      let cellUpdate: { [key: string]: any } = {}

      if (property === "") {
        const { c: color, e: emoji, cs: onClickCScript, vs: onViewCScript, ls: onLeaveCScript, is: onInitCScript, ...rest } = value
        cellUpdate = {
          color,
          emoji,
          onClickCScript,
          onViewCScript,
          onLeaveCScript,
          onInitCScript,
          ...rest
        }
      } else {
        cellUpdate[shorthenCellPropertyName(property)] = value
      }
      // @ts-ignore
      window._store.getState().updateCell({ gridId, cellIndex, cellUpdate })
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

// variable subscriber proxy
const proxyTarget6 = {};
const cellSubscriberHandler = {
  get(_target: any, variable: string) {
    // @ts-ignore
    let subscribersOfTheCell = window._store.getState().cellSubscribers?.[variable]
    // if the subscriber array does not exist for the variable, create it
    if (!Array.isArray(subscribersOfTheCell)) {
      // @ts-ignore
      const oldCellSubscribers = window._store.getState().cellSubscribers
      const cellSubscribers = {
        ...oldCellSubscribers,
        [variable]: []
      }
      // @ts-ignore
      window._store.setState({ cellSubscribers })
      // @ts-ignore
      subscribersOfTheCell = window._store.getState().cellSubscribers?.[variable]
    }

    return subscribersOfTheCell
  },
  set(_object: any, variable: string, subscribersOfTheCell: Function[]) {
    // @ts-ignore
    const oldCellSubscribers = window._store.getState().cellSubscribers

    const cellSubscribers = {
      ...oldCellSubscribers,
      [variable]: subscribersOfTheCell ?? []
    }

    // @ts-ignore
    window._store.setState({ cellSubscribers })
    return true
  },
};

export const cellSubscriberProxy = new Proxy(proxyTarget6, cellSubscriberHandler)