<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# noi-search



<!-- Auto Generated Below -->


## Dependencies

### Used by

 - [noi-mobility-traffic](../..)

### Depends on

- [noi-path-details](../path-details)
- [noi-button](../../components/button)

### Graph
```mermaid
graph TD;
  noi-search --> noi-path-details
  noi-search --> noi-button
  noi-path-details --> noi-last-sync
  noi-path-details --> noi-urban-path
  noi-path-details --> noi-station-item
  noi-path-details --> noi-button
  noi-urban-path --> noi-station-item
  noi-urban-path --> noi-last-sync
  noi-mobility-traffic --> noi-search
  style noi-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
