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
import CodeMirror from 'react-codemirror'
import printf from 'printf'
require('codemirror/mode/javascript/javascript')

class EditPackagePlanView extends React.Component {
  static propTypes = {
    pkg: React.PropTypes.object,
    plan: React.PropTypes.string,
    getPackagePlan: React.PropTypes.func.isRequired,
    getPackageInfo: React.PropTypes.func.isRequired,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool,
    cleanState: React.PropTypes.func,
    params: React.PropTypes.object,
    onSubmit: React.PropTypes.func,
    router: React.PropTypes.object,
    route: React.PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.initState(props)
  }

  componentWillMount () {
    if (this.props.getPackageInfo) {
      this.props.getPackageInfo(this.props.params.pkgReference)
    }
    if (this.props.getPackagePlan) {
      this.props.getPackagePlan(this.props.params.pkgReference)
    }
  }

  initState (props) {
    this.state = {
      plan: props.plan
    }
  }

  componentWillReceiveProps (nextProps) {
    this.initState(nextProps)
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  componentDidMount () {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.planNotSaved) {
        return 'You didn\'t save your current deployment plan, are you sure you want to leave this page?'
      }
    })
  }

  startHelper () {
    const helperList = [
      {
        title: 'Deployment plan',
        text: '<p>Here goes the query that defines the deployment plan.</p><p>You can look the link below to see how to structurate your JSON.</p>',
        selector: '[data-help="deployment-plan"]',
        position: 'top'
      },
      {
        title: 'Delete you package',
        text: '<p>You can delete your package.</p>',
        selector: '[data-help="delete-package"]',
        position: 'bottom'
      },
      {
        title: 'Overview of your package',
        text: '<p>You can have an overview of your package with some cool charts</p>',
        selector: '[data-help="overview-tab"]',
        position: 'bottom'
      },
      {
        title: 'Versions of your package',
        text: '<p>Here is the place to manage all the deifferent versions of your package</p>',
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
        text: '<p>Let\'s see the versions now.</p>',
        selector: '[data-help="tab-versions"]',
        position: 'top'
      })
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  onFormSubmit (event) {
    event.preventDefault()
    this.setState(Object.assign({}, this.state, { planNotSaved: false }))
    this.props.onSubmit(this.props.pkg.reference, this.state.plan)
  }

  displayTabs () {
    const tabs = [
      {
        id: 'overview',
        label: 'Overview',
        link: '/packages/edit/%s',
        classes: 'tabs-widget__tab',
        datahelp: 'overview-tab'
      },
      {
        id: 'plan',
        label: 'Plan',
        link: '/packages/edit/%s/plan',
        classes: 'tabs-widget__tab tabs-widget__tab--active'
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
        link: '/filters',
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

  onPlanChange (event) {
    let diff = event.target.value
    this.setState(Object.assign({}, this.state, { plan: diff }))

    if (!this.state.planNotSaved) {
      this.setState(Object.assign({}, this.state, { planNotSaved: true }))
    }
  }

  onCodeEditorChange (value) {
    this.onPlanChange({
      target: {
        value: value
      }
    })
  }

  displayPlan () {
    const options = {
      lineNumbers: true,
      mode: 'javascript'
    }

    return (
      <div className="plan">
        <form onSubmit={this.onFormSubmit.bind(this)}>
          <h3>
            <label htmlFor="packagePlan">
              Deployment plan
            </label>
          </h3>
          <div data-help="deployment-plan">
            <CodeMirror placeholder="Add your deployment plan in a JSON format" value={this.state.plan} onChange={this.onCodeEditorChange.bind(this)} options={options} />
          </div>
          <div className="actions">
            <div className="help">
              <a href="https://barracks.io/support/application-management/associate-filters-to-version-to-create-a-deployment-plan/">
                <span className="fa fa-question-circle" />
                How to create a deployment plan?
              </a>
            </div>
            <div className="btn-group btn-group--right">
              <button type="submit" className="btn" disabled={!this.state.planNotSaved}>
                Save Plan
              </button>
            </div>
          </div>
        </form>
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
          <div className="cta">
            <button type="button" className="btn btn--alt btn--danger" data-help="delete-package">
              Delete package
            </button>
          </div>
        </header>
        <div className="content">
          <div className="package">
            {this.displayTabs()}
            <div className="tabView">
              {this.displayPlan()}
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default EditPackagePlanView
