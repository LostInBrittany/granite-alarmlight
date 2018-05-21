/**
@license MIT
Copyright (c) 2018 Horacio "LostInBrittany" Gonzalez
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { updateStyles } from '@polymer/polymer/lib/mixins/element-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * `granite-alarmlight`
 * a ok-warn-ko status indicator
 *
 * Example:
 *
 * ```html
 * <granite-alarmlight status="1"></granite-led>
 * ```
 * The following custom properties and mixins are available for styling:
 * Custom property | Description | Default
 *
 * ----------------|-------------|----------
 * `--granite-alarmlight-margin`                    | Margin around the LED           | 5px
 * `--granite-alarmlight-size`                      | Size of the LED                 | 20px
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class GraniteAlarmlight extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }

      #ledSocket {
        margin: var(--granite-alarmlight-margin, 5px);
        width: var(--granite-alarmlight-size, 20px);
        height: var(--granite-alarmlight-size, 20px);
        border-radius: calc(var(--granite-alarmlight-size, 20px) / 2);
        transition: background-color linear .08s;
        background-color: var(--granite-alarmlight-current-color, #000000);
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
      }
    </style>
    <div id="ledSocket"></div>
    `;
  }

  static get is() { return 'granite-alarmlight'; }
  /**
    * Fired when the alarm light RGB color change
    *
    * @event alarmlight-change
    */
  static get properties() {
    return {
      /**
       * The status of the property
       * See the element description
       */
       status: {
        type: Number,
        value: 1,
        notify: true,
       },
      /**
       * If false, the alarm light is a classic three color traffic-light-like indicator
       * If true, it shows a gradient of color
       * See the element description
       */
      linear: {
        type: Boolean,
        value: false,
      },
      /**
       * The ok threshold
       * See the element description
       */
      ok: {
        type: Number,
        value: 1.0,
      },
      /**
       * The warn threshold
       * See the element description
       */
      warn: {
        type: Number,
        value: 0.0,
      },
      /**
       * The ko threshold
       * See the element description
       */
      ko: {
        type: Number,
        value: -1.0,
      },
      _defaultThresholds: {
        type: Array,
        return: [-1.0, 0.0, 1.0],
      },
      /**
       * The ok RGB Hex color
       */
      okColor: {
        type: String,
        value: '#00ff00',
      },
      /**
       * The warn RGB Hex color
       */
      warnColor: {
        type: String,
        value: '#ffff00',
      },
      /**
       * The ko RGB Hex color
       */
      koColor: {
        type: String,
        value: '#ff0000',
      },
      /**
       * If true, log messages
       */
       debug: {
        type: Boolean,
        value: false,
       },
      _okRGB: {
        type: Object,
        computed: '_validateColor(okColor)',
      },
      _warnRGB: {
        type: Object,
        computed: '_validateColor(warnColor)',
      },
      _koRGB: {
        type: Object,
        computed: '_validateColor(koColor)',
      },
      _statusRGB: {
        type: Object,
        observer: '_onStatusRGBChange',
        computed: '_onParamsChange(status,_okRGB,_warnRGB,_koRGB,linear)',
      },
      _risingThreshold: {
        type: Boolean,
        computed: '_onThresholdsChanged(ok,warn,ko)',
      },
    };
  }

  static get observers() {
   }

  connectedCallback() {
    super.connectedCallback();
    if (this.debug) {
      console.log(`[granite-alarmlight] connectedCallback - Threshold values - ko: ${this.ko}, warn:${this.warn},ok:${this.ok}`); // eslint-disable-line max-len
    }
  }

  _onThresholdsChanged() {
    /*
     * We need threshold values to be monotonous, either
     * ok >= warn >= ko  or ok <= warn <= ko
     */
    if ( ((this.ok > this.warn) && (this.warn < this.ko)) ||
          ((this.ok < this.warn) && (this.warn > this.ko)) ) {
      console.error('[granite-alarmlight] _onThresholdsChanged - invalid thresholds ',
        {ok: this.ok, warn: this.warn, ko: this.ko});
      this.ko = this._defaultThresholds[0];
      this.warn = this._defaultThresholds[1];
      this.ok = this._defaultThresholds[2];
      return true;
    }
    return ((this.ok >= this.warn) && (this.warn >= this.ko));
  }

  _validateColor(color) {
    if (!this._isValidHexValue(color)) {
      return {r: 0, g: 0, b: 0};
    }
    let colorLen = (color.length-1)/3;
    let rgb = {
      r: parseInt(color.substring(1, 1+colorLen), 16),
      g: parseInt(color.substring(1+colorLen, 1+2*colorLen), 16),
      b: parseInt(color.substring(1+2*colorLen, 1+3*colorLen), 16),
    };
    if (this.debug) {
      console.log('[granite-alarmlight] _validateColor', color, rgb );
    }
    return rgb;
  }

  _isValidHexValue(color) {
    if (typeof color !== 'string' ||
        !color.startsWith('#') ||
        ( color.length != 4 && color.length != 7) ) {
      return false;
    }
    if (this.debug) {
      console.log('[granite-alarmlight] _isValidHexValue', parseInt(color.substring(1), 16) );
    }
    let hex = parseInt('f'+color.substring(1), 16);
    return (hex.toString(16) === 'f'+color.substring(1));
  }

  _onParamsChange() {
    if (this._okRGB == undefined
        || this._warnRGB == undefined
        || this._koRGB == undefined
        || this.status == undefined) {
      return;
    }
    if (this.debug) {
      console.log('[granite-alarmlight]',
          `status: ${this.status}, _okRGB:${this._okRGB}, _warnRGB:${this._warnRGB}` );
    }
    if (!this.linear) {
      return this._computeValue();
    }
    return this._computeLinearValue();
  }

  _computeLinearValue() {
    let percent;
    if (this._risingThreshold) {
      if (this.status > this.ok) {
        return this._okRGB;
      }
      if (this.status < this.ko) {
        return this._koRGB;
      }
      if (this.status > this.warn) {
        percent = 1.0 * (this.status - this.warn) / (this.ok - this.warn);
        return {
          r: this._interpolate(this._warnRGB.r, this._okRGB.r, percent),
          g: this._interpolate(this._warnRGB.g, this._okRGB.g, percent),
          b: this._interpolate(this._warnRGB.b, this._okRGB.b, percent),
        };
      }
      percent = 1.0 * (this.status - this.ko) / (this.warn - this.ko);
      return {
        r: this._interpolate(this._koRGB.r, this._warnRGB.r, percent),
        g: this._interpolate(this._koRGB.g, this._warnRGB.g, percent),
        b: this._interpolate(this._koRGB.b, this._warnRGB.b, percent),
      };
    }
    if (this.status < this.ok) {
      return this._okRGB;
    }
    if (this.status > this.ko) {
      return this._koRGB;
    }
    if (this.status < this.warn) {
      percent = 1.0 * (this.status - this.warn) / (this.ok - this.warn);
      return {
        r: this._interpolate(this._warnRGB.r, this._okRGB.r, percent),
        g: this._interpolate(this._warnRGB.g, this._okRGB.g, percent),
        b: this._interpolate(this._warnRGB.b, this._okRGB.b, percent),
      };
    }
    percent = 1.0 * (this.status - this.ko) / (this.warn - this.ko);
    return {
      r: this._interpolate(this._koRGB.r, this._warnRGB.r, percent),
      g: this._interpolate(this._koRGB.g, this._warnRGB.g, percent),
      b: this._interpolate(this._koRGB.b, this._warnRGB.b, percent),
    };
  }

  _computeValue() {
    if (this._risingThreshold) {
      if (this.status < this.warn - (this.warn - this.ko)/2.0) {
        return this._koRGB;
      }
      if (this.status > this.warn + (this.ok - this.warn)/2.0) {
        return this._okRGB;
      }
      return this._warnRGB;
    }
    if (this.status > this.warn + (this.ko - this.warn)/2.0) {
      return this._koRGB;
    }
    if (this.status < this.warn - (this.warn - this.ok)/2.0) {
      return this._okRGB;
    }
    return this._warnRGB;
  }

  _rgbToHex(rgb) {
    /* eslint-disable max-len */
    return `#${this._singleRgbToHex(this._statusRGB.r)}${this._singleRgbToHex(this._statusRGB.g)}${this._singleRgbToHex(this._statusRGB.b)}`;
    /* eslint-enable max-len */
  }

  _singleRgbToHex(rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    return hex;
  }

  _onStatusRGBChange() {
    if (this.debug) {
      console.log('[granite-alarmlight] _onStatusRGBChange', this._statusRGB, this._rgbToHex(this._statusRGB));
    }
    updateStyles({'--granite-alarmlight-current-color': this._rgbToHex(this._statusRGB)});
    this.dispatchEvent(new CustomEvent('alarmlight-change', {detail: this._statusRGB}));
  }
  _interpolate(v1, v2, percent) {
    return Math.round(v1 + percent*(v2-v1));
  }
}

window.customElements.define(GraniteAlarmlight.is, GraniteAlarmlight);
