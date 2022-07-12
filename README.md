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

To integrate as iframe, please follow the code below

```html
<iframe
  :src="{{tryItOutUrl + docUrl + apiKey}}"
  frameborder="0"
  id="TryOutIframe"
  style="overflow:hidden;width:100%;max-height:100%;pointer-events:revert-layer;"
  allow="camera *;microphone *; clipboard-read; clipboard-write"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
></iframe>
```

To get proper resize:
This should be run once page is loaded

```js
window.addEventListener(
  "message",
  function (e) {
    // message that was passed from iframe page with the size of the page
    const iframe = document.getElementById("TryOutIframe");
    let message = e.data;

    if (iframe && message.responseToCopy) {
      /**
       * Here is listening to the iframe event after user click "copy"
       * button in the raw response. Receive and add data to clipboard
       * */
      navigator.clipboard.writeText(message.responseToCopy);
    }

    if (iframe && message.completed) {
      // Calculate the height different before and after the API result
      const heightDif = +iframe.style.height.replace("px", "") - message.height;

      /**
       * If the height different is greater than 100px (use 100px here
       * to avoid window resizing bug), the widnow will be  scroll  up
       * till the top area of the Try It Out iframe container.
       * */

      heightDif > 100
        ? this.window.scrollBy({ top: -heightDif, behavior: "smooth" })
        : null;
    }

    if (iframe && message.height) {
      iframe.style.height = message.height + "px";
    }
  },
  false
);
```

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

For audio recording and return as base64 string.
