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

import filterService from 'services/filterService'
import deviceService from 'services/deviceService'
import { push } from 'react-router-redux'
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_FILTER_CREATED = 'RECEIVE_FILTER_CREATED'
const RECEIVE_DEVICES_PAGE = 'RECEIVE_DEVICES_PAGE'
const EMPTY_DEVICES_PAGE = 'EMPTY_DEVICES_PAGE'
const CLEAN_STATE = 'CLEAN_STATE'

const titles = [
  { property: 'unitId', label: 'Unit ID', classes: 'full wrap'},
  { property: 'lastEvent.receptionDate', label: 'Last seen'}
]
const sortableColumns = ['unitId', 'lastEvent.receptionDate']

// ------------------------------------
// Actions
// ------------------------------------
export function createFilter (filter) {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')

    try {
      const parsedFilter = Object.assign({}, filter, { query: JSON.parse(filter.query)})

      return filterService.createFilter(parsedFilter).then(result => {
        dispatch(receiveFilterCreated(result))
        dispatch(push(`/filters/${result.name}`))
        hideNotification(dispatch, loader)
      }).catch((err) => {
        hideNotification(dispatch, loader)
        console.error('err', err)
        switch (err.response.status) {
          case 422:
            showNotification(dispatch, 'error_filter_malformed')
            break
          case 409:
            showNotification(dispatch, 'error_filter_create_conflict')
            break
          case 400:
            showNotification(dispatch, 'error_filter_validation_failed')
            break
          default:
            showNotification(dispatch, 'error_generic')
        }
      })
    } catch (err) {
      console.error('err', err)
      dispatch(emptyDevicesPage())
      hideNotification(dispatch, loader)
      showNotification(dispatch, 'error_filter_malformed')
      return
    }
  }
}

export function getDevicesPage (options) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')
    const start = performance.now()

    try {
      options.query = JSON.parse(options.query)
    } catch (err) {
      console.error('err', err)
      dispatch(emptyDevicesPage())
      hideNotification(dispatch, loader)
      showNotification(dispatch, 'error_filter_malformed')
      return
    }

    return deviceService.getDevicesPage(options).then(result => {
      if (options && options.pageNumber) {
        result.page.number = options.page
      }
      if (options && options.sort) {
        result.sort = options.sort
      }
      if (options && options.filter) {
        result.filter = options.filter
      }

      dispatch(receiveDevicesPage(result))

      const stop = performance.now()

      window.setTimeout(() => {
        hideNotification(dispatch, loader)
      }, Math.round((500 - (stop - start))))
    }).catch(err => {
      console.error(err)
      dispatch(emptyDevicesPage())
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
      dispatch(emptyDevicesPage())
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function receiveFilterCreated (payload) {
  return {
    type: RECEIVE_FILTER_CREATED,
    payload
  }
}

export function receiveDevicesPage (payload) {
  return {
    type: RECEIVE_DEVICES_PAGE,
    payload
  }
}

export function emptyDevicesPage () {
  return {
    type: EMPTY_DEVICES_PAGE
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
  RECEIVE_DEVICES_PAGE: (state, action) => Object.assign({}, state, {
    devices: {
      titles: titles,
      sortableColumns: sortableColumns,
      pageDevices: action.payload.pageDevices,
      page: action.payload.page,
      sort: action.payload.sort
    }
  }),
  EMPTY_DEVICES_PAGE: (state, action) => Object.assign({}, state, {
    devices: {}
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  devices: {
    titles: [],
    pageDevices: [],
    page: {}
  }
}

export default function filtersReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

