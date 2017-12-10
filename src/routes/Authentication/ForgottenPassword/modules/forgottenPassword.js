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

// ------------------------------------
// Constants
// ------------------------------------
const SUCCEED_RESET_PASSWORD = 'SUCCEED_RESET_PASSWORD'
const FAIL_RESET_PASSWORD = 'FAIL_RESET_PASSWORD'
const REQUEST_RESET_PASSWORD = 'REQUEST_RESET_PASSWORD'

// ------------------------------------
// Actions
// ------------------------------------
export function requestResetPassword (credentials) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_RESET_PASSWORD })
    const loader = showNotification(dispatch, 'loader')

    return authenticationService.resetPassword(credentials.email).then(result => {
      dispatch(succeedResetPassword(result))
      showNotification(dispatch, 'success_ask_reset_password')
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        case 401:
          showNotification(dispatch, 'error_account_not_exist')
          break
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(failResetPassword(err))
    })
  }
}

export function succeedResetPassword (result) {
  return {
    type: SUCCEED_RESET_PASSWORD,
    payload: result
  }
}

export function failResetPassword (error) {
  return {
    type: FAIL_RESET_PASSWORD,
    payload: error
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  SUCCEED_RESET_PASSWORD: (state, action) => ({
    requestInProgress: false
  }),
  FAIL_RESET_PASSWORD: (state, action) => ({
    requestInProgress: false
  }),
  REQUEST_RESET_PASSWORD: (state, action) => ({
    requestInProgress: true
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
}

export default function forgottenPasswordReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
