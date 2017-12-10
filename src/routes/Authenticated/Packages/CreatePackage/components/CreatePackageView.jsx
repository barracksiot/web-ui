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
import { Link } from 'react-router'
import urls from 'config/urls.json'

class CreatePackageView extends React.Component {
  static propTypes = {
    cleanState: React.PropTypes.func,
    onSubmit: React.PropTypes.func.isRequired,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    router: React.PropTypes.object,
    route: React.PropTypes.object,
    tourInProgress: React.PropTypes.bool
  }

  constructor (props, context) {
    super(props, context)
    this.initState(props)
  }

  initState (props) {
    this.state = {
      pkg: {},
      pkgNotSaved: false
    }
  }

  componentDidMount () {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.pkgNotSaved) {
        return 'You didn\'t save your current package, are you sure you want to leave this page?'
      }
    })

    if (this.props.tourInProgress) {
      this.startHelper()
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  onFormSubmit (event) {
    event.preventDefault()
    this.setState(Object.assign({}, this.state, { pkgNotSaved: false }))
    this.props.onSubmit(this.state.pkg)
  }

  onPkgPropertyChange (event) {
    let diff = {}
    diff[event.target.name] = event.target.value || undefined
    let newPkg = Object.assign({}, this.state.pkg, diff)
    this.setState(Object.assign({}, this.state, { pkg: newPkg }))

    if (!this.state.pkgNotSaved) {
      this.setState(Object.assign({}, this.state, { pkgNotSaved: true }))
    }
  }

  startHelper () {
    const helperList = [
      {
        title: 'Name',
        text: '<p>You have to give a name to your package. This name will be only used for you to understand the content of the package. For example: "MyTracker"</p>',
        selector: '[data-help="package-name"]',
        position: 'right'
      },
      {
        title: 'Reference',
        text: '<p>This is the most important field of your package. This will be the unique identifier for your package. For example: "com.mysolution.mytrackerapp"</p>',
        selector: '[data-help="package-reference"]',
        position: 'right'
      },
      {
        title: 'Description',
        text: '<p>This is the description of the package. Again, it\'s only for you, to know what is your package and its features.</p>',
        selector: '[data-help="package-description"]',
        position: 'right'
      }
    ]

    if (this.props.tourInProgress) {
      helperList.push({
        text: '<p>This is the Devices page</p><p>Let\'s go there.</p>',
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
            <Link to={urls.routes.packages} className="back">&lt; Back to all packages</Link>
            <h2>
              Create a new Package
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
        </header>
        <div className="content">
          <div className="package">
            <div className="tabView">

              <div className="plan">
                <form onSubmit={this.onFormSubmit.bind(this)}>
                  <div className="package-name" data-help="package-name">
                    <h3>
                      <label htmlFor="name">
                        Name
                      </label>
                    </h3>
                    <input type="text" name="name" placeholder="Add a package name" required maxLength="144" value={this.state.pkg.name} onChange={this.onPkgPropertyChange.bind(this)} />
                  </div>
                  <div className="package-reference" data-help="package-reference">
                    <h3>
                      <label htmlFor="pkgReference">
                        Reference
                      </label>
                    </h3>
                    <input type="text" name="reference" id="pkgReference" placeholder="e.g. io.barracks.example" pattern="^[\x21-\x7E]+$" required value={this.state.pkg.reference} onChange={this.onPkgPropertyChange.bind(this)} />
                  </div>
                  <div className="package-description" data-help="package-description">
                    <h3>
                      <label htmlFor="packageDescription">
                        Description
                      </label>
                    </h3>
                    <textarea name="description" id="packageDescription" placeholder="Describe your package" maxLength="500" value={this.state.pkg.description} onChange={this.onPkgPropertyChange.bind(this)} />
                  </div>
                  <div className="actions">
                    <div className="btn-group btn-group--right">
                      <button type="submit" className="btn">
                        Create package
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </main>
    )
  }

}

export default CreatePackageView
