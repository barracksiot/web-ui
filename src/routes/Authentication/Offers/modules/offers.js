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
import { receiveCurrentUser } from 'modules/auth'

// ------------------------------------
// Constants
// ------------------------------------
const CLEAN_STATE = 'CLEAN_STATE'
const REQUEST_FREE_PLAN_FAILED = 'REQUEST_FREE_PLAN_FAILED'

// ------------------------------------
// Actions
// ------------------------------------
export function requestFreePlan () {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    return authenticationService.createSubscriptionAccount('none', {
      plan: 'FREE',
      paymentDetails: {}
    }).then(result => {
      return authenticationService.getCurrentUser()
    }).then(user => {
      dispatch(receiveCurrentUser(user))
      dispatch(push('/'))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      console.error(err)
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        case 412:
          showNotification(dispatch, 'error_billing_precondition_failed')
          break
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(failRequestFreePlan(err))
    })
  }
}

export function failRequestFreePlan () {
  return {
    type: REQUEST_FREE_PLAN_FAILED
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
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
}

export default function offersReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
