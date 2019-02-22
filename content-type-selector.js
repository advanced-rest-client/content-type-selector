/**
@license
Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {EventsTargetMixin} from '@advanced-rest-client/events-target-mixin/events-target-mixin.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
/**
 * `<content-type-selector>` is an element that provides an UI for selecting common
 * content type values.
 *
 * The element do not renders a value that is not defined on the list.
 * Instead it shows the default label.
 *
 * If the content type is more complex, mening has additional information like
 * `multipart/form-data; boundary=something` then, in this case` only the
 * `multipart/form-data` is taken into the account when computing selected item.
 *
 * The element fires the `content-type-changed` custom event when the user change
 * the value in the drop down container. It is not fired when the change has not
 * beem cause by the user.
 *
 * ### Example
 * ```
 * <content-type-selector></content-type-selector>
 * ```
 *
 * The list of content type values can be extended by setting child `<paper-item>`
 * elements with the `data-type` attribute set to content type value.
 *
 * ### Example
 * ```
 * <content-type-selector>
 *    <paper-item data-type="application/zip">Zip file</paper-item>
 *    <paper-item data-type="application/7z">7-zip file</paper-item>
 * </content-type-selector>
 * ```
 *
 * ### Listening for content type change event
 *
 * By default the element listens for the `content-type-changed` custom event on
 * global `window` object. This can be controlled by setting the `eventsTarget`
 * property to an element that will be used as an event listeners target.
 * This way the application can scope events accepted by this element.
 *
 * This will not work for events dispatched on this element. The scoped element
 * should handle `content-type-changed` custom event and stop it's propagation
 * if appropriate.
 *
 * Once the `content-type-changed` custom event it changes value of current
 * content type on this element unless the event has been canceled.
 *
 * ### Styling
 * `<content-type-selector>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--content-type-selector` | Mixin applied to the element | `{}`
 * `--content-type-selector-item` | Mixin applied to dropdown items | `{}`
 *
 * The element support styles for `paper-dropdown-menu`, `paper-listbox` and `paper-item`
 *
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin EventsTargetMixin
 */
class ContentTypeSelector extends EventsTargetMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --content-type-selector;
    }

    paper-item {
      @apply --content-type-selector-item;
    }

    paper-item:hover {
      @apply --paper-item-hover;
      @apply --content-type-selector-item-hover;
    }
    </style>
    <paper-dropdown-menu label="Body content type">
      <paper-listbox slot="dropdown-content" on-iron-select="_contentTypeSelected"
        selected="[[selected]]" selectable="[data-type]">
        <paper-item data-type="application/json">application/json</paper-item>
        <paper-item data-type="application/xml">application/xml</paper-item>
        <paper-item data-type="application/atom+xml">application/atom+xml</paper-item>
        <paper-item data-type="multipart/form-data">multipart/form-data</paper-item>
        <paper-item data-type="multipart/alternative">multipart/alternative</paper-item>
        <paper-item data-type="multipart/mixed">multipart/mixed</paper-item>
        <paper-item data-type="application/x-www-form-urlencoded">application/x-www-form-urlencoded</paper-item>
        <paper-item data-type="application/base64">application/base64</paper-item>
        <paper-item data-type="application/octet-stream">application/octet-stream</paper-item>
        <paper-item data-type="text/plain">text/plain</paper-item>
        <paper-item data-type="text/css">text/css</paper-item>
        <paper-item data-type="text/html">text/html</paper-item>
        <paper-item data-type="application/javascript">application/javascript</paper-item>
        <slot name="item"></slot>
      </paper-listbox>
    </paper-dropdown-menu>
`;
  }

  static get is() {return 'content-type-selector';}
  static get properties() {
    return {
      /**
       * A value of a Content-Type header.
       */
      contentType: {
        type: String,
        notify: true,
        observer: '_contentTypeChanged'
      },
      /**
       * Index of currently selected item.
       */
      selected: Number
    };
  }

  constructor() {
    super();
    this._contentTypeHandler = this._contentTypeHandler.bind(this);
  }

  _attachListeners(node) {
    node.addEventListener('content-type-changed', this._contentTypeHandler);
  }

  _detachListeners(node) {
    node.removeEventListener('content-type-changed', this._contentTypeHandler);
  }
  /**
   * Handles change of content type value
   *
   * @param {String} contentType New value
   */
  _contentTypeChanged(contentType) {
    this.__cancelSelectedEvents = true;
    if (!contentType) {
      this.set('selected', undefined);
      this.__cancelSelectedEvents = false;
      return;
    }
    const index = contentType.indexOf(';');
    if (index > 0) {
      contentType = contentType.substr(0, index);
    }
    contentType = contentType.toLowerCase();
    const supported = this.__getDropdownChildrenTypes();
    const selected = supported.findIndex((item) => item.toLowerCase() === contentType);
    if (selected !== -1) {
      this.set('selected', selected);
    } else {
      this.set('selected', undefined);
    }
    this.__cancelSelectedEvents = false;
  }

  /**
   * If the event comes from different source then this element then it
   * updates `contentType` value.
   *
   * @param {CustomEvent} e
   */
  _contentTypeHandler(e) {
    if (e.defaultPrevented || e.composedPath()[0] === this) {
      return;
    }
    const ct = e.detail.value;
    if (ct !== this.contentType) {
      this.set('contentType', ct);
    }
  }
  /**
   * When chanding the editor it mey require to also change the content type header.
   * This function updates Content-Type.
   *
   * @param {CustomEvent} e
   */
  _contentTypeSelected(e) {
    if (this.__cancelSelectedEvents) {
      return;
    }
    const selected = e.target.selected;
    if (this.selected !== selected) {
      this.set('selected', selected);
    }
    const ct = e.detail.item.dataset.type;
    if (this.contentType !== ct) {
      this.__cancelSelectedEvents = true;
      this.dispatchEvent(new CustomEvent('content-type-changed', {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          value: ct
        }
      }));
      this.set('contentType', ct);
      this.__cancelSelectedEvents = false;
    }
  }
  /**
   * Creates a list of all content types added to this element.
   * This includes pre-existing onces and any added to loght DOM.
   *
   * @return {Array} Array of ordered content types (values of the
   * `data-type` attribute).
   */
  __getDropdownChildrenTypes() {
    let children = Array.from(this.shadowRoot.querySelectorAll('paper-listbox paper-item'));
    const slot = this.shadowRoot.querySelector('slot[name="item"]');
    const lightChildren = slot.assignedNodes();
    children = children.concat(lightChildren);
    const result = [];
    children.forEach((item) => {
      if (!item.dataset || !item.dataset.type) {
        return;
      }
      result[result.length] = item.dataset.type;
    });
    return result;
  }

  /**
   * Dispatched when selected value changes
   *
   * @event content-type-changed
   * @param {String} value New value of the content type.
   */
}
window.customElements.define(ContentTypeSelector.is, ContentTypeSelector);
