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

import packageService from 'services/packageService'
import { push } from 'react-router-redux'
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_UPLOAD_FILE_PROGRESS = 'RECEIVE_UPLOAD_FILE_PROGRESS'
const RECEIVE_UPLOAD_FILE_COMPLETE = 'RECEIVE_UPLOAD_FILE_COMPLETE'

const VERSION_CREATED = 'VERSION_CREATED'
const START_VERSION_CREATION = 'START_VERSION_CREATION'
const RECEIVE_VERSION_CREATION_ERROR = 'RECEIVE_VERSION_CREATION_ERROR'

const CLEAN_STATE = 'CLEAN_STATE'

// ------------------------------------
// Actions
// ------------------------------------

export function createVersion (pkgReference, version, file) {
  return (dispatch, getState) => {
    const loader = showNotification(dispatch, 'loader')

    try {
      const currentVersion = Object.assign({}, version)

      if(version && version.metadata) {
        currentVersion.metadata = JSON.parse(currentVersion.metadata)
      }

      dispatch(startUpdateCreation())
      packageService.createVersion(pkgReference, file, JSON.stringify(currentVersion), (event) => {
        if (event.lengthComputable) {
          let percentComplete = event.loaded / event.total * 0.9
          percentComplete = Math.round(percentComplete * 100) / 100
          dispatch(receiveUploadFileProgress(percentComplete))
        }
      }).then(result => {
        dispatch(receiveUploadFileProgress(1))
        dispatch(receiveVersionCreated(result))
        dispatch(push(`/packages/edit/${pkgReference}/versions/${result.id}`))
        hideNotification(dispatch, loader)
        showNotification(dispatch, 'success_version_created')
      }).catch((err) => {
        hideNotification(dispatch, loader)

        switch (err.status) {
          case 400:
            showNotification(dispatch, 'error_version_bad_request')
            break
          case 409:
            showNotification(dispatch, 'error_version_create_conflict')
            break
          case 422:
            showNotification(dispatch, 'error_version_malformed')
            break
          default:
            showNotification(dispatch, 'error_generic')
        }

        dispatch(receiveUpdateCreationError())
      })
    } catch (err) {
      console.error('err', err)
      dispatch(receiveUpdateCreationError())
      hideNotification(dispatch, loader)
      showNotification(dispatch, 'error_version_malformed')
      return
    }
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

export function receiveVersionCreated (payload) {
  return {
    type: VERSION_CREATED,
    payload
  }
}

export function startUpdateCreation () {
  return {
    type: START_VERSION_CREATION
  }
}

export function receiveUpdateCreationError () {
  return {
    type: RECEIVE_VERSION_CREATION_ERROR
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
  RECEIVE_UPLOAD_FILE_PROGRESS : (state, action) => ({
    version: state.version,
    uploadProgress: action.payload.uploadProgress
  }),
  VERSION_CREATED: (state, action) => ({
    version: action.payload.version,
    uploadProgress: state.uploadProgress
  }),
  START_VERSION_CREATION: (state, action) => ({
    version: state.version,
    uploadProgress: state.uploadProgress
  }),
  RECEIVE_VERSION_CREATION_ERROR: (state, action) => ({
    version: state.version,
    uploadProgress: 0
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  version: {},
  uploadProgress: 0
}

export default function packagesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

