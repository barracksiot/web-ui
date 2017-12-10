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
import { Link } from 'react-router'

class UpdateEditorView extends React.Component {
  static propTypes = {
    getUpdate: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    cleanState: React.PropTypes.func,
    getSegmentsList: React.PropTypes.func.isRequired,
    segmentsList: React.PropTypes.object,
    params: React.PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.initState(props)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.update.uuid) {
      this.initState(nextProps)
    }
  }

  initState (props) {
    props.update.description = props.update.description || ''

    this.state = {
      update: props.update
    }
  }

  field (label, className, value) {
    return (
      <p>
        <strong>{label}</strong>
        <span className={className}>{value}</span>
      </p>
    )
  }

  onFormSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.state.update)
  }

  componentWillMount () {
    if (this.props.getUpdate) {
      this.props.getUpdate(this.props.params.updateId)
    }
    if (this.props.getSegmentsList) {
      this.props.getSegmentsList()
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  onUpdatePropertyChange (event) {
    let diff = {}
    diff[event.target.name] = event.target.value || undefined
    let newUpdate = Object.assign({}, this.state.update, diff)
    this.setState(Object.assign({}, this.state, { update: newUpdate }))
  }

  displaySegmentsList () {
    const segmentsList = this.props.segmentsList.active

    if (segmentsList) {
      return (
        segmentsList.concat(this.props.segmentsList.other).map((segment) => (
          <option key={segment.id} value={segment.id}>
            {segment.name} ({pluralize('device', segment.deviceCount, true)})
          </option>
        ))
      )
    }
  }

  render () {
    const backUrl = '/updates/' + this.state.update.uuid

    return (
      <main className="view">
        <header>
          <div className="content">
            <Link to="/updates" className="back">&lt; Back to all update</Link>
            <h2>
              Manage {this.state.update.name}
            </h2>
          </div>
        </header>
        <div className="content">
          <form className="form manage-update" data-component="UpdatesCreate" onSubmit={this.onFormSubmit.bind(this)}>

            <div className="info">

              <div>

                <div className="form__item form__item--input form__item--important">
                  <label htmlFor="name">
                    Name *
                  </label>
                  <div className="input">
                    <input type="text" id="name" name="name" required placeholder="Give a name for this update" value={this.state.update.name} onChange={this.onUpdatePropertyChange.bind(this)} />
                  </div>
                </div>

                <div className="form__item form__item--input form__item--textarea">
                  <label htmlFor="description">
                    Description
                  </label>
                  <div className="input">
                    <textarea id="description" name="description" placeholder="Add a short description for this update" value={this.state.update.description} onChange={this.onUpdatePropertyChange.bind(this)} />
                  </div>
                </div>

                <div className="form__item form__item--select" data-help="segment">
                  <label htmlFor="segmentId">
                    Segment *
                  </label>
                  <div className="input">
                    <select id="segmentId" name="segmentId" value={this.state.update.segmentId} onChange={this.onUpdatePropertyChange.bind(this)}>
                      {this.displaySegmentsList()}
                    </select>
                  </div>
                </div>

                {this.field('Status', 'status status--' + this.state.update.status, this.state.update.status)}

              </div>
              <div>

                {this.field('Version ID', 'versionId', this.state.update.versionId)}
                {this.field('Package ID', 'packageId', this.state.update.packageId)}

                <div className="form__item form__item--input form__item--textarea">
                  <label htmlFor="additionalProperties">
                    Custom Update Data
                  </label>
                  <div className="input">
                    <textarea id="additionalProperties" name="additionalProperties" placeholder="Enter your Custom Update Data in a JSON format" value={this.state.update.additionalProperties} onChange={this.onUpdatePropertyChange.bind(this)} />
                  </div>
                </div>

              </div>

            </div>

            <input type="hidden" id="status" name="status" data-status required />

            <div className="form__submit">
              <div className="btn-group btn-group--opposite">
                <Link className="btn btn--alt active" to={backUrl}>
                  Cancel
                </Link>
                <button type="submit" className="btn active" value="draft">
                  Save draft
                </button>
              </div>
            </div>

          </form>

        </div>
      </main>
    )
  }
}

export default UpdateEditorView
