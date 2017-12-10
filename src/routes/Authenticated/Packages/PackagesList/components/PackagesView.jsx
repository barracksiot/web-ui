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

class PackagesView extends React.Component {
  static propTypes = {
    cleanState: React.PropTypes.func.isRequired,
    getPackagesPage: React.PropTypes.func.isRequired,
    items: React.PropTypes.array.isRequired,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool
  }

  componentDidMount () {
    if (this.props.tourInProgress) {
      this.startHelper()
    }
  }

  componentWillMount () {
    if (this.props.getPackagesPage) {
      this.props.getPackagesPage()
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  startHelper () {
    const helperList = [
      {
        title: 'Packages list',
        text: '<p>On this screen, you can see all the packages you manage with Barracks. You can click on a package to open it and edit its informations and access its versions</p>',
        selector: '[data-help="list"]',
        position: 'top'
      },
      {
        title: 'Create a package',
        text: '<p>Click here to create a new package.</p>',
        selector: '[data-help="create-packages"]',
        position: 'bottom'
      }
    ]

    if (this.props.tourInProgress) {
      helperList.pop()
      helperList.push({})
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  generatePackages () {
    const pkgs = this.props.items

    if (pkgs.length) {
      return (
        <div className="tiles-list--packages" data-help="list">
          {pkgs.map((pkg) => (
            <Link to={`/packages/edit/${pkg.reference}`} className="tile tile--package" key={pkg.reference}>
              <div className="header">
                <h3 className="name">
                  {pkg.name}
                </h3>
                <div className="info">
                  <div className="reference">
                    {pkg.reference}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )
    }
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content" data-help="list">
            <h2>
              Packages
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
          <div className="cta">
            <Link to="/packages/create" className="btn btn--alt" data-help="create-packages">
              Create package
            </Link>
          </div>
        </header>
        <div className="content">
          {this.generatePackages()}
        </div>
      </main>
    )
  }
}

export default PackagesView
