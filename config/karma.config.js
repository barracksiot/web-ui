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

const argv = require('yargs').argv
const project = require('./project.config')
const webpackConfig = require('./webpack.config')
const debug = require('debug')('app:config:karma')

debug('Creating configuration.')
const karmaConfig = {
  basePath : '../', // project root in relation to bin/karma.js
  files    : [
    {
      pattern  : `./${project.dir_test}/test-bundler.js`,
      watched  : false,
      served   : true,
      included : true
    }
  ],
  singleRun     : !argv.watch,
  frameworks    : ['mocha'],
  reporters     : ['mocha'],
  preprocessors : {
    [`${project.dir_test}/test-bundler.js`] : ['webpack']
  },
  browsers : ['PhantomJS'],
  webpack  : {
    devtool : 'cheap-module-source-map',
    resolve : Object.assign({}, webpackConfig.resolve, {
      alias : Object.assign({}, webpackConfig.resolve.alias, {
        sinon : 'sinon/pkg/sinon.js'
      })
    }),
    plugins : webpackConfig.plugins,
    module  : {
      noParse : [
        /\/sinon\.js/
      ],
      loaders : webpackConfig.module.loaders.concat([
        {
          test   : /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
          loader : 'imports?define=>false,require=>false'
        }
      ])
    },
    // Enzyme fix, see:
    // https://github.com/airbnb/enzyme/issues/47
    externals : Object.assign({}, webpackConfig.externals, {
      'react/addons'                   : true,
      'react/lib/ExecutionEnvironment' : true,
      'react/lib/ReactContext'         : 'window'
    }),
    sassLoader : webpackConfig.sassLoader
  },
  webpackMiddleware : {
    noInfo : true
  },
  coverageReporter : {
    reporters : project.coverage_reporters
  }
}

if (project.globals.__COVERAGE__) {
  karmaConfig.reporters.push('coverage')
  karmaConfig.webpack.module.preLoaders = [{
    test    : /\.(js|jsx)$/,
    include : new RegExp(project.dir_client),
    exclude : /node_modules/,
    loader  : 'babel',
    query   : Object.assign({}, project.compiler_babel, {
      plugins : (project.compiler_babel.plugins || []).concat('istanbul')
    })
  }]
}

module.exports = (cfg) => cfg.set(karmaConfig)
