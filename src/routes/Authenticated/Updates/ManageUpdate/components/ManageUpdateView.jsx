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
import moment from 'moment'
import DateTimeSelector from 'components/DateTimeSelector'
import { Link } from 'react-router'

class ManageUpdateView extends React.Component {
  static propTypes = {
    currentUpdate: React.PropTypes.shape({
      uuid: React.PropTypes.string,
      additionalProperties: React.PropTypes.string,
      name: React.PropTypes.string,
      description: React.PropTypes.string,
      versionId: React.PropTypes.string,
      packageId: React.PropTypes.string,
      segmentName: React.PropTypes.string,
      segmentDeviceCount: React.PropTypes.number,
      userId: React.PropTypes.string,
      revisionId: React.PropTypes.number,
      status: React.PropTypes.string,
      creationDate: React.PropTypes.string,
      fileName: React.PropTypes.string,
      scheduledDate: React.PropTypes.string
    }),
    editUpdate:React.PropTypes.func,
    getUpdate:React.PropTypes.func,
    changeStatus:React.PropTypes.func,
    cleanState: React.PropTypes.func,
    params: React.PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps (nextProps) {
    this.state = {}
  }

  field (label, className, value) {
    return (
      <p>
        <strong>{label}</strong>
        <span className={className}>{value}</span>
      </p>
    )
  }

  getSegmentName () {
    return (<span>
      {this.props.currentUpdate.segmentName} <span>({pluralize('device', this.props.currentUpdate.segmentDeviceCount, true)})</span>
    </span>)
  }

  onChangeStatusButtonClick (event) {
    var status = event.target.attributes['value'].value
    if (status === 'scheduled') {
      this.props.changeStatus(this.props.currentUpdate.uuid, status, { scheduledDate: this.state.scheduledDate })
    } else {
      this.props.changeStatus(this.props.currentUpdate.uuid, status)
    }
  }

  onEditButtonClick () {
    this.props.editUpdate(this.props.currentUpdate.uuid)
  }

  isEditable (status) {
    if (status === 'draft') {
      return (
        <div className="cta">
          <button type="button" className="btn btn--alt" onClick={this.onEditButtonClick.bind(this)} value="draft">
            Edit draft
          </button>
        </div>
      )
    }
  }

  componentWillMount () {
    if (this.props.getUpdate) {
      this.props.getUpdate(this.props.params.updateId)
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  onScheduleClick () {
    this.setState({ modalStatus: 'open' })
    this.setState({
      schedulingInProgress: true,
      scheduledDate: new Date()
    })
  }

  onDisableScheduleClick () {
    this.setState({
      scheduledDate: undefined
    })
  }

  getSchedulingModal () {
    if (this.state.schedulingInProgress) {
      return (
        <div className={'modal modal--' + this.state.modalStatus}>
          <button type="button" className="close" onClick={this.onCloseModal.bind(this)} />
          <DateTimeSelector defaultValue={this.state.scheduledDate} onDateTimeSelected={this.closeModal.bind(this)} />
        </div>
      )
    }
  }

  onCloseModal () {
    this.closeModal()
  }

  closeModal (date) {
    this.setState({ modalStatus: 'inactive' })
    window.setTimeout(function () {
      this.setState({
        schedulingInProgress: false,
        scheduledDate: date
      })
    }.bind(this), 500)
  }

  getActionButtons () {
    const statusHandlers = {
      draft: () => {
        return (
          <div className="btn-group btn-group--right">
            <button type="submit" className="btn btn--link active" onClick={this.onScheduleClick.bind(this)}>
              <i className="fa fa-clock-o" />
              Schedule
            </button>
            <button type="submit" className="btn active" onClick={this.onChangeStatusButtonClick.bind(this)} value="published">
              Publish now
            </button>
          </div>
        )
      },
      scheduled: () => {
        return (
          <div className="btn-group btn-group--right">
            <button type="submit" className="btn active" onClick={this.onChangeStatusButtonClick.bind(this)} value="draft">
              Cancel publication
            </button>
            <button type="submit" className="btn active" onClick={this.onChangeStatusButtonClick.bind(this)} value="published">
              Publish now
            </button>
          </div>
        )
      },
      published: () => {
        return (
          <div className="btn-group btn-group--right">
            <button type="submit" className="btn active" onClick={this.onChangeStatusButtonClick.bind(this)} value="archived">
              Archive
            </button>
          </div>
        )
      },
      archived: () => {
        return (
          <div className="btn-group btn-group--right">
            <button type="submit" className="btn active" onClick={this.onChangeStatusButtonClick.bind(this)} value="published">
              Publish now
            </button>
          </div>
        )
      }
    }
    if (this.props.currentUpdate && this.props.currentUpdate.status) {
      if (!this.state.scheduledDate || this.state.schedulingInProgress) {
        return statusHandlers[this.props.currentUpdate.status]()
      } else {
        return (
          <div className="btn-group btn-group--right">
            <button type="submit" className="btn btn--link active" onClick={this.onDisableScheduleClick.bind(this)}>
              <i className="fa fa-times" />
              {moment(this.state.scheduledDate).format('LLL')}
            </button>
            <button type="submit" className="btn active" onClick={this.onChangeStatusButtonClick.bind(this)} value="scheduled">
              Schedule
            </button>
          </div>
        )
      }
    }
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <Link to="/updates" className="back"> &lt; Back to all update</Link>
            <h2>
              Manage {this.props.currentUpdate.name}
            </h2>
          </div>
          {this.isEditable(this.props.currentUpdate.status)}
        </header>
        <div className="content">
          <div className="manage-update">

            <div className="info">
              <div>
                {this.field('Name', 'name', this.props.currentUpdate.name)}
                {this.field('Description', 'description', this.props.currentUpdate.description)}
                {this.field('Segment', 'segmentName', this.getSegmentName())}
                {this.field('Status', 'status status--' + this.props.currentUpdate.status, this.props.currentUpdate.status)}
                {this.props.currentUpdate.scheduledDate ? this.field('Publication scheduled for', 'scheduledDate', this.props.currentUpdate.scheduledDate) : undefined}
              </div>
              <div>
                {this.field('Version ID', 'versionId', this.props.currentUpdate.versionId)}
                {this.field('File name', 'fileName', this.props.currentUpdate.fileName)}
                {this.field('Revision', 'revisionId', this.props.currentUpdate.revisionId)}
                {this.field('Custom Update Data', 'additionalProperties', this.props.currentUpdate.additionalProperties)}
              </div>
            </div>

            {this.getSchedulingModal()}

            {this.getActionButtons()}

          </div>
        </div>
      </main>
    )
  }
}

export default ManageUpdateView
