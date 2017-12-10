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
import urls from 'config/urls.json'

class AccountView extends React.Component {
  static propTypes = {
    profile: React.PropTypes.shape({
      firstName: React.PropTypes.string,
      lastName: React.PropTypes.string,
      email: React.PropTypes.string,
      apiKey: React.PropTypes.string
    }),
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

  startHelper () {
    const helperList = [
      {
        text: '<p>This is your basic informations.</p>',
        selector: '[data-help="user-info"]',
        position: 'right'
      },
      {
        text: '<p>This is all informations you need about Barracks API</p>',
        selector: '[data-help="api-info"]',
        position: 'right'
      },
      {
        text: '<p>Here is the current version of Barracks. You can switch in the left menu.</p>',
        selector: '[data-help="app-version"]',
        position: 'bottom'
      },
      {
        text: '<p>Here is your API Key, please don\'t share it with everybody.</p>',
        selector: '[data-help="api-key"]',
        position: 'bottom'
      },
      {
        text: '<p>And if you need any help, don\'t hesitate to visit our support page.</p>',
        selector: '[data-help="support-page"]',
        position: 'bottom'
      },
      {
        text: '<p>Don\'t forget, we have some SDK examples. If you already implemented one on your devices, let\'s continue.</p><p>Otherwise, we advise you to implement a SDK.</p>',
        selector: '[data-help="sdk-info"]',
        position: 'left'
      },
      {
        text: '<p>You can find here some usefull tools</p>',
        selector: '[data-help="tools"]',
        position: 'left'
      },
      {
        text: '<p>If you want to automate things, you can try our CLI tool for Barracks.</p>',
        selector: '[data-help="cli-tool"]',
        position: 'left'
      }
    ]

    if (this.props.tourInProgress) {
      helperList.push({
        text: '<p>The tour has finished, we go back to support page.</p>',
        selector: '[data-help="page-support"]',
        position: 'right'
      })
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  copyApiKey (event) {
    event.target.select()
    document.execCommand('copy')
    const that = this
    this.setState(Object.assign({}, this.state, { isCopied: true }))
    setTimeout(function () {
      that.setState(Object.assign({}, that.state, { isCopied: false }))
    }, 3000)
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
              <div className="basic" data-help="user-info">

                <h3>
                  User informations
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

              </div>
              <div data-help="api-info">

                <h3>
                  API informations
                </h3>

                <div className="api" data-help="app-version">
                  <p>
                    <strong>
                      Application version
                    </strong>
                    <span className="app-version">
                      {process.env.APP_VERSION} <span className="experimental">experimental</span>
                    </span>
                  </p>
                </div>

                <div className={this.state.isCopied ? 'apiKey copied' : 'apiKey'} data-help="api-key">
                  <p>
                    <strong>
                      API Key
                    </strong>
                    <textarea rows="3" value={this.state.profile.apiKey} onClick={this.copyApiKey.bind(this)} readOnly spellCheck="false" />
                    <em> click to copy</em>
                  </p>
                </div>

                <div className="api" data-help="support-page">
                  <p>
                    <strong>
                      Documentation
                    </strong>
                    <span>
                      See <a href={urls.documentation.root} target="_blank">our&nbsp;full&nbsp;documentation</a> or <a href={urls.website.root} target="_blank">contact&nbsp;us</a>
                    </span>
                  </p>
                </div>

                <div className="api" data-help="support-page">
                  <p>
                    <strong>
                      API references
                    </strong>
                    <span>
                      <a href={urls.documentation.services.authorization} target="_blank">Authentication&nbsp;API<i className="fa fa-external-link" /></a>
                    </span>
                    <span>
                      <a href={urls.documentation.services.member} target="_blank">Management&nbsp;API<i className="fa fa-external-link" /></a>
                    </span>
                    <span>
                      <a href={urls.documentation.services.device} target="_blank">Device&nbsp;API<i className="fa fa-external-link" /></a>
                    </span>
                  </p>
                </div>

              </div>

              <div data-help="sdk-info">
                <h3>
                  SDK
                </h3>

                <div className="api">
                  <p>
                    <strong>
                      JavaScript SDK
                    </strong>
                    <span>
                      <a href={urls.github.javascriptV2} target="_blank">See GitHub repo <i className="fa fa-external-link" /></a>
                    </span>
                    <span>
                      <a href={urls.github.javascriptDocumentationV2} target="_blank">See documentation <i className="fa fa-external-link" /></a>
                    </span>
                  </p>
                </div>

              </div>

              <div data-help="tools">
                <h3>
                  Tools
                </h3>

                <div className="api" data-help="cli-tool">
                  <p>
                    <strong>
                      Barracks CLI
                    </strong>
                    <span>
                      <a href={urls.github.cliGithub} target="_blank">See GitHub repo <i className="fa fa-external-link" /></a>
                    </span>
                    <span>
                      <a href={urls.github.cliNpm} target="_blank">Go to npm page <i className="fa fa-external-link" /></a>
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
