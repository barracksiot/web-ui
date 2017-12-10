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
import printf from 'printf'
import moment from 'moment'

const DEVICES_ENDPOINT = '/api/member/devices'
const DEVICE_HISTORY_ENDPOINT = '/api/member/devices/%s/events'
const DEVICE_INFO_ENDPOINT = '/api/member/devices/%s'
const SEGMENT_DEVICES_ENDPOINT = '/api/member/segments/%s/devices'

function getDevicesPage ({ page, itemsByPage, sort, query } = { page: 0, itemsByPage: 10, sort: undefined, query: undefined }) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    if (!page) page = 0
    if (!itemsByPage) itemsByPage = 10

    const paginationParameters = `?page=${page}&size=${itemsByPage}`
    const sortParameters = sort ? `&sort=${sort.property},${sort.direction}` : ''
    const queryParameters = query ? `&query=${encodeURI(JSON.stringify(query))}` : ''
    const url = DEVICES_ENDPOINT + paginationParameters + sortParameters + queryParameters

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        let pageDevices = []

        if (data.page.totalElements > 0) {
          pageDevices = data._embedded.devices.map(mapDevice)
        }

        resolve({
          pageDevices: pageDevices,
          page: data.page
        })
      }).catch(function (error) {
        reject(error)
      })
  })
}

function getDevicesPageBySegmentId (segmentId, { page, itemsByPage, sort } = { page: 0, itemsByPage: 10, sort: undefined }) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    if (!page) page = 0
    if (!itemsByPage) itemsByPage = 10

    const paginationParameters = `?page=${page}&size=${itemsByPage}`
    const sortParameters = sort ? `&sort=${sort.property},${sort.direction}` : ''
    const url = printf(SEGMENT_DEVICES_ENDPOINT, segmentId) + paginationParameters + (sortParameters)

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        let deviceInfos = []

        if (data.page.totalElements > 0) {
          deviceInfos = data._embedded.devices.map(mapDevice)
        }

        resolve({
          page: data.page,
          pageDevices: deviceInfos
        })
      }).catch(error => {
        console.error(error)
        reject(error)
      })
  })
}

function mapDevice (device) {
  return {
    id: device.unitId,
    unitId: device.unitId,
    lastEvent: {
      additionalProperties: JSON.stringify(device.lastEvent.additionalProperties, null, '\t'),
      receptionDate: device.lastEvent.receptionDate ? moment(device.lastEvent.receptionDate).format('LLL') : 'Unknown',
      versionId: device.lastEvent.versionId || 'Unknown',
      segmentId: device.lastEvent.segmentId || 'other'
    },
    firstSeen: device.firstSeen ? moment(device.firstSeen).format('LLL') : 'Unknown'
  }
}

function getDeviceInfo (unitId) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    fetch(printf(DEVICE_INFO_ENDPOINT, unitId), requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        resolve(mapDevice(data))
      }).catch(function (error) {
        reject(error)
      })
  })
}

function getDeviceHistoryPage (unitId, { page, itemsByPage, sort } = { page: 0, itemsByPage: 10, sort: undefined }) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    if (!page) page = 0
    if (!itemsByPage) itemsByPage = 10

    const paginationParameters = `?page=${page}&size=${itemsByPage}`
    const sortParameters = sort ? `&sort=${sort.property},${sort.direction}` : ''
    const url = printf(DEVICE_HISTORY_ENDPOINT, unitId) + paginationParameters + (sortParameters)

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        let deviceInfos = []

        if (data.page.totalElements > 0) {
          deviceInfos = data._embedded.events.map((deviceEvent, index) => Object.assign({}, deviceEvent, {
            id: index,
            receptionDate: moment(deviceEvent.receptionDate).format('LLL')
          }))
        }

        resolve({
          page: data.page,
          pageDevices: deviceInfos
        })
      }).catch(function (error) {
        reject(error)
      })
  })
}

export default {
  getDevicesPage,
  getDeviceHistoryPage,
  getDeviceInfo,
  getDevicesPageBySegmentId
}
