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
import { withRouter, Link } from 'react-router'
import { EditSegment } from 'components/EditSegment'

class ManageSegmentsView extends React.Component {
  static propTypes = {
    activeSegments: React.PropTypes.array,
    inactiveSegments: React.PropTypes.array,
    getSegments: React.PropTypes.func.isRequired,
    createSegment: React.PropTypes.func.isRequired,
    cleanState: React.PropTypes.func,
    updateActiveSegmentsOrder: React.PropTypes.func,
    updateSegment: React.PropTypes.func,
    setHelperSteps: React.PropTypes.func.isRequired,
    segmentsList: React.PropTypes.array,
    startHelper: React.PropTypes.func.isRequired,
    route: React.PropTypes.object,
    router: React.PropTypes.object,
    tourInProgress: React.PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      segment: {
        comparisonType: 'eq'
      },
      activeSegments: [],
      inactiveSegments: [],
      segmentOrderNotSaved: false
    }
  }

  componentDidMount () {
    this.props.getSegments()

    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.segmentOrderNotSaved) {
        return 'You didn\'t save the new segments order, are you sure you want to leave this page?'
      }
    })

    if (this.props.tourInProgress) {
      this.startHelper()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.segmentsList !== this.props.segmentsList) {
      this.setState({
        creationInProgress: false
      })
    }
    this.setState({
      activeSegments: nextProps.activeSegments,
      inactiveSegments: nextProps.inactiveSegments,
      segmentOrderNotSaved: false,
      creationInProgress: false,
      editInProgress: undefined
    })
  }

  startHelper () {
    let helperList = []
    if (this.state.creationInProgress || this.state.editInProgress) {
      helperList = [
        {
          title: 'Create a new segment',
          text: '<p>Here goes the name of your new segment.</p>',
          selector: '[data-help="segment-name"]',
          position: 'bottom'
        },
        {
          title: 'Segmentation rules',
          text: '<p>Here go the rules that define whether a device should be in the segment or not.</p><p>You can select the criteria to check from the device payload, the type of condition to use, and wich value the data should be compared against.</p>',
          selector: '[data-help="segment-rules"]',
          position: 'bottom'
        },
        {
          title: 'Add a rule',
          text: '<p>You can add as many rules as you need to define your segment.</p>',
          selector: '[data-help="segment-add-rule"]',
          position: 'left'
        },
        {
          title: 'Save the segment',
          text: '<p>When you\'re happy with the rules you defined, click here to confirm the segment creation.</p><p>When created, the segment is inactive by default. Just go to the manage segment page to activate it by moving it to the active segment list.</p>',
          selector: '[data-help="save-segment"]',
          position: 'left'
        }
      ]
    } else {
      helperList = [
        {
          title: 'Manage your segments',
          text: '<p>Here you can manage all your segments.</p><p>You can activate or disable any segment by moving them in the active or inactive list.</p>',
          selector: '[data-help="drag-and-drop-zone"]',
          position: 'top'
        },
        {
          title: 'Active segments',
          text: '<p>All segments in this list are used to sort your devices when they contact Barracks.</p><p>Using drag and drop, you can manage the priority order of those segments. When a device connect to Barrakcs, it will be assigned to the first segment that matches the device data.</p>',
          selector: '[data-help="active-segments-list"]',
          position: 'right'
        },
        {
          title: 'Inactive segments',
          text: '<p>You can disable a segment anytime by dragging it in here.</p><p>You can enable an inactive segment at anytime by moving it to the active segments list.</p>',
          selector: '[data-help="inactive-segments-list"]',
          position: 'left'
        },
        {
          title: 'Save order',
          text: '<p>Once you\'re done organizing your segments, click here to save the changes you made.</p>',
          selector: '[data-help="save-order"]',
          position: 'bottom'
        },
        {
          title: 'Need more segments ?',
          text: '<p>Click here to create a new segment.</p><p>All newly created segments are added by default in the inactive list.</p>',
          selector: '[data-help="create-segment"]',
          position: 'bottom'
        }
      ]
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  createSegment (segment) {
    this.props.createSegment(segment)
  }

  cancelSegmentEdition () {
    this.setState({
      creationInProgress: false,
      editInProgress: undefined
    })
  }

  updateSegment (segment) {
    this.props.updateSegment(segment)
  }

  displaySegmentForm () {
    var saveHandler
    if (this.state.creationInProgress) {
      saveHandler = this.createSegment
    } else if (this.state.editInProgress) {
      saveHandler = this.updateSegment
    }
    if (saveHandler) {
      return <EditSegment segment={this.state.editInProgress} onSave={saveHandler.bind(this)} onCancel={this.cancelSegmentEdition.bind(this)} />
    }
  }

  onAddSegmentClick (event) {
    this.setState({
      creationInProgress: true
    })
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  moveSegmentToAnotherList (sourceListStateKey, targetListStateKey, segment) {
    const sourceList = this.state[sourceListStateKey]
    const targetList = this.state[targetListStateKey]
    const alreadyExists = targetList.some(item => item.id === segment.id)
    if (!alreadyExists) {
      this.setState({
        [targetListStateKey]: targetList.concat(segment),
        [sourceListStateKey]: sourceList.filter(item => item.id !== segment.id)
      })
    }
  }

  changeListOrder (listStateKey, sourceSegment, targetSegment) {
    const segments = this.state[listStateKey]
    const sourceIndex = segments.findIndex(element => element.id === sourceSegment.id)
    const segment = segments.splice(sourceIndex, 1)[0]
    const targetIndex = segments.findIndex(element => element.id === targetSegment.id)
    if (sourceIndex > targetIndex) {
      segments.splice(targetIndex, 0, segment)
    } else {
      segments.splice(targetIndex + 1, 0, segment)
    }
    this.setState({
      [listStateKey]: segments
    })
  }

  activeSegmentHoverHandler (source, target) {
    if (!target) {
      this.moveSegmentToAnotherList('inactiveSegments', 'activeSegments', Object.assign({}, source, { notDropped: true }))
    } else {
      this.changeListOrder('activeSegments', source, target)
    }
  }

  inactiveSegmentsHoverHandler (source, target) {
    if (!target) {
      this.moveSegmentToAnotherList('activeSegments', 'inactiveSegments', Object.assign({}, source, { notDropped: true }))
    } else {
      this.changeListOrder('inactiveSegments', source, target)
    }
  }

  activeSegmentDropHandler (source) {
    const { activeSegments } = this.state
    this.setState({
      activeSegments: activeSegments.map(item => {
        if (source.id === item.id) {
          item.notDropped = false
        }
        return item
      }),
      segmentOrderNotSaved: true
    })
  }

  inactiveSegmentDropHandler (source) {
    const { inactiveSegments } = this.state
    this.setState({
      inactiveSegments: inactiveSegments.map(item => {
        if (source.id === item.id) {
          item.notDropped = false
        }
        return item
      }),
      segmentOrderNotSaved: true
    })
  }

  segmentEditHandler (segment) {
    this.setState({
      editInProgress: segment
    })
  }

  displaySegments () {
    const { editInProgress, creationInProgress } = this.state
    if (!editInProgress && !creationInProgress) {
      return (
        <div className="tiles-lists">
          {this.displayActiveSegments()}
          {this.displayInactiveSegments()}
        </div>
      )
    }
  }

  displayActiveSegments () {
    return <SegmentsList
      className="tiles-list tiles-list--active tiles-list--with-funnel"
      title="Active list"
      segments={this.state.activeSegments}
      isDraggable
      onSegmentEdit={this.segmentEditHandler.bind(this)}
      onSegmentHover={this.activeSegmentHoverHandler.bind(this)}
      onSegmentDrop={this.activeSegmentDropHandler.bind(this)}
      dataHelp="active-segments-list"
    />
  }

  displayInactiveSegments () {
    return <SegmentsList
      className="tiles-list tiles-list--inactive"
      title="Inactive list"
      segments={this.state.inactiveSegments}
      isDraggable
      onSegmentEdit={this.segmentEditHandler.bind(this)}
      onSegmentHover={this.inactiveSegmentsHoverHandler.bind(this)}
      onSegmentDrop={this.inactiveSegmentDropHandler.bind(this)}
      dataHelp="inactive-segments-list"
    />
  }

  saveSegmentsOrderHandler () {
    this.props.updateActiveSegmentsOrder(this.state.activeSegments)
  }

  displayCallToAction () {
    const { editInProgress, creationInProgress } = this.state
    if (!editInProgress && !creationInProgress) {
      return (
        <div className="cta">
          <button type="button" className="btn" onClick={this.saveSegmentsOrderHandler.bind(this)} disabled={!this.state.segmentOrderNotSaved} data-help="save-order">
            Save order
          </button>
          <button type="button" className="btn" onClick={this.onAddSegmentClick.bind(this)} data-help="create-segment">
            Create a segment
          </button>
        </div>
      )
    }
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <Link to="/segments" className="back"> &lt; Back to segments</Link>
            <h2>
              Manage segments
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
          {this.displayCallToAction()}
        </header>
        <div className="content" data-help="drag-and-drop-zone">
          {this.displaySegmentForm()}
          {this.displaySegments()}
        </div>
      </main>
    )
  }
}

export default withRouter(ManageSegmentsView)
