import * as Bookmark from 'bookmark';
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
declare function ignoreDrag(e: any): void;
declare function loadDroppedFile(e: any): Promise<Bookmark.Store | undefined>;
/**
 * Choose file with file-chooser to get file
 * @see https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
 */
declare function loadChosenFile(this: {
    files: FileList;
}): Promise<Bookmark.Store | undefined>;
/**
 * Flatten bookmark tree into array
 */
declare function processData(bookmark: Bookmark.Store): Bookmark.FormattedBookmark[] | undefined;
export { ignoreDrag, loadDroppedFile, loadChosenFile, processData };
//# sourceMappingURL=hello-scene.d.ts.map