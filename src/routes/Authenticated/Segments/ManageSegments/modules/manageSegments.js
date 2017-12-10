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

import segmentService from 'services/segmentService'
import { showNotification, hideNotification } from 'modules/notifications'

// ------------------------------------
// Constants
// ------------------------------------
const SEGMENT_RECEIVED = 'SEGMENT_RECEIVED'
const SEGMENT_CREATED = 'SEGMENT_CREATED'
const CLEAN_STATE = 'CLEAN_STATE'

// ------------------------------------
// Actions
// ------------------------------------
export function createSegment (segment) {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')

    return segmentService.createSegment(segment).then(segment => {
      dispatch(segmentCreated(segment))
      hideNotification(dispatch, loader)
      dispatch(getSegments())
    }).catch((err) => {
      hideNotification(dispatch, loader)
      console.error(err)
      switch (err.status) {
        case 422:
          showNotification(dispatch, 'error_segment_validation_failed')
          break
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function getSegments () {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    segmentService.getSegments().then(results => {
      hideNotification(dispatch, loader)
      dispatch(receiveSegments(results))
    }).catch(err => {
      hideNotification(dispatch, loader)
      console.error(err)
      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function updateActiveSegmentsOrder (segments) {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    const ids = segments.map(segment => segment.id)
    segmentService.updateActiveSegmentsOrder(ids).then(() => {
      hideNotification(dispatch, loader)
      dispatch(getSegments())
    }).catch(err => {
      hideNotification(dispatch, loader)
      console.error(err)
      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function updateSegment (segment) {
  return (dispatch) => {
    const loader = showNotification(dispatch, 'loader')
    segmentService.updateSegment(segment).then(() => {
      hideNotification(dispatch, loader)
      dispatch(getSegments())
    }).catch(err => {
      hideNotification(dispatch, loader)
      console.error(err)
      switch (err.status) {
        default:
          showNotification(dispatch, 'error_generic')
      }
    })
  }
}

export function receiveSegments (payload) {
  return {
    type: SEGMENT_RECEIVED,
    payload
  }
}

export function segmentCreated (segment) {
  return {
    type: SEGMENT_CREATED
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
  SEGMENT_RECEIVED: (state, action) => ({
    activeSegments: action.payload.active,
    inactiveSegments: action.payload.inactive
  }),
  CLEAN_STATE: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  activeSegments: [],
  inactiveSegments: []
}

export default function manageSegmentsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

