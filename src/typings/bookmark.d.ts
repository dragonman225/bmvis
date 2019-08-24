declare module 'bookmark' {
  export interface Store {
    checksum: string
    roots: {
      bookmark_bar: FolderNode
      other: FolderNode
      synced: FolderNode
    }
    version: number
  }

  export interface Node {
    date_added: string
    id: string
    name: string
    type: NodeType
  }

  export interface FolderNode extends Node {
    children: Node[]
    date_modified: string
    type: NodeType.Folder
  }

  export interface UrlNode extends Node {
    type: NodeType.URL
    url: string
  }

  export enum NodeType {
    Folder = "folder",
    URL = "url"
  }

  export interface FormattedBookmark {
    createdTime: number
    id: string
    name: string
    url: string
    folderPath: string[]
  }
}