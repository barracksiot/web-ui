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

import authenticationService from 'services/authenticationService'
import { showNotification, hideNotification } from 'modules/notifications'
import { push } from 'react-router-redux'

// ------------------------------------
// Constants
// ------------------------------------
const SUCCEED_SET_PASSWORD = 'SUCCEED_SET_PASSWORD'
const FAIL_SET_PASSWORD = 'FAIL_SET_PASSWORD'
const REQUEST_SET_PASSWORD = 'REQUEST_SET_PASSWORD'

// ------------------------------------
// Actions
// ------------------------------------
export function requestSetPassword (credentials) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_SET_PASSWORD })
    const loader = showNotification(dispatch, 'loader')

    return authenticationService.confirmPassword(credentials).then(result => {
      dispatch(succeedSetPassword(result))
      showNotification(dispatch, 'success_ask_reset_password')
      hideNotification(dispatch, loader)
      dispatch(push('/authentication/login'))
    }).catch((err) => {
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        case 400:
          showNotification(dispatch, 'error_account_invalid_password')
          break
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(failSetPassword(err))
    })
  }
}

export function succeedSetPassword (result) {
  return {
    type: SUCCEED_SET_PASSWORD,
    payload: result
  }
}

export function failSetPassword (error) {
  return {
    type: FAIL_SET_PASSWORD,
    payload: error
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  SUCCEED_SET_PASSWORD: (state, action) => ({
    requestInProgress: false
  }),
  FAIL_SET_PASSWORD: (state, action) => ({
    requestInProgress: false
  }),
  REQUEST_SET_PASSWORD: (state, action) => ({
    requestInProgress: true
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
}

export default function setPasswordReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
