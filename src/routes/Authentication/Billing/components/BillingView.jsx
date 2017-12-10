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
import $ from 'jquery'
import PaypalLogo from '../assets/logo-paypal.png'

class BillingView extends React.Component {
  static propTypes = {
    verifyAccount: React.PropTypes.func,
    isDisabled: React.PropTypes.bool,
    cleanState: React.PropTypes.func,
    isSubscribed: React.PropTypes.bool,
    getPlan: React.PropTypes.func,
    push: React.PropTypes.func.isRequired,
    location: React.PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.initState(props)
  }

  initState (props) {
    this.state = {
      plan: props.location.query.plan,
      billing: {}
    }

    if (props.billing) {
      this.state = Object.assign({}, this.state, {
        billing: props.billing
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isSubscribed) {
      this.props.push('/')
    }
  }

  componentWillMount () {
    this.setState(Object.assign({}, this.state, { isPaypalCallback: false }))

    if (this.props.location.query.payment === 'done') {
      this.setState(Object.assign({}, this.state, { isPaypalCallback: true }))
      this.props.verifyAccount()
    }

    if (this.props.location.query.payment === 'canceled') {
      this.setState(Object.assign({}, this.state, { isPaypalCallback: true }))
    }
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  onTabClick (event) {
    if (this.props.isDisabled === true) {
      return false
    }

    const $target = $(event.target)
    const $tabsWidget = $target.closest('.tabs-widget')
    const $tabs = $tabsWidget.find('.tabs-widget__tabs')
    const $items = $tabsWidget.find('.tabs-widget__items')
    const index = $tabs.find('button').index($target)

    if ($target.hasClass('tabs-widget__tab--active') !== true) {
      $tabs.find('.tabs-widget__tab--active').removeClass('tabs-widget__tab--active')
      $items.find('.tabs-widget__item--active').removeClass('tabs-widget__item--active')
      $target.addClass('tabs-widget__tab--active')
      $items.find('.tabs-widget__item:eq(' + index + ')').addClass('tabs-widget__item--active')
    }
  }

  onBillingPropertyChange (event) {
    const diff = {}
    diff[event.target.name] = event.target.value
    const newBilling = Object.assign({}, this.state.billing, diff)
    this.setState(Object.assign({}, this.state, { billing: newBilling }))
  }

  onCreditCardFormSubmit (event) {
    event.preventDefault()

    const billing = this.state.billing

    if (this.props.isDisabled === true) {
      return false
    }

    if (billing.expirationDateMonth && billing.expirationDateYear) {
      billing.expiration = billing.expirationDateMonth + '/' + billing.expirationDateYear
    }

    this.props.getPlan('cc', {
      plan: this.state.plan,
      paymentDetails: billing
    })
  }

  onPaypalFormSubmit (event) {
    event.preventDefault()

    if (this.props.isDisabled === true) {
      return false
    }

    const url = window.location.origin + window.location.pathname + '?plan=' + this.props.location.query.plan

    this.props.getPlan('paypal', {
      plan: this.state.plan,
      paymentDetails: {
        returnUrl: url + '&payment=done',
        cancelUrl: url + '&payment=canceled'
      }
    })
  }

  generateOptions (min, max) {
    const options = []

    for (let i = min; i <= max; i++) {
      options.push(<option key={i} value={i}>{i}</option>)
    }

    return options
  }

  render () {
    const currentYear = new Date().getFullYear()

    return (
      <main className="gate__content">
        <section className="smartbox smartbox--largest">
          <header className="smartbox__header">
            <h2>
              Billing information
            </h2>
          </header>

          <div className="smartbox__content">

            <p>
              Choose a payment's method.
            </p>

            <div className="tabs-widget">
              <div className="tabs-widget__tabs">
                <button type="button" className={this.state.isPaypalCallback ? 'tabs-widget__tab' : 'tabs-widget__tab tabs-widget__tab--active'} onClick={this.onTabClick.bind(this)}>
                  <i className="fa fa-credit-card" />
                  Credit card
                </button>
                <button type="button" className={this.state.isPaypalCallback ? 'tabs-widget__tab tabs-widget__tab--active' : 'tabs-widget__tab'} onClick={this.onTabClick.bind(this)}>
                  <i className="fa fa-paypal" />
                  PayPal
                </button>
              </div>
              <div className="tabs-widget__items">
                <div className={this.state.isPaypalCallback ? 'tabs-widget__item' : 'tabs-widget__item tabs-widget__item--active'}>

                  <form className="form" onSubmit={this.onCreditCardFormSubmit.bind(this)}>

                    <div className="form__item__group">

                      <div className="form__item form__item--input">
                        <label htmlFor="firstName">
                          First Name *
                        </label>
                        <div className="input">
                          <input type="text" id="firstName" name="firstName" placeholder="John" value={this.state.billing.firstName} onChange={this.onBillingPropertyChange.bind(this)} required />
                        </div>
                      </div>

                      <div className="form__item form__item--input">
                        <label htmlFor="lastName">
                          Last Name *
                        </label>
                        <div className="input">
                          <input type="text" id="lastName" name="lastName" placeholder="Doe" value={this.state.billing.lastName} onChange={this.onBillingPropertyChange.bind(this)} required />
                        </div>
                      </div>

                    </div>

                    <div className="form__item__group">

                      <div className="form__item form__item--input">
                        <label htmlFor="company">
                          Company
                        </label>
                        <div className="input">
                          <input type="text" id="company" name="company" placeholder="World Company" value={this.state.billing.company} onChange={this.onBillingPropertyChange.bind(this)} />
                        </div>
                      </div>

                      <div className="form__item form__item--input">
                        <label htmlFor="company">
                          Country *
                        </label>
                        <div className="input">
                          <input type="text" id="country" name="country" placeholder="US" value={this.state.billing.country} onChange={this.onBillingPropertyChange.bind(this)} required />
                        </div>
                      </div>

                    </div>

                    <div className="form__item form__item--input">
                      <label htmlFor="address">
                        Street Address *
                      </label>
                      <div className="input">
                        <input type="text" id="address" name="address" placeholder="350 5th Ave" value={this.state.billing.address} onChange={this.onBillingPropertyChange.bind(this)} required />
                      </div>
                    </div>

                    <div className="form__item__group">

                      <div className="form__item form__item--input form__item--full">
                        <label htmlFor="city">
                          City *
                        </label>
                        <div className="input">
                          <input type="text" id="city" name="city" placeholder="New York" value={this.state.billing.city} onChange={this.onBillingPropertyChange.bind(this)} required />
                        </div>
                      </div>

                      <div className="form__item form__item--input">
                        <label htmlFor="state">
                          State
                        </label>
                        <div className="input">
                          <input type="text" id="state" name="state" placeholder="NY" value={this.state.billing.state} onChange={this.onBillingPropertyChange.bind(this)} size="5" />
                        </div>
                      </div>

                      <div className="form__item form__item--input">
                        <label htmlFor="zip">
                          Postal Code *
                        </label>
                        <div className="input">
                          <input type="text" id="zip" name="zip" placeholder="10118" value={this.state.billing.postalCode} onChange={this.onBillingPropertyChange.bind(this)} required size="8" />
                        </div>
                      </div>

                    </div>

                    <div className="form__item__group">

                      <div className="form__item form__item--input">
                        <label htmlFor="number">
                          Card Number *
                        </label>
                        <div className="input">
                          <input type="text" id="number" name="number" placeholder="1234123412341234" pattern="[0-9]{13,16}" value={this.state.billing.cardNumber} onChange={this.onBillingPropertyChange.bind(this)} required />
                        </div>
                      </div>

                      <div className="form__item form__item--input form__item--select form__item--multiple">
                        <label htmlFor="expirationDateMonth">
                          Expiration Date *
                        </label>
                        <div className="inputs">
                          <div className="input">
                            <select id="expirationDateMonth" name="expirationDateMonth" defaultValue="" value={this.state.billing.expirationDateMonth} onChange={this.onBillingPropertyChange.bind(this)} required>
                              <option value="" disabled>MM</option>
                              <option value="01">01</option>
                              <option value="02">02</option>
                              <option value="03">03</option>
                              <option value="04">04</option>
                              <option value="05">05</option>
                              <option value="06">06</option>
                              <option value="07">07</option>
                              <option value="08">08</option>
                              <option value="09">09</option>
                              <option value="10">10</option>
                              <option value="11">11</option>
                              <option value="12">12</option>
                            </select>
                          </div>
                          <div className="separator">
                            /
                          </div>
                          <div className="input">
                            <select id="expirationDateYear" name="expirationDateYear" defaultValue="" value={this.state.billing.expirationDateYear} onChange={this.onBillingPropertyChange.bind(this)} required>
                              <option value="" disabled>YYYY</option>
                              {this.generateOptions(currentYear, currentYear + 10)}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form__item form__item--input">
                        <label htmlFor="code">
                          Card Code *
                        </label>
                        <div className="input">
                          <input type="text" id="code" name="code" placeholder="123" maxLength="4" value={this.state.billing.cardCode} onChange={this.onBillingPropertyChange.bind(this)} required size="6" />
                        </div>
                      </div>

                    </div>

                    <div className="form__submit">
                      <div className="btn-group btn-group--center">
                        <button type="submit" className="btn" disabled={this.props.isDisabled}>
                          Confirm account
                        </button>
                      </div>
                    </div>

                  </form>

                </div>
                <div className={this.state.isPaypalCallback ? 'tabs-widget__item tabs-widget__item--active' : 'tabs-widget__item'}>

                  <form className="form" onSubmit={this.onPaypalFormSubmit.bind(this)}>
                    <div className="center">
                      <img src={PaypalLogo} alt="" />
                    </div>
                    <div className="form__submit">
                      <div className="btn-group btn-group--center">
                        <button type="submit" className="btn" disabled={this.props.isDisabled}>
                          Confirm account with PayPal
                        </button>
                      </div>
                    </div>
                  </form>

                </div>
              </div>
            </div>

            <div className="form__other-links">
              <Link to="/authentication/offers">
                Back to plans list
              </Link>
            </div>

          </div>
        </section>
      </main>
    )
  }

}

export default BillingView
