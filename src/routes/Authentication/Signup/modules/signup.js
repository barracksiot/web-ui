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
const REQUEST_SIGNUP = 'REQUEST_SIGNUP'
const SUCCEED_SIGNUP = 'SUCCEED_SIGNUP'
const FAIL_SIGNUP = 'FAIL_SIGNUP'

const REQUEST_SET_PASSWORD = 'REQUEST_SET_PASSWORD'
const SUCCEED_SET_PASSWORD = 'SUCCEED_SET_PASSWORD'
const FAIL_SET_PASSWORD = 'FAIL_SET_PASSWORD'

const CLEAN_STATE = 'CLEAN_STATE'

// ------------------------------------
// Actions
// ------------------------------------
export function requestSignup (user) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_SIGNUP })
    const loader = showNotification(dispatch, 'loader')

    return authenticationService.signup(user).then(result => {
      dispatch(succeedSignup(result))
      dispatch(requestSetPassword(result.email))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        case 400:
          showNotification(dispatch, 'error_account_already_exist')
          break
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(failSignup(err))
    })
  }
}

export function requestSetPassword (email) {
  return (dispatch, getState) => {
    dispatch({
      type: REQUEST_SET_PASSWORD
    })
    return authenticationService.setPassword(email).then(result => {
      dispatch(succeedSetPassword(result))
    }).catch((err) => {
      dispatch(failSetPassword(err))
    })
  }
}

export function succeedSignup (result) {
  return {
    type: SUCCEED_SIGNUP,
    payload: result
  }
}

export function succeedSetPassword (result) {
  return {
    type: SUCCEED_SET_PASSWORD,
    payload: result
  }
}

export function failSignup (error) {
  return {
    type: FAIL_SIGNUP,
    payload: error
  }
}

export function failSetPassword (error) {
  return {
    type: FAIL_SET_PASSWORD,
    payload: error
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
  FAIL_SET_PASSWORD: (state, action) => Object.assign({}, state, { requestInProgress: false }),
  FAIL_SIGNUP: (state, action) => Object.assign({}, state, { requestInProgress: false }),
  REQUEST_SIGNUP: (state, action) => Object.assign({}, state, { requestInProgress: true }),
  SUCCEED_SIGNUP: (state, action) => Object.assign({}, state, { signupSucceed: true }),
  REQUEST_SET_PASSWORD: (state, action) => Object.assign({}, state, { emailSent: true }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
}

export default function signupReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
