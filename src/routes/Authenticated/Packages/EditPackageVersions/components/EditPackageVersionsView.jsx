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
import List from 'components/List'
import Tabs from 'components/Tabs'
import printf from 'printf'
import urls from 'config/urls.json'

class EditPackageVersionsView extends React.Component {
  static propTypes = {
    pkg: React.PropTypes.object,
    titles: React.PropTypes.array.isRequired,
    items: React.PropTypes.array.isRequired,
    getPackageVersionsPage: React.PropTypes.func.isRequired,
    getPackageInfo: React.PropTypes.func.isRequired,
    page: React.PropTypes.object,
    sort: React.PropTypes.object,
    clickableColumns: React.PropTypes.array,
    sortableColumns: React.PropTypes.array,
    package: React.PropTypes.object,
    cleanState: React.PropTypes.func,
    onItemClick: React.PropTypes.func,
    params: React.PropTypes.object,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool
  }

  componentWillMount () {
    if (this.props.getPackageInfo) {
      this.props.getPackageInfo(this.props.params.pkgReference)
    }
    if (this.props.getPackageVersionsPage) {
      this.props.getPackageVersionsPage(this.props.params.pkgReference)
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  startHelper () {
    const helperList = [
      {
        title: 'Versions list',
        text: '<p>This is all the different versions of your package. </p>',
        selector: '[data-help="versions"]',
        position: 'bottom'
      },
      {
        title: 'Create a version',
        text: '<p>Click on this button to create a new version of your package</p>',
        selector: '[data-help="create-version"]',
        position: 'left'
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
        title: 'Plan tab',
        text: '<p>This section is where you manage your deployment plan.</p>',
        selector: '[data-help="plan-tab"]',
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
        text: '<p>Let\'s see the filters  now.</p>',
        selector: '[data-help="filters-tab"]',
        position: 'top'
      })
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  sortVersions (property, direction) {
    const options = {
      page: 0,
      sort: {
        property,
        direction
      }
    }

    this.props.getPackageVersionsPage(this.props.params.pkgReference, options)
  }

  changePage (pageNumber) {
    const options = {
      page: pageNumber
    }

    options.sort = this.props.sort || undefined
    this.props.getPackageVersionsPage(this.props.params.pkgReference, options)
  }

  onItemClick (version) {
    this.props.onItemClick(this.props.params.pkgReference, version)
  }

  displayTabs () {
    const tabs = [
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
        classes: 'tabs-widget__tab tabs-widget__tab--active'
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

  displayVersions () {
    const url = `/packages/edit/${this.props.params.pkgReference}/versions/create`

    return (
      <div className="versions" data-help="versions">
        <List
          titles={this.props.titles}
          items={this.props.items}
          page={this.props.page}
          sort={this.props.sort}
          sortByProperty={this.sortVersions.bind(this)}
          getPageByNumber={this.changePage.bind(this)}
          sortableColumns={this.props.sortableColumns}
          clickableColumns={this.props.clickableColumns}
          onItemClick={this.onItemClick.bind(this)}
        />
        <div className="actions">
          <Link to={url} className="btn btn--circle" data-help="create-version">
            <span className="fa fa-plus" />
          </Link>
        </div>
      </div>
    )
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <Link to={urls.routes.packages} className="back">&lt; Back to packages</Link>
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
            <div className="tabView">
              {this.displayVersions()}
            </div>
          </div>
        </div>
      </main>
    )
  }

}

export default EditPackageVersionsView
