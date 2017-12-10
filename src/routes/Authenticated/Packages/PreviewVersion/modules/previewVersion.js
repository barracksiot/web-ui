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

import packageService from 'services/packageService'
import { push } from 'react-router-redux'
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_VERSION = 'RECEIVE_VERSION'

const CLEAN_STATE = 'CLEAN_STATE'

// ------------------------------------
// Actions
// ------------------------------------

export function getVersionPage (pkgReference, version) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    return packageService.getPackageVersionPage(pkgReference, version).then(result => {
      result.metadata = JSON.stringify(result.metadata, false, 2)
      dispatch(receiveVersion(result))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)
      console.error('err', err)
      switch (err.response.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function receiveVersion (payload) {
  return {
    type: RECEIVE_VERSION,
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
  RECEIVE_VERSION : (state, action) => ({
    version: action.payload
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  version: {}
}

export default function packagesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

