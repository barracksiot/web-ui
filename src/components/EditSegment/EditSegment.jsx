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
import { AndCriterion } from 'components/EditSegment'

const IN_COMPARISON_KEY = 'in'
const NIN_COMPARISON_KEY = 'nin'

function parseSegmentComparisonValue (criterion) {
  if (criterion.comparisonType === IN_COMPARISON_KEY || criterion.comparisonType === NIN_COMPARISON_KEY) {
    return criterion.comparisonValue.split('|').map(item => item.trim())
  }
  return criterion.comparisonValue
}

function convertCriteriaToQuery (criteria) {
  const queryItems = []
  criteria.forEach(criterion => {
    queryItems.push({
      [criterion.comparisonType]: {
        [criterion.comparisonKey]: parseSegmentComparisonValue(criterion)
      }
    })
  })

  if (queryItems.length === 1) {
    return queryItems[0]
  } else {
    return { and: queryItems }
  }
}

function convertQueryToCriteria (query) {
  const queryItems = query.and || [query]
  const criteria = []

  queryItems.forEach(item => {
    Object.getOwnPropertyNames(item).forEach(comparisonType => {
      Object.getOwnPropertyNames(item[comparisonType]).forEach(comparisonKey => {
        const criterion = {
          comparisonType,
          comparisonKey,
          comparisonValue: item[comparisonType][comparisonKey]
        }
        if (criterion.comparisonType === IN_COMPARISON_KEY || criterion.comparisonType === NIN_COMPARISON_KEY) {
          criterion.comparisonValue = criterion.comparisonValue.join(' | ')
        }
        criteria.push(criterion)
      })
    })
  })

  return criteria
}

class EditSegment extends React.Component {
  static propTypes = {
    segment: React.PropTypes.object,
    onSave: React.PropTypes.func,
    onCancel: React.PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = this.buildState(props.segment)
  }

  buildState (segment) {
    return {
      name: segment ? segment.name : undefined,
      criteria: (segment && segment.query) ? convertQueryToCriteria(segment.query) : [{ comparisonType: 'eq' }]
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this.buildState(nextProps.segment))
  }

  cancelHandler () {
    this.props.onCancel()
  }

  saveHandler (event) {
    event.preventDefault()
    const { name, criteria } = this.state
    this.props.onSave({
      id: this.props.segment ? this.props.segment.id : undefined,
      name,
      query: convertCriteriaToQuery(criteria)
    })
  }

  deleteCriterionHandler (index) {
    const { criteria } = this.state
    criteria.splice(index, 1)
    this.setState({
      criteria
    })
    if (criteria.length === 0) {
      this.addAndCriteriaHandler()
    }
  }

  nameChangeHandler (event) {
    this.setState({
      name: event.target.value
    })
  }

  addAndCriteriaHandler (event) {
    const { criteria } = this.state
    criteria.push({ comparisonType: 'eq' })
    this.setState({
      criteria
    })
  }

  criterionChangeHandler (index, criterion) {
    const { criteria } = this.state
    criteria[index] = criterion
    this.setState({
      criteria
    })
  }

  displayRules () {
    const { criteria } = this.state
    return criteria.map((criterion, index) => {
      return (
        <AndCriterion
          key={index}
          index={index}
          criterion={criterion}
          onDelete={this.deleteCriterionHandler.bind(this)}
          isDeletable={criteria.length > 1}
          onChange={this.criterionChangeHandler.bind(this)}
        />
      )
    })
  }

  render () {
    return (
      <div className="tiles-list tiles-list--without-funnel">
        <form onSubmit={this.saveHandler.bind(this)}>
          <div className="tile tile--manage-segment">

            <div className="header" data-help="segment-name">
              <h3 className="name">
                <label title="Edit channel name">
                  <i className="fa fa-pencil" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Segment name"
                    value={this.state.name}
                    required="true"
                    pattern="^[A-Za-z0-9_]+$"
                    maxLength="50"
                    onChange={this.nameChangeHandler.bind(this)} />
                </label>
              </h3>
              <div className="info">
                <div className="devices" />
                <div className="actions">
                  <button type="button" className="btn btn--alt" onClick={this.cancelHandler.bind(this)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn" data-help="save-segment">
                    Save
                  </button>
                </div>
              </div>
            </div>

            <div className="rules" data-help="segment-rules">
              <h4 className="title">
                Devices with:
              </h4>
              <div className="complex-form complex-form--comparison">
                <div className="group group--and">
                  {this.displayRules()}
                </div>

                <div className="actions">
                  <button type="button" className="action action--and" onClick={this.addAndCriteriaHandler.bind(this)} data-help="segment-add-rule">
                    <span>AND</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default EditSegment
