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

import { push } from 'react-router-redux'
import urls from 'config/urls.json'

// ------------------------------------
// Constants
// ------------------------------------
const STEPS_CHANGED = 'STEPS_CHANGED'
const START_HELPER = 'START_HELPER'
const JOYRIDE_INITIALIZED = 'JOYRIDE_INITIALIZED'
const START_TOUR = 'START_TOUR'
const CONTINUE_TOUR = 'CONTINUE_TOUR'
const TOUR_ENDED = 'TOUR_ENDED'

const tourPages = [
  urls.routes.support,
  urls.routes.packages,
  urls.routes.createPackage,
  urls.routes.devices,
  urls.routes.filters,
  urls.routes.createFilter,
  urls.routes.account
]

// ------------------------------------
// Actions
// ------------------------------------
export function setHelperSteps (steps) {
  return {
    type: STEPS_CHANGED,
    payload: steps
  }
}

export function startHelper () {
  return {
    type: START_HELPER
  }
}

export function setJoyride (joyride) {
  return {
    type: JOYRIDE_INITIALIZED,
    payload: joyride
  }
}

export function startTour (joyride) {
  return (dispatch) => {
    dispatch({
      type: START_TOUR
    })
  }
}

export function endTour (completed) {
  return {
    type: TOUR_ENDED,
    payload: { completed }
  }
}

export function continueTour () {
  return (dispatch, getState) => {
    const nextPageIndex = getState().helper.tourProgress.index + 1
    if (nextPageIndex < tourPages.length) {
      dispatch({
        type: CONTINUE_TOUR,
        payload: nextPageIndex
      })
      dispatch(push(tourPages[nextPageIndex]))
    } else {
      dispatch(push('/'))
      dispatch(endTour(true))
    }
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  STEPS_CHANGED: (state, action) => {
    return Object.assign({}, state, {
      steps: action.payload
    })
  },
  START_HELPER: (state, action) => {
    const progress = state.joyride.getProgress()
    if (isNaN(progress.percentageComplete)) {
      state.joyride.start()
    } else {
      state.joyride.reset(false)
      state.joyride.start()
    }
    return state
  },
  JOYRIDE_INITIALIZED: (state, action) => {
    return Object.assign({}, state, {
      joyride: action.payload
    })
  },
  START_TOUR: (state, action) => {
    return Object.assign({}, state, {
      tourProgress: {
        index: 0
      }
    })
  },
  CONTINUE_TOUR: (state, action) => {
    return Object.assign({}, state, {
      tourProgress: {
        index: action.payload
      }
    })
  },
  TOUR_ENDED: (state, action) => {
    delete state.tourProgress
    return state
  },
  CLEAN_STATE: (state, action) => Object.assign({}, initialState, {
    tourProgress: state.tourProgress
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}

export default function notifReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
