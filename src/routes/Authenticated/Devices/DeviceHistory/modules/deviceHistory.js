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

import deviceService from 'services/deviceService'
import segmentService from 'services/segmentService'
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_DEVICE_INFO = 'RECEIVE_DEVICE_INFO'
const RECEIVE_DEVICE_HISTORY = 'RECEIVE_DEVICE_HISTORY'
const CLEAN_STATE = 'CLEAN_STATE'

const titles = [
  { property: 'versionId', label: 'Version Id', classes: 'full wrap'},
  { property: 'receptionDate', label: 'Change date'}
]
const clickableColumns = []
const sortableColumns = ['versionId', 'receptionDate']

// ------------------------------------
// Actions
// ------------------------------------
export function getDeviceInfo (unitId) {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    let result = {}

    return deviceService.getDeviceInfo(unitId).then(deviceInfo => {
      result = Object.assign({}, deviceInfo)
      return segmentService.getSegmentById(deviceInfo.lastEvent.segmentId)
    }).then(segment => {
      dispatch(receiveDeviceInfo(Object.assign({}, result, { segment })))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      console.error(err)
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function getDeviceHistory (unitId, options) {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')

    return deviceService.getDeviceHistoryPage(unitId, options).then(result => {
      if (options && options.pageNumber) {
        result.page.number = options.page
      }
      if (options && options.sort) {
        result.sort = options.sort
      }

      dispatch(receiveDeviceHistory(result))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      console.error(err)
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function receiveDeviceInfo (payload) {
  return {
    type: RECEIVE_DEVICE_INFO,
    payload
  }
}

export function receiveDeviceHistory (payload) {
  return {
    type: RECEIVE_DEVICE_HISTORY,
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
  RECEIVE_DEVICE_INFO: (state, action) => {
    return Object.assign({}, state, {
      currentDevice: action.payload
    })
  },
  RECEIVE_DEVICE_HISTORY: (state, action) => {
    return Object.assign({}, state, {
      pageDeviceHistory: action.payload.pageDevices,
      page: action.payload.page,
      sort: action.payload.sort
    })
  },
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  titles,
  clickableColumns,
  sortableColumns,
  pageDeviceHistory: [],
  page: {}
}

export default function devicesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
