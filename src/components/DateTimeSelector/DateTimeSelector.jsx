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

function buildRangeArray (min, max) {
  let array = []
  let i
  for (i = min; i <= max; i++) {
    array.push(i)
  }
  return array
}

function getLastDayOfTheMonth (year, month) {
  const date = new Date(year, month, 0)
  return date.getDate()
}

class DateTimeSelector extends React.Component {
  static propTypes = {
    defaultValue: React.PropTypes.object,
    onDateTimeSelected: React.PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      day: this.props.defaultValue.getDate(),
      month: this.props.defaultValue.getMonth() + 1,
      year: this.props.defaultValue.getFullYear(),
      hour: this.props.defaultValue.getHours(),
      minute: this.props.defaultValue.getMinutes()
    }
  }

  onDateTimeChange (event) {
    const newState = Object.assign({}, this.state, { [event.target.name]: event.target.value })
    if (event.target.name === 'month' || event.target.name === 'year') {
      const lastDayOfMonth = getLastDayOfTheMonth(newState.year, newState.month)
      if (newState.day > lastDayOfMonth) {
        newState.day = 1
      }
    }
    this.setState(newState)
  }

  getTimeZone () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  getDaySelector () {
    const days = buildRangeArray(1, getLastDayOfTheMonth(this.state.year, this.state.month))
    return (
      <select name="day" defaultValue={this.state.day} onChange={this.onDateTimeChange.bind(this)}>
        {days.map(day => <option key={day} value={day}>{day < 10 ? `0${day}` : day}</option>)}
      </select>
    )
  }

  getMonthSelector () {
    const months = buildRangeArray(1, 12)
    return (
      <select name="month" defaultValue={this.state.month} onChange={this.onDateTimeChange.bind(this)}>
        {months.map(month => <option key={month} value={month}>{month < 10 ? `0${month}` : month}</option>)}
      </select>
    )
  }

  getYearSelector () {
    const currentYear = new Date().getFullYear()
    const years = buildRangeArray(currentYear, currentYear + 10)
    return (
      <select name="year" defaultValue={this.state.year} onChange={this.onDateTimeChange.bind(this)}>
        {years.map(year => <option key={year} value={year}>{year}</option>)}
      </select>
    )
  }

  getHourSelector () {
    const hours = buildRangeArray(0, 23)
    return (
      <select name="hour" defaultValue={this.state.hour} onChange={this.onDateTimeChange.bind(this)}>
        {hours.map(hour => <option key={hour} value={hour}>{hour < 10 ? `0${hour}` : hour}</option>)}
      </select>
    )
  }

  getMinuteSelector () {
    const minutes = buildRangeArray(0, 59)
    return (
      <select name="minute" defaultValue={this.state.minute} onChange={this.onDateTimeChange.bind(this)}>
        {minutes.map(minute => <option key={minute} value={minute}>{minute < 10 ? `0${minute}` : minute}</option>)}
      </select>
    )
  }

  onDateTimeSelected (event) {
    event.preventDefault()

    const dateTime = new Date(
      this.state.year,
      this.state.month - 1,
      this.state.day,
      this.state.hour,
      this.state.minute
    )

    this.props.onDateTimeSelected(dateTime)
  }

  render () {
    return (
      <form className="form" onSubmit={this.onDateTimeSelected.bind(this)}>

        <div className="form__item form__item--input form__item--select form__item--multiple">
          <label htmlFor="expirationDateMonth">
            Date
          </label>
          <div className="inputs">
            <div className="input">
              {this.getDaySelector()}
            </div>
            <div className="separator">
              /
            </div>
            <div className="input">
              {this.getMonthSelector()}
            </div>
            <div className="separator">
              /
            </div>
            <div className="input">
              {this.getYearSelector()}
            </div>
          </div>
        </div>

        <div className="form__item form__item--input form__item--select form__item--multiple">
          <label htmlFor="expirationDateMonth">
            Time
          </label>
          <div className="inputs">
            <div className="input">
              {this.getHourSelector()}
            </div>
            <div className="separator">
              :
            </div>
            <div className="input">
              {this.getMinuteSelector()}
            </div>
          </div>
          <p className="form__item--help">
            ({this.getTimeZone()})
          </p>
        </div>

        <div className="form__submit">
          <div className="btn-group btn-group--center">
            <button type="submit" className="btn">
              Validate date
            </button>
          </div>
        </div>

      </form>
    )
  }
}

export default DateTimeSelector
