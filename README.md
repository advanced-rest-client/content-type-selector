# content-type-selector

An element that provides an UI for selecting common content type values.

```html
<content-type-selector contenttype="application/zip">
  <paper-item slot="item" data-type="application/zip">Zip file</paper-item>
  <paper-item slot="item" data-type="application/7z">7-zip file</paper-item>
</content-type-selector>
```

[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/content-type-selector.svg)](https://www.npmjs.com/package/@advanced-rest-client/content-type-selector)

[![Tests and publishing](https://github.com/advanced-rest-client/content-type-selector/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/content-type-selector/actions/workflows/deployment.yml)

## Usage

### Installation

```sh
npm install --save @advanced-rest-client/content-type-selector
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/content-type-selector/content-type-selector.js';
    </script>
    <script src="node_modules/web-animations-js/web-animations-next.min.js"></script>
  </head>
  <body>
    <content-type-selector contenttype="application/json"></content-type-selector>
    <script>
    window.addEventListener('content-type-changed', (e) => {
      console.log(e.detail.value);
    });
    </script>
  </body>
</html>
```

### In a LitElement template

```js
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/content-type-selector/content-type-selector.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <content-type-selector .contentType="${this.mediaType}" @contenttype-changed="${this._mediaChangeHandler}"></content-type-selector>
    `;
  }

  _mediaChangeHandler(e) {
    console.log(e.target.contentType);
    // or e.detail.value
  }
}
customElements.define('sample-element', SampleElement);
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@advanced-rest-client/content-type-selector/content-type-selector.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <content-type-selector contenttype="{{mediaType}}"></content-type-selector>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/content-type-selector
cd content-type-selector
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```
