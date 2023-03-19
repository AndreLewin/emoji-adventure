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


// update proxy

const proxyTarget4 = {};
const handler4 = {
  get(_target: any, variable: string) {
    const cellProperty = variable.split("_")[0] as keyof Cell
    const gridId = parseInt(variable.match(/gridId(\d*)/)?.[1] ?? "")
    const cellIndex = parseInt(variable.match(/cellIndex(\d*)/)?.[1] ?? "")
    // @ts-ignore
    const cell = window._s.getState().getCell({ gridId, cellIndex }) as Cell
    return cell[cellProperty]
  },
  set(_target: any, variable: string, value: any) {
    const cellProperty = variable.split("_")[0] as keyof Cell
    const gridId = parseInt(variable.match(/gridId(\d*)/)?.[1] ?? "")
    const cellIndex = parseInt(variable.match(/cellIndex(\d*)/)?.[1] ?? "")
    // @ts-ignore
    window._s.getState().updateCell({
      gridId,
      cellIndex,
      cellUpdate: {
        [cellProperty]: value
      }
    })
    return true
  },
};

export const updateProxy = new Proxy(proxyTarget4, handler4);