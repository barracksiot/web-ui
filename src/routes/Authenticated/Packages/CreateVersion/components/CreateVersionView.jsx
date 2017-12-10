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
import CodeMirror from 'react-codemirror'
require('codemirror/mode/javascript/javascript')

class VersionEditorView extends React.Component {
  static propTypes = {
    uploadProgress: React.PropTypes.number,
    onSubmit: React.PropTypes.func,
    cleanState: React.PropTypes.func,
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool,
    params: React.PropTypes.object,
    router: React.PropTypes.object,
    route: React.PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.initState(props)
  }

  initState (props) {
    this.state = {
      uploadProgress: props.uploadProgress,
      version: {},
      file: {}
    }

    if (props.version) {
      this.state = Object.assign({}, this.state, {
        version: props.version
      })
    }
  }

  onFormSubmit (event) {
    event.preventDefault()
    this.setState(Object.assign({}, this.state, { versionNotSaved: false }))
    this.props.onSubmit(
      this.props.params.pkgReference,
      this.state.version,
      this.state.file.name ? this.state.file : undefined
    )
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.uploadProgress !== nextProps.uploadProgress) {
      this.setState(Object.assign({}, this.state, {
        uploadProgress: nextProps.uploadProgress
      }))
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  onVersionPropertyChange (event) {
    let diff = {}
    diff[event.target.name] = event.target.value || undefined
    let newVersion = Object.assign({}, this.state.version, diff)
    this.setState(Object.assign({}, this.state, { version: newVersion }))

    if (!this.state.versionNotSaved) {
      this.setState(Object.assign({}, this.state, { versionNotSaved: true }))
    }
  }

  onCodeEditorChange (value) {
    this.onVersionPropertyChange({
      target: {
        name: 'metadata',
        value: value
      }
    })
  }

  onFileSelected (event) {
    this.setState(Object.assign({}, this.state, {
      file: event.target.files[0] ? event.target.files[0] : {}
    }))
  }

  onClickSelectFile (event) {
    this.refs.file.click()
  }

  getFileName () {
    return this.state.file.name ? this.state.file.name : this.state.version.fileName
  }

  componentDidMount () {
    if (this.props.tourInProgress) {
      this.startHelper()
    }

    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.versionNotSaved) {
        return 'You didn\'t save your version, are you sure you want to leave this page?'
      }
    })
  }

  startHelper () {
    const helperList = [
      {
        title: 'ID',
        text: '<p>This is the most important field of your version. It must reflect your package technical version naming and can\'t be changed once the version is published. If you have any doubt, please refer to our documentation.</p>',
        selector: '[data-help="id"]',
        position: 'right'
      },
      {
        title: 'Upload your file',
        text: '<p>This is where you upload your file on Barracks.</p>',
        selector: '[data-help="file"]',
        position: 'right'
      },
      {
        title: 'Name',
        text: '<p>You have to give a name to your version. This name will be only used for you to understand the purpose of the version.</p>',
        selector: '[data-help="name"]',
        position: 'right'
      },
      {
        title: 'Description',
        text: '<p>This is the description of the version. Again, it\'s only for you, to know what you\'ve pushed in the version.</p>',
        selector: '[data-help="description"]',
        position: 'right'
      },
      {
        title: 'Metadata',
        text: '<p>You can add, in JSON format, some additional custom data to your version, data that will be sent to the device. You can use those data on the device to run any action or add any information you want.</p>',
        selector: '[data-help="metadata"]',
        position: 'left'
      },
      {
        title: 'Save draft',
        text: '<p>Here we go!</p><p>Your version will be created and be ready to publish. We don\'t publish by default the version, you have to click on "publish" after saving the draft.</p>',
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
    const backUrl = `/packages/edit/${this.props.params.pkgReference}/versions`
    const options = {
      lineNumbers: true,
      mode: 'javascript'
    }

    return (
      <main className="view">
        <header>
          <div className="content">
            <Link to={backUrl} className="back">&lt; Back to versions</Link>
            <h2>
              Create a Version
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
        </header>
        <div className="content">
          <div className="manage-version">
            <form className="form" onSubmit={this.onFormSubmit.bind(this)}>
              <div>

                <div className="info">
                  <div>

                    <div className="group">

                      <div className="form-item version-id" data-help="id">
                        <h3 className="id">
                          <label htmlFor="id">
                            ID *
                          </label>
                        </h3>
                        <input type="text" id="id" name="id" data-version-id required placeholder="Set an unique ID for your version" pattern="^[\x21-\x7E]+$" maxLength="50" value={this.state.version.id} onChange={this.onVersionPropertyChange.bind(this)} />
                      </div>

                      <div className="form-item version-file" data-help="file">
                        <h3 className="file">
                          <label htmlFor="file">
                            Upload your file *
                          </label>
                        </h3>
                        <div className="input">
                          <input type="file" id="file" name="file" data-file ref="file" onChange={this.onFileSelected.bind(this)} required={this.state.file.name} disabled={this.state.uploadProgress} />
                          <button type="button" className="btn btn--alt" data-default="Choose a file" onClick={this.onClickSelectFile.bind(this)} disabled={this.state.uploadProgress}>
                            <i className="fa fa-upload" />
                            <span>{this.state.file.name ? this.getFileName() : 'Choose a file ...' }</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="form-item version-name" data-help="name">
                      <h3 className="name">
                        <label htmlFor="name">
                          Name *
                        </label>
                      </h3>
                      <input type="text" id="name" name="name" required placeholder="Give a name for this version" value={this.state.version.name} maxLength="50" onChange={this.onVersionPropertyChange.bind(this)} />
                    </div>

                    <div className="form-item version-description" data-help="description">
                      <h3 className="description">
                        <label htmlFor="description">
                          Description
                        </label>
                      </h3>
                      <textarea id="description" name="description" placeholder="Add a short description for this version" value={this.state.version.description} onChange={this.onVersionPropertyChange.bind(this)} />
                    </div>

                  </div>
                  <div>

                    <div className="metadata" data-help="metadata">
                      <h3>
                        <label htmlFor="metadata">
                          Metadata
                        </label>
                      </h3>
                      <CodeMirror value={this.state.version.metadata} onChange={this.onCodeEditorChange.bind(this)} options={options} />
                    </div>

                  </div>
                </div>

                <progress value={this.state.uploadProgress} max="1" />
              </div>

              <div className="form__submit">
                <div className="btn-group btn-group--right">
                  <button type="submit" className="btn" value="draft" disabled={this.state.uploadProgress} data-help="save-draft">
                    Save Version
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </main>
    )
  }
}

export default VersionEditorView
