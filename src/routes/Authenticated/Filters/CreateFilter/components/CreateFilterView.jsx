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
import List from 'components/List'
require('codemirror/mode/javascript/javascript')

class CreateFilterView extends React.Component {
  static propTypes = {
    getDevicesPage: React.PropTypes.func,
    devices: React.PropTypes.object,
    onSubmit: React.PropTypes.func,
    cleanState: React.PropTypes.func,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    router: React.PropTypes.object,
    route: React.PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.initState(props)
  }

  initState (props) {
    this.state = {
      filter: {},
      filterNotSaved: false
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
        text: '<p>Here go the query that define whether a device should be in the filter or not.</p><p>You can look the link below to see how to structurate your JSON.</p>',
        selector: '[data-help="filter-query"]',
        position: 'bottom'
      },
      {
        title: 'Preview the filter',
        text: '<p>You can preview all devices associated to your filter.</p>',
        selector: '[data-help="preview-filter"]',
        position: 'left'
      },
      {
        title: 'Save the filter',
        text: '<p>When you\'re happy with the query you defined, click here to confirm the filter creation.</p>',
        selector: '[data-help="save-filter"]',
        position: 'left'
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

  onFormSubmit (event) {
    event.preventDefault()
    this.setState(Object.assign({}, this.state, { filterNotSaved: false }))
    this.props.onSubmit(this.state.filter)
  }

  onFilterPropertyChange (event) {
    let diff = {}
    diff[event.target.name] = event.target.value || undefined
    let newFilter = Object.assign({}, this.state.filter, diff)
    this.setState(Object.assign({}, this.state, { filter: newFilter }))

    if (!this.state.filterNotSaved) {
      this.setState(Object.assign({}, this.state, { filterNotSaved: true }))
    }
  }

  onCodeEditorChange (value) {
    this.onFilterPropertyChange({
      target: {
        name: 'query',
        value: value
      }
    })
  }

  onUpdatePreview () {
    this.props.getDevicesPage({ query: this.state.filter.query })
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
      mode: 'javascript'
    }

    return (
      <div className="filter-group">
        <div className="filter-edit">
          <form onSubmit={this.onFormSubmit.bind(this)}>
            <div className="filter-name" data-help="filter-name">
              <h3 className="name">
                <label htmlFor="name">
                  Name
                </label>
              </h3>
              <input type="text" name="name" id="name" placeholder="Add a filter name" required pattern="^[\x21-\x7E]+$" maxLength="50" value={this.state.filter.name} onChange={this.onFilterPropertyChange.bind(this)} />
            </div>
            <div className="filter-query" data-help="filter-query">
              <h3>
                <label htmlFor="query">
                  Query
                </label>
              </h3>
              <CodeMirror value={this.state.filter.query} onChange={this.onCodeEditorChange.bind(this)} options={options} />
            </div>
            <div className="actions">
              <div className="help">
                <a href="https://barracks.io/support/application-management/filters-what-are-they-how-to-use-them/">
                  <span className="fa fa-question-circle" />
                  How to create a filter query?
                </a>
              </div>
              <div className="btn-group btn-group--right">
                <button type="button" className="btn btn--alt" onClick={this.onUpdatePreview.bind(this)} data-help="preview-filter">
                  Update preview
                </button>
                <button type="submit" className="btn" data-help="save-filter" disabled={!this.state.filterNotSaved}>
                  Save filter
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
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
            onItemClick={this.props.devices.onItemClick}
          />
        </div>
      )
    } else if (this.props.devices.page && this.props.devices.page.totalElements === 0) {
      return (
        <div className="filter-preview">
          <h3>
            No results found
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
            <Link to="/filters" className="back">&lt; Back to all filters</Link>
            <h2>
              Create filter
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
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

export default CreateFilterView
