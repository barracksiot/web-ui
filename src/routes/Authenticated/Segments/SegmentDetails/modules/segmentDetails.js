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

import segmentService from 'services/segmentService'
import deviceService from 'services/deviceService'
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_DEVICES_PAGE = 'RECEIVE_DEVICES_PAGE'
const RECEIVE_SEGMENT = 'RECEIVE_SEGMENT'
const CLEAN_STATE = 'CLEAN_STATE'

const titles = [
  { property: 'unitId', label: 'Unit ID', classes: 'full wrap'},
  { property: 'lastEvent.versionId', label: 'Version Id'},
  { property: 'lastEvent.receptionDate', label: 'Last seen'}
]
const clickableColumns = ['unitId']
const sortableColumns = ['unitId', 'lastEvent.versionId', 'lastEvent.receptionDate']

// ------------------------------------
// Actions
// ------------------------------------
export function getDevicesPage (segmentId, options) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    return deviceService.getDevicesPageBySegmentId(segmentId, options).then(result => {
      if (options && options.pageNumber) {
        result.page.number = options.page
      }
      if (options && options.sort) {
        result.sort = options.sort
      }

      dispatch(receiveDevicesPage(result))
      hideNotification(dispatch, loader)
    }).catch(err => {
      console.error(err)
      hideNotification(dispatch, loader)
      switch (err.response.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function getSegment (segmentId) {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    return segmentService.getSegmentById(segmentId).then(segment => {
      dispatch(receiveSegment(segment))
      hideNotification(dispatch, loader)
    }).catch(err => {
      console.error(err)
      hideNotification(dispatch, loader)
      switch (err.response.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

function receiveDevicesPage (payload) {
  return {
    type: RECEIVE_DEVICES_PAGE,
    payload
  }
}

function receiveSegment (payload) {
  return {
    type: RECEIVE_SEGMENT,
    payload
  }
}

export function cleanState () {
  return {
    type: CLEAN_STATE
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  RECEIVE_DEVICES_PAGE: (state, action) => ({
    titles: titles,
    currentSegment: state.currentSegment,
    clickableColumns: clickableColumns,
    sortableColumns: sortableColumns,
    pageDevices: action.payload.pageDevices,
    page: action.payload.page,
    sort: action.payload.sort
  }),
  RECEIVE_SEGMENT: (state, action) => Object.assign({}, state, { currentSegment: action.payload }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  titles: [],
  pageDevices: [],
  page: {}
}

export default function segmentDetailsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
