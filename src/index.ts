/**
 * @module index
 * The following code describes the control flow of this application
 */

import { Scene, SceneController } from './scenectl'
import { ignoreDrag, loadChosenFile, loadDroppedFile, processData } from './hello-scene'
import { getSliderVal, initGraph, updateGraph } from './graph-scene'

/**
 * Scenes
 */

const scenectl = new SceneController()

const hello = new Scene({
  id: '#hello'
})

const graph = new Scene({
  id: '#graph',
  render: initGraph
})

scenectl.add(hello, graph)

startApp()

function startApp() {

  /** SEvents of Scene: Hello */
  const dragFile = { selector: '#hello', eType: 'dragenter dragover' }
  const dropFile = { selector: '#hello', eType: 'drop' }
  const chooseFile = { selector: '#select-file', eType: 'change' }

  /** SEvents of Scene: Graph */
  const moveSlider = { selector: '#graph__slider input', eType: 'input' }

  /** Scene: Hello */
  hello.when(dragFile).do(ignoreDrag)
  hello.when(dropFile).do(loadDroppedFile, processData, printData, toView(graph))
  hello.when(chooseFile).do(loadChosenFile, processData, printData, toView(graph))

  /** Scene: Graph */
  graph.when(moveSlider).do(getSliderVal, printData, updateGraph)

  /** Start */
  scenectl.switchTo(hello)

}

/**
 * 
 * 
 * Utils
 * 
 * 
 */

function printData(data: any) {
  console.log(data)
  return data
}

function toView(scene: Scene): Function {
  return function () { scenectl.switchTo(scene) }
}