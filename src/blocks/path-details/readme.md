# noi-path-details



<!-- Auto Generated Below -->


## Events

| Event          | Description | Type                                |
| -------------- | ----------- | ----------------------------------- |
| `toggleActive` |             | `CustomEvent<"highway" \| "urban">` |


## Dependencies

### Used by

 - [noi-search](../search)

### Depends on

- [noi-last-sync](../last-sync)
- [noi-urban-path](../urban-path)
- [noi-station-item](../station-item)
- [noi-button](../../components/button)

### Graph
```mermaid
graph TD;
  noi-path-details --> noi-last-sync
  noi-path-details --> noi-urban-path
  noi-path-details --> noi-station-item
  noi-path-details --> noi-button
  noi-urban-path --> noi-station-item
  noi-urban-path --> noi-last-sync
  noi-search --> noi-path-details
  style noi-path-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
