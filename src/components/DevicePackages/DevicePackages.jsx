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

/* eslint no-eval: 1 */
import React from 'react'
import { Link } from 'react-router'

class DevicePackages extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    noValueTitle: React.PropTypes.string.isRequired,
    items: React.PropTypes.arrayOf(React.PropTypes.shape({
      reference: React.PropTypes.any.isRequired,
      version: React.PropTypes.any.isRequired
    })).isRequired,
    clickable:React.PropTypes.any.isRequired
  }

  render () {
    if (this.props.items[0]) {
      const clickable = this.props.clickable
      const pkgs = this.props.items.map(function (pkg) {
        const content = clickable ? <Link to={`/packages/edit/${pkg.reference}/plan`}>{pkg.reference} ({pkg.version})</Link> : `${pkg.reference} (${pkg.version})`
        return <span key={pkg.reference} className="pkgName">{content}</span>
      })
      return (
        <div className="device-packages">
          <strong>
            {this.props.title}
          </strong>
          <div className="packageList">
            {pkgs}
          </div>
        </div>
      )
    } else {
      return (
        <div className="device-packages">
          <strong>
            {this.props.noValueTitle}
          </strong>
        </div>
      )
    }
  }
}

export default DevicePackages
