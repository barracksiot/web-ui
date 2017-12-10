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

class Notification extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.oneOf(['error', 'success', 'warning', 'info', 'loading']).isRequired,
    title: React.PropTypes.string,
    message: React.PropTypes.string,
    closable: React.PropTypes.bool,
    duration: React.PropTypes.number,
    destroy: React.PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = { status: 'active' }
  }

  componentDidMount () {
    if (this.props.duration > 0) {
      window.setTimeout(function () {
        if (this.state.status === 'active') {
          this.closeNotification()
        }
      }.bind(this), this.props.duration)
    }
  }

  closeNotification () {
    this.setState({ status: 'inactive' })
    window.setTimeout(function () {
      this.props.destroy(this.props.id)
    }.bind(this), 500)
  }

  render () {
    const { id, type, title, message, closable } = this.props

    return (
      <div className={'notification notification--' + this.state.status} data-id={id} data-type={type}>
        {closable ? <button type="button" className="close" onClick={this.closeNotification.bind(this)}><i className="fa fa-times" /><span>Close</span></button> : null}
        {title ? <div className="title">{title}</div> : null}
        {message ? <div className="message">{message}</div> : null}
      </div>
    )
  }
}

export default Notification
