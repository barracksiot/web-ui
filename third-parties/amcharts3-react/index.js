/*
 * MIT License
 *
 * Copyright (c) 2017 Barracks Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

if (typeof window !== "undefined") {
  window.React = require("react");
  window.ReactDOM = require("react-dom");

  require("amcharts3/amcharts/amcharts.js");
  require("amcharts3/amcharts/serial.js");
  require("amcharts3/amcharts/themes/light.js");

  require("./amcharts3-react.js");

  var component = window.AmCharts.React;
  var factory = React.createFactory(component);

  function AmCharts() {
    console.warn("Using AmCharts is deprecated, instead use AmCharts.React");
    return factory.apply(this, arguments);
  }

  AmCharts.React = component;

  function define(obj, name) {
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable: true,
      get: function () {
        return window.AmCharts[name];
      },
      set: function (v) {
        window.AmCharts[name] = v;
      }
    });
  }

  define(AmCharts, "baseHref");
  define(AmCharts, "bezierX");
  define(AmCharts, "bezierY");
  define(AmCharts, "charts");
  define(AmCharts, "dayNames");
  define(AmCharts, "monthNames");
  define(AmCharts, "processDelay");
  define(AmCharts, "shortDayNames");
  define(AmCharts, "shortMonthNames");
  define(AmCharts, "theme");
  define(AmCharts, "useUTC");
  define(AmCharts, "addInitHandler");
  define(AmCharts, "addPrefix");
  define(AmCharts, "clear");
  define(AmCharts, "formatDate");
  define(AmCharts, "formatNumber");
  define(AmCharts, "makeChart");
  define(AmCharts, "stringToDate");

  module.exports = AmCharts;

} else {
  module.exports = {};
}
