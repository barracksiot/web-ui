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

class LoginView extends React.Component {
  static propTypes = {
    login: React.PropTypes.func
  }

  onFormSubmit (event) {
    event.preventDefault()

    this.props.login({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })
  }

  render () {
    return (
      <main className="gate__content">
        <section className="smartbox">

          <form className="form" onSubmit={this.onFormSubmit.bind(this)}>
            <header className="smartbox__header">
              <h2>
                Hello you!
              </h2>
            </header>

            <div className="smartbox__content">

              <p>
                Please confirm your credentials to enter in Barracks.
              </p>

              <div className="form__item form__item--input form__item--icon">
                <label htmlFor="username">
                  Email
                </label>
                <div className="input input--icon">
                  <input type="email" id="username" placeholder="john@doe.com" required />
                  <span className="icon">
                    <i className="fa fa-envelope" />
                  </span>
                </div>
              </div>

              <div className="form__item form__item--input form__item--icon">
                <label htmlFor="password">
                  Password
                </label>
                <div className="input input--icon">
                  <input type="password" id="password" placeholder="Password" required />
                  <span className="icon">
                    <i className="fa fa-lock" />
                  </span>
                </div>
              </div>

              <div className="form__submit">
                <div className="btn-group">
                  <button type="submit" className="btn btn--full">
                    Log In
                  </button>
                </div>
              </div>

              <div className="form__other-links">
                <Link to="/authentication/signup">
                  Need an account?
                </Link>
                <Link to="/authentication/forgotten-password">
                  Forgot password?
                </Link>
              </div>

            </div>
          </form>

        </section>
      </main>
    )
  }

}

export default LoginView
