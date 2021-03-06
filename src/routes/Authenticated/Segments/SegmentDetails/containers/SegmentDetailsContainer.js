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
import SegmentDetailsView from '../components/SegmentDetailsView.jsx'
import { push } from 'react-router-redux'
import { setHelperSteps, startHelper } from 'modules/helper'
import { getDevicesPage, getSegment, cleanState } from '../modules/segmentDetails'

const mapDispatchToProps = {
  setHelperSteps,
  startHelper,
  getSegment,
  getDevicesPage,
  cleanState,
  onItemClick: (unitId) => push(`/devices/view/${unitId}`)

}

const mapStateToProps = (state) => ({
  clickableColumns: state.segmentDetails.clickableColumns,
  sortableColumns: state.segmentDetails.sortableColumns,
  titles: state.segmentDetails.titles,
  items: state.segmentDetails.pageDevices,
  segment: state.segmentDetails.currentSegment,
  page: state.segmentDetails.page,
  sort: state.segmentDetails.sort
})

export default connect(mapStateToProps, mapDispatchToProps)(SegmentDetailsView)
