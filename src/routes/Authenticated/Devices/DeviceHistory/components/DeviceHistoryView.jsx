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
import CodeMirror from 'react-codemirror'
import DevicePackages from 'components/DevicePackages'

class DeviceHistoryView extends React.Component {
  static propTypes = {
    currentDevice: React.PropTypes.object,
    selectedEvent: React.PropTypes.object,
    titles: React.PropTypes.array.isRequired,
    items: React.PropTypes.array.isRequired,
    getDeviceInfo: React.PropTypes.func,
    getDeviceHistory: React.PropTypes.func,
    onEventClick: React.PropTypes.func,
    page: React.PropTypes.object,
    sort: React.PropTypes.object,
    cleanState: React.PropTypes.func,
    goBack: React.PropTypes.func,
    params: React.PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.initState(props)
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

  componentWillReceiveProps (nextProps) {
    if (this.state.currentDevice !== nextProps.currentDevice) {
      this.initState(nextProps)
    }

    if (this.state.items !== nextProps.items) {
      this.initState(nextProps)
    }
  }

  initState (props) {
    this.state = {
      currentDevice: {
        lastEvent: {},
        customClientData: {}
      },
      selectedEvent: {
        index:0,
        event: {}
      }
    }

    if (props.currentDevice) {
      this.state = Object.assign({}, this.state, {
        currentDevice: props.currentDevice
      })
    }

    if (props.items) {
      this.state = Object.assign({}, this.state, {
        selectedEvent: { index: 0, event: props.items[0] }
      })
    }
  }

  onEventClick (event) {
    const deviceEvent = this.props.items[event.target.value]
    if (deviceEvent) {
      this.setState(Object.assign({}, this.state, { selectedEvent: { index:event.target.value, event:deviceEvent } }))
    }
  }

  getDeviceInstalledPackages () {
    if (this.state.selectedEvent && this.state.selectedEvent.event) {
      return (
        <DevicePackages
          title="Installed Packages"
          noValueTitle="No Installed Packages"
          items={this.state.selectedEvent.event.packages}
          clickable={false}
        />
      )
    }
  }

  getDeviceEvents () {
    if (this.props.items[0]) {
      var i = 0
      const that = this
      const events = this.props.items.map((event) => {
        const className = i === this.state.selectedEvent.index ? 'selected' : ''
        const tag = <li key={i} value={i} onClick={that.onEventClick.bind(that)} className={className}>{event.receptionDate}</li>
        i++
        return tag
      })
      return (
        <ul>
          {events}
        </ul>
      )
    }
  }

  getAvailablePackages () {
    if (this.state.selectedEvent && this.state.selectedEvent.event) {
      return (
        <DevicePackages
          title="Available Packages"
          noValueTitle="No Available Packages"
          items={this.state.selectedEvent.event.response.available}
          clickable
        />
      )
    }
  }

  getChangedPackages () {
    if (this.state.selectedEvent && this.state.selectedEvent.event) {
      return (
        <DevicePackages
          title="Changed Packages"
          noValueTitle="No Changed Packages"
          items={this.state.selectedEvent.event.response.changed}
          clickable
        />
      )
    }
  }

  getUnchangedPackages () {
    if (this.state.selectedEvent && this.state.selectedEvent.event) {
      return (
        <DevicePackages
          title="Unchanged Packages"
          noValueTitle="No Unchanged Packages"
          items={this.state.selectedEvent.event.response.unchanged}
          clickable
        />
      )
    }
  }

  getUnavailablePackages () {
    if (this.state.selectedEvent && this.state.selectedEvent.event) {
      return (
        <DevicePackages
          title="Unavailable Packages"
          noValueTitle="No Unavailable Packages"
          items={this.state.selectedEvent.event.response.unavailable}
          clickable
        />
      )
    }
  }

  getEventRequestInfo () {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      readOnly: 'nocursor'
    }
    var customData = '{}'
    if (this.state.selectedEvent && this.state.selectedEvent.event) {
      customData = this.state.selectedEvent.event.customClientData
    }
    return (
      <div className="request">
        <h2>
          Request
        </h2>
        {this.getDeviceInstalledPackages()}
        <div>
          <strong>Custom Client Data</strong>
          <CodeMirror placeholder="Add your deployment plan in a JSON format" value={customData} options={options} />
        </div>
      </div>
    )
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <a onClick={this.props.goBack} href="#" className="back">&lt; Back to devices list</a>
            <h2>
              {this.props.params.unitId}
            </h2>
          </div>
        </header>
        <div className="content">
          <div className="device-info">
            <div className="dates">
              <div>
                <h5>
                  Date of enrollment
                </h5>
                {this.props.currentDevice.firstSeen}
              </div>
              <div>
                <h5>
                  Last seen
                </h5>
                {this.props.currentDevice.lastEvent.receptionDate}
              </div>
            </div>
            <div className="groupInfo">
              <div className="info">
                {this.getEventRequestInfo()}
                <div className="response">
                  <h2>
                    Response
                  </h2>
                  {this.getAvailablePackages()}
                  {this.getChangedPackages()}
                  {this.getUnchangedPackages()}
                  {this.getUnavailablePackages()}
                </div>
              </div>
              <aside className="pings">
                {this.getDeviceEvents()}
              </aside>
            </div>
          </div>
        </div>
      </main>
    )
  }

}

export default DeviceHistoryView
