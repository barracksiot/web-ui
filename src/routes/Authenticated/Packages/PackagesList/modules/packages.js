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

import { showNotification, hideNotification } from 'modules/notifications'
import packageService from 'services/packageService'
// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_PACKAGES_PAGE = 'RECEIVE_PACKAGES_PAGE'
const CLEAN_STATE = 'CLEAN_STATE'

// ------------------------------------
// Actions
// ------------------------------------
export function cleanState () {
  return {
    type: CLEAN_STATE
  }
}

export function getPackagesPage (options) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    return packageService.getPackagesPage(options).then(result => {
      if (options && options.pageNumber) {
        result.page.number = options.page
      }

      dispatch(receivePackagesPage(result))
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

export function receivePackagesPage (payload) {
  return {
    type: RECEIVE_PACKAGES_PAGE,
    payload
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  RECEIVE_PACKAGES_PAGE: (state, action) => Object.assign({}, state, {
    pagePackages: action.payload.pagePackages
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  pagePackages: [],
  page: {}
}

export default function packagesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
