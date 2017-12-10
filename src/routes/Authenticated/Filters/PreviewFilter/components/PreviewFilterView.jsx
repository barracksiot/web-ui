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
import pluralize from 'pluralize'
import CodeMirror from 'react-codemirror'
require('codemirror/mode/javascript/javascript')
import List from 'components/List'
import urls from 'config/urls.json'

class PreviewFilterView extends React.Component {
  static propTypes = {
    getFilterPage: React.PropTypes.func,
    getFilterPackages: React.PropTypes.func,
    getDevicesPage: React.PropTypes.func,
    onItemClick: React.PropTypes.func,
    devices: React.PropTypes.object,
    filter: React.PropTypes.object,
    filterPackages: React.PropTypes.array,
    onUpdatePreview: React.PropTypes.func,
    deleteFilter: React.PropTypes.func,
    cleanState: React.PropTypes.func,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    router: React.PropTypes.object,
    route: React.PropTypes.object,
    params: React.PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.initState(props)
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.filter !== nextProps.filter) {
      this.initState(nextProps)

      if (this.props.getDevicesPage) {
        this.props.getDevicesPage({ query: this.state.filter.query })
      }

      if (this.props.getFilterPackages) {
        this.props.getFilterPackages(this.state.filter.name)
      }
    }
  }

  initState (props) {
    this.state = {
      filter: {},
      filterNotSaved: false
    }

    if (props.filter) {
      this.state = Object.assign({}, this.state, {
        filter: props.filter
      })
    }
  }

  componentWillMount () {
    if (this.props.getFilterPage) {
      this.props.getFilterPage(this.props.params.filterName)
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  componentDidMount () {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.filterNotSaved) {
        return 'You didn\'t save your current filter, are you sure you want to leave this page?'
      }
    })
  }

  startHelper () {
    const helperList = [
      {
        title: 'Create a new filter',
        text: '<p>Here goes the name of your new filter.</p>',
        selector: '[data-help="filter-name"]',
        position: 'bottom'
      },
      {
        title: 'Filter query',
        text: '<p>Here goes the query that defines whether a device should be in the filter or not.</p><p>You can look the link below to see how is structurated the JSON.</p>',
        selector: '[data-help="filter-query"]',
        position: 'bottom'
      },
      {
        title: 'Preview',
        text: '<p>You can see here all devices associated to your filter query.</p>',
        selector: '[data-help="preview"]',
        position: 'top'
      }
    ]

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  deleteFilterHandler () {
    this.props.deleteFilter(this.props.filter.name)
  }

  sortDevices (property, direction) {
    const options = {
      page: 0,
      sort: {
        property,
        direction
      }
    }

    this.getDevicesPage(options)
  }

  changePage (pageNumber) {
    const options = {
      page: pageNumber
    }

    this.getDevicesPage(options)
  }

  getDevicesPage (options) {
    options.sort = options.sort || this.props.devices.sort || undefined
    options.query = this.state.filter.query || undefined
    this.props.getDevicesPage(options)
  }

  getFilter () {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      readOnly: 'nocursor'
    }

    return (
      <div className="filter-group">
        <div className="filter-edit">
          <div className="filter-query" data-help="filter-query">
            <h3>
              <label htmlFor="query">
                Query
              </label>
            </h3>
            <CodeMirror value={this.state.filter.query} options={options} />
          </div>
        </div>
        <aside className="filter-plans">
          {this.getFilterPlans()}
        </aside>
      </div>
    )
  }

  getFilterPlans () {
    if (this.props.filterPackages) {
      const title = this.props.filterPackages[0] ? 'Associated packages' : 'No Associated packages'
      const pkgs = this.props.filterPackages.map(function (pkg) {
        return <li key={pkg}><Link to={`/packages/edit/${pkg}/plan`}>{pkg}</Link></li>
      })
      return (
        <div>
          <h3>
            {title}
          </h3>
          <ul>
            {pkgs}
          </ul>
        </div>
      )
    }
  }

  getFilterPreview () {
    if (this.props.devices.page && this.props.devices.page.totalElements > 0) {
      return (
        <div className="filter-preview">
          <h3>
            Preview <span>({pluralize('device', this.props.devices.page.totalElements, true)})</span>
          </h3>

          <List
            titles={this.props.devices.titles}
            items={this.props.devices.pageDevices}
            page={this.props.devices.page}
            sort={this.props.devices.sort}
            sortByProperty={this.sortDevices.bind(this)}
            getPageByNumber={this.changePage.bind(this)}
            sortableColumns={this.props.devices.sortableColumns}
            clickableColumns={this.props.devices.clickableColumns}
            onItemClick={this.props.onItemClick}
          />
        </div>
      )
    } else if (this.props.devices.page && this.props.devices.page.totalElements === 0) {
      return (
        <div className="filter-preview">
          <h3>
            No devices found
          </h3>
        </div>
      )
    } else {
      return (
        <div className="filter-preview">
          <h3>
            No preview available
          </h3>
        </div>
      )
    }
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <Link to={urls.routes.filters} className="back">&lt; Back to all filters</Link>
            <h2>
              Preview {this.props.params.filterName} filter
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
          <div className="cta">
            <button type="button" className="btn btn--alt btn--danger" value="draft" onClick={this.deleteFilterHandler.bind(this)}>
              Delete filter
            </button>
          </div>
        </header>
        <div className="content">
          <div className="filter">
            {this.getFilter()}
            <div data-help="preview">
              {this.getFilterPreview()}
            </div>
          </div>
        </div>
      </main>
    )
  }

}

export default PreviewFilterView
