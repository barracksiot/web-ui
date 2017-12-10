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
import { getReadableSize } from 'utils/mathUtils'

require('codemirror/mode/javascript/javascript')

class PreviewVersionView extends React.Component {
  static propTypes = {
    version: React.PropTypes.object,
    getVersionPage: React.PropTypes.func,
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
      version: {}
    }

    if (props.version) {
      this.state = Object.assign({}, this.state, {
        version: props.version
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.version !== nextProps.version) {
      this.initState(nextProps)
    }
  }

  componentWillMount () {
    if (this.props.getVersionPage) {
      this.props.getVersionPage(this.props.params.pkgReference, this.props.params.version)
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
    const helperList = [
      {
        title: 'ID',
        text: '<p>This is the unique identifier of your version.</p>',
        selector: '[data-help="id"]',
        position: 'right'
      },
      {
        title: 'Name',
        text: '<p>This name will be only used for you to understand the purpose of the version.</p>',
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
        title: 'File name',
        text: '<p>This is the name of the file you uploaded for this version.</p>',
        selector: '[data-help="file"]',
        position: 'right'
      },
      {
        title: 'Metadata',
        text: '<p>here\'s custom data of your version. These data will be sent to the device.</p>',
        selector: '[data-help="metadata"]',
        position: 'left'
      }
    ]

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  render () {
    const backUrl = `/packages/edit/${this.props.params.pkgReference}/versions`
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      readOnly: 'nocursor'
    }
    console.log('version', this.props.version)
    return (
      <main className="view">
        <header>
          <div className="content">
            <Link to={backUrl} className="back">&lt; Back to versions</Link>
            <h2>
              Version {this.props.version.name}
              <div className="contextual-help" title="Get some help">
                <button type="button" onClick={this.startHelper.bind(this)}>
                  <i className="fa fa-question-circle" />
                </button>
              </div>
            </h2>
          </div>
        </header>
        <div className="content">
          <div className="version-info">
            <div className="info">
              <div>
                <p data-help="id">
                  <strong>ID</strong>
                  <span>{this.state.version.id}</span>
                </p>
                <p data-help="description">
                  <strong>Description</strong>
                  <span>{this.state.version.description}</span>
                </p>
                <p data-help="file">
                  <strong>File name</strong>
                  <span>{this.state.version.filename}</span>
                </p>
                <p data-help="file-size">
                  <strong>File size</strong>
                  <span>{getReadableSize(this.state.version.length)}</span>
                </p>
                <p data-help="file-md5">
                  <strong>File MD5</strong>
                  <span>{this.state.version.md5}</span>
                </p>
              </div>
              <div>
                <div className="metadata" data-help="metadata">
                  <h3>
                    <label htmlFor="metadata">
                      Metadata
                    </label>
                  </h3>
                  <CodeMirror value={this.state.version.metadata} options={options} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default PreviewVersionView
