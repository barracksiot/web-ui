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
import Slider from 'react-slick'
import { Link } from 'react-router'
import urls from 'config/urls.json'

class SupportView extends React.Component {
  static propTypes = {
    setHelperSteps: React.PropTypes.func.isRequired,
    startHelper: React.PropTypes.func.isRequired,
    startTour: React.PropTypes.func.isRequired,
    tourInProgress: React.PropTypes.bool
  }

  generateSlider () {
    const settings = {
      infinite: false,
      dots: true
    }

    return (
      <div className="slider">
        <Slider {...settings}>
          <div>
            <h2>Step 1: Enroll your first device</h2>
            <p>On Barracks, <b>devices are self enrolled</b>. You don’t need to import them manually. So, to get started with Barracks, you’ll need :</p>
            <ul>
              <li>Our <a href={urls.github.javascriptV2} target="_blank">NodeJs SDK</a></li>
              <li>Your <b>API key</b>. You’ll find it on <Link to={urls.routes.account}>your account page</Link></li>
            </ul>
            <p>Once it’s done, your devices will be enrolled on Barracks and appear in the Devices section</p>
          </div>
          <div>
            <h2>Step 2: Create a Package</h2>
            <p>Go <Link to={urls.routes.createPackage}>create a Package</Link> in the <Link to={urls.routes.packages}>Packages</Link> section</p>
            <ul>
              <li>By default, your package has an empty <b>deployment plan</b></li>
              <li>Once your package is created, upload one or several <b>Versions</b> of your package, in the versions tab</li>
            </ul>
            <p>Now let's talk about <b>Filters</b> and see how to deploy your package</p>
          </div>
          <div>
            <h2>Step 3: Create some Filters</h2>
            <p>Filter your device using customClient data or other information send by the devices</p>
            <ul>
              <li>Go to the <Link to={urls.routes.createFilter}>Create Filter Section</Link></li>
              <li>If you need help, check out our <a href={urls.documentation.filter} target="_blank">support page</a></li>
            </ul>
            <p>Once it’s done, you'll be able to use those Filters into your <b>Deployment plan</b></p>
          </div>
          <div>
            <h2>Step 4: Deploy your Package</h2>
            <ul>
              <li>You’ll be able to create rules using Filters</li>
              <li>Those rules will apply on your Package and its Versions</li>
            </ul>
            <p>As soon as your device pings Barracks, it will receive data to update itself</p>
            <p><b>And Voilà!</b></p>
          </div>
        </Slider>
      </div>
    )
  }

  startHelper () {
    const helperList = []

    if (this.props.tourInProgress) {
      helperList.push({
        text: '<p>This is the Packages page</p><p>Let\'s go there.</p>',
        selector: '[data-help="page-packages"]',
        position: 'right'
      })
    }

    console.log('Hello everybody :)')

    this.props.setHelperSteps(helperList)
    this.props.startHelper()
  }

  startTour () {
    this.props.startTour()
  }

  componentDidUpdate (previousProps) {
    if (this.props.tourInProgress && !previousProps.tourInProgress) {
      this.startHelper()
    }
  }

  render () {
    return (
      <main className="view">
        <header>
          <div className="content">
            <h2>
              Support
            </h2>
          </div>
        </header>
        <div className="content">
          <div className="support">
            {this.generateSlider()}
            <div className="actions">
              <div className="start">
                <p>
                  <button type="button" className="btn" onClick={this.startTour.bind(this)}>
                    Take a tour!
                  </button>
                </p>
              </div>
              <div className="support">
                <p>
                  Go to the <a href={urls.documentation.root} target="_blank">documentation <i className="fa fa-external-link" /></a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default SupportView
