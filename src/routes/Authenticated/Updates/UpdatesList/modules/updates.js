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

import updateService from 'services/updateService'
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------

const RECEIVE_UPDATES_PAGE = 'RECEIVE_UPDATES_PAGE'
const CLEAN_STATE = 'CLEAN_STATE'

const titles = [
  { property: 'name', label: 'Name'},
  { property: 'description', label: 'Description', classes: 'full wrap'},
  { property: 'creationDate', label: 'Creation date'},
  { property: 'status', label: 'Status'},
  { property: 'versionId', label: 'Version Id'}
]
const clickableColumns = ['name']
const sortableColumns = ['name', 'description', 'creationDate', 'status']

// ------------------------------------
// Actions
// ------------------------------------
export function getUpdatesPage (options) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    return updateService.getUpdatesPage(options).then(result => {
      if (options && options.pageNumber) {
        result.page.number = options.page
      }
      if (options && options.sort) {
        result.sort = options.sort
      }

      dispatch(receiveUpdatesPage(result))
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

export function sortUpdates (property, direction) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    return updateService.getUpdatesPage({ sort: { property, direction } }).then(result => {
      dispatch(receiveUpdatesPage(Object.assign({}, result, { sort: { property, direction } })))
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

export function receiveUpdatesPage (payload) {
  return {
    type: RECEIVE_UPDATES_PAGE,
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
  RECEIVE_UPDATES_PAGE: (state, action) => ({
    titles: titles,
    clickableColumns: clickableColumns,
    sortableColumns: sortableColumns,
    pageUpdates: action.payload.pageUpdates,
    page: action.payload.page,
    sort: action.payload.sort
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  titles,
  pageUpdates: [],
  page: {}
}

export default function updatesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
