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

import {
  LOCATION_CHANGE,
  locationChange,
  updateLocation,
  default as locationReducer
} from 'store/location'

describe('(Internal Module) Location', () => {
  it('Should export a constant LOCATION_CHANGE.', () => {
    expect(LOCATION_CHANGE).to.equal('LOCATION_CHANGE')
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(locationReducer).to.be.a('function')
    })

    it('Should initialize with a state of null.', () => {
      expect(locationReducer(undefined, {})).to.equal(null)
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = locationReducer(undefined, {})
      expect(state).to.equal(null)
      state = locationReducer(state, { type: '@@@@@@@' })
      expect(state).to.equal(null)

      const locationState = { pathname: '/yup' }
      state = locationReducer(state, locationChange(locationState))
      expect(state).to.equal(locationState)
      state = locationReducer(state, { type: '@@@@@@@' })
      expect(state).to.equal(locationState)
    })
  })

  describe('(Action Creator) locationChange', () => {
    it('Should be exported as a function.', () => {
      expect(locationChange).to.be.a('function')
    })

    it('Should return an action with type "LOCATION_CHANGE".', () => {
      expect(locationChange()).to.have.property('type', LOCATION_CHANGE)
    })

    it('Should assign the first argument to the "payload" property.', () => {
      const locationState = { pathname: '/yup' }
      expect(locationChange(locationState)).to.have.property('payload', locationState)
    })

    it('Should default the "payload" property to "/" if not provided.', () => {
      expect(locationChange()).to.have.property('payload', '/')
    })
  })

  describe('(Specialized Action Creator) updateLocation', () => {
    let _globalState
    let _dispatchSpy

    beforeEach(() => {
      _globalState = {
        location : locationReducer(undefined, {})
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState,
          location : locationReducer(_globalState.location, action)
        }
      })
    })

    it('Should be exported as a function.', () => {
      expect(updateLocation).to.be.a('function')
    })

    it('Should return a function (is a thunk).', () => {
      expect(updateLocation({ dispatch: _dispatchSpy })).to.be.a('function')
    })

    it('Should call dispatch exactly once.', () => {
      updateLocation({ dispatch: _dispatchSpy })('/')
      expect(_dispatchSpy.should.have.been.calledOnce)
    })
  })
})
