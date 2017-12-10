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

import React from 'react'
import { Link } from 'react-router'
import AmCharts from 'amcharts3-react'
require('amcharts3/amcharts/pie.js')

class DevicesBySegmentsPie extends React.Component {
  static propTypes = {
    devicesBySegmentsStats: React.PropTypes.array.isRequired
  }

  generateChart (data) {
    if (data.length) {
      const colors = [
        '#033221', '#084A32', '#0E6244', '#147B56', '#1A9368', '#147B56', '#0E6244',
        '#084A32', '#0E6244', '#147B56', '#1A9368', '#147B56', '#0E6244', '#084A32'
      ]

      const chartSeries = this.props.devicesBySegmentsStats.map((item, i) => ({
        segmentName: item.name,
        deviceCount: item.deviceCount
      }))

      const config = {
        'path': 'node_modules/amcharts3/amcharts',
        'type': 'pie',
        'theme': 'light',
        'fontSize': 14,
        'fontFamily': 'Palanquin',
        'colors': colors,
        'dataProvider': chartSeries,
        'titleField': 'segmentName',
        'valueField': 'deviceCount',
        'radius': '25%',
        'innerRadius': '40%',
        'balloonText': '<b>[[value]]</b> ([[percents]]%)',
        'labelText': '[[title]]',
        'startEffect': 'easeOutSine',
        'creditsPosition': 'bottom-right',
        'marginTop': 20,
        'legend':{
          'align': 'center',
          'position': 'bottom',
          'equalWidths': false,
          'valueText': '',
          'markerLabelGap': 10,
          'spacing': 20
        }
      }

      return (
        <div>
          <h2>
            <Link to="/segments">Devices segment distribution</Link>
          </h2>
          <div className="pie">
            <AmCharts {...config} />
          </div>
        </div>
      )
    } else {
      return (
        <p>
          You have no devices to show.
        </p>
      )
    }
  }

  render () {
    return (
      <div className="item" data-help="devices-by-segment">
        {this.generateChart(this.props.devicesBySegmentsStats)}
      </div>
    )
  }
}

export default DevicesBySegmentsPie
