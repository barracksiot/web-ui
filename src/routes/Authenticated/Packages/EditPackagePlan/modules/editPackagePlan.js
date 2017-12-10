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
import printf from 'printf'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_PACKAGE_INFO = 'RECEIVE_PACKAGE_INFO'
const RECEIVE_PACKAGE_PLAN = 'RECEIVE_PACKAGE_PLAN'
const CLEAN_STATE = 'CLEAN_STATE'

// ------------------------------------
// Actions
// ------------------------------------
export function getPackagePlan (reference) {
  return (dispatch, getState) => {
    packageService.getPackagePlanPage(reference).then(plan => {
      plan = JSON.stringify(plan, false, 2)
      dispatch(receivePackagePlan({
        plan: plan
      }))
    }).catch(error => {
      console.error(error)
    })
  }
}

export function getPackageInfo (reference) {
  return (dispatch, getState) => {
    packageService.getPackageOverviewPage(reference).then(pkg => {
      dispatch(receivePackageInfo({
        pkg: pkg
      }))
    }).catch(error => {
      console.error(error)
    })
  }
}

export function updatePackagePlan (reference, plan) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')
    try {

      plan = plan || '{}'
      const parsedPlan = JSON.parse(plan)
      dispatch(receivePackagePlan({
        plan: plan
      }))

      return packageService.updatePackagePlan(reference, parsedPlan).then(result => {
        result = JSON.stringify(result, false, 2)
        dispatch(receivePackagePlan({
          plan: result
        }))
        hideNotification(dispatch, loader)
        showNotification(dispatch, 'success_deploymen_plan_updated')
      }).catch((err) => {
        hideNotification(dispatch, loader)
        console.error('err', err)
        switch (err.response.status) {
          case 422:
            showNotification(dispatch, 'error_plan_malformed')
            break
          case 400:
            showNotification(dispatch, 'error_plan_validation_failed')
            break
          default:
            showNotification(dispatch, 'error_generic')
        }
      })
    } catch (err) {
      console.error('err', err)
      hideNotification(dispatch, loader)
      showNotification(dispatch, 'error_plan_malformed')
      return
    }
  }
}

export function receiveDevicesPage (payload) {
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

export function receivePackageInfo (payload) {
  return {
    type: RECEIVE_PACKAGE_INFO,
    payload
  }
}

export function receivePackagePlan (payload) {
  return {
    type: RECEIVE_PACKAGE_PLAN,
    payload
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  RECEIVE_PACKAGE_INFO: (state, action) => Object.assign({}, state, {
    pkg: action.payload.pkg
  }),
  RECEIVE_PACKAGE_PLAN: (state, action) => Object.assign({}, state, {
    plan: action.payload.plan
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  pkg: {},
  plan: ''
}

export default function packagesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

