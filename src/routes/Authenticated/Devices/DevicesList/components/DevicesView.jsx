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
import pluralize from 'pluralize'
import List from 'components/List'

class DevicesView extends React.Component {
  static propTypes = {
    titles: React.PropTypes.array.isRequired,
    items: React.PropTypes.array.isRequired,
    getDevicesPage: React.PropTypes.func.isRequired,
    page: React.PropTypes.object,
    filter: React.PropTypes.object,
    sort: React.PropTypes.object,
    onItemClick: React.PropTypes.func.isRequired,
    clickableColumns: React.PropTypes.array,
    sortableColumns: React.PropTypes.array,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = props.filter ? { deviceFilter: props.filter } : { deviceFilter: '' }
  }

  componentWillMount () {
    this.state.deviceFilter ? this.filterDeviceSubmit() : this.props.getDevicesPage()
  }

  componentDidMount () {
    if (this.props.tourInProgress) {
      this.startHelper()
    }
  }

  startHelper () {
    const helperList = [
      {
        title: 'Devices list',
        text: '<p>You have the list of the devices enrolled with Barracks. You can display 50 of them on each page. If you click on a device, you\'ll have the device history.</p>',
        selector: '[data-help="list"]',
        position: 'middle'
      },
      {
        title: 'Devices filter',
        text: '<p>You can filter the fields list by unit id.</p>',
        selector: '[data-help="filter"]',
        position: 'left'
      }
    ]

    if (this.props.tourInProgress) {
      helperList.push({
        text: '<p>This is the Filters page</p><p>Let\'s go there.</p>',
        selector: '[data-help="page-filters"]',
        position: 'right'
      })
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  onUpdateDeviceFilter (event) {
    this.setState(Object.assign({}, this.state, { deviceFilter: event.target.value }))
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

  filterDeviceSubmit (event) {
    if (event) {
      event.preventDefault()
    }

    const options = {
      page: 0
    }

    this.getDevicesPage(options)
  }

  getDevicesPage (options) {
    options.sort = options.sort || this.props.sort || undefined
    options.query = this.state.deviceFilter ? { regex: { 'unitId': '.*' + this.state.deviceFilter + '.*' } } : undefined
    options.filter = this.state.deviceFilter || undefined
    this.props.getDevicesPage(options)
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <h2>
              {pluralize('Device', this.props.page.totalElements, true)}
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
          <form className="filter-form" data-help="filter" onSubmit={this.filterDeviceSubmit.bind(this)}>
            <div className="form__item">
              <div className="input">
                <input
                  type="text"
                  name="deviceFilter"
                  value={this.state.deviceFilter}
                  onChange={this.onUpdateDeviceFilter.bind(this)}
                />
              </div>
            </div>
            <button type="submit" className="btn">
              Filter
            </button>
          </form>
        </header>
        <div className="content" data-help="list">
          <List
            titles={this.props.titles}
            items={this.props.items}
            page={this.props.page}
            sort={this.props.sort}
            sortByProperty={this.sortDevices.bind(this)}
            getPageByNumber={this.changePage.bind(this)}
            sortableColumns={this.props.sortableColumns}
            clickableColumns={this.props.clickableColumns}
            onItemClick={this.props.onItemClick}
          />
        </div>
      </main>
    )
  }

}

export default DevicesView
