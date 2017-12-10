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

class Navigation extends React.Component {
  static propTypes = {
    page: React.PropTypes.object.isRequired,
    getPageByNumber: React.PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      currentPage: props.page.number + 1,
      pageField: props.page.number + 1
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      currentPage: nextProps.page.number + 1,
      pageField: nextProps.page.number + 1
    })
  }

  firstPageClick (event) {
    this.changePagination(1)
  }

  previousPageClick (event) {
    this.changePagination(this.state.currentPage - 1)
  }

  nextPageClick (event) {
    this.changePagination(this.state.currentPage + 1)
  }

  lastPageClick (event) {
    this.changePagination(this.props.page.totalPages)
  }

  specificPageSubmit (event) {
    event.preventDefault()
    this.changePagination(this.state.pageField)
  }

  onUpdatePageValueChange (event) {
    this.setState(Object.assign({}, this.state, { pageField: event.target.value }))
  }

  changePagination (pageNumber) {
    pageNumber = parseInt(pageNumber)
    if (Number.isInteger(pageNumber) && pageNumber > 0 && pageNumber <= this.props.page.totalPages) {
      this.setState({
        currentPage: pageNumber,
        pageField: pageNumber
      })
      this.props.getPageByNumber(pageNumber - 1)
    } else {
      this.setState({
        pageField: this.state.currentPage
      })
    }
  }

  render () {
    if (!this.props.page.totalElements || this.props.page.totalElements <= this.props.page.size) {
      return
    }

    return (
      <div className="navigation">
        <button type="button" onClick={this.firstPageClick.bind(this)} disabled={this.state.currentPage === 1}>
          <span className="fa fa-fast-backward" />
        </button>
        <button type="button" onClick={this.previousPageClick.bind(this)} disabled={this.state.currentPage === 1}>
          <span className="fa fa-backward" />
        </button>
        <div className="current-page">
          <form onSubmit={this.specificPageSubmit.bind(this)}>
            <span>
              <input
                type="number"
                name="pageField"
                value={this.state.pageField}
                onChange={this.onUpdatePageValueChange.bind(this)}
                onBlur={this.specificPageSubmit.bind(this)}
                min="1"
                max={this.props.page.totalPages}
              />
            </span>
            <span>
              /
            </span>
            <span>
              {this.props.page.totalPages}
            </span>
          </form>
        </div>
        <button type="button" onClick={this.nextPageClick.bind(this)} disabled={this.state.currentPage === this.props.page.totalPages}>
          <span className="fa fa-forward" />
        </button>
        <button type="button" onClick={this.lastPageClick.bind(this)} disabled={this.state.currentPage === this.props.page.totalPages}>
          <span className="fa fa-fast-forward" />
        </button>
      </div>
    )
  }
}

export default Navigation
