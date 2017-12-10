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
import { IndexLink, Link } from 'react-router'
import urls from 'config/urls.json'

class Sidebar extends React.Component {
  static propTypes = {
    logout: React.PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = { mobileNavClass: 'mobileNavInvisible' }
  }

  onLogoutButtonClick () {
    this.props.logout()
  }

  onToggleMobileNav () {
    const mobileNavClass = this.state.mobileNavClass === 'mobileNavInvisible' ? 'mobileNavVisible' : 'mobileNavInvisible'

    this.setState({
      mobileNavClass: mobileNavClass
    })
  }

  onPageChange () {
    this.setState({
      mobileNavClass: 'mobileNavInvisible'
    })
  }

  onSwitchVersion () {
    localStorage.setItem('appVersion', 'v1')
    window.location.replace('/')
  }

  render () {
    return (
      <div className="sidebar">
        <h1>Barracks</h1>
        <button type="button" className="switch" data-status={this.state.mobileNavClass} onClick={this.onToggleMobileNav.bind(this)}>
          <span />
          <span />
          <span />
        </button>
        <nav className={this.state.mobileNavClass}>
          <div className="main">
            <Link to={urls.routes.packages} activeClassName="current" data-help="page-packages" onClick={this.onPageChange.bind(this)}>
              <span>Packages</span>
            </Link>
            <Link to={urls.routes.devices} activeClassName="current" data-help="page-devices" onClick={this.onPageChange.bind(this)}>
              <span>Devices</span>
            </Link>
            <Link to={urls.routes.filters} activeClassName="current" data-help="page-filters" onClick={this.onPageChange.bind(this)}>
              <span>Filters</span>
            </Link>
          </div>
          <div className="alt" data-help="alt-nav">
            <Link to={urls.routes.account} activeClassName="current" data-help="page-account" onClick={this.onPageChange.bind(this)}>
              <span>Account</span>
            </Link>
            <IndexLink to={urls.routes.support} activeClassName="current" data-help="page-support" onClick={this.onPageChange.bind(this)}>
              <span>Support</span>
            </IndexLink>
            <button type="button" onClick={this.onLogoutButtonClick.bind(this)} data-help="logout">
              <span>Log out</span>
            </button>
            <div className="version">
              <span>
                <button type="button" onClick={this.onSwitchVersion.bind(this)} >Back to version <span className="version-number">1</span></button>
              </span>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default Sidebar
