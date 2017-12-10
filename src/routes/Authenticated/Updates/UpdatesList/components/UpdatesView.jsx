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
import List from 'components/List'
import { Link } from 'react-router'

class UpdatesView extends React.Component {
  static propTypes = {
    titles: React.PropTypes.array.isRequired,
    items: React.PropTypes.array.isRequired,
    getUpdatesPage: React.PropTypes.func.isRequired,
    page: React.PropTypes.object,
    sort: React.PropTypes.object,
    clickableColumns: React.PropTypes.array,
    sortableColumns: React.PropTypes.array,
    cleanState: React.PropTypes.func.isRequired,
    onItemClick: React.PropTypes.func.isRequired,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool
  }

  componentWillMount () {
    if (this.props.getUpdatesPage) {
      this.props.getUpdatesPage()
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  componentDidMount () {
    if (this.props.tourInProgress) {
      this.startHelper()
    }
  }

  startHelper () {
    let helperList = [
      {
        title: 'Updates list',
        text: '<p>On this screen, you can see all the update you have on Barracks.</p><p>They can have 3 status: Draft, Published and Archive.</p><ul><li>If an update is published, it will be pushed to your devices.</li><li>If an update is "Draft", then it\'s not pushed.</li><li>If an update is "Archive" that means it has been published then stopped.</li></ul>',
        selector: '[data-help="list"]',
        position: 'top'
      },
      {
        title: 'Create an update',
        text: '<p>You can click here to create a new update.</p>',
        selector: '[data-help="create-update"]',
        position: 'bottom'
      }
    ]

    if (this.props.tourInProgress) {
      helperList.pop()
      helperList.push({
        title: 'Create an update',
        text: '<p>You can click here to create a new update.</p><p>Let\'s go there</p>',
        selector: '[data-help="create-update"]',
        position: 'bottom'
      })
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  sortUpdates (property, direction) {
    const options = {
      page: 0,
      sort: {
        property,
        direction
      }
    }

    this.props.getUpdatesPage(options)
  }

  changePage (pageNumber) {
    const options = {
      page: pageNumber
    }

    options.sort = this.props.sort || undefined
    this.props.getUpdatesPage(options)
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <h2>
              Updates
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
          <div className="cta">
            <Link to="/updates/create" className="btn btn--alt" data-help="create-update">
              Create an update
            </Link>
          </div>
        </header>
        <div className="content">
          <List
            titles={this.props.titles}
            items={this.props.items}
            page={this.props.page}
            sort={this.props.sort}
            sortByProperty={this.sortUpdates.bind(this)}
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

export default UpdatesView
