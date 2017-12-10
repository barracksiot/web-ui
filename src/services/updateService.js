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
import moment from 'moment'

const UPDATE_ENDPOINT = '/api/member/updates'
const UPLOAD_PACKAGE_ENDPOINT = '/api/member/packages'

function getUpdatesPage ({ page, itemsByPage, sort } = { page: 0, itemsByPage: 10, sort: undefined }) {
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
    const url = UPDATE_ENDPOINT + paginationParameters + (sortParameters)

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        let pageUpdates = []

        if (data.page.totalElements > 0) {
          pageUpdates = data._embedded['updates'].map(update => Object.assign({}, update, {
            id: update.uuid,
            creationDate: moment(update.creationDate).format('LLL'),
            versionId: update.packageInfo.versionId
          }))
        }

        resolve({
          page: data.page,
          pageUpdates: pageUpdates
        })
      }).catch(function (error) {
        console.error(error)
        reject(error)
      })
  })
}

function uploadPackage (fileInfo, updateProgressListener) {
  return new Promise((resolve, reject) => {
    const token = authenticationService.getToken()

    const formData = new FormData()
    formData.append('file', fileInfo.file)
    formData.append('versionId', fileInfo.versionId)

    const oReq = new XMLHttpRequest()
    oReq.open('POST', UPLOAD_PACKAGE_ENDPOINT)
    oReq.setRequestHeader('X-Auth-Token', token)
    oReq.upload.addEventListener('progress', updateProgressListener)

    oReq.addEventListener('load', () => {
      if (oReq.status === 201) {
        resolve(JSON.parse(oReq.responseText))
      } else {
        reject(oReq)
      }
    })

    oReq.addEventListener('error', (event) => {
      reject(event)
    })

    oReq.send(formData)
  })
}

function changeUpdateStatus (updateId, newStatus, options) {
  options = options || {}

  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken(),
        'Content-type': 'application/json'
      }
    }

    const query = options.scheduledDate ? '?time=' + options.scheduledDate.toISOString() : ''
    const url = `/api/member/updates/${updateId}/status/${newStatus}${query}`

    fetch(url, requestParams)
      .then(checkStatus)
      .then(() => {
        resolve()
      }).catch(error => {
        console.error('Request failed', error)
        reject(error)
      })
  })
}

function createUpdate (update) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken(),
        'Content-type': 'application/json'
      },
      body: JSON.stringify(update)
    }

    fetch(UPDATE_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        resolve(data)
      })
      .catch(function (error) {
        console.error('Request failed', error)
        reject(error)
      })
  })
}

function modifyUpdate (update) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken(),
        'Content-type': 'application/json'
      },
      body: JSON.stringify(update)
    }

    fetch(UPDATE_ENDPOINT + `/${update.uuid}`, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        resolve(data)
      })
      .catch(function (error) {
        console.error('Request failed', error)
        reject(error)
      })
  })
}

function getUpdateFromId (uuid) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    fetch(UPDATE_ENDPOINT + `/${uuid}`, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        const segmentName = data.segment ? data.segment.name : undefined
        const segmentId = data.segment ? data.segment.id : undefined

        resolve({
          name: data.name,
          uuid: data.uuid,
          description: data.description,
          packageId: data.packageInfo.id,
          revisionId: data.revisionId,
          segmentId: segmentId,
          segmentName: segmentName,
          creationDate: moment(data.creationDate).format('LLL'),
          scheduledDate: data.scheduledDate ? moment(data.scheduledDate).format('LLL') : undefined,
          status: data.status,
          additionalProperties: JSON.stringify(data.additionalProperties, null, '\t'),
          versionId: data.packageInfo.versionId,
          fileName: data.packageInfo.fileName
        })
      })
      .catch(function (error) {
        console.error('Request failed', error)
        reject()
      })
  })
}

export default {
  getUpdatesPage,
  uploadPackage,
  changeUpdateStatus,
  createUpdate,
  modifyUpdate,
  getUpdateFromId
}
