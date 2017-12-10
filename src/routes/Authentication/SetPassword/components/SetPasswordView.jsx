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

class SetPasswordView extends React.Component {
  static propTypes = {
    setPassword: React.PropTypes.func,
    isDisabled: React.PropTypes.bool,
    location: React.PropTypes.object
  }

  constructor (props) {
    super(props)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onPasswordConfirmationChange = this.onPasswordConfirmationChange.bind(this)
    this.state = {
      email: props.location.query.email,
      token: props.location.query.token
    }
  }

  onPasswordChange (event) {
    this.setState({
      password: event.target.value
    })
  }

  onPasswordConfirmationChange (event) {
    this.setState({
      passwordConfirmation: event.target.value
    })
  }

  onFormSubmit (event) {
    event.preventDefault()
    if (!this.props.isDisabled && this.state.password === this.state.passwordConfirmation) {
      this.props.setPassword(this.state)
    }
  }

  render () {
    return (
      <main className="gate__content">
        <section className="smartbox">

          <form className="form" onSubmit={this.onFormSubmit}>
            <header className="smartbox__header">
              <h2>
                You're almost done
              </h2>
            </header>

            <div className="smartbox__content">

              <p>
                Juste create your own secure password.
              </p>

              <div className="form__item form__item--input form__item--icon form__item--disabled">
                <div className="input input--icon">
                  <input type="text" id="email" value={this.state.email} disabled />
                  <span className="icon">
                    <i className="fa fa-envelope" />
                  </span>
                </div>
              </div>

              <div className="form__item form__item--input form__item--icon">
                <label htmlFor="password">
                  Create your password
                </label>
                <div className="input input--icon">
                  <input type="password" id="password" placeholder="Password" value={this.state.password} onChange={this.onPasswordChange} required data-needvalidation="" data-uppercase="1" data-digit="1" data-length="8" />
                  <span className="icon">
                    <i className="fa fa-lock" />
                  </span>
                </div>
                <div className="check">
                  <span className="check__require check__require--uppercase">
                    <b>1</b>
                    Uppercase
                  </span>
                  <span className="check__require check__require--digit">
                    <b>1</b>
                    Number
                  </span>
                  <span className="check__require check__require--length">
                    <b>8</b>
                    Characters
                  </span>
                </div>
              </div>

              <div className="form__item form__item--input form__item--icon">
                <label htmlFor="password-confirmation">
                  Confirm password
                </label>
                <div className="input input--icon">
                  <input type="password" id="password-confirmation" placeholder="Password" value={this.state.passwordConfirmation} onChange={this.onPasswordConfirmationChange} required />
                  <span className="icon">
                    <i className="fa fa-lock" />
                  </span>
                </div>
              </div>

              <div className="form__submit">
                <div className="btn-group">
                  <button type="submit" className="btn btn--full" disabled={this.props.isDisabled}>
                    Confirm password
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

        </section>
      </main>
    )
  }

}

export default SetPasswordView
