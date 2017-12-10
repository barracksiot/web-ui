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
import SegmentsList from 'components/SegmentsList'
import { Link } from 'react-router'

class SegmentsView extends React.Component {
  static propTypes = {
    activeSegments: React.PropTypes.array,
    otherSegment: React.PropTypes.object,
    getSegments: React.PropTypes.func.isRequired,
    openSegment: React.PropTypes.func.isRequired,
    cleanState: React.PropTypes.func.isRequired,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool
  }

  componentDidMount () {
    this.props.getSegments()
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
        title: 'Segments list',
        text: '<p>On this screen, you can see all the active segments you have on Barracks.</p><p>You can click on any segment to see the list of devices enrolled into it, along with the updates distributed to thoses devices.</p>',
        selector: '[data-help="active-segments-list"]',
        position: 'top'
      },
      {
        title: 'The "Other" segment',
        text: '<p>This is the "Other" segment.</p><p>It is the default segment. Every device connecting to Barracks will be visible here unless it matches another segment.</p><p>If you happen to disable a segment that already contains some devices, all of them will be moved automatically to the "Other" segment until their next connection.</p>',
        selector: '[data-help="other-segment"]',
        position: 'bottom'
      },
      {
        title: 'Manage your segments',
        text: '<p>You can click here to manage your segments.</p><p>From there, you\'ll be able to create, update, re-order and activate or disactivate any segment</p>',
        selector: '[data-help="manage-segments"]',
        position: 'bottom'
      }
    ]

    if (this.props.tourInProgress) {
      helperList.pop()
      helperList.push({
        title: 'Manage your segments',
        text: '<p>You can click here to manage your segments.</p><p>Let\'s go there</p>',
        selector: '[data-help="manage-segments"]',
        position: 'bottom'
      })
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  segmentClickHanlder (segmentId) {
    this.props.openSegment(segmentId)
  }

  render () {
    const { activeSegments, otherSegment } = this.props

    return (
      <main className="view">
        <header>
          <div className="content" data-help="list">
            <h2>
              Segments
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
          <div className="cta">
            <Link to="/segments/manage" className="btn btn--alt" data-help="manage-segments">
              Manage Segments
            </Link>
          </div>
        </header>
        <div className="content">
          <div className="tiles-list tiles-list--with-funnel" data-help="active-segments-list">
            <SegmentsList segments={activeSegments} otherSegment={otherSegment} onSegmentClick={this.segmentClickHanlder.bind(this)} isDraggable={false} />
          </div>
        </div>
      </main>
    )
  }
}

export default SegmentsView
