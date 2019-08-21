declare module 'Bookmark' {
  export interface Store {
    checksum: string
    roots: {
      bookmark_bar: Node
      other: Node
      synced: Node
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
}