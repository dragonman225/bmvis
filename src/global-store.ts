import * as Bookmark from 'bookmark'

type globalDataStore = {
  bookmarkStore?: Bookmark.Store
  bookmarkArray?: FormattedBookmark[]
}

type FormattedBookmark = {
  createdTime: number
  id: string
  name: string
  url: string
  folderPath: string
}

const globalDataStore: globalDataStore = {
}

export { globalDataStore }