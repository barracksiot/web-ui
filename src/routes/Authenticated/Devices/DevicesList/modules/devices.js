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
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_DEVICES_PAGE = 'RECEIVE_DEVICES_PAGE'

const titles = [
  { property: 'unitId', label: 'Unit ID', classes: 'full wrap' },
  { property: 'packageCount', label: 'Packages', classes: 'right' },
  { property: 'lastEvent.receptionDate', label: 'Last seen' }
]
const clickableColumns = ['unitId']
const sortableColumns = ['unitId', 'lastEvent.receptionDate']

// ------------------------------------
// Actions
// ------------------------------------
export function getDevicesPage (options) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    return deviceService.getDevicesPage(options).then(result => {
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
        case 400:
          showNotification(dispatch, 'error_devices_bad_request')
          break
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function sortDevices (property, direction) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    return deviceService.getFirstDevicesPage(
      { sort: { property, direction } }
    ).then(result => {
      dispatch(receiveDevicesPage(Object.assign({}, result, { sort: { property, direction } })))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function receiveDevicesPage (payload) {
  return {
    type: RECEIVE_DEVICES_PAGE,
    payload
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  RECEIVE_DEVICES_PAGE: (state, action) => ({
    titles: titles,
    clickableColumns: clickableColumns,
    sortableColumns: sortableColumns,
    pageDevices: action.payload.pageDevices,
    page: action.payload.page,
    sort: action.payload.sort,
    filter: action.payload.filter
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  titles: [],
  pageDevices: [],
  page: {}
}

export default function devicesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
