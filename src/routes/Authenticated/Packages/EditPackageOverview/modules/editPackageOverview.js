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
const RECEIVE_PACKAGE_OVERVIEW_PAGE = 'RECEIVE_PACKAGE_OVERVIEW_PAGE'
const CLEAN_STATE = 'CLEAN_STATE'

// ------------------------------------
// Actions
// ------------------------------------
export function getPackageOverviewPage (reference) {
  return (dispatch, getState) => {
    packageService.getPackageOverviewPage(reference).then(pkg => {
      dispatch(receivePackageOverviewPage({
        pkg: pkg
      }))
    }).catch(error => {
      console.error(error)
    })
  }
}

export function receivePackageOverviewPage (payload) {
  return {
    type: RECEIVE_PACKAGE_OVERVIEW_PAGE,
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
  RECEIVE_PACKAGE_OVERVIEW_PAGE: (state, action) => Object.assign({}, state, {
    pkg: action.payload.pkg
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  pkg: {}
}

export default function packagesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

