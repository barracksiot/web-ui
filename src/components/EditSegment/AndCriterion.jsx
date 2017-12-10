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
import Autocomplete from 'react-autocomplete'

class AndCriterion extends React.Component {
  static propTypes = {
    criterion: React.PropTypes.object,
    index: React.PropTypes.number,
    onDelete: React.PropTypes.func,
    onChange: React.PropTypes.func,
    isDeletable: React.PropTypes.bool
  }

  propertyChangeHandler (event) {
    const { criterion, onChange, index } = this.props
    let target = event.target.value

    if (target === 'true') {
      target = true
    } else if (target === 'false') {
      target = false
    } else if (!isNaN(parseFloat(target)) && isFinite(target)) {
      target = parseFloat(target)
    }

    const change = Object.assign({}, criterion, {
      [event.target.name]: target
    })

    onChange(index, change)
  }

  comparisonKeyAutocompletionSelectHandler (value) {
    const { criterion, onChange, index } = this.props
    const change = Object.assign({}, criterion, {
      comparisonKey: value
    })
    onChange(index, change)
  }

  deleteCriterionHandler () {
    this.props.onDelete(this.props.index)
  }

  renderDeleteButton () {
    if (this.props.isDeletable) {
      return (
        <div className="actions">
          <button type="button" className="action action--delete" onClick={this.deleteCriterionHandler.bind(this)} >
            <span>-</span>
          </button>
        </div>
      )
    }
    return undefined
  }

  getCommonComparisonKeys () {
    return ['unitId', 'versionId', 'customClientData']
  }

  render () {
    return (
      <div className="alone">
        <div className="rule">
          {this.renderDeleteButton()}
          <div className="input input--autocomplete">
            <Autocomplete
              value={this.props.criterion.comparisonKey}
              inputProps={{
                name: 'comparisonKey',
                pattern: '^(versionId|customClientData(\\..+)?|unitId)$',
                required: 'true',
                placeholder: 'key'
              }}
              items={this.getCommonComparisonKeys()}
              onChange={this.propertyChangeHandler.bind(this)}
              onSelect={this.comparisonKeyAutocompletionSelectHandler.bind(this)}
              shouldItemRender={(state, value) => state !== value && state.startsWith(value)}
              getItemValue={item => item}
              renderItem={(item, isHighlighted) => (
                <div className={'autocomplete-item ' + (isHighlighted ? ' autocomplete-item--active' : '')} key={item}>
                  {item}
                </div>
              )}
              />
          </div>
          <div className="select">
            <select required name="comparisonType" value={this.props.criterion.comparisonType} onChange={this.propertyChangeHandler.bind(this)} >
              <option value="eq">=</option>
              <option value="ne">&ne;</option>
              <option value="lt">&lt;</option>
              <option value="gt">&gt;</option>
              <option value="lte">&le;</option>
              <option value="gte">&ge;</option>
              <option value="in">in</option>
              <option value="nin">not in</option>
              <option value="regex">regex</option>
            </select>
          </div>
          <div className="input">
            <input type="text" name="comparisonValue" placeholder="value" required value={this.props.criterion.comparisonValue} onChange={this.propertyChangeHandler.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}

export default AndCriterion
