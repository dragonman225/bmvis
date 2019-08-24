import { ERROR } from './strings'

/**
 * Read a file as a string using DOM FileReader
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 * @param file - A file metadata object
 */
async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = () => {
      let res = reader.result
      if (typeof res === 'string') resolve(res)
      else reject(ERROR.READ_FILE_FAIL)
    }
    reader.readAsText(file)
  })
}

/**
 * Read a JSON file to JS object
 * @param file - A file metadata object
 */
async function readJSON(file: File) {
  let fileContent = await readFile(file)
  return JSON.parse(fileContent)
}

/**
 * Get the first file of specified mime type in FileList
 * @param mime - A mime string
 * @param files - A FileList object
 */
function getFirstFileOfType(mime: string, files: FileList): File | undefined {
  for (let i = 0; i < files.length; i++) {
    if (files[i].type === mime) return files[i]
  }
}

export { readFile, readJSON, getFirstFileOfType }