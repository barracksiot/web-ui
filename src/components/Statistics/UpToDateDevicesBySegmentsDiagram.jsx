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

class UpToDateDevicesBySegmentsDiagram extends React.Component {
  static propTypes = {
    upToDateDevicesBySegmentsStats: React.PropTypes.array.isRequired
  }

  generateChart (data) {
    if (data.length) {
      const chartSeries = data.map((item, i) => ({
        segmentName: item.segmentName,
        upToDate: item.upToDateDevices,
        notUpToDate: item.totalDevices - item.upToDateDevices
      }))

      const config = {
        path: 'node_modules/amcharts3/amcharts',
        type: 'serial',
        theme: 'light',
        rotate: true,
        dataProvider: chartSeries,
        percentPrecision: 0,
        gridAboveGraphs: true,
        startDuration: 1,
        valueAxes: [
          {
            axisAlpha: 0,
            gridColor: '#0da16c',
            gridAlpha: 0.5,
            dashLength: 1,
            offset: 0,
            position: 'bottom',
            stackType: '100%',
            title: 'Percent'
          }
        ],
        graphs: [
          {
            balloonText: '<b>[[value]]/[[total]] devices</b> ([[percents]]%)',
            fillColors: '#065b3d',
            lineColor: '#065b3d',
            fillAlphas: 1,
            lineAlpha: 0.5,
            type: 'column',
            valueField: 'upToDate'
          }, {
            balloonText: '',
            fillColors: '#FFFFFF',
            lineColor: '#065b3d',
            fillAlphas: 1,
            lineAlpha: 0.5,
            type: 'column',
            valueField: 'notUpToDate'
          }
        ],
        chartCursor: {
          categoryBalloonEnabled: false,
          cursorAlpha: 0,
          zoomable: false
        },
        categoryField: 'segmentName',
        categoryAxis: {
          axisAlpha: 0,
          gridPosition: 'middle',
          gridAlpha: 0,
          position: 'left',
          tickPosition: 'middle',
          tickLength: 10
        }
      }

      const height = data.length ? parseInt(data.length * 34 + 80) + 'px' : 'auto'

      return (
        <div>
          <h2>
            <Link to="/segments">Up-to-date devices by segment</Link>
          </h2>
          <div className="diagram" style={{ height: height }}>
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
      <div className="item" data-help="up-to-date-sevices-by-segments">
        {this.generateChart(this.props.upToDateDevicesBySegmentsStats)}
      </div>
    )
  }
}

export default UpToDateDevicesBySegmentsDiagram
