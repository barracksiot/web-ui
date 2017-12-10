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
    uploadProgress: React.PropTypes.number,
    onSubmit: React.PropTypes.func,
    cleanState: React.PropTypes.func,
    getSegmentsList: React.PropTypes.func.isRequired,
    segmentsList: React.PropTypes.object,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool
  }

  constructor (props, context) {
    super(props, context)
    this.initState(props)
  }

  initState (props) {
    this.state = {
      uploadProgress: props.uploadProgress,
      update: {},
      file: {}
    }

    if (props.update) {
      this.state = Object.assign({}, this.state, {
        update: props.update
      })
    }
  }

  onFormSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.state.update, this.state.file.name ? this.state.file : undefined)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.uploadProgress !== nextProps.uploadProgress) {
      this.setState(Object.assign({}, this.state, {
        uploadProgress: nextProps.uploadProgress
      }))
    }
  }

  componentWillMount () {
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

  onFileSelected (event) {
    this.setState(Object.assign({}, this.state, {
      file: event.target.files[0] ? event.target.files[0] : {}
    }))
  }

  onClickSelectFile (event) {
    this.refs.inputFile.click()
  }

  getFileName () {
    return this.state.file.name ? this.state.file.name : this.state.update.fileName
  }

  componentDidMount () {
    if (this.props.tourInProgress) {
      this.startHelper()
    }
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

  startHelper () {
    const helperList = [
      {
        title: 'Name',
        text: '<p>You have to give a name to your update. This name will be only used for you to understand the purpose of the update.</p>',
        selector: '[data-help="name"]',
        position: 'right'
      },
      {
        title: 'Description',
        text: '<p>This is the description of the update. Again, it\'s only for you, to know what you\'ve pushed in the update.</p>',
        selector: '[data-help="description"]',
        position: 'right'
      },
      {
        title: 'Segment',
        text: '<p>You have to select a segment. The update will be published and pushed only on this segment and only the devices connected to the segment will receive the update.</p>',
        selector: '[data-help="segment"]',
        position: 'right'
      },
      {
        title: 'Custom update data',
        text: '<p>You can add, in JSON format, some additional custom data to your update, data that will be sent to the device. You can use those data on the device to run any action or add any information you want.</p>',
        selector: '[data-help="custom-update-data"]',
        position: 'right'
      },
      {
        title: 'Version ID',
        text: '<p>This is the most important field of your update. It must reflect your package technical version naming and can\'t be changed once the update is published. If you have any doubt, please refer to our documentation.</p>',
        selector: '[data-help="version-id"]',
        position: 'left'
      },
      {
        title: 'Upload your package',
        text: '<p>This is where you upload your package on Barracks.</p>',
        selector: '[data-help="upload-package"]',
        position: 'left'
      },
      {
        title: 'Save draft',
        text: '<p>Here we go!</p><p>Your update will be created and be ready to publish. We don\'t publish by default the update, you have to click on "publish" after saving the draft.</p>',
        selector: '[data-help="save-draft"]',
        position: 'left'
      }
    ]

    if (this.props.tourInProgress) {
      helperList.push({
        text: '<p>The tour has finished, we go back to Dashboard.</p>',
        selector: '[data-help="page-dashboard"]',
        position: 'right'
      })
    }

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <Link to="/updates" className="back">&lt; Back to all update</Link>
            <h2>
              Create an Update
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
        </header>
        <div className="content">
          <form className="form manage-update" data-component="UpdatesCreate" onSubmit={this.onFormSubmit.bind(this)}>

            <div className="info">
              <div>

                <div className="form__item form__item--input form__item--important" data-help="name">
                  <label htmlFor="name">
                    Name *
                  </label>
                  <div className="input">
                    <input type="text" id="name" name="name" required placeholder="Give a name for this update" value={this.state.update.name} onChange={this.onUpdatePropertyChange.bind(this)} />
                  </div>
                </div>

                <div className="form__item form__item--input form__item--textarea" data-help="description">
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
                    <select id="segmentId" name="segmentId" required value={this.state.update.segmentId} onChange={this.onUpdatePropertyChange.bind(this)}>
                      <option value="">Choose a segment</option>
                      {this.displaySegmentsList()}
                    </select>
                  </div>
                </div>

                <div className="form__item form__item--input form__item--textarea" data-help="custom-update-data">
                  <label htmlFor="additionalProperties">
                    Custom Update Data
                  </label>
                  <div className="input">
                    <textarea id="additionalProperties" name="additionalProperties" placeholder="Enter your Custom Update Data in a JSON format" value={this.state.update.additionalProperties} onChange={this.onUpdatePropertyChange.bind(this)} />
                  </div>
                </div>

              </div>
              <div className="critical-data">

                <p className="form__item--help">
                  This is the most important field of your update. It must reflect your package technical version naming and can't be changed once the update is published. If you have any doubt, please refer to our documentation
                </p>

                <div className="form__item form__item--input" data-help="version-id">
                  <label htmlFor="versionId">
                    Version ID *
                  </label>
                  <div className="input">
                    <input type="text" id="versionId" name="versionId" data-version-id required placeholder="Set an unique version ID for your package" value={this.state.update.versionId} onChange={this.onUpdatePropertyChange.bind(this)} />
                  </div>
                </div>

                <div className="form__item form__item--input form__item--file" data-help="upload-package">
                  <label htmlFor="uploadPackage">
                    Upload your package *
                  </label>
                  <div className="input">
                    <input type="file" id="uploadPackage" name="file" data-package ref="inputFile" onChange={this.onFileSelected.bind(this)} required={this.state.file.name} disabled={this.state.uploadProgress} />
                    <button type="button" className="btn btn--small" data-default="Choose a file" onClick={this.onClickSelectFile.bind(this)} disabled={this.state.uploadProgress}>
                      <i className="fa fa-upload" />
                      <span>{this.state.file.name ? this.getFileName() : 'Choose a file ...' }</span>
                    </button>
                  </div>
                </div>

                <input type="hidden" id="packageId" name="packageId" data-package-id required value={this.state.packageId} />

                <progress value={this.state.uploadProgress} max="1" />

              </div>
            </div>

            <input type="hidden" id="status" name="status" data-status required />

            <div className="form__submit">
              <div className="btn-group btn-group--right">
                <button type="submit" className="btn active" value="draft" disabled={this.state.uploadProgress} data-help="save-draft">
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
