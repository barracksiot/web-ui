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
import { SEGMENT } from 'constants/dnd'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'

const segmentTarget = {
  hover (props, monitor, component) {
    const dragSegment = monitor.getItem()
    const hoverSegment = props.segment

    // Don't replace items with themselves
    if (dragSegment.id === hoverSegment.id) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragSegment.id < hoverSegment.id && hoverClientY < hoverMiddleY) {
      return
    }

    // Dragging upwards
    if (dragSegment.id > hoverSegment.id && hoverClientY > hoverMiddleY) {
      return
    }

    // Time to actually perform the action
    props.onHover(monitor.getItem(), props.segment)
  },
  drop (props, monitor, component) {
    const droppedSegment = monitor.getItem()
    props.onDropReceived(droppedSegment)
  }
}

const segmentSource = {
  beginDrag (props) {
    return props.segment
  }
}

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

class Segment extends React.Component {
  static propTypes = {
    isDraggable: React.PropTypes.bool,
    onHover: React.PropTypes.func,
    onClick: React.PropTypes.func,
    segment: React.PropTypes.object.isRequired,
    onEdit: React.PropTypes.func,
    connectDropTarget: React.PropTypes.func.isRequired,
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool
  }

  onClick (event) {
    if (this.props.onClick) {
      this.props.onClick(this.props.segment.id)
    }
  }

  editHandler () {
    if (this.props.onEdit) {
      this.props.onEdit(this.props.segment)
    }
  }

  displayActions () {
    if (this.props.onEdit) {
      return (
        <div className="actions">
          <button type="button" className="btn btn--link" onClick={this.editHandler.bind(this)}>
            Edit
          </button>
        </div>
      )
    }
  }

  decorateNode (node) {
    const { onHover, isDraggable, connectDropTarget, connectDragSource } = this.props
    if (onHover) {
      return isDraggable ? connectDragSource(connectDropTarget(node)) : connectDropTarget(node)
    }
    return isDraggable ? connectDragSource(node) : node
  }

  render () {
    const { segment, isDragging } = this.props

    return this.decorateNode(
      <div className="tile tile--segment" data-dragging={isDragging || segment.notDropped} data-clickable={!!this.props.onClick} onClick={this.onClick.bind(this)} data-help={this.props.segment.id === 'other' ? 'other-segment' : ''}>
        <div className="header">
          <h3 className="name">
            {segment.name}
          </h3>
          <div className="info">
            <div className="devices">
              {pluralize('device', segment.deviceCount, true)}
            </div>
            {this.displayActions()}
          </div>
        </div>
      </div>
    )
  }
}

export default DragSource(SEGMENT, segmentSource, collectSource)(DropTarget(SEGMENT, segmentTarget, collectTarget)(Segment))
