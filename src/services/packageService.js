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

const PACKAGES_ENDPOINT = '/v2/api/member/packages'
const PACKAGE_OVERVIEW_ENDPOINT = '/v2/api/member/packages/%s'
const PACKAGE_PLAN_ENDPOINT = '/v2/api/member/packages/%s/deployment-plan'
const PACKAGE_VERSIONS_ENDPOINT = '/v2/api/member/packages/%s/versions'
const PACKAGE_VERSION_ENDPOINT = '/v2/api/member/packages/%s/versions/%s'
const PACKAGE_FOR_FILTER_ENDPOINT = '/v2/api/member/filters/%s/deployment-plan'

function getPackagesPage ({ page, itemsByPage } = { page: 0, itemsByPage: 1000 }) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    if (!page) page = 0
    if (!itemsByPage) itemsByPage = 1000
    const paginationParameters = `?page=${page}&size=${itemsByPage}`
    const url = PACKAGES_ENDPOINT + paginationParameters

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        let pagePackages = []

        if (data.page.totalElements > 0) {
          pagePackages = data._embedded['packages'].map(pkg => Object.assign({}, pkg, {
            name: pkg.name,
            reference: pkg.reference
          }))
        }

        resolve({
          page: data.page,
          pagePackages: pagePackages
        })
      }).catch(function (error) {
        console.error(error)
        reject(error)
      })
  })
}

function getPackageOverviewPage (pkgReference) {
  return new Promise((resolve, reject) => {

    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken(),
        'Content-type': 'application/json'
      }
    }

    fetch(printf(PACKAGE_OVERVIEW_ENDPOINT, pkgReference), requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        resolve(data)
      }).catch(function (error) {
        console.error(error)
        reject(error)
      })
  })
}

function getPackagePlanPage (pkgReference) {
  return new Promise((resolve, reject) => {

    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken(),
        'Content-type': 'application/json'
      }
    }

    const url = printf(PACKAGE_PLAN_ENDPOINT, pkgReference)

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        resolve(data)
      }).catch(function (error) {
        console.error(error)
        reject(error)
      })
  })
}

function getPackageVersionPage (pkgReference, version) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    const url = printf(PACKAGE_VERSION_ENDPOINT, pkgReference, version)
    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        resolve(data)
      }).catch(function (error) {
        console.error(error)
        reject(error)
      })
  })
}

function getPackageVersionsPage (pkgReference, page, itemsByPage, sort) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken()
      }
    }

    if (!page) page = 0
    if (!itemsByPage) itemsByPage = 1000
    const paginationParameters = `?page=${page}&size=${itemsByPage}`
    const sortParameters = sort ? `&sort=${sort.property},${sort.direction}` : ''
    const url = printf(PACKAGE_VERSIONS_ENDPOINT, pkgReference) + paginationParameters + sortParameters

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        let pageVersions = []

        if (data.page.totalElements > 0) {
          pageVersions = data._embedded['versions'].map(version => Object.assign({}, version, {
            creationDate: moment(version.creationDate).format('LLL')
          }))
        }

        resolve({
          page: data.page,
          pageVersions: pageVersions
        })
      }).catch(function (error) {
        console.error(error)
        reject(error)
      })
  })
}

function getPackagesForFilter (filterName, page, itemsByPage)  {
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

    const url = printf(PACKAGE_FOR_FILTER_ENDPOINT, filterName)

    fetch(url, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (data) {
        let pkgs = []
        if (data.page.totalElements > 0) {
          data._embedded.objectNodes.map( plan =>
            pkgs.push(plan.content.packageRef)
          )
        }
        resolve({
          page: data.page,
          filterPackages: pkgs
        })
      }).catch(function (error) {
        console.error(error)
        reject(error)
      })
  })
}

function createPackage (pkg) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken(),
        'Content-type': 'application/json'
      },
      body: JSON.stringify(pkg)
    }

    fetch(PACKAGES_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (pkg) {
        resolve(pkg)
      })
      .catch(function (error) {
        console.error('Request failed', error)
        reject(error)
      })
  })
}

function createVersion (pkgReference, file, version, updateProgressListener) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('version', new Blob([version], {
      type: 'application/json'
    }))

    const oReq = new XMLHttpRequest()
    oReq.open('POST', printf(PACKAGE_VERSIONS_ENDPOINT, pkgReference))
    oReq.setRequestHeader('X-Auth-Token', authenticationService.getToken())
    oReq.upload.addEventListener('progress', updateProgressListener)

    oReq.addEventListener('load', () => {
      if (oReq.status === 201) {
        resolve(JSON.parse(oReq.responseText))
      } else {
        console.error(oReq)
        reject(oReq)
      }
    })

    oReq.addEventListener('error', (event) => {
      console.error(event)
      reject(event)
    })

    oReq.send(formData)
  })
}

function updatePackagePlan (pkgReference, packagePlan) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': authenticationService.getToken(),
        'Content-type': 'application/json'
      },
      body: JSON.stringify(packagePlan)
    }

    fetch(printf(PACKAGE_PLAN_ENDPOINT, pkgReference), requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (plan) {
        resolve(plan)
      })
      .catch(function (error) {
        console.error('Request failed', error)
        reject(error)
      })
  })
}

export default {
  getPackagesPage,
  getPackageVersionPage,
  getPackagesForFilter,
  getPackageOverviewPage,
  getPackagePlanPage,
  getPackageVersionsPage,
  createPackage,
  createVersion,
  updatePackagePlan
}
