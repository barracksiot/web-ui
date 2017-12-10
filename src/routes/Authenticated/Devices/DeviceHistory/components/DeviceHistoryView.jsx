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
import { DeviceDetails } from 'components/Device'
import List from 'components/List'

class DeviceHistoryView extends React.Component {
  static propTypes = {
    currentDevice: React.PropTypes.object,
    titles: React.PropTypes.array.isRequired,
    items: React.PropTypes.array.isRequired,
    getDeviceInfo: React.PropTypes.func,
    getDeviceHistory: React.PropTypes.func,
    page: React.PropTypes.object,
    sort: React.PropTypes.object,
    clickableColumns: React.PropTypes.array,
    sortableColumns: React.PropTypes.array,
    cleanState: React.PropTypes.func,
    goBack: React.PropTypes.func,
    onItemClick: React.PropTypes.func,
    params: React.PropTypes.object
  }

  componentWillMount () {
    if (this.props.getDeviceInfo) {
      this.props.getDeviceInfo(this.props.params.unitId)
    }
    if (this.props.getDeviceHistory) {
      this.props.getDeviceHistory(this.props.params.unitId)
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  renderSegmentInfo () {
    const { segment } = this.props.currentDevice
    if (segment) {
      return (<span className="current-segment">{segment.name} ({pluralize('device', segment.deviceCount, true)})</span>)
    }
  }

  sortDevices (property, direction) {
    const options = {
      page: 0,
      sort: {
        property,
        direction
      }
    }

    this.props.getDeviceHistory(this.props.params.unitId, options)
  }

  changePage (pageNumber) {
    const options = {
      page: pageNumber
    }

    options.sort = this.props.sort || undefined
    this.props.getDeviceHistory(this.props.params.unitId, options)
  }

  getDeviceDetails () {
    if (this.props.currentDevice) {
      return (
        <DeviceDetails device={this.props.currentDevice} />
      )
    }
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <a onClick={this.props.goBack} href="#" className="back">&lt; Back to devices list</a>
            <h2>
              {this.props.params.unitId} change history
            </h2>
          </div>
        </header>
        <div className="content">
          {this.getDeviceDetails()}
          <List
            titles={this.props.titles}
            items={this.props.items}
            page={this.props.page}
            sort={this.props.sort}
            sortByProperty={this.sortDevices.bind(this)}
            getPageByNumber={this.changePage.bind(this)}
            sortableColumns={this.props.sortableColumns}
            clickableColumns={this.props.clickableColumns}
            onItemClick={this.props.onItemClick}
          />
        </div>
      </main>
    )
  }
}

export default DeviceHistoryView
