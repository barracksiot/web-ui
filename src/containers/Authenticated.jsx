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

import React from 'react'

const userStatusHandlers = {
  subscription_pending: (component) => {
    component.props.replace('/authentication/offers')
    return false
  },
  payment_pending: (component) => {
    component.props.replace('/authentication/offers')
    return false
  }
}

const Authenticated = ComposedComponent => class extends React.Component {
  static displayName = 'Authenticated Component';

  static propTypes = {
    currentUser: React.PropTypes.object,
    retrieveCurrentUser: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.display = false
    this.state = {}
  }

  componentWillReceiveProps (nextProps) {
    this.changeCurrentUser(nextProps.currentUser)
  }

  changeCurrentUser (user) {
    if (user) {
      this.setState({ currentUser: user })
      const userStatusHandler = userStatusHandlers[user.status]
      if (userStatusHandler) {
        if (!userStatusHandler(this)) {
          this.display = false
          return
        }
      }
      this.display = true
    }
  }

  componentDidMount () {
    this.changeCurrentUser(this.props.currentUser)
    if (!this.state.currentUser) {
      this.props.retrieveCurrentUser()
    }
  }

  render () {
    return (this.display ? <ComposedComponent {...this.props} {...this.state} /> : null)
  }
}

export default Authenticated
