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

// ------------------------------------
// Constants
// ------------------------------------

const RECEIVE_ACCOUNT_INFO = 'RECEIVE_ACCOUNT_INFO'
const CLEAN_STATE = 'CLEAN_STATE'

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON (response) {
  return response.json()
}

function getAccountInfoFromLink (link) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': localStorage.getItem('authToken')
      }
    }

    fetch(link, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        resolve(data)
      })
      .catch(function (error) {
        console.error('Request failed', error)
        reject(error)
      })
  })
}

// ------------------------------------
// Actions
// ------------------------------------
export function getAccountInfo () {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')

    return getAccountInfoFromLink('/api/auth/me').then(result => {
      dispatch(receiveAccountInfo({
        profile: result
      }))
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

export function receiveAccountInfo (payload) {
  return {
    type: RECEIVE_ACCOUNT_INFO,
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
  RECEIVE_ACCOUNT_INFO: (state, action) => ({
    profile: action.payload.profile
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}

export default function updatesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
