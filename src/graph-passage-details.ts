import { globalDataStore } from './global-store'

function getSliderVal(this: { value: number }) {
  const sv = this.value
  return sv
}

function initGraph() {
  const bookmarks = globalDataStore.bookmarkArray
  if (bookmarks) {
    console.log(bookmarks)
  }
}

function updateGraph() {

}

export { getSliderVal, initGraph, updateGraph }