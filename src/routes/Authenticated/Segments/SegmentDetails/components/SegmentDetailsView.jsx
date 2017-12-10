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

class SegmentDetailsView extends React.Component {
  static propTypes = {
    titles: React.PropTypes.array.isRequired,
    items: React.PropTypes.array.isRequired,
    getDevicesPage: React.PropTypes.func.isRequired,
    getSegment: React.PropTypes.func.isRequired,
    segment: React.PropTypes.object,
    page: React.PropTypes.object,
    sort: React.PropTypes.object,
    clickableColumns: React.PropTypes.array,
    sortableColumns: React.PropTypes.array,
    cleanState: React.PropTypes.func,
    onItemClick: React.PropTypes.func,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    params: React.PropTypes.object
  }

  componentWillMount () {
    this.props.getDevicesPage(this.props.params.segmentId)
    this.props.getSegment(this.props.params.segmentId)
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  startHelper () {
    const helperList = [
      {
        title: 'Segment detail page',
        text: '<p>This is the section where you can see all devices enrolled in the segment.</p>',
        selector: '[data-help="device-list"]',
        position: 'bottom'
      }
    ]

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  sortDevices (property, direction) {
    const options = {
      page: 0,
      sort: {
        property,
        direction
      }
    }

    this.props.getDevicesPage(this.props.params.segmentId, options)
  }

  changePage (pageNumber) {
    const options = {
      page: pageNumber
    }

    options.sort = this.props.sort || undefined
    this.props.getDevicesPage(this.props.params.segmentId, options)
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <Link to="/segments" className="back">&lt; Back to segments list</Link>
            <h2>
              {this.props.segment ? this.props.segment.name : ''} segment
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
        </header>
        <div className="content">
          <div data-help="device-list">
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
        </div>
      </main>
    )
  }
}

export default SegmentDetailsView
