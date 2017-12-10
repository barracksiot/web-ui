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
import Authenticated from 'containers/Authenticated.jsx'
import Sidebar from 'components/Sidebar'
import Notifications from 'containers/Notifications'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { setJoyride, continueTour, endTour } from 'modules/helper'
import Joyride from 'react-joyride'
import 'styles/core.scss'
import { connect } from 'react-redux'
import { retrieveCurrentUser, logout } from 'modules/auth'
import { replace } from 'react-router-redux'

class AuthenticatedLayout extends React.Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired,
    setJoyride: React.PropTypes.func,
    tourProgress: React.PropTypes.object,
    helperSteps: React.PropTypes.array,
    currentPathname: React.PropTypes.string,
    continueTour: React.PropTypes.func,
    endTour: React.PropTypes.func
  }

  joyrideCallback (event) {
    if (event.action === 'skip' || event.action === 'close') {
      this.props.endTour()
    } else if (this.props.tourProgress && event.type === 'finished') {
      this.props.continueTour()
    }
  }

  render () {
    return (
      <div className="app">
        <Joyride
          ref={joyride => { this.props.setJoyride(joyride) }}
          steps={this.props.helperSteps}
          debug={false}
          type="continuous"
          showSkipButton
          showStepsProgress
          callback={this.joyrideCallback.bind(this)} />
        <Sidebar currentPathname={this.props.currentPathname} />
        {this.props.children}
        <Notifications />
      </div>
    )
  }

}

const mapDispatchToProps = {
  retrieveCurrentUser,
  logout,
  setJoyride,
  continueTour,
  endTour,
  replace
}

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.auth.currentUser,
  currentPathname: ownProps.location.pathname,
  helperSteps: state.helper.steps,
  tourProgress: state.helper.tourProgress
})

export default DragDropContext(HTML5Backend)(connect(mapStateToProps, mapDispatchToProps)(Authenticated(AuthenticatedLayout)))
