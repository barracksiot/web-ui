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

const RECEIVE_UPLOAD_FILE_PROGRESS = 'RECEIVE_UPLOAD_FILE_PROGRESS'
const RECEIVE_UPLOAD_FILE_COMPLETE = 'RECEIVE_UPLOAD_FILE_COMPLETE'

const UPDATE_CREATED = 'UPDATE_CREATED'
const START_UPDATE_CREATION = 'START_UPDATE_CREATION'
const RECEIVE_UPDATE_CREATION_ERROR = 'RECEIVE_UPDATE_CREATION_ERROR'

const CLEAN_STATE = 'CLEAN_STATE'

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

export function createUpdate (update, file) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')
    let fileInfo = {
      versionId: update.versionId,
      file
    }
    let additionnalProperties

    if (update.additionalProperties) {
      try {
        additionnalProperties = JSON.parse(update.additionalProperties)
      } catch (err) {
        hideNotification(dispatch, loader)
        showNotification(dispatch, 'error_update_invalid_additionnal_properties')
        dispatch(receiveUpdateCreationError())
        return
      }
    }

    dispatch(startUpdateCreation())
    updateService.uploadPackage(fileInfo, (event) => {
      if (event.lengthComputable) {
        let percentComplete = event.loaded / event.total * 0.9
        percentComplete = Math.round(percentComplete * 100) / 100
        dispatch(receiveUploadFileProgress(percentComplete))
      }
    }).then((result) => {
      return updateService.createUpdate({
        name: update.name,
        description: update.description,
        packageId: result.id,
        segmentId: update.segmentId,
        additionalProperties: additionnalProperties
      })
    }).then(result => {
      dispatch(receiveUploadFileProgress(1))
      dispatch(receiveUpdateCreated(result))
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

      dispatch(receiveUpdateCreationError())
    })
  }
}

export function receiveSegmentsList (payload) {
  return {
    type: RECEIVE_SEGMENTS_LIST,
    payload
  }
}

export function receiveUploadComplet (payload) {
  return {
    type: RECEIVE_UPLOAD_FILE_COMPLETE,
    payload
  }
}

export function receiveUploadFileProgress (progress) {
  return {
    type: RECEIVE_UPLOAD_FILE_PROGRESS,
    payload: { uploadProgress: progress }
  }
}

export function receiveUpdateCreated (payload) {
  return {
    type: UPDATE_CREATED,
    payload
  }
}

export function startUpdateCreation () {
  return {
    type: START_UPDATE_CREATION
  }
}

export function receiveUpdateCreationError () {
  return {
    type: RECEIVE_UPDATE_CREATION_ERROR
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
    update : state.update,
    uploadProgress: state.uploadProgress
  }),
  RECEIVE_UPLOAD_FILE_PROGRESS : (state, action) => ({
    segmentsList: state.segmentsList,
    update: state.update,
    uploadProgress: action.payload.uploadProgress
  }),
  UPDATE_CREATED: (state, action) => ({
    segmentsList: state.segmentsList,
    update: action.payload.update,
    uploadProgress: state.uploadProgress
  }),
  START_UPDATE_CREATION: (state, action) => ({
    segmentsList: state.segmentsList,
    update: state.update,
    uploadProgress: state.uploadProgress
  }),
  RECEIVE_UPDATE_CREATION_ERROR: (state, action) => ({
    segmentsList: state.segmentsList,
    update: state.update,
    uploadProgress: 0
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  segmentsList: {},
  update: {},
  uploadProgress: 0
}

export default function updatesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

