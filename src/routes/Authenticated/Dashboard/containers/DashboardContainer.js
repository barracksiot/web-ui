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

import { connect } from 'react-redux'
import {
  getDevicesByUpdatesStats,
  getDevicesBySegmentsStats,
  getUpToDateDevicesBySegmentsStats,
  getDevicesNumber,
  getRecentDevicesNumber,
  getOtherSegmentDevicesNumber,
  cleanState
} from '../modules/stats'
import { setHelperSteps, startHelper, startTour } from 'modules/helper'
import DashboardView from '../components/DashboardView.jsx'

const mapDispatchToProps = {
  getDevicesByUpdatesStats,
  getDevicesBySegmentsStats,
  getUpToDateDevicesBySegmentsStats,
  getDevicesNumber,
  getRecentDevicesNumber,
  getOtherSegmentDevicesNumber,
  setHelperSteps,
  startHelper,
  startTour,
  cleanState
}

const mapStateToProps = (state) => ({
  devicesByUpdatesStats: state.stats.devicesByUpdatesStats,
  devicesBySegmentsStats: state.stats.devicesBySegmentsStats,
  upToDateDevicesBySegmentsStats: state.stats.upToDateDevicesBySegmentsStats,
  devicesNumber: state.stats.devicesNumber,
  recentDevicesNumber: state.stats.recentDevicesNumber,
  otherSegmentDevicesNumber: state.stats.otherSegmentDevicesNumber,
  tourInProgress: !!state.helper.tourProgress
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView)
