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
import { push, replace } from 'react-router-redux'
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER'
const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
const USER_REJECTED = 'USER_REJECTED'
const SUCCEED_AUTHENTICATION = 'SUCCEED_AUTHENTICATION'
const FAIL_AUTHENTICATION = 'FAIL_AUTHENTICATION'

// ------------------------------------
// Actions
// ------------------------------------
export function retrieveCurrentUser () {
  return (dispatch) => {
    return authenticationService.getCurrentUser().then(user => {
      dispatch(receiveCurrentUser(user))
    }).catch((err) => {
      dispatch(reject(err))
    })
  }
}

export function logout () {
  return (dispatch) => {
    authenticationService.logout()
    dispatch(userLoggedOut())
    showNotification(dispatch, 'info_logout')
    dispatch(push('/authentication/login'))
  }
}

export function reject () {
  return (dispatch) => {
    authenticationService.logout()
    dispatch(userRejected())
    dispatch(push('/authentication/login'))
  }
}

export function userLoggedOut () {
  return {
    type: USER_LOGGED_OUT
  }
}

export function userRejected () {
  return {
    type: USER_REJECTED
  }
}

export function receiveCurrentUser (user) {
  return {
    type: RECEIVE_CURRENT_USER,
    payload: user
  }
}

function getBaseUrlFromUserAppVersion () {
  return (dispatch) => {
    var appVersion = localStorage.getItem('appVersion')
    if(appVersion == 'v2'){
      window.location.replace('/v2/')
    }else{
      localStorage.setItem('appVersion', 'v1')
      dispatch(replace('/'))
    }
  }
}

export function login (credentials) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')
    return authenticationService.authenticate(credentials.username, credentials.password).then((user) => {
      dispatch(succeedAuthentication(user))
      dispatch(getBaseUrlFromUserAppVersion(dispatch))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)

      console.error(err)
      switch (err.response.status) {
        case 401:
          showNotification(dispatch, 'error_authentication_failed_bad_credentials')
          break
        case 502:
          showNotification(dispatch, 'error_bad_gateway')
          break
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(failAuthentication(err))
    })
  }
}

export function succeedAuthentication (user) {
  return {
    type: SUCCEED_AUTHENTICATION,
    payload: user
  }
}

export function failAuthentication (error) {
  return {
    type: FAIL_AUTHENTICATION,
    payload: error
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  RECEIVE_CURRENT_USER: (state, action) => Object.assign({}, state, {
    currentUser: action.payload
  }),
  SUCCEED_AUTHENTICATION: (state, action) => Object.assign({}, state, {
    currentUser: action.payload
  }),
  USER_LOGGED_OUT: (state, action) => ({
  }),
  USER_REJECTED: (state, action) => ({
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
}

export default function authReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
