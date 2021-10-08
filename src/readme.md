# noi-mobility-traffic



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [noi-button](./components/button)
- [noi-backdrop](./components/backdrop)
- [noi-stations-modal](./blocks/stations-modal)
- [noi-search](./blocks/search)
- [noi-map](./blocks/map)

### Graph
```mermaid
graph TD;
  noi-mobility-traffic --> noi-button
  noi-mobility-traffic --> noi-backdrop
  noi-mobility-traffic --> noi-stations-modal
  noi-mobility-traffic --> noi-search
  noi-mobility-traffic --> noi-map
  noi-stations-modal --> noi-button
  noi-stations-modal --> noi-input
  noi-search --> noi-path-details
  noi-search --> noi-button
  noi-path-details --> noi-last-sync
  noi-path-details --> noi-urban-path
  noi-path-details --> noi-station-item
  noi-path-details --> noi-button
  noi-urban-path --> noi-station-item
  noi-urban-path --> noi-last-sync
  noi-map --> noi-button
  style noi-mobility-traffic fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
