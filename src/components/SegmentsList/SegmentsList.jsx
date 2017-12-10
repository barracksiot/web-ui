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
import Segment from 'components/Segment'
import { DropTarget } from 'react-dnd'
import { SEGMENT } from 'constants/dnd'

const target = {
  hover (props, monitor, component) {
    const source = monitor.getItem()
    props.onSegmentHover(source)
  },
  drop (props, monitor, component) {
    const source = monitor.getItem()
    props.onSegmentDrop(source)
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

class SegmentsList extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    segments: React.PropTypes.array,
    className: React.PropTypes.string,
    otherSegment: React.PropTypes.object,
    onSegmentDrop: React.PropTypes.func,
    onSegmentHover: React.PropTypes.func,
    onSegmentClick: React.PropTypes.func,
    onSegmentEdit: React.PropTypes.func,
    isDraggable: React.PropTypes.bool,
    connectDropTarget: React.PropTypes.func,
    dataHelp: React.PropTypes.string
  }

  dropReceivedOnSegmentHandler (source) {
    this.props.onSegmentDrop(source)
  }

  hoverOnSegmentHandler (source, target) {
    this.props.onSegmentHover(source, target)
  }

  displaySegments () {
    const { segments, otherSegment, onSegmentClick, onSegmentEdit, isDraggable } = this.props

    if (!this.props.segments) {
      return
    }

    const segmentsComponents = segments.map(segment => {
      return <Segment
        key={segment.id}
        segment={segment}
        onClick={onSegmentClick}
        onEdit={onSegmentEdit}
        isDraggable={isDraggable}
        onDropReceived={this.dropReceivedOnSegmentHandler.bind(this)}
        onHover={this.hoverOnSegmentHandler.bind(this)}
      />
    })

    if (otherSegment && Object.keys(otherSegment).length) {
      return segmentsComponents.concat(<Segment key={otherSegment.id} segment={otherSegment} onClick={onSegmentClick} />)
    }

    return segmentsComponents
  }

  displayTitle () {
    if (this.props.title) {
      return <h3 className="title">{this.props.title}</h3>
    }
  }

  render () {
    const { connectDropTarget } = this.props

    return connectDropTarget(
      <div className={this.props.className} data-help={this.props.dataHelp ? this.props.dataHelp : ''}>
        {this.displayTitle()}
        {this.displaySegments()}
      </div>
    )
  }
}

export default DropTarget(SEGMENT, target, collect)(SegmentsList)
