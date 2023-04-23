// import { getRegexes } from "../utils/evalScript";

import { Cell } from ".";

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

const convertCellPropertyName = (n: string): string => {
  if (n === "c") return "color"
  if (n === "e") return "emoji"
  if (n === "cs") return "onClickCScript"
  if (n === "is") return "onInitCScript"
  if (n === "vs") return "onViewCScript"
  return n
}

const convertGridPropertyName = (n: string): string => {
  if (n === "vs") return "onViewGScript"
  if (n === "is") return "onInitGScript"
  return n
}

const convertAdventurePropertyName = (n: string): string => {
  if (n === "is") return "onInitAScript"
  return n
}

const proxyTarget5 = {};
const handler5 = {
  get(_target: any, variable: string) {
    const regex = /(?:\_(\d*))?(?:\_(\d*))?([a-z]*)/
    const match = regex.exec(variable)
    const gridId = parseInt(match?.[1] ?? "")
    const cellIndex = parseInt(match?.[2] ?? "")
    const property = match?.[3] ?? ""

    console.log("gridId | proxy.ts l173", gridId)
    console.log("cellIndex | proxy.ts l174", cellIndex)
    console.log("property | proxy.ts l175", property)


    if (!Number.isNaN(cellIndex) && !Number.isNaN(gridId)) {
      // cell mode
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
    } else if (!Number.isNaN(gridId)) {
      // grid mode
      // @ts-ignore
      const grid = window._s.getState().getGrid({ gridId }) as Grid
      const { onViewGScript: vs, onInitGScript: is } = grid
      const gridWithShortNames: { [key: string]: any } = {
        is,
        vs,
        ...grid
      }
      return property === "" ? gridWithShortNames : gridWithShortNames[property]
    } else {
      // adventure mode
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
  },
  set(_target: any, variable: string, value: any) {
    const regex = /(?:\_(\d*))?(?:\_(\d*))?([a-z]*)/
    const match = regex.exec(variable)
    const gridId = parseInt(match?.[1] ?? "")
    const cellIndex = parseInt(match?.[2] ?? "")
    const property = match?.[3] ?? ""

    console.log("gridId | proxy.ts l173", gridId)
    console.log("cellIndex | proxy.ts l174", cellIndex)
    console.log("property | proxy.ts l175", property)

    if (!Number.isNaN(cellIndex) && !Number.isNaN(gridId)) {
      // cell mode
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
        cellUpdate[convertCellPropertyName(property)] = value
      }
      // @ts-ignore
      window._s.getState().updateCell({ gridId, cellIndex, cellUpdate })
    } else if (!Number.isNaN(gridId)) {
      // grid mode
      let gridUpdate: { [key: string]: any } = {}

      if (property === "") {
        const { vs: onViewGScript, is: onInitGScript, ...rest } = value
        gridUpdate = {
          onViewGScript,
          onInitGScript,
          ...rest
        }
      } else {
        gridUpdate[convertGridPropertyName(property)] = value
      }
      // @ts-ignore
      window._s.getState().updateGrid({ gridId, gridUpdate })
    } else {
      // adventure mode
      let adventureUpdate: { [key: string]: any } = {}

      if (property === "") {
        const { is: onInitAScript, ...rest } = value
        adventureUpdate = {
          onInitAScript,
          ...rest
        }
      } else {
        adventureUpdate[convertAdventurePropertyName(property)] = value
      }
      // @ts-ignore
      window._s.setState(adventureUpdate)
    }

    return true
  },
};

export const dataProxy = new Proxy(proxyTarget5, handler5);