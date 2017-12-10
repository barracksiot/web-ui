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
import { receiveCurrentUser } from 'modules/auth'

// ------------------------------------
// Constants
// ------------------------------------
const SUCCEED_CREATE_SUBSCRIPTION_ACCOUNT = 'SUCCEED_CREATE_SUBSCRIPTION_ACCOUNT'
const FAIL_CREATE_SUBSCRIPTION_ACCOUNT = 'FAIL_CREATE_SUBSCRIPTION_ACCOUNT'
const REQUEST_CREATE_SUBSCRIPTION_ACCOUNT = 'REQUEST_CREATE_SUBSCRIPTION_ACCOUNT'

const SUCCEED_VERIFY_SUBSCRIPTION_ACCOUNT = 'SUCCEED_VERIFY_SUBSCRIPTION_ACCOUNT'
const FAIL_VERIFY_SUBSCRIPTION_ACCOUNT = 'FAIL_VERIFY_SUBSCRIPTION_ACCOUNT'
const REQUEST_VERIFY_SUBSCRIPTION_ACCOUNT = 'REQUEST_VERIFY_SUBSCRIPTION_ACCOUNT'

const CLEAN_STATE = 'CLEAN_STATE'

function waitUntilSubscriptionProcessed (dispatch) {
  return authenticationService.verifySubscriptionAccount().then(result => {
    if (result.subscriptions[0].cancelType === 'paypal-wait') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitUntilSubscriptionProcessed(dispatch))
        }, 2000)
      })
    } else {
      return authenticationService.getCurrentUser()
    }
  }).catch(function (error) {
    console.error('Request failed', error)
  })
}

// ------------------------------------
// Actions
// ------------------------------------
export function requestCreateSubscriptionAccount (billingMethod, billingInfo) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_CREATE_SUBSCRIPTION_ACCOUNT })
    const loader = showNotification(dispatch, 'loader')

    return authenticationService.createSubscriptionAccount(billingMethod, billingInfo).then(result => {
      dispatch(succeedCreateSubscriptionAccount(result))
      if (billingMethod === 'paypal') {
        window.location.href = result.subscriptions[0].redirectUrl
      } else if (billingMethod === 'cc') {
        dispatch(requestVerifySubscriptionAccount())
      }
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        case 412:
          showNotification(dispatch, 'error_billing_precondition_failed')
          break
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(failCreateSubscriptionAccount(err))
    })
  }
}

export function requestVerifySubscriptionAccount () {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_VERIFY_SUBSCRIPTION_ACCOUNT })
    const loader = showNotification(dispatch, 'loader')

    waitUntilSubscriptionProcessed(dispatch).then((user) => {
      hideNotification(dispatch, loader)
      showNotification(dispatch, 'success_payment_method_validated')
      dispatch(receiveCurrentUser(user))
      dispatch(succeedVerifySubscriptionAccount())
    }).catch((err) => {
      console.error(err)
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        case 403:
          showNotification(dispatch, 'warning_billing_not_verified_account')
          break
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(failVerifySubscriptionAccount(err))
    })
  }
}

export function succeedCreateSubscriptionAccount (result) {
  return {
    type: SUCCEED_CREATE_SUBSCRIPTION_ACCOUNT,
    payload: result
  }
}

export function failCreateSubscriptionAccount (error) {
  return {
    type: FAIL_CREATE_SUBSCRIPTION_ACCOUNT,
    payload: error
  }
}

export function succeedVerifySubscriptionAccount () {
  return {
    type: SUCCEED_VERIFY_SUBSCRIPTION_ACCOUNT,
    payload: true
  }
}

export function failVerifySubscriptionAccount (error) {
  return {
    type: FAIL_VERIFY_SUBSCRIPTION_ACCOUNT,
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
  SUCCEED_CREATE_SUBSCRIPTION_ACCOUNT: (state, action) => ({
    requestInProgress: false
  }),
  FAIL_CREATE_SUBSCRIPTION_ACCOUNT: (state, action) => ({
    requestInProgress: false
  }),
  REQUEST_CREATE_SUBSCRIPTION_ACCOUNT: (state, action) => ({
    requestInProgress: true
  }),
  SUCCEED_VERIFY_SUBSCRIPTION_ACCOUNT: (state, action) => ({
    requestInProgress: true,
    isSubscribed: action.payload
  }),
  FAIL_VERIFY_SUBSCRIPTION_ACCOUNT: (state, action) => ({
    requestInProgress: false
  }),
  REQUEST_VERIFY_SUBSCRIPTION_ACCOUNT: (state, action) => ({
    requestInProgress: true
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
}

export default function billingReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
