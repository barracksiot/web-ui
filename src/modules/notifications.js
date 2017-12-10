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

import { generateUUID } from 'utils/mathUtils'
import getNotificationData from 'config/notifications.json'

// ------------------------------------
// Constants
// ------------------------------------
const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

export function buildNotification (name) {
  return Object.assign({}, getNotificationData[name], { id: generateUUID(), name: name })
}

// ------------------------------------
// Actions
// ------------------------------------
export function showNotification (dispatch, name) {
  let notification = buildNotification(name)
  dispatch(addNotification(notification))
  return notification.id
}

export function hideNotification (dispatch, id) {
  dispatch(removeNotification(id))
  return true
}

export function addNotification (notification) {
  return (dispatch) => {
    dispatch({
      type: ADD_NOTIFICATION,
      payload: notification
    })
  }
}

export function removeNotification (notificationId) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_NOTIFICATION,
      payload: notificationId
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  ADD_NOTIFICATION: (state, action) => Object.assign({}, state, {
    notifications: state.notifications.concat([action.payload])
  }),
  REMOVE_NOTIFICATION: (state, action) => Object.assign({}, state, {
    notifications: state.notifications.filter((value) => { return value.id !== action.payload })
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  notifications: []
}

export default function notifReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
