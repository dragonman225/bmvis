import * as Bookmark from 'Bookmark'

type globalDataStore = {
  bookmarkStore?: Bookmark.Store
  bookmarkArray?: (Bookmark.UrlNode & { folderPath: string })[]
}

const globalDataStore: globalDataStore = {
}

export { globalDataStore }