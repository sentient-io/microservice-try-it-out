# Try It Out (try-it-out)

Sentient.io's API try out platform

## Install the dependencies

DO NOT USE YARN, not sure how it appeared there.

```bash
# yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Deployment

Double check .firebaserc's project.
For dev, use : try-it-out-dev
For prod, awating for the final URL

```bash
firebase deploy --only hosting
```

### Integration

@params docUrl - Important, the url point to a yaml or json file for try
it out to read the documentation .

@params apiKey - Feed an API key to try it out, this will disable the UI
for the API key input.

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).

### Additional Package Installed

#### **@stoplight/json-ref-resolver** (https://www.npmjs.com/package/@stoplight/json-ref-resolver)

To parse the "$ref" from the yaml docs to direct callable object.

#### **js-yaml** (https://www.npmjs.com/package/js-yaml)

Yaml parser. Convert yaml doc to json object

#### **export-from-json** (https://www.npmjs.com/package/export-from-json)

Export to plain text, css, html, json, csv, xls, xml files from JSON.

#### **qmarkdown** (https://qmarkdown.netlify.app/)

Markdown viewer. Installed with command
`$ quasar ext add @quasar/qmarkdown@next`

#### **papaparse** (https://www.npmjs.com/package/papaparse)

CSV to JSON

#### **recordrtc** (https://www.npmjs.com/package/recordrtc)

For audio recording and return as base64 string
