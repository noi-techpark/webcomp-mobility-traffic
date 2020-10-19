# noi-mobility-traffic

A responsive Web-component "tempi di percorrenza"

## Table of contents

- [Usage](#usage)
- [Gettings started](#getting-started)
- [Tests and linting](#tests-and-linting)
- [Deployment](#deployment)
- [Docker environment](#docker-environment)
- [Information](#information)

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

## Getting started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

### Prerequisites

Before building/starting the project one will need to add a `.env` file in the root prj dir wit following secrets:

```
CLIENT_SECRET=???
CLIENT_ID=it.bz.opendatahub.webcomponents.mobility-traffic
TOKEN_URL="https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/token"
```

To build the project, the following prerequisites must be met:

- ToDo: Check the prerequisites
- Node 12 / NPM 6

For a ready to use Docker environment with all prerequisites already installed and prepared, you can check out the [Docker environment](#docker-environment) section.

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

### Build

Build and start the project:

```bash
npm run start
```

The application will be served and can be accessed at [http://localhost:8080](http://localhost:8080).

## Tests and linting

The tests and the linting can be executed with the following commands:

```bash
npm run test
npm run lint
```

## Deployment

To create the distributable files, execute the following command:

```bash
npm run build
```

## Docker environment

For the project a Docker environment is already prepared and ready to use with all necessary prerequisites.

These Docker containers are the same as used by the continuous integration servers.

### Installation

Install [Docker](https://docs.docker.com/install/) (with Docker Compose) locally on your machine.

### Dependenices

First, install all dependencies:

```bash
docker-compose run --rm app /bin/bash -c "npm install"
```

### Start and stop the containers

Before start working you have to start the Docker containers:

```
docker-compose up --build --detach
```

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

ToDo: For support, please contact [info@opendatahub.bz.it](mailto:info@opendatahub.bz.it).

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

