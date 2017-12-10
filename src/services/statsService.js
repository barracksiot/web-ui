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

import authenticationService from './authenticationService'
import { checkStatus, parseJSON } from 'utils/fetchUtils'

const DEVICES_PER_VERSION_ID_ENDPOINT = '/api/member/stats/devices/perVersionId'
const DEVICES_PER_SEGMENT_ID_ENDPOINT = '/api/member/stats/devices/perSegmentId'
const DEVICES_LAST_SEEN_ENDPOINT = '/api/member/stats/devices/lastSeen'

function getDevicesPerVersionId () {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    const endpoint = DEVICES_PER_VERSION_ID_ENDPOINT

    fetch(endpoint, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
  })
}

function getDevicesLastSeen (start = '', end = '') {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    let url = DEVICES_LAST_SEEN_ENDPOINT + '?start=' + start + '&end=' + end

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
  })
}

function getDevicesUpToDateBySegments () {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    let url = DEVICES_PER_SEGMENT_ID_ENDPOINT + '?updated=true'

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
  })
}

function getDevicesBySegments () {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    let url = DEVICES_PER_SEGMENT_ID_ENDPOINT

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
  })
}

export default {
  getDevicesPerVersionId,
  getDevicesLastSeen,
  getDevicesUpToDateBySegments,
  getDevicesBySegments
}
