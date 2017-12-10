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
const RECEIVE_PACKAGE_VERSIONS_PAGE = 'RECEIVE_PACKAGE_VERSIONS_PAGE'
const RECEIVE_PACKAGE_INFO = 'RECEIVE_PACKAGE_INFO'
const CLEAN_STATE = 'CLEAN_STATE'
const titles = [
  { property: 'id', label: 'Id'},
  { property: 'name', label: 'Name'},
  { property: 'description', label: 'Description', classes: 'full wrap'},
  { property: 'creationDate', label: 'Creation date'}
]
const clickableColumns = ['id']
const sortableColumns = ['id', 'name', 'description', 'creationDate']

// ------------------------------------
// Actions
// ------------------------------------
export function getPackageVersionsPage (reference) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    return packageService.getPackageVersionsPage(reference).then(result => {
      dispatch(receivePackageVersionsPage(result))
      hideNotification(dispatch, loader)
    }).catch(err => {
      console.error(err)
      hideNotification(dispatch, loader)
      switch (err.response.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
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

export function sortPackageVersions (reference, property, direction) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    return packageService.getPackageVersionsPage(reference, { sort: { property, direction } }).then(result => {
      dispatch(receivePackageVersionsPage(Object.assign({}, result, { sort: { property, direction } })))
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

export function receivePackageVersionsPage (payload) {
  return {
    type: RECEIVE_PACKAGE_VERSIONS_PAGE,
    payload
  }
}

export function receivePackageInfo (payload) {
  return {
    type: RECEIVE_PACKAGE_INFO,
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
  RECEIVE_PACKAGE_INFO: (state, action) => Object.assign({}, state, {
    pkg: action.payload.pkg
  }),
  RECEIVE_PACKAGE_VERSIONS_PAGE: (state, action) => Object.assign({}, state, {
    titles: titles,
    clickableColumns: clickableColumns,
    sortableColumns: sortableColumns,
    pageVersions: action.payload.pageVersions,
    page: action.payload.page,
    sort: action.payload.sort
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  titles,
  pageVersions: [],
  page: {},
  pkg: {}
}

export default function packagesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

