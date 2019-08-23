import { select } from 'd3-selection'

import { globalDataStore } from './global-store'
import { CircleGraph } from './circle-graph'
import { ERROR } from './strings'

const timeSpan = 1000 * 1000 * 60 * 60 * 24 * 7 // microseconds
const sliderStep = 1000 * 1000 * 60 * 60 * 24
let g: CircleGraph

function getSliderVal(this: { valueAsNumber: number }) {
  const sv = this.valueAsNumber
  return sv
}

/**
 * Convert Chrome timestamp to date
 * @param ts - Chrome timestamp
 * @see https://www.epochconverter.com/webkit
 */
function wkTimestampToDate(ts: number) {
  const epochToWkDiffSec = 11644473600
  const wkSec = ts / 1000000
  const epochSec = wkSec - epochToWkDiffSec
  const d = new Date(epochSec * 1000)
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return d.toLocaleDateString('en-US', opts)
}

function initGraph() {
  const bookmarks = globalDataStore.bookmarkArray
  if (bookmarks) {
    let minTime = bookmarks[0].createdTime
    let maxTime = bookmarks[bookmarks.length - 1].createdTime

    select('#graph__slider input')
      .attr('min', minTime)
      .attr('max', maxTime - timeSpan)
      .attr('step', sliderStep)
      .attr('value', maxTime - timeSpan)

    updateGraph(maxTime - timeSpan)
  }
}

function setDateDisplay(wkTs: number) {
  let sta = wkTimestampToDate(wkTs)
  let end = wkTimestampToDate(wkTs + timeSpan)
  select('#graph__slider h3')
    .text(`${sta} ~ ${end}`)
}

function updateGraph(sliderValue: number) {
  setDateDisplay(sliderValue)

  const bookmarks = globalDataStore.bookmarkArray
  if (!bookmarks) throw new Error(ERROR.NO_BM)

  const bookmarksToShow = bookmarks
    .filter(b => {
      return (b.createdTime >= sliderValue) && (b.createdTime <= sliderValue + timeSpan)
    })
    .filter(b => {
      return b.folderPath.indexOf('FB') === -1
        && b.folderPath.indexOf('Media') === -1
        && b.folderPath.indexOf('tmp') === -1
    })

  console.log(bookmarksToShow, timeSpan, sliderValue + timeSpan)

  if (bookmarksToShow.length > 0) {
    if (!g) g = new CircleGraph(bookmarksToShow, '#graph__draw')
    else g.update(bookmarksToShow)
  } else {
    g.clear()
  }

}

export { getSliderVal, initGraph, updateGraph }