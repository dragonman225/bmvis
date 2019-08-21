/**
 * @module index
 * The following code describes the control flow of this application
 */

import { select, event } from 'd3-selection'

import { ERROR } from './strings'
import { readJSON, getFirstFileOfType } from './handleFile'
import { preventDefault } from './event-utils'

/**
 * 
 * 
 * Scene: Hello
 * 
 * Description:
 * In this scene, users can drag and drop file or choose file to provide 
 * their bookmark file.
 *
 * 
 */

/**
 * Drag and drop to provide bookmark file
 * @see https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#Selecting_files_using_drag_and_drop
 * 
 * In d3, use dedicated `event` object instead of passing `e` with functions 
 * to access event context.
 * 
 * Trying to access `e` passed by function leads to errors:
 * @see https://stackoverflow.com/questions/30420593/d3-js-image-mouseenter-stoppropagation-throw-error
 */

select('#scene-hello').on('dragenter dragover',
  function () {
    preventDefault(event)
  }
)

select('#scene-hello').on('drop',
  async function () {
    try {
      preventDefault(event)

      const dt = event.dataTransfer
      if (!dt) throw new Error(ERROR.NO_FILES_IN_DT)

      /**
       * If user drop multiple files, find the first one being JSON 
       * in FileList.
       */
      const file = getFirstFileOfType('application/json', dt.files)
      if (!file) throw new Error(ERROR.NO_JSON_IN_FILELIST)

      let bookmarkData = await readJSON(file)
      console.log(bookmarkData)
    } catch (error) {
      console.log(error)
    }
  }
)



/**
 * Choose file with file-chooser to provide bookmark file
 * @see https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
 */

select('#select-file').on('change',
  async function (this: { files: FileList }) {
    try {
      let file = this.files[0]
      let bookmarkData = await readJSON(file)
      console.log(bookmarkData)
    } catch (error) {
      console.log(error)
    }
  } as any
)

/**
 *
 *
 * Scene: Graph
 * 
 * Description:
 * In this scene, users can view visialized data of their bookmarks.
 *
 *
 */