import * as Bookmark from 'bookmark'

type globalDataStore = {
  bookmarkStore?: Bookmark.Store
  bookmarkArray?: Bookmark.FormattedBookmark[]
}

const globalDataStore: globalDataStore = {
}

export { globalDataStore }