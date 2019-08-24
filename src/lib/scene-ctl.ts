import { select, event } from 'd3-selection'

type SceneOptions = {
  id: string
  render?: Function
}

type SEvent = {
  selector: string
  eType: string
}

class Scene {
  id: string
  displayType: string
  render?: Function
  constructor(opts: SceneOptions) {
    this.id = opts.id
    this.displayType = getElemDisplayType(opts.id)
    this.render = opts.render
  }

  when(sev: SEvent) {
    return {
      /**
       * A handling pipeline, functions are called one by one
       * 
       * The first callback in the pipeline receives d3 `event`,
       * later callbacks receive return value from the previous 
       * callback.
       */
      do: (...handlers: Function[]) => {

        setEvent(sev.selector, sev.eType,
          /** Must use normal function so `this` is the event's context */
          async function (this: any) {
            let rv = event
            for (let i = 0; i < handlers.length; i++) {
              rv = handlers[i].call(this, rv)
              if (rv instanceof Promise) rv = await rv
            }
          })

      } // do
    } // return of Scene.when
  } // Scene.when
} // Scene

type SceneList = Scene[]

class SceneController {
  scenes: SceneList
  currentSceneId: string
  constructor(...scenes: Scene[]) {
    if (scenes.length) {
      this.scenes = scenes
      this.currentSceneId = scenes[0].id
    } else {
      this.scenes = []
      this.currentSceneId = ''
    }
  }

  add(...scenes: Scene[]) {
    scenes.forEach(newScene => {
      if (!this.scenes.find(scene => scene.id === newScene.id))
        this.scenes.push(newScene)
    })
  }

  switchTo(scene: Scene) {
    let sceneId = scene.id
    this.currentSceneId = sceneId
    this._switchView()
    if (typeof scene.render === 'function')
      scene.render()
  }

  _switchView() {
    this.scenes.forEach(scene => {
      if (scene.id === this.currentSceneId) {
        showElem(scene.id, scene.displayType)
      } else {
        hideElem(scene.id)
      }
    })
  }
}

function setEvent(selector: string, eType: string, handler: Function) {
  select(selector).on(eType, handler as any)
}

function showElem(id: string, displayType: string) {
  select(id).style('display', displayType)
}

function hideElem(id: string) {
  select(id).style('display', 'none')
}

function getElemDisplayType(id: string) {
  return select(id).style('display')
}

export { Scene, SceneController }