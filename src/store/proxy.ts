const target = {};

export type Subcriber = {
  variable: string,
  callback: (newValue?: any) => {},
  id?: string
}

export let subscribers: Subcriber[] = []

const addSubscriber = (variable: string, callback: (newValue?: any) => {}, id = "") => {
  subscribers.push({
    variable,
    callback,
    id
  })
}

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

export const proxy = new Proxy(target, handler);

addSubscriber("potato", (v) => console.log(`subs ${v}`))

proxy.potato++
proxy.potato++

if (proxy.tomato) console.log("tomato")
if (proxy.potato) console.log("potato")

// everything is 0 by default
// because most variable are going to be number (counter and scores)
// and that why we don't need to initialize them

// # global
// @ map
// ^ cell

// $ : subscribe to the value after it

// $#.c : subscriber to global c
// $@.c : subscriber to map c
// $^.c :

// $#c : subscribe to global count
// $@c : subscribe to map count
// $^c : subscribe to local count