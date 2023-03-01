// import { getRegexes } from "../utils/evalScript";

const proxyTarget = {};

export type Subcriber = {
  variable: string,
  callback: (newValue?: any) => {},
  id?: string
}

export let subscribers: Subcriber[] = []

const handler = {
  get(target, prop) {
    // console.log("target | proxy.ts l8", target)
    // console.log("prop | proxy.ts l9", prop)

    const value = target[prop]
    return value === undefined ? 0 : value
  },
  set(obj, variable, value) {
    // console.log("obj | proxy.ts l15", obj)
    // console.log("prop | proxy.ts l16", prop)
    // console.log("value | proxy.ts l17", value)
    console.log("variable | proxy.ts l32", variable)
    console.log("value | proxy.ts l32", value)


    obj[variable] = value

    // trigger subscribers
    const subscribersForVariable = subscribers.filter(s => s.variable === variable)
    subscribersForVariable.forEach(subscriber => subscriber.callback(value))
    return true
  },
};

export const variableProxy = new Proxy(proxyTarget, handler);


// subscriber proxy
// used to simplify shorthands
// window._subscriberProxy.xxx = yyy will be translated to subscribers.push({ variable: x, callback: y })

let callbackCounter = 0

const proxyTarget2 = {};
const subscriberHandler = {
  get() {
    return "not available"
  },
  set(_object, variable: string, unparsedCallback: (newValue?: any) => {}) {
    console.log("variable | proxy.ts l32", variable)
    console.log("value | proxy.ts l32", unparsedCallback)

    callbackCounter++

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

    subscribers.push({
      variable,
      callback: unparsedCallback,
      id: `${callbackCounter}`
    })
    return true
  },
};

export const subscriberProxy = new Proxy(proxyTarget2, subscriberHandler)
