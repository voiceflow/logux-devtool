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

