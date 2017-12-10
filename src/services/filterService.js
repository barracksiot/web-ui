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

const CREATE_FILTER_ENDPOINT = '/api/member/filters'
const DELETE_FILTER_ENDPOINT = '/api/member/filters/%s'
const GET_FILTERS_ENDPOINT = '/api/member/filters'

function createFilter (filter) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      },
      body: JSON.stringify(filter)
    }
    fetch(CREATE_FILTER_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
  })
}

function editFilter (filter) {
  return new Promise((resolve, reject) => {
    resolve({
      name: 'Alpha',
      query: {
        eq: {
          unitId: 'Cyber_Brain_1'
        }
      }
    })
  })
}

function deleteFilter (filterName) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'delete',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }
    fetch(printf(DELETE_FILTER_ENDPOINT, filterName), requestParams)
      .then(checkStatus)
      .then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
  })
}

function getFilterPage (filter) {
  return new Promise((resolve, reject) => {
    resolve({
      name: 'Alpha',
      query: {
        eq: {
          unitId: 'Cyber_Brain_1'
        }
      }
    })
  })
}

function getFiltersPage ({ page, itemsByPage, sort, query } = { page: 0, itemsByPage: 10 }) {
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
    const url = GET_FILTERS_ENDPOINT + paginationParameters

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        let pageFilters = []

        if (data.page.totalElements > 0) {
          pageFilters = data._embedded.filters
        }

        resolve({
          pageFilters: pageFilters,
          page: data.page
        })
      }).catch(function (error) {
        reject(error)
      })
  })
}

export default {
  getFilterPage,
  createFilter,
  editFilter,
  deleteFilter,
  getFiltersPage
}
