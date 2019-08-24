/**
 * Read a file as a string using DOM FileReader
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 * @param file - A file metadata object
 */
declare function readFile(file: File): Promise<string>;
/**
 * Read a JSON file to JS object
 * @param file - A file metadata object
 */
declare function readJSON(file: File): Promise<any>;
/**
 * Get the first file of specified mime type in FileList
 * @param mime - A mime string
 * @param files - A FileList object
 */
declare function getFirstFileOfType(mime: string, files: FileList): File | undefined;
export { readFile, readJSON, getFirstFileOfType };
//# sourceMappingURL=handleFile.d.ts.map