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
import Tabs from 'components/Tabs'
import printf from 'printf'
import urls from 'config/urls.json'

class EditPackageOverviewView extends React.Component {
  static propTypes = {
    package: React.PropTypes.object,
    tabs: React.PropTypes.array,
    getPackageOverviewPage: React.PropTypes.func,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool,
    pkg: React.PropTypes.object,
    cleanState: React.PropTypes.func,
    params: React.PropTypes.object
  }

  componentWillMount () {
    if (this.props.getPackageOverviewPage) {
      this.props.getPackageOverviewPage(this.props.params.pkgReference)
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  startHelper () {
    const helperList = [
      {
        title: 'Overview',
        text: '<p>You can have an overview of your package with some cool charts</p>',
        selector: '[data-help="overview"]',
        position: 'top'
      },
      {
        title: 'Delete you package',
        text: '<p>You can delete your package.</p>',
        selector: '[data-help="delete-package"]',
        position: 'bottom'
      },
      {
        title: 'Plan tab',
        text: '<p>This section is where you manage your deployment plan.</p>',
        selector: '[data-help="plan-tab"]',
        position: 'bottom'
      },
      {
        title: 'Versions of your package',
        text: '<p>This section is the place to manage all the different versions of your package</p>',
        selector: '[data-help="versions-tab"]',
        position: 'bottom'
      },
      {
        title: 'Go to Filters',
        text: '<p>A simple shortcut to the filters so you be sure when composing your deployment plan.</p>',
        selector: '[data-help="filters-tab"]',
        position: 'bottom'
      }
    ]

    if (this.props.tourInProgress) {
      helperList.push({
        text: '<p>Let\'s see the deployment plan now.</p>',
        selector: '[data-help="plan-tab"]',
        position: 'top'
      })
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  displayTabs () {
    const tabs = [
      {
        id: 'overview',
        label: 'Overview',
        link: '/packages/edit/%s',
        classes: 'tabs-widget__tab tabs-widget__tab--active'
      },
      {
        id: 'plan',
        label: 'Plan',
        link: '/packages/edit/%s/plan',
        classes: 'tabs-widget__tab',
        datahelp: 'plan-tab'
      },
      {
        id: 'versions',
        label: 'Versions',
        link: '/packages/edit/%s/versions',
        classes: 'tabs-widget__tab',
        datahelp: 'versions-tab'
      },
      {
        id: 'filters',
        label: 'Filters',
        link: urls.routes.filters,
        classes: 'tabs-widget__link',
        datahelp: 'filters-tab'
      }
    ]

    const ref = this.props.params.pkgReference
    tabs.forEach(function (tab) {
      tab.link = printf(tab.link, ref)
    })

    return (
      <Tabs tabs={tabs} />
    )
  }

  displayOverview () {
    return (
      <div className="overview">
        <p>
          Some cool charts or usefull info here.
        </p>
      </div>
    )
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <Link to="/packages" className="back">&lt; Back to packages</Link>
            <h2>
              {this.props.pkg.name || ' '}
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
            <h3>
              {this.props.pkg.reference || ' '}
            </h3>
          </div>
        </header>
        <div className="content">
          <div className="package">
            {this.displayTabs()}
            <div className="tabView" data-help="overview">
              {this.displayOverview()}
            </div>
          </div>
        </div>
      </main>
    )
  }

}

export default EditPackageOverviewView
