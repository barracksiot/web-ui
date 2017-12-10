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

class AccountView extends React.Component {
  static propTypes = {
    profile: React.PropTypes.shape({
      firstName: React.PropTypes.string,
      lastName: React.PropTypes.string,
      email: React.PropTypes.string,
      apiKey: React.PropTypes.string,
      gaTrackingId: React.PropTypes.string
    }),
    onSubmit: React.PropTypes.func,
    getAccountInfo: React.PropTypes.func,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool,
    cleanState: React.PropTypes.func
  }

  constructor (props) {
    super(props)
    this.initState(props)
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.profile !== nextProps.profile) {
      this.initState(nextProps)
    }
  }

  initState (props) {
    this.state = {
      profile: props.profile || {}
    }
  }

  componentWillMount () {
    if (this.props.getAccountInfo) {
      this.props.getAccountInfo()
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  componentDidMount () {
    if (this.props.tourInProgress) {
      this.startHelper()
    }
  }

  onUpdatePropertyChange (event) {
    let diff = {}
    diff[event.target.name] = event.target.value || undefined
    let newProfile = Object.assign({}, this.state.profile, diff)
    this.setState(Object.assign({}, this.state, { profile: newProfile }))
  }

  onFormSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.state.profile)
  }

  startHelper () {
    const helperList = [
      {
        text: '<p>Here is your API Key, please don\'t share it with everybody.</p>',
        selector: '[data-help="api-key"]',
        position: 'bottom'
      },
      {
        text: '<p>This is the current version of Barracks. You can switch in the left menu.</p>',
        selector: '[data-help="app-version"]',
        position: 'bottom'
      },
      {
        text: '<p>And if you need any help, don\'t hesitate to visit our support page.</p>',
        selector: '[data-help="support-page"]',
        position: 'bottom'
      },
      {
        text: '<p>Don\'t forget, we have some SDK examples. If you already implemented one on your devices, let\'s continue.</p><p>Otherwise, we advise you to implement a SDK.</p>',
        selector: '[data-help="sdk-example"]',
        position: 'left'
      },
      {
        text: '<p>Also, if you want to automate things, you can try our CLI tool for Barracks.</p>',
        selector: '[data-help="cli-tool"]',
        position: 'left'
      },
      {
        text: '<p>In case you want to do some easy testing, we provide a device emulator.</p><p>It simulates many simple devices connecting to Barracks the same way your devices would.</p>',
        selector: '[data-help="device-emulator"]',
        position: 'left'
      }
    ]

    if (this.props.tourInProgress) {
      helperList.push({
        text: '<p>This is the Devices page</p><p>Let\'s go there</p>',
        selector: '[data-help="page-devices"]',
        position: 'right'
      })
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <h2>
              My account
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
        </header>
        <div className="content">
          <div className="profile">

            <div className="info">
              <div className="basic">

                <form className="form form--manage-profile" onSubmit={this.onFormSubmit.bind(this)}>

                  <h3>
                    Basic informations
                  </h3>

                  <p>
                    <strong>
                      First name
                    </strong>
                    <span className="firstName">
                      {this.state.profile.firstName}
                    </span>
                  </p>

                  <p>
                    <strong>
                      Last name</strong>
                    <span className="lastName">
                      {this.state.profile.lastName}
                    </span>
                  </p>

                  <p>
                    <strong>
                      Email
                    </strong>
                    <span className="email">
                      {this.state.profile.email}
                    </span>
                  </p>

                  <div className="form__item form__item--input">
                    <strong>
                      <label htmlFor="gaTrackingId">
                        Google UA-ID <span className="experimental">experimental</span>
                      </label>
                    </strong>
                    <div className="input">
                      <input type="text" id="gaTrackingId" name="gaTrackingId" pattern="^UA-[0-9]{8}-[0-9]{1,3}$" maxLength="14" placeholder="e.g. UA-XXXXXXXX-X" value={this.state.profile.gaTrackingId} onChange={this.onUpdatePropertyChange.bind(this)} />
                    </div>
                  </div>

                  <div className="btn-group btn-group--center">
                    <button type="submit" className="btn">
                      Save profile
                    </button>
                  </div>

                </form>

              </div>
              <div className="apis" data-help="sdk-example">

                <h3>
                  SDK and API informations
                </h3>

                <div className="api" data-help="app-version">
                  <p>
                    <strong>
                      Application version
                    </strong>
                    <span className="app-version">
                      1.2.0
                    </span>
                  </p>
                </div>

                <div className="api" data-help="support-page">
                  <p>
                    <strong>
                      API documentation
                    </strong>
                    <span>
                      See <a href="https://barracks.io/support/" target="_blank">our&nbsp;full&nbsp;documentation</a> or <a href="https://barracks.io/" target="_blank">contact&nbsp;us</a>
                    </span>
                  </p>
                </div>

                <div className="api" data-help="api-key">
                  <p>
                    <strong>
                      API Key
                    </strong>
                    <span className="apiKey">
                      {this.state.profile.apiKey}
                    </span>
                  </p>
                </div>

                <div className="api">
                  <p>
                    <strong>
                      Python SDK
                    </strong>
                    <span>
                      <a href="https://github.com/barracksiot/python-client" target="_blank">See GitHub repo <i className="fa fa-external-link" /></a>
                    </span>
                    <span>
                      <a href="https://github.com/barracksiot/python-client/blob/master/README.md" target="_blank">See documentation <i className="fa fa-external-link" /></a>
                    </span>
                  </p>
                </div>

                <div className="api">
                  <p>
                    <strong>
                      JavaScript SDK
                    </strong>
                    <span>
                      <a href="https://github.com/barracksiot/javascript-client" target="_blank">See GitHub repo <i className="fa fa-external-link" /></a>
                    </span>
                    <span>
                      <a href="https://github.com/barracksiot/javascript-client/blob/master/README.md" target="_blank">See documentation <i className="fa fa-external-link" /></a>
                    </span>
                  </p>
                </div>

                <div className="api">
                  <p>
                    <strong>
                      Android SDK
                    </strong>
                    <span>
                      <a href="https://github.com/barracksiot/android-client" target="_blank">See GitHub repo <i className="fa fa-external-link" /></a>
                    </span>
                    <span>
                      <a href="http://barracksiot.github.io/android-client/" target="_blank">See documentation <i className="fa fa-external-link" /></a>
                    </span>
                  </p>
                </div>

                <div className="api">
                  <p>
                    <strong>
                      iOS SDK
                    </strong>
                    <span>
                      <a href="https://github.com/barracksiot/ios-osx-client" target="_blank">See GitHub repo <i className="fa fa-external-link" /></a>
                    </span>
                    <span>
                      <a href="http://barracksiot.github.io/ios-osx-client/docs/" target="_blank">See documentation <i className="fa fa-external-link" /></a>
                    </span>
                  </p>
                </div>

                <div className="api" data-help="cli-tool">
                  <p>
                    <strong>
                      Barracks CLI
                    </strong>
                    <span>
                      <a href="https://github.com/barracksiot/barracks-cli" target="_blank">See GitHub repo <i className="fa fa-external-link" /></a>
                    </span>
                    <span>
                      <a href="https://www.npmjs.com/package/barracks-cli" target="_blank">Go to npm page <i className="fa fa-external-link" /></a>
                    </span>
                  </p>
                </div>

                <div className="api" data-help="device-emulator">
                  <p>
                    <strong>
                      Device Emulator
                    </strong>
                    <span>
                      <a href="http://barracksiot.github.io/emulator/" target="_blank">See device emulator <i className="fa fa-external-link" /></a>
                    </span>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    )
  }
}

export default AccountView
