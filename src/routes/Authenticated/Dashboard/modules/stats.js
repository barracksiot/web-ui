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

import moment from 'moment'
import statsService from 'services/statsService'
import segmentService from 'services/segmentService'
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_DEVICES_BY_UPDATES_STATS = 'RECEIVE_DEVICES_BY_UPDATES_STATS'
const RECEIVE_DEVICES_BY_SEGMENTS_STATS = 'RECEIVE_DEVICES_BY_SEGMENTS_STATS'
const RECEIVE_UP_TO_DATE_DEVICES_BY_SEGMENTS_STATS = 'RECEIVE_UP_TO_DATE_DEVICES_BY_SEGMENTS_STATS'
const RECEIVE_DEVICES_NUMBER = 'RECEIVE_DEVICES_NUMBER'
const RECEIVE_RECENT_DEVICES_NUMBER = 'RECEIVE_RECENT_DEVICES_NUMBER'
const RECEIVE_OTHER_SEGMENT_DEVICES_NUMBER = 'RECEIVE_OTHER_SEGMENT_DEVICES_NUMBER'
const CLEAN_STATE = 'CLEAN_STATE'

// ------------------------------------
// Actions
// ------------------------------------
export function getDevicesByUpdatesStats () {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    return statsService.getDevicesPerVersionId().then(result => {
      dispatch(receivedevicesByUpdatesStats(result.values))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)
      console.error(err)
      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function getDevicesBySegmentsStats () {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    return segmentService.getSegments().then(result => {
      const segments = result.active
      segments.push(result.other)
      dispatch(receiveUpdatedDevicesBySegmentsStats(segments))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)
      console.error(err)
      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function getUpToDateDevicesBySegmentsStats () {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')

    const upToDateSegmentNumber = new Promise((resolve, reject) => {
      statsService.getDevicesUpToDateBySegments().then(result => {
        resolve(result)
      }).catch((err) => {
        console.error(err)
        reject(err)
      })
    })

    const segmentNumber = new Promise((resolve, reject) => {
      statsService.getDevicesBySegments().then(result => {
        resolve(result)
      }).catch((err) => {
        console.error(err)
        reject(err)
      })
    })

    return Promise.all([segmentNumber, upToDateSegmentNumber]).then((result) => {
      const newResult = result[0].values.map((segment) => {
        const upToDateItemValue = result[1].values.find(function (upToDateItem) {
          return upToDateItem.name === segment.name
        })

        return {
          segmentName: segment.name,
          totalDevices: segment.value,
          upToDateDevices: upToDateItemValue.value
        }
      })

      dispatch(receiveUpToDateDevicesBySegmentsStats(newResult))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)
      console.error(err)
      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function getDevicesNumber () {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    return statsService.getDevicesLastSeen().then(result => {
      dispatch(receiveDevicesNumber(result.total))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)
      console.error(err)
      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function getRecentDevicesNumber () {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    let dateNow = moment()
    return statsService.getDevicesLastSeen(
      moment(dateNow).subtract(1, 'day').toISOString(), moment(dateNow).toISOString()
    ).then(result => {
      dispatch(receiveRecentDevicesNumber(result.total))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)
      console.error(err)
      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function getOtherSegmentDevicesNumber () {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    return segmentService.getSegments().then(result => {
      dispatch(receiveOtherSegmentDevicesNumber(result.other.deviceCount))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)
      console.error(err)
      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function receivedevicesByUpdatesStats (devicesByUpdatesStats) {
  return {
    type: RECEIVE_DEVICES_BY_UPDATES_STATS,
    payload: devicesByUpdatesStats
  }
}

export function receiveUpdatedDevicesBySegmentsStats (devicesBySegmentsStats) {
  return {
    type: RECEIVE_DEVICES_BY_SEGMENTS_STATS,
    payload: devicesBySegmentsStats
  }
}

export function receiveUpToDateDevicesBySegmentsStats (upToDateDevicesBySegmentsStats) {
  return {
    type: RECEIVE_UP_TO_DATE_DEVICES_BY_SEGMENTS_STATS,
    payload: upToDateDevicesBySegmentsStats
  }
}

export function receiveDevicesNumber (devicesNumber) {
  return {
    type: RECEIVE_DEVICES_NUMBER,
    payload: devicesNumber
  }
}

export function receiveRecentDevicesNumber (recentDevicesNumber) {
  return {
    type: RECEIVE_RECENT_DEVICES_NUMBER,
    payload: recentDevicesNumber
  }
}

export function receiveOtherSegmentDevicesNumber (otherSegmentDevicesNumber) {
  return {
    type: RECEIVE_OTHER_SEGMENT_DEVICES_NUMBER,
    payload: otherSegmentDevicesNumber
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
  RECEIVE_DEVICES_BY_UPDATES_STATS: (state, action) => Object.assign({}, state, { devicesByUpdatesStats: action.payload }),
  RECEIVE_DEVICES_BY_SEGMENTS_STATS: (state, action) => Object.assign({}, state, { devicesBySegmentsStats: action.payload }),
  RECEIVE_UP_TO_DATE_DEVICES_BY_SEGMENTS_STATS: (state, action) => Object.assign({}, state, { upToDateDevicesBySegmentsStats: action.payload }),
  RECEIVE_DEVICES_NUMBER: (state, action) => Object.assign({}, state, { devicesNumber: action.payload }),
  RECEIVE_RECENT_DEVICES_NUMBER: (state, action) => Object.assign({}, state, { recentDevicesNumber: action.payload }),
  RECEIVE_OTHER_SEGMENT_DEVICES_NUMBER: (state, action) => Object.assign({}, state, { otherSegmentDevicesNumber: action.payload }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
}

export default function statsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
