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

const CREATE_SEGMENT_ENDPOINT = '/api/member/segments'
const GET_SEGMENTS_ENDPOINT = '/api/member/segments/order'
const UPDATE_ACTIVE_SEGMENTS_ORDER_ENDPOINT = '/api/member/segments/order'
const UPDATE_SEGMENT_ENDPOINT = '/api/member/segments/%s'
const GET_SEGMENT_ENDPOINT = '/api/member/segments/%s'

function createSegment (segment) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      },
      body: JSON.stringify(segment)
    }
    fetch(CREATE_SEGMENT_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        resolve(data)
      }).catch(error => {
        console.error(error)
        reject(error)
      })
  })
}

function updateSegment (segment) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      },
      body: JSON.stringify(segment)
    }
    fetch(printf(UPDATE_SEGMENT_ENDPOINT, segment.id), requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        resolve(data)
      }).catch(error => {
        console.error(error)
        reject(error)
      })
  })
}

function getSegments () {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/hal+json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }
    fetch(GET_SEGMENTS_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        resolve(data)
      }).catch(error => {
        console.error(error)
        reject(error)
      })
  })
}

function updateActiveSegmentsOrder (ids) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/hal+json',
        'Content-Type': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      },
      body: JSON.stringify(ids)
    }
    fetch(UPDATE_ACTIVE_SEGMENTS_ORDER_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        resolve(data)
      }).catch(error => {
        console.error(error)
        reject(error)
      })
  })
}

function getSegmentById (segmentId) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/hal+json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }
    fetch(printf(GET_SEGMENT_ENDPOINT, segmentId), requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        resolve(data)
      }).catch(error => {
        console.error(error)
        reject(error)
      })
  })
}

export default {
  createSegment,
  updateSegment,
  getSegments,
  updateActiveSegmentsOrder,
  getSegmentById
}
