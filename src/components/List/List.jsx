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

/* eslint no-eval: 1 */
import React from 'react'
import Navigation from 'components/Navigation'
import $ from 'jquery'

class List extends React.Component {
  static propTypes = {
    titles: React.PropTypes.arrayOf(React.PropTypes.shape({
      property: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      classes: React.PropTypes.string
    })).isRequired,
    items: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.any.isRequired
    })).isRequired,
    page: React.PropTypes.object.isRequired,
    sort: React.PropTypes.object,
    sortByProperty: React.PropTypes.func,
    getPageByNumber: React.PropTypes.func,
    clickableColumns: React.PropTypes.array,
    sortableColumns: React.PropTypes.array,
    onItemClick: React.PropTypes.func
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

  isSorted (property) {
    return this.props.sort && property === this.props.sort.property ? this.props.sort.direction : undefined
  }

  onPropertyOrder (event) {
    const $target = $(event.target).closest('[data-sortable]')
    if ($target.length) {
      const property = $target.attr('data-sortable')
      const directionAttribute = $target.attr('data-direction')
      this.props.sortByProperty(property, (directionAttribute === 'ASC') ? 'DESC' : 'ASC')
    }
  }

  onItemClick (event) {
    const $target = $(event.target).closest('[data-id]')
    const id = $target.attr('data-id')
    this.props.onItemClick(id)
  }

  generateTHead () {
    const ths = this.props.titles

    return (
      <thead>
        <tr>
          {ths.map((th) => (
            <th
              key={th.property}
              onClick={this.onPropertyOrder.bind(this)}
              className={th.classes}
              data-sortable={this.props.sortableColumns && this.props.sortableColumns.indexOf(th.property) !== -1 ? th.property : null}
              data-direction={this.isSorted(th.property)}
            >
              {th.label}
            </th>
          ))}
        </tr>
      </thead>
    )
  }

  generateTBody () {
    const ths = this.props.titles
    const tds = this.props.items

    return (
      <tbody>
        {tds.map((td) => (
          <tr key={td.id} data-id={td.id}>
            {ths.map((th) => (
              <td key={td.id + '_' + th.property} className={th.classes} data-clickable={this.props.clickableColumns && this.props.clickableColumns.indexOf(th.property) !== -1 ? true : null} onClick={this.props.clickableColumns && this.props.clickableColumns.indexOf(th.property) !== -1 ? this.onItemClick.bind(this) : null}>
                {eval('td.' + th.property)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }

  generateNavigation () {
    if (!this.props.page.totalElements || this.props.page.totalElements <= this.props.page.size) {
      return
    }

    return (
      <Navigation
        page={this.props.page}
        currentPage={this.state.currentPage}
        pageField={this.state.pageField}
        getPageByNumber={this.props.getPageByNumber}
      />
    )
  }

  render () {
    return (
      <div className="list">
        <div className="table" data-help="list">
          <table>
            {this.generateTHead()}
            {this.generateTBody()}
          </table>
        </div>
        {this.generateNavigation()}
      </div>
    )
  }

}

export default List
