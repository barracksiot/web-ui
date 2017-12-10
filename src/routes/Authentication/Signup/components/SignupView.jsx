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

class SignupView extends React.Component {
  static propTypes = {
    signup: React.PropTypes.func,
    isDisabled: React.PropTypes.bool,
    signupSucceed: React.PropTypes.bool,
    emailSent: React.PropTypes.bool,
    cleanState: React.PropTypes.func
  }

  constructor () {
    super()
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  componentWillUnmount () {
    this.props.cleanState()
  }

  onFormSubmit (event) {
    event.preventDefault()

    if (this.props.isDisabled !== true) {
      this.props.signup({
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        phone: document.getElementById('phone').value
      })
    }
  }

  getFormTile () {
    if (!this.props.signupSucceed || !this.props.emailSent) {
      return (
        <form className="form" onSubmit={this.onFormSubmit}>
          <header className="smartbox__header">
            <h2>
              Join Barracks
            </h2>
          </header>

          <div className="smartbox__content">

            <p>
              Ask for an account.
            </p>

            <div className="form__item__group">

              <div className="form__item form__item--input form__item--icon">
                <label htmlFor="firstName">
                  First Name
                </label>
                <div className="input input--icon">
                  <input type="text" id="firstName" placeholder="John" required />
                  <span className="icon">
                    <i className="fa fa-user" />
                  </span>
                </div>
              </div>

              <div className="form__item form__item--input form__item--icon">
                <label htmlFor="lastName">
                  Last Name
                </label>
                <div className="input input--icon">
                  <input type="text" id="lastName" placeholder="Doe" required />
                  <span className="icon">
                    <i className="fa fa-user" />
                  </span>
                </div>
              </div>

            </div>

            <div className="form__item__group">

              <div className="form__item form__item--input form__item--icon">
                <label htmlFor="phone">
                  Phone
                </label>
                <div className="input input--icon">
                  <input type="tel" id="phone" placeholder="+1 555 555-5555" required />
                  <span className="icon">
                    <i className="fa fa-phone" />
                  </span>
                </div>
              </div>

              <div className="form__item form__item--input form__item--icon">
                <label htmlFor="company">
                  Company
                </label>
                <div className="input input--icon">
                  <input type="text" id="company" placeholder="Doe Inc." required />
                  <span className="icon">
                    <i className="fa fa-building" />
                  </span>
                </div>
              </div>

            </div>

            <div className="form__item form__item--input form__item--icon">
              <label htmlFor="email">
                Email
              </label>
              <div className="input input--icon">
                <input type="email" id="email" placeholder="john@doe.com" required />
                <span className="icon">
                  <i className="fa fa-envelope" />
                </span>
              </div>
            </div>

            <div className="form__item form__item--checkbox">
              <div className="input">
                <input type="checkbox" id="tou" required />
              </div>
              <label htmlFor="tou">
                By clicking this button, you agree to Barracks's <a href="https://barracks.io/terms-and-conditions/" target="_blank">Terms of Use</a>.
              </label>
            </div>

            <div className="form__submit">
              <div className="btn-group">
                <button type="submit" className="btn btn--full" disabled={this.props.isDisabled}>
                  Create account
                </button>
              </div>
            </div>

            <div className="form__other-links">
              <Link to="/authentication/login">
                Already have an account?
              </Link>
            </div>

          </div>
        </form>
      )
    }
  }

  getSuccessTile () {
    if (this.props.signupSucceed && this.props.emailSent) {
      return (
        <div>
          <header className="smartbox__header">
            <h2>Welcome to Barracks!</h2>
          </header>
          <div className="smartbox__content">
            <p>An email has been sent to your address to confirm your account.</p>
          </div>
          <div className="form__other-links">
            <Link to="/authentication/login">
              Back to log in page
            </Link>
          </div>
        </div>
      )
    }
  }

  render () {
    return (
      <main className="gate__content">
        <section className="smartbox smartbox--large">
          {this.getFormTile()}
          {this.getSuccessTile()}
        </section>
      </main>
    )
  }

}

export default SignupView
