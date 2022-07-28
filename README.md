# logux-redux

## Installation

`yarn install`

## Build

`yarn build`

## Getting Started

You can use this devtool for `logux` by [installing it as an "unpacked extension" in chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked).

```ts
// record a single dispatched action
window.__LOGUX_DEVTOOL__.recordDispatch(meta.id, action, store.getState())

// record a set of replayed actions with their new states
window.__LOGUX_DEVTOOL__.recordReplay([[meta1.id, action1, state1], [meta2.id, action2, state2]])
```

## API

### `__LOGUX_DEVTOOL__.recordDispatch(id, action, state)`

record a single dispatched action

* `id` - unique identifier for the action
* `action` - redux action
* `state` - final state after applying the action

### `__LOGUX_DEVTOOL__.recordReplay`

record a set of replayed actions with their new states

* `entries` - an array of `id`, `action`, `state` tuples

## Screenshots

<img width="1727" alt="Screen Shot 2022-07-28 at 4 12 46 AM" src="https://user-images.githubusercontent.com/3784470/181456155-4f8ce853-b772-4d7a-a5db-5fddd5b5cb34.png">


