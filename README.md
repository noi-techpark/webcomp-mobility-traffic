<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# Mobility Traffic

[![CI/CD](https://github.com/noi-techpark/webcomp-mobility-traffic/actions/workflows/main.yml/badge.svg)](https://github.com/noi-techpark/webcomp-mobility-traffic/actions/workflows/main.yml)
[![REUSE status](https://api.reuse.software/badge/github.com/noi-techpark/webcomp-mobility-traffic)](https://api.reuse.software/info/github.com/noi-techpark/webcomp-mobility-traffic)

A responsive webcomponent for travelling times

- [Mobility Traffic](#mobility-traffic)
  - [Usage](#usage)
    - [Attributes](#attributes)
      - [--noi-font-family](#--noi-font-family)
      - [--noi-width, --noi-height](#--noi-width---noi-height)
      - [--noi-primary, --noi-primary-rgb](#--noi-primary---noi-primary-rgb)
      - [--noi-primary-contrast](#--noi-primary-contrast)
      - [--noi-action, --noi-action-rgb](#--noi-action---noi-action-rgb)
      - [--noi-action-contrast](#--noi-action-contrast)
      - [--noi-error, --noi-error-rgb](#--noi-error---noi-error-rgb)
      - [--noi-error-contrast](#--noi-error-contrast)
      - [--noi-jam-strong](#--noi-jam-strong)
      - [--noi-jam-light](#--noi-jam-light)
      - [--noi-jam-none](#--noi-jam-none)
    - [Configuration](#configuration)
      - [Geometries configuration](#geometries-configuration)
      - [Jams configuration](#jams-configuration)
      - [Time Outlayers configuration](#time-outlayers-configuration)
      - [Urban segments configuration](#urban-segments-configuration)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Source code](#source-code)
    - [Dependencies](#dependencies)
    - [Developer server start](#developer-server-start)
  - [Tests](#tests)
  - [Deployment](#deployment)
  - [Docker environment](#docker-environment)
    - [Installation](#installation)
    - [Dependenices](#dependenices)
    - [Start and stop the containers](#start-and-stop-the-containers)
    - [Running commands inside the container](#running-commands-inside-the-container)
  - [Information](#information)
    - [Support](#support)
    - [Contributing](#contributing)
    - [Documentation](#documentation)
    - [Boilerplate](#boilerplate)
    - [License](#license)


## Usage

Please, follow the example in `src/index.html`. You will need to include the web-component JS wile located in `/build` folder (either module or nomodule  version):

```html
<script type="module" src="/build/noi-mobility-traffic.esm.js"></script>
<script nomodule src="/build/noi-mobility-traffic.js"></script>
```

Secondly, you'll need to include the component stylesheet:
```html
  <link rel="stylesheet" href="/build/noi-mobility-traffic.css">
```

Now, define the web component like this:

```html
  <noi-mobility-traffic lang="it"></noi-mobility-traffic>
```

### Attributes

We tried to comply as much as possible the HTML/CSS spec so the only attribute that is standard is `lang` which is passed as component attribute. The rest of the properties are declared as CSS custom properties and can be defined either inline or in css header. The default values are given below:

```css
noi-mobility-traffic {
  --noi-font-family: "Roboto", "Helvetica Neue", sans-serif;
  --noi-width: 100%;
  --noi-height: 100%;
  --noi-primary: #0068B4;
  --noi-primary-rgb: 0, 104, 180;
  --noi-primary-contrast: #ffffff;
  --noi-action: #339966;
  --noi-action-rgb: 87, 173, 57;
  --noi-action-contrast: #ffffff;
  --noi-error: #B44C00;
  --noi-error-rgb: 180,76,0;
  --noi-error-contrast: #ffffff;
  --noi-jam-none: #0068B4;
  --noi-jam-strong: #B44C00;
  --noi-jam-light: yellow;
}
```

#### --noi-font-family

Main font that will be use across all the projects. Should comply to the css `font-family` property. Default is Roboto.

#### --noi-width, --noi-height

Width/Height of the web-component. Should comply the width/height css attribute. Can be fixed or percent (or any other valid css width value). Default is 100%


#### --noi-primary, --noi-primary-rgb

Primary color to be used all across the web-component and it's rgb representation (should correspond to the first value). Default is:
```css
  --noi-primary: #0068B4;
  --noi-primary-rgb: 0, 104, 180;
```

#### --noi-primary-contrast

Primary contrast color color. Used to distinguish the text font on elements that have `background: var(--noi-primary)`. Default is white.
```css
  --noi-primary-contrast: #000000;
```

#### --noi-action, --noi-action-rgb

Action color to be used all across the web-component and it's rgb representation (should correspond to the first value). Default is:
```css
  --noi-action: #339966;
  --noi-action-rgb: 87, 173, 57;
```

#### --noi-action-contrast

Action contrast color color. Used to distinguish the text font on elements that have `background: var(--noi-action)`. Default is white.
```css
  --noi-action-contrast: #000000;
```

#### --noi-error, --noi-error-rgb

An error color to be used for all the error messages and it's rgb representation (should correspond to the first value). Default is:
```css
  --noi-action: red;
  --noi-action-rgb: 255, 0, 0;
```

#### --noi-error-contrast

Error contrast color color. Used to distinguish the text font on elements that have `background: var(--noi-error)`. Default is white.
```css
  --noi-error-contrast: #000000;
```

#### --noi-jam-strong

The value that will be used to color a segment path with heavy traffic on the map. Default is red.

```css
--noi-jam-strong: red;
```

#### --noi-jam-light

The value that will be used to color a segment path with light traffic on the map. Default is yellow.

```css
--noi-jam-strong: yellow;
```

#### --noi-jam-none

The value that will be used to color a segment path without any traffic. Default is blue.

```css
--noi-jam-none: blue;
```


### Configuration

The app uses following four json files to configure different thresholds and currently missing api data:

Inside the folder `data`:
- `geometries.json` - provide missing geometry data for A22 path
- `jams.json` - values to identify traffic jams on segments
- `time-thresholds.json` - thresholds to identify time values outlayers
- `urban-segments.json` - provide missing urban connections between two highway stations

#### Geometries configuration

Provide a json map (by LinkStation id) that should comply the  following
structure. Geometry attribute should be a valid **GeoJSON** object.
```json
{
  "1853-1854": {
    "geometry": "",
    "name":"BOLZANO NORD - BOLZANO SUD"
  }
}
```

#### Jams configuration

Traffic jams map (by LinkStation id) that should comply the  following
structure. Supports both Urban and A22 segments. Each key should be an array of
two velocity values - heavy traffic value and light traffic value. If actual
segment velocity is lower than first value, the traffic considered to be heavy.
If higher than first but lower than second, light traffic. Higher than second,
no traffic. If value is missing the segment will have the default colour on the
map. Example:

```json
{
  "1853->1854": [70, 95],
  "Arginale_Palermo->Arginale_Resia": [40, 60]
}
```

#### Time Outlayers configuration

Time thresholds map. If historical value + thresholds < actual value, then the
actual value will be considered an outlayer and a historical value will be used.
Example:

```json
{
  "1853->1854": 120
}
```

#### Urban segments configuration

Contains the urban stations path (as an array of ids) that connect two highway
stations. The id should be a concatenation of start station id and end station
id with `->` separator in-between (as in example below `1854->1853` LinkStation
connecting Bz Nord and Bz Süd). If no data is provided for given start/end,
urban path is considered to be absent.

```json
{
  "1854->1853": [
    "Torricelli->siemens",
    "siemens->Galilei_Palermo",
    "Galilei_Palermo->Galilei_Lancia",
    "Galilei_Lancia->Galilei_Virgolo",
    "Galilei_Virgolo->Galleria_Virgolo",
    "Galleria_Virgolo->P_Campiglio"
  ]
}
```


## Getting started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

### Prerequisites

Before building/starting the project one will need to add a `.env` file in the
root prj dir with following secrets:

```
CLIENT_SECRET=???
CLIENT_ID=it.bz.opendatahub.webcomponents.mobility-traffic
TOKEN_URL="https://auth.opendatahub.com/auth/realms/noi/protocol/openid-connect/token"
```

To build the project, the following prerequisites must be met:

- ToDo: Check the prerequisites
- Node 12 / NPM 6

For a ready to use Docker environment with all prerequisites already installed
and prepared, you can check out the [Docker environment](#docker-environment)
section.

### Source code

Get a copy of the repository:

```bash
ToDo: git clone https://github.com/noi-techpark/webcomp-mobility-traffic.git
```

Change directory:

```bash
ToDo: cd webcomp-mobility-traffic/
```

### Dependencies

Download all dependencies (please, do clean install (ci), to respect the `package-lock.json`):

```bash
npm ci
```

### Developer server start

Build and start the project:

```bash
npm run start
```

The application will be served and can be accessed at [http://localhost:3333](http://localhost:3333).

## Tests

The tests can be executed with the following command:

```bash
npm run test
```

## Deployment

To create the distributable files, execute the following command:

```bash
npm run build:cdn
```

## Docker environment

For the project a Docker environment is already prepared and ready to use with all necessary prerequisites.

These Docker containers are the same as used by the continuous integration servers.

### Installation

Install [Docker](https://docs.docker.com/install/) (with Docker Compose) locally on your machine.

### Dependenices

First, install all dependencies:

```bash
docker-compose run --rm app /bin/bash -c "npm ci"
```

### Start and stop the containers

Before start working you have to start the Docker containers:

```
docker-compose up --build --detach
```

The application will be served and can be accessed at [http://localhost:8999](http://localhost:8999).

After finished working you can stop the Docker containers:

```
docker-compose stop
```

### Running commands inside the container

When the containers are running, you can execute any command inside the environment. Just replace the dots `...` in the following example with the command you wish to execute:

```bash
docker-compose run --rm app /bin/bash -c "..."
```

Some examples are:

```bash
docker-compose run --rm app /bin/bash -c "npm run test"
```

## Information

### Support

For support, please contact [help@opendatahub.com](mailto:help@opendatahub.com).

### Contributing

If you'd like to contribute, please follow the following instructions:

- Fork the repository.

- Checkout a topic branch from the `development` branch.

- Make sure the tests are passing.

- Create a pull request against the `development` branch.

A more detailed description can be found here: [https://github.com/noi-techpark/documentation/blob/master/contributors.md](https://github.com/noi-techpark/documentation/blob/master/contributors.md).

### Documentation

More documentation can be found at [https://opendatahub.readthedocs.io/en/latest/index.html](https://opendatahub.readthedocs.io/en/latest/index.html).

### Boilerplate

The project uses this boilerplate: [https://github.com/noi-techpark/webcomp-boilerplate](https://github.com/noi-techpark/webcomp-boilerplate).

### License

The code in this project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3 license. See the [LICENSE.md](LICENSE.md) file for more information.

