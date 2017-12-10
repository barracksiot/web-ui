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

import moment from 'moment'
import { push } from 'react-router-redux'
import { showNotification, hideNotification } from 'modules/notifications'
import updateService from 'services/updateService'

// ------------------------------------
// Constants
// ------------------------------------

const RECEIVE_UPDATE = 'RECEIVE_UPDATE'
const RECEIVE_ERROR = 'RECEIVE_ERROR'
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

function getUpdateFromId (link) {
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
        const segmentName = data.segment ? data.segment.name : undefined
        const segmentDeviceCount = data.segment ? data.segment.deviceCount : 0

        resolve({
          currentUpdate : {
            uuid : data.uuid,
            name: data.name,
            description: data.description,
            packageId: data.packageInfo.id,
            segmentName: segmentName,
            segmentDeviceCount: segmentDeviceCount,
            creationDate: moment(data.creationDate).format('LLL'),
            status: data.status,
            revisionId: data.revisionId,
            versionId: data.packageInfo.versionId,
            fileName: data.packageInfo.fileName,
            additionalProperties: JSON.stringify(data.additionalProperties, null, '\t'),
            scheduledDate: data.scheduledDate ? moment(data.scheduledDate).format('LLL') : undefined
          }
        })
      })
      .catch(function (error) {
        console.error('Request failed', error)
        reject()
      })
  })
}

// ------------------------------------
// Actions
// ------------------------------------

export function getUpdate (updateId) {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    return getUpdateFromId(`/api/member/updates/${updateId}`).then(result => {
      dispatch(receiveUpdate(result))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      console.error(err)
      hideNotification(dispatch, loader)
      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(push('/updates'))
    })
  }
}

export function changeStatus (updateId, status, options) {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    return updateService.changeUpdateStatus(updateId, status, options).then(() => {
      dispatch(getUpdate(updateId))
      hideNotification(dispatch, loader)
    }).catch(err => {
      console.error(err)
      hideNotification(dispatch, loader)

      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(receiveError())
    })
  }
}

export function receiveUpdate (payload) {
  return {
    type: RECEIVE_UPDATE,
    payload
  }
}

export function receiveError () {
  return {
    type:RECEIVE_ERROR
  }
}

export function cleanState () {
  return {
    type: CLEAN_STATE
  }
}

export function editUpdate (updateId) {
  return (dispatch) => {
    dispatch(push('/updates/edit/' + updateId))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  RECEIVE_UPDATE: (state, action) => ({
    currentUpdate: action.payload.currentUpdate
  }),
  RECEIVE_ERROR: (state, action) => ({
    currentUpdate: state.currentUpdate
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentUpdate: {
    uuid : '',
    name: '',
    description: '',
    packageId: '',
    segmentName: '',
    creationDate: '',
    status: '',
    revisionId: 0,
    additionalProperties: ''
  }
}

export default function updatesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

