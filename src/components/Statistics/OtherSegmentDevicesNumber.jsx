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
import { transformNumberToLocale } from 'utils/mathUtils'

class OtherSegmentDevicesNumber extends React.Component {
  static propTypes = {
    otherSegmentDevicesNumber: React.PropTypes.number.isRequired,
    devicesNumber: React.PropTypes.number
  }

  generateMessage () {
    if (this.props.otherSegmentDevicesNumber > 0) {
      return (
        <p>
          <strong>
            {transformNumberToLocale(this.props.otherSegmentDevicesNumber, 'en-US')}
          </strong>
          {pluralize('device', this.props.devicesNumber)} in Other segment
        </p>
      )
    } else {
      return (
        <p>
          No device in Other segment
        </p>
      )
    }
  }

  render () {
    return (
      <div className="item" data-help="other-segment-devices">
        {this.generateMessage()}
      </div>
    )
  }
}

export default OtherSegmentDevicesNumber
