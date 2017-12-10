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

import updateService from 'services/updateService'
import segmentService from 'services/segmentService'
import { push } from 'react-router-redux'
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_SEGMENTS_LIST = 'RECEIVE_SEGMENTS_LIST'

const UPDATE_MODIFIED = 'UPDATE_MODIFIED'
const RECEIVE_UPDATE = 'RECEIVE_UPDATE'
const START_UPDATE_MODIFICATION = 'START_UPDATE_MODIFICATION'
const RECEIVE_UPDATE_MODIFICATION_ERROR = 'RECEIVE_UPDATE_MODIFICATION_ERROR'

const CLEAN_STATE = 'CLEAN_STATE'

function modifyUpdate (update, additionnalProperties) {
  return updateService.modifyUpdate(Object.assign({}, update, {
    additionalProperties: additionnalProperties
  }))
}

// ------------------------------------
// Actions
// ------------------------------------
export function getSegmentsList () {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')

    return segmentService.getSegments().then(result => {
      dispatch(receiveSegmentsList(result))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)

      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function editUpdate (update) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')
    let additionnalProperties
    dispatch(startUpdateModification())

    if (update.additionalProperties) {
      try {
        additionnalProperties = JSON.parse(update.additionalProperties)
      } catch (err) {
        hideNotification(dispatch, loader)
        showNotification(dispatch, 'error_update_invalid_additionnal_properties')
        dispatch(receiveUpdateModificationError(err))
        return
      }
    }

    modifyUpdate(update, additionnalProperties).then(result => {
      dispatch(receiveUpdateModified(result))
      dispatch(push(`/updates/${result.uuid}`))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)

      switch (err.status) {
        case 400:
          showNotification(dispatch, 'error_update_bad_request')
          break
        case 409:
          showNotification(dispatch, 'error_update_create_conflict')
          break
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(receiveUpdateModificationError(err))
    })
  }
}

export function getUpdate (updateId) {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')

    return updateService.getUpdateFromId(updateId).then(result => {
      dispatch(receiveUpdate(result))
      hideNotification(dispatch, loader)
    }).catch((err) => {
      hideNotification(dispatch, loader)

      switch (err.response.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }

      dispatch(push('/updates'))
      dispatch(receiveUpdateModificationError(err))
    })
  }
}

export function receiveSegmentsList (payload) {
  return {
    type: RECEIVE_SEGMENTS_LIST,
    payload
  }
}

export function receiveUpdate (update) {
  return {
    type:RECEIVE_UPDATE,
    payload : { update }
  }
}

export function receiveUpdateModified (payload) {
  return {
    type: UPDATE_MODIFIED,
    payload
  }
}

export function startUpdateModification () {
  return {
    type: START_UPDATE_MODIFICATION
  }
}

export function receiveUpdateModificationError () {
  return {
    type: RECEIVE_UPDATE_MODIFICATION_ERROR
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
  RECEIVE_SEGMENTS_LIST: (state, action) => ({
    segmentsList: action.payload,
    update : state.update
  }),
  UPDATE_MODIFIED: (state, action) => ({
    segmentsList: state.segmentsList,
    update: action.payload.update
  }),
  RECEIVE_UPDATE: (state, action) => ({
    segmentsList: state.segmentsList,
    update: action.payload.update
  }),
  RECEIVE_UPDATE_MODIFICATION_ERROR: (state, action) => ({
    segmentsList: state.segmentsList,
    update: state.update
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  segmentsList: {},
  update: {}
}

export default function updatesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

