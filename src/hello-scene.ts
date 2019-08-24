import { preventDefault } from './lib/event-utils'
import { readJSON, getFirstFileOfType } from './lib/handleFile'
import { ERROR } from './lib/strings'
import { globalDataStore } from './global-state'

import * as Bookmark from 'bookmark'

/**
 * Drag and drop to get file
 * @see https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#Selecting_files_using_drag_and_drop
 * 
 * In d3, use dedicated `event` object instead of passing `e` with functions 
 * to access event context.
 * 
 * Trying to access `e` passed by function leads to errors:
 * @see https://stackoverflow.com/questions/30420593/d3-js-image-mouseenter-stoppropagation-throw-error
 */

function ignoreDrag(e: any) {
  preventDefault(e)
} // ignoreDrag

async function loadDroppedFile(e: any) {
  try {
    preventDefault(e)

    const dt = e.dataTransfer
    if (!dt) throw new Error(ERROR.NO_FILES_IN_DT)

    /**
     * If user drop multiple files, find the first one being JSON 
     * in FileList.
     */
    const file = getFirstFileOfType('application/json', dt.files)
    if (!file) throw new Error(ERROR.NO_JSON_IN_FILELIST)

    let bookmarkData: Bookmark.Store = await readJSON(file)
    return bookmarkData
  } catch (error) {
    console.log(error)
  }
} // loadDroppedFile



/**
 * Choose file with file-chooser to get file
 * @see https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
 */

async function loadChosenFile(this: { files: FileList }) {
  try {
    let file = this.files[0]
    let bookmarkData: Bookmark.Store = await readJSON(file)
    globalDataStore.bookmarkStore = bookmarkData
    return bookmarkData
  } catch (error) {
    console.log(error)
  }
} // loadChosenFile



/**
 * Flatten bookmark tree into array
 */

function processData(bookmark: Bookmark.Store) {
  try {
    let bookmarkTrees = [
      bookmark.roots.bookmark_bar,
      bookmark.roots.other,
      bookmark.roots.synced
    ]
    let foldreNodePath: Bookmark.FolderNode[] = []
    let bookmarkArray: Bookmark.FormattedBookmark[] = []

    bookmarkTrees.forEach(node => {
      dfs(node, foldreNodePath, bookmarkArray)
    })

    bookmarkArray = bookmarkArray.sort((later, former) => {
      if (later.createdTime > former.createdTime) return 1
      else if (later.createdTime < former.createdTime) return -1
      else return 0
    })

    globalDataStore.bookmarkArray = bookmarkArray
    return bookmarkArray
  } catch (error) {
    console.log(error)
  }
} // processData

function dfs(
  tree: Bookmark.FolderNode,
  foldreNodePath: Bookmark.FolderNode[],
  bookmarkArray: Bookmark.FormattedBookmark[]
) {

  if (tree.children) {
    foldreNodePath.push(tree)

    tree.children.forEach(node => {
      if (node.type === 'folder') {
        let tree = node as Bookmark.FolderNode

        dfs(tree, foldreNodePath, bookmarkArray)

      } else {
        let leaf = node as Bookmark.UrlNode
        let path = foldreNodePath.map(n => n.name)
        bookmarkArray.push({
          createdTime: parseInt(leaf.date_added),
          id: leaf.id,
          name: leaf.name,
          url: leaf.url,
          folderPath: path
        })
      } // else
    }) // forEach
    
    foldreNodePath.pop()
  } // if

} // dfs

export { ignoreDrag, loadDroppedFile, loadChosenFile, processData }