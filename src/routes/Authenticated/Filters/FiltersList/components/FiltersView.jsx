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
import Navigation from 'components/Navigation'
import { Link } from 'react-router'
import pluralize from 'pluralize'

class FiltersView extends React.Component {
  static propTypes = {
    cleanState: React.PropTypes.func.isRequired,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    getFiltersPage: React.PropTypes.func.isRequired,
    items: React.PropTypes.array.isRequired,
    page: React.PropTypes.object,
    tourInProgress: React.PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      currentPage: props.page.number + 1,
      pageField: props.page.number + 1
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      currentPage: nextProps.page.number + 1,
      pageField: nextProps.page.number + 1
    })
  }

  componentWillMount () {
    if (this.props.getFiltersPage) {
      this.props.getFiltersPage()
    }
  }

  componentDidMount () {
    if (this.props.tourInProgress) {
      this.startHelper()
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  startHelper () {
    const helperList = [
      {
        title: 'Filters list',
        text: '<p>On this screen, you can see all the filters you have on Barracks.</p><p>You can click on any filter to see the the query associated.</p>',
        selector: '[data-help="filters-list"]',
        position: 'top'
      }
    ]

    if (this.props.tourInProgress) {
      helperList.push({
        title: 'Create a new filter',
        text: '<p>Let\'s see how to create a filter.</p>',
        selector: '[data-help="create-filter"]',
        position: 'right'
      })
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  changePage (pageNumber) {
    const options = {
      page: pageNumber
    }

    this.props.getFiltersPage(options)
  }

  displayFilters () {
    const items = this.props.items

    if (items.length) {
      return (
        <div className="tiles-list">
          {items.map((filter) => (
            <Link to={`/filters/${filter.name}`} className="tile tile--filter" key={filter.name}>
              <div className="header">
                <h3 className="name">
                  {filter.name}
                </h3>
                <div className="info">
                  <div className="devices">
                    {pluralize('device', filter.deviceCount, true)}
                  </div>
                  <div className="plans">
                    {pluralize('package', filter.deploymentCount, true)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )
    }
  }

  generateNavigation () {
    if (!this.props.page.totalElements || this.props.page.totalElements <= this.props.page.size) {
      return
    }

    return (
      <Navigation
        page={this.props.page}
        currentPage={this.state.currentPage}
        pageField={this.state.pageField}
        getPageByNumber={this.changePage.bind(this)}
      />
    )
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content" data-help="list">
            <h2>
              Filters
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
          <div className="cta">
            <Link to="/filters/create" className="btn btn--alt" data-help="create-filter">
              Create filter
            </Link>
          </div>
        </header>
        <div className="content" data-help="filters-list">
          {this.displayFilters()}
          {this.generateNavigation()}
        </div>
      </main>
    )
  }
}

export default FiltersView
