<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# noi-station-item



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute     | Description | Type      | Default     |
| ----------------------- | ------------- | ----------- | --------- | ----------- |
| `isEnd`                 | `is-end`      |             | `boolean` | `false`     |
| `isSelected`            | `is-selected` |             | `boolean` | `false`     |
| `isStart`               | `is-start`    |             | `boolean` | `false`     |
| `name` _(required)_     | `name`        |             | `string`  | `undefined` |
| `position` _(required)_ | `position`    |             | `number`  | `undefined` |
| `timeSec`               | `time-sec`    |             | `number`  | `undefined` |


## Dependencies

### Used by

 - [noi-path-details](../path-details)
 - [noi-urban-path](../urban-path)

### Graph
```mermaid
graph TD;
  noi-path-details --> noi-station-item
  noi-urban-path --> noi-station-item
  style noi-station-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
