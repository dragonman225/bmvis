function preventDefault(e: Event) {
  e.stopPropagation()
  e.preventDefault()
}

export { preventDefault }