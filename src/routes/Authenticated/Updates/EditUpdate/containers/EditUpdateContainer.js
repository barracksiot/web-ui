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

import { connect } from 'react-redux'
import EditUpdateView from '../components/EditUpdateView.jsx'
import { getSegmentsList, getUpdate, editUpdate, cleanState } from '../modules/editUpdate'

const mapDispatchToProps = {
  getSegmentsList,
  getUpdate,
  onSubmit: editUpdate,
  cleanState
}

const mapStateToProps = (state) => ({
  segmentsList: state.editUpdate.segmentsList,
  update: state.editUpdate.update ? {
    segmentId: state.editUpdate.update.segmentId,
    segmentName: state.editUpdate.update.segmentName,
    description: state.editUpdate.update.description,
    name: state.editUpdate.update.name,
    additionalProperties: state.editUpdate.update.additionalProperties,
    packageId: state.editUpdate.update.packageId,
    uuid: state.editUpdate.update.uuid,
    versionId: state.editUpdate.update.versionId,
    status: state.editUpdate.update.status,
    fileName: state.editUpdate.update.fileName
  } : {}
})

export default connect(mapStateToProps, mapDispatchToProps)(EditUpdateView)
