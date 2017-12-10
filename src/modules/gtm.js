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

// ------------------------------------
// Constants
// ------------------------------------
function pushFormSucceed () {
  dataLayer.push({
    'event': 'form',
    'type': 'success',
    'url': window.location.pathname + window.location.search
  })
}

function pushNotificationError (action) {
  dataLayer.push({
    'event': 'notification',
    'type': action.payload.type,
    'label': action.payload.name,
    'url': window.location.pathname + window.location.search
  })
}

function pushTourStarted (action) {
  dataLayer.push({
    event: 'help',
    category: 'Help',
    action: 'Tour - Start',
    label: window.location.pathname + window.location.search
  })
}

function pushTourEnded (action) {
  dataLayer.push({
    event: 'help',
    category: 'Help',
    action: 'Tour - End',
    label: `${action.payload.completed ? 'completed' : 'not completed'} - ${window.location.pathname + window.location.search}`
  })
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  SUCCEED_AUTHENTICATION: (state, action) => {
    pushFormSucceed()
    return initialState
  },
  SUCCEED_RESET_PASSWORD: (state, action) => {
    pushFormSucceed()
    return initialState
  },
  SUCCEED_VERIFY_SUBSCRIPTION_ACCOUNT: (state, action) => {
    pushFormSucceed()
    return initialState
  },
  SUCCEED_SET_PASSWORD: (state, action) => {
    pushFormSucceed()
    return initialState
  },
  SUCCEED_SIGNUP: (state, action) => {
    pushFormSucceed()
    return initialState
  },
  ADD_NOTIFICATION: (state, action) => {
    pushNotificationError(action)
    return initialState
  },
  START_TOUR: (state, action) => {
    pushTourStarted(action)
    return initialState
  },
  TOUR_ENDED: (state, action) => {
    pushTourEnded(action)
    return initialState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
}

export default function gtmReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
