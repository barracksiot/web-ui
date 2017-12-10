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
import OnDemandImage from './assets/on-demand.png'

class OffersView extends React.Component {
  static propTypes = {
    onFreePlanChoice: React.PropTypes.func
  }

  render () {
    return (
      <section className="offers">

        <h2>
          Choose your plan
        </h2>

        <div className="tiles-offers">

          <div className="tile tile--price">

            <h3 className="title">
              Free
            </h3>

            <div className="price">
              <span data-price><span className="currency">$</span>0<span className="frequency">/mo</span></span>
            </div>

            <ul className="specifications">
              <li>
                <strong><span data-quantity>50</span> devices</strong>
              </li>
              <li>
                <span data-capacity>5 GB/mo</span> transfer
              </li>
              <li>
                Online Help
              </li>
            </ul>

            <div className="btn-group btn-group--full">
              <button onClick={this.props.onFreePlanChoice} className="btn">
                Get Free
              </button>
            </div>

          </div>

          <div className="tile tile--price tile--ondemand">

            <h3 className="title">
              On demand
            </h3>

            <div className="picture">
              <img src={OnDemandImage} alt="" />
            </div>

            <ul className="specifications">
              <li>
                <strong>∞ devices</strong>
              </li>
              <li>
                Personalized Support
              </li>
              <li>
                SLA tickets
              </li>
            </ul>

            <div className="btn-group btn-group--full">
              <a className="btn btn--alt" href="https://barracks.io/contact/" target="_blank">
                Talk with us
              </a>
            </div>

          </div>

        </div>

      </section>
    )
  }

}

export default OffersView
