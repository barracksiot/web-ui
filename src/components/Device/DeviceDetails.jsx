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
import pluralize from 'pluralize'

class DeviceDetails extends React.Component {
  static propTypes = {
    device: React.PropTypes.object.isRequired
  }

  renderSegmentInfo () {
    const { segment } = this.props.device
    if (segment) {
      return (<span className="current-segment">{segment.name} ({pluralize('device', segment.deviceCount, true)})</span>)
    }
  }

  render () {
    return (
      <div className="devices-info">
        <div className="info">
          <div>
            <p>
              <strong>Version ID</strong>
              <span className="current-versionId">{this.props.device.lastEvent.versionId}</span>
            </p>
            <p>
              <strong>Date of enrollment</strong>
              <span className="first-ping">{this.props.device.firstSeen}</span>
            </p>
            <p>
              <strong>Last seen</strong>
              <span className="last-ping">{this.props.device.lastEvent.receptionDate}</span>
            </p>
          </div>
          <div>
            <p>
              <strong>Segment</strong>
              {this.renderSegmentInfo()}
            </p>
            <p>
              <strong>Custom Client Data</strong>
              <span className="current-additionalProperties">{this.props.device.lastEvent.additionalProperties}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default DeviceDetails
