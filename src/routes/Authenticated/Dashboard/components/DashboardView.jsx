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
import DevicesByUpdatesPie from 'components/Statistics/DevicesByUpdatesPie.jsx'
import DevicesBySegmentsPie from 'components/Statistics/DevicesBySegmentsPie.jsx'
import UpToDateDevicesBySegmentsDiagram from 'components/Statistics/UpToDateDevicesBySegmentsDiagram.jsx'
import DevicesNumber from 'components/Statistics/DevicesNumber.jsx'
import RecentDevicesNumber from 'components/Statistics/RecentDevicesNumber.jsx'
import OtherSegmentDevicesNumber from 'components/Statistics/OtherSegmentDevicesNumber.jsx'
import WelcomeSlider from 'components/WelcomeSlider'

class DashboardView extends React.Component {
  static propTypes = {
    devicesByUpdatesStats: React.PropTypes.array,
    devicesBySegmentsStats: React.PropTypes.array,
    upToDateDevicesBySegmentsStats: React.PropTypes.array,
    devicesNumber: React.PropTypes.number,
    recentDevicesNumber: React.PropTypes.number,
    otherSegmentDevicesNumber: React.PropTypes.number,
    getDevicesByUpdatesStats: React.PropTypes.func.isRequired,
    getDevicesBySegmentsStats: React.PropTypes.func.isRequired,
    getUpToDateDevicesBySegmentsStats: React.PropTypes.func.isRequired,
    getDevicesNumber: React.PropTypes.func.isRequired,
    getRecentDevicesNumber: React.PropTypes.func.isRequired,
    getOtherSegmentDevicesNumber: React.PropTypes.func.isRequired,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    startTour: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool,
    cleanState: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    if (!this.props.devicesByUpdatesStats) {
      this.props.getDevicesByUpdatesStats()
    }
    if (!this.props.devicesBySegmentsStats) {
      this.props.getDevicesBySegmentsStats()
    }
    if (!this.props.upToDateDevicesBySegmentsStats) {
      this.props.getUpToDateDevicesBySegmentsStats()
    }
    if (!this.props.devicesNumber) {
      this.props.getDevicesNumber()
    }
    if (!this.props.recentDevicesNumber) {
      this.props.getRecentDevicesNumber()
    }
    if (!this.props.otherSegmentDevicesNumber) {
      this.props.getOtherSegmentDevicesNumber()
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  generateView () {
    if (this.props.devicesNumber === 0) {
      return (
        <div className="statistics statistics--empty">
          <div className="item">
            <div className="slider">
              <WelcomeSlider />
            </div>
          </div>
          <div className="item">
            <div className="actions">
              <div className="start">
                <p>
                  <button type="button" className="btn" onClick={this.startTour.bind(this)}>
                    Let's start together!
                  </button>
                </p>
              </div>
              <div className="support">
                <p>
                  Lost? Get some <a href="https://barracks.io/support/" target="_blank">Support <i className="fa fa-external-link" /></a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (this.props.devicesNumber === undefined) {
      return (
        <div className="statistics" />
      )
    } else {
      return (
        <div className="statistics">
          <div className="statistic statistic--pie">
            {this.getDevicesByUpdatesStats()}
          </div>
          <div className="statistic statistic--pie">
            {this.getDevicesBySegmentsStats()}
          </div>
          <div className="statistic statistic--group">
            {this.getDevicesNumber()}
            {this.getOtherSegmentDevicesNumber()}
            {this.getRecentDevicesNumber()}
          </div>
          <div className="statistic statistic--diagram">
            {this.getUpToDateDevicesBySegmentsStats()}
          </div>
        </div>
      )
    }
  }

  getDevicesByUpdatesStats () {
    if (this.props.devicesByUpdatesStats !== undefined) {
      return <DevicesByUpdatesPie devicesByUpdatesStats={this.props.devicesByUpdatesStats} />
    }
    return false
  }

  getDevicesBySegmentsStats () {
    if (this.props.devicesBySegmentsStats !== undefined) {
      return <DevicesBySegmentsPie devicesBySegmentsStats={this.props.devicesBySegmentsStats} />
    }
    return false
  }

  getUpToDateDevicesBySegmentsStats () {
    if (this.props.upToDateDevicesBySegmentsStats !== undefined) {
      return <UpToDateDevicesBySegmentsDiagram upToDateDevicesBySegmentsStats={this.props.upToDateDevicesBySegmentsStats} />
    }
    return false
  }

  getDevicesNumber () {
    if (this.props.devicesNumber !== undefined) {
      return <DevicesNumber devicesNumber={this.props.devicesNumber} />
    }
    return false
  }

  getRecentDevicesNumber () {
    if (this.props.recentDevicesNumber !== undefined) {
      return <RecentDevicesNumber recentDevicesNumber={this.props.recentDevicesNumber} />
    }
    return false
  }

  getOtherSegmentDevicesNumber () {
    if (this.props.otherSegmentDevicesNumber !== undefined) {
      return <OtherSegmentDevicesNumber otherSegmentDevicesNumber={this.props.otherSegmentDevicesNumber} />
    }
    return false
  }

  startHelper () {
    const helperList = []
    if (this.props.devicesNumber > 0) {
      [
        {
          title: 'Devices version distribution',
          text: '<p>Here you have your devices by version ID. If you click on the legend, you can tick or untick the version ID, it will refresh the pie.</p>',
          selector: '[data-help="device-version-distribution"]',
          position: 'bottom'
        },
        {
          title: 'Devices segment distribution',
          text: '<p>Theses are your devices splitted by segment. Without a ssegmentation setup of your own, all your devices appear on Other.</p>',
          selector: '[data-help="devices-by-segment"]',
          position: 'bottom'
        },
        {
          title: 'Registered Devices',
          text: '<p>You have the total volume of devices registered on Barracks. Remember, you don\'t need to registered your devices. Barracks will listen to your new devices and will registered them automatically.</p>',
          selector: '[data-help="registered-devices"]',
          position: 'top'
        },
        {
          title: 'Devices seen in the last 24h',
          text: '<p>This is the number of devices who pinged in the last 24h in Barracks.</p>',
          selector: '[data-help="device-seen-last-24"]',
          position: 'top'
        },
        {
          title: 'Devices in the Other segment',
          text: '<p>This is the number of devices in the Other segment.</p>',
          selector: '[data-help="other-segment-devices"]',
          position: 'top'
        },
        {
          title: 'Up to date devices by segment',
          text: '<p>This is the percentage of up to date devices showed by segment. We consider a device up to date when it has the most recent versionId available./p>',
          selector: '[data-help="up-to-date-sevices-by-segments"]',
          position: 'top'
        }
      ].forEach(step => {
        helperList.push(step)
      })
    }

    if (this.props.tourInProgress) {
      helperList.push({
        text: '<p>Here is your account and the support part if you need any help or information about your account and API Key.</p><p>Let\'s go there</p>',
        selector: '[data-help="page-account"]',
        position: 'right'
      })
    }

    console.log('Hello everybody :)')

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  startTour () {
    this.props.startTour()
  }

  componentDidUpdate (previousProps) {
    if (this.props.tourInProgress && !previousProps.tourInProgress) {
      this.startHelper()
    }
  }

  render () {
    if (this.props.devicesNumber === 0) {
      return (
        <main className="view">
          <div className="content">
            <div className="dashboard">
              {this.generateView()}
            </div>
          </div>
        </main>
      )
    } else {
      return (
        <main className="view">
          <header>
            <div className="content">
              <h2>
                Dashboard
                <div className="contextual-help" title="Get some help">
                  <button type="button" onClick={this.startHelper.bind(this)}>
                    <i className="fa fa-question-circle" />
                  </button>
                </div>
              </h2>
            </div>
          </header>
          <div className="content">
            <div className="dashboard">
              {this.generateView()}
            </div>
          </div>
        </main>
      )
    }
  }
}

export default DashboardView
