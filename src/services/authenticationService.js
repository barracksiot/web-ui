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

import { checkStatus, parseJSON } from 'utils/fetchUtils'

const AUTHENTICATION_ENDPOINT = '/api/auth/login'
const REGISTER_ENDPOINT = '/api/auth/register'
const CURRENT_USER_ENDPOINT = '/api/auth/me'
const RESET_PASSWORD_ENDPOINT = '/api/auth/password/reset'
const SET_PASSWORD_ENDPOINT = '/api/auth/password/set'
const CONFIRM_PASSWORD_ENDPOINT = '/api/auth/password/reset/confirm'
const CREATE_SUBSCRIPTION_ACCOUNT_ENDPOINT = '/api/subscription/customers'
const VERIFY_SUBSCRIPTION_ACCOUNT_ENDPOINT = '/api/subscription/customers/verify'

function setToken (token) {
  localStorage.setItem('authToken', token)
}

function getToken () {
  return localStorage.getItem('authToken')
}

function removeToken () {
  localStorage.removeItem('authToken')
}

export default {
  authenticate: (username, password) => new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }
    fetch(AUTHENTICATION_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(function (response) {
        const token = response.headers.get('X-Auth-Token')
        setToken(token)
        return parseJSON(response)
      })
      .then(function (json) {
        resolve(json)
      }).catch(function (err) {
        reject(err)
      })
  }),

  resetPassword: (email) => new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    }
    fetch(RESET_PASSWORD_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(function (message) {
        resolve(message)
      }).catch(function (err) {
        reject(err)
      })
  }),

  setPassword: (email) => new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    }
    fetch(SET_PASSWORD_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(function (message) {
        resolve(message)
      }).catch(function (err) {
        reject(err)
      })
  }),

  confirmPassword: (credentials) => new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        token: credentials.token
      })
    }
    fetch(CONFIRM_PASSWORD_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(function (message) {
        resolve(message)
      }).catch(function (err) {
        reject(err)
      })
  }),

  signup: (user) => new Promise((resolve, reject) => {
    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        company: user.company
      })
    }
    fetch(REGISTER_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (message) {
        resolve(message)
      }).catch(function (err) {
        reject(err)
      })
  }),

  createSubscriptionAccount: (billingMethod, billingInfo) => new Promise((resolve, reject) => {
    const endpoint = CREATE_SUBSCRIPTION_ACCOUNT_ENDPOINT + '?method=' + billingMethod

    const requestParams = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'X-Auth-Token': getToken()
      },
      body: JSON.stringify(billingInfo)
    }
    fetch(endpoint, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (user) {
        resolve(user)
      }).catch(function (err) {
        reject(err)
      })
  }),

  verifySubscriptionAccount: () => new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'X-Auth-Token': getToken()
      }
    }
    fetch(VERIFY_SUBSCRIPTION_ACCOUNT_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (result) {
        resolve(result)
      }).catch(function (err) {
        reject(err)
      })
  }),

  getCurrentUser: () => new Promise((resolve, reject) => {
    const requestParams = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'X-Auth-Token': getToken()
      }
    }
    fetch(CURRENT_USER_ENDPOINT, requestParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(function (user) {
        resolve(user)
      }).catch(function (err) {
        reject(err)
      })
  }),

  getToken,

  isConnected: () => !!getToken(),

  logout: () => removeToken()

}
