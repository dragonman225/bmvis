import * as d3 from 'd3'
import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { forceSimulation, forceCenter, forceX, forceY, forceCollide, forceManyBody } from 'd3-force'

import { FormattedBookmark } from 'bookmark'

class CircleGraph {
  targetNode: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  data: FormattedBookmark[]
  graph: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  allGroups: any
  width: number
  height: number
  circleRadius: number
  circleColor: string
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>
  constructor(data: FormattedBookmark[], target: string) {

    this.targetNode = select(target)

    this.width = (this.targetNode.node() as unknown as HTMLElement).offsetWidth - 10
    this.height = (this.targetNode.node() as unknown as HTMLElement).offsetHeight - 10
    this.circleRadius = 50
    this.circleColor = '#4d4d4d'

    this.data = data
    this.graph = this.targetNode.append('svg')

    this.graph.attr('width', this.width)
      .attr('height', this.height)

    this.allGroups = this._drawGroups()
    this.simulation = this._startSimulation()

  } // constructor



  _drawSimulationFrame() {

    this.allGroups.selectAll('circle')
      .attr('cx', (d: any) => d.x = Math.max(this.circleRadius, Math.min(this.width - this.circleRadius, d.x)))
      .attr('cy', (d: any) => d.y = Math.max(this.circleRadius, Math.min(this.height - this.circleRadius, d.y)))

    /**
     * `this` is current DOM element
     * @see https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_attr
     * 
     * `getBBox()` to get the bounding box of the element
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getBBox
     */
    this.allGroups.selectAll('foreignObject')
      .attr('x',
        function (this: SVGGraphicsElement, d: FormattedBookmarkParticle) {
          return d.x - this.getBBox().width / 2
        })
      .attr('y',
        function (this: SVGGraphicsElement, d: FormattedBookmarkParticle) {
          return d.y - this.getBBox().height / 2
        })

  } // drawSimulationFrame



  resize() {

    this.width = (this.targetNode.node() as unknown as HTMLElement).offsetWidth - 10
    this.height = (this.targetNode.node() as unknown as HTMLElement).offsetHeight - 10
    this.graph.attr('width', this.width)
      .attr('height', this.height)

  } // resize



  update(newData: FormattedBookmark[]) {

    if (typeof this.graph.remove === 'function')
      this.graph.remove()

    this.data = newData
    this.graph = this.targetNode.append('svg')
      .attr('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')

    this.resize()

    this._drawGroups()
    this._startSimulation()

  } // update



  _drawGroups() {

    this.allGroups = this.graph.selectAll('g')
      .data(this.data)
      .enter()
      .append('g')
      .call(drag()
        .on('start', dragstarted.bind(this) as any)
        .on('drag', dragged.bind(this) as any)
        .on('end', dragended.bind(this) as any) as any)

    this.allGroups.append('circle')
      .attr('r', this.circleRadius)
      .attr('fill', this.circleColor)
      .attr('stroke', 'black')
      .attr('cx', this.width / 2)
      .attr('cy', this.height / 2)

    /**
     * Use HTML in SVG
     * @see https://stackoverflow.com/questions/45518545/svg-foreignobject-not-showing-on-any-browser-why
     */
    this.allGroups.append('a')
      .attr('href', (d: FormattedBookmark) => d.url)
      .attr('target', '_blank')
      .append('foreignObject')
      .attr('x', this.width / 2)
      .attr('y', this.height / 2)
      .attr('width', this.circleRadius * 2)
      .attr('height', this.circleRadius * 2)
      .append('xhtml:div')
      //.attr('fill', '#ddd')
      .text((d: FormattedBookmark) => d.name.substr(0, 25))

    return this.allGroups

  } // drawGroups



  _startSimulation() {

    this.simulation = forceSimulation()
      .force('x', forceX().strength(0.1).x(this.width / 2))
      .force('y', forceY().strength(0.3).y(this.height / 2))
      .force('center', forceCenter().x(this.width / 2).y(this.height / 2)) // Attraction to the center of the svg area
      .force('charge', forceManyBody().strength(15)) // Nodes are attracted one each other of value is > 0
      .force('collide', forceCollide().strength(.5).radius(this.circleRadius + 35).iterations(1)) // Force that avoids circle overlapping

    this.simulation
      .nodes(this.data as any)
      .on('tick', () => {
        requestAnimationFrame(this._drawSimulationFrame.bind(this))
      })

    return this.simulation

  }



  clear() {
    this.graph.remove()
  }

}

interface FormattedBookmarkParticle extends FormattedBookmark {
  fx: number | null
  fy: number | null
  x: number
  y: number
}

function dragstarted(
  this: CircleGraph,
  d: FormattedBookmarkParticle,
) {
  if (!event.active) this.simulation.alphaTarget(.03).restart()
  d.fx = d.x
  d.fy = d.y
}

function dragged(d: FormattedBookmarkParticle) {
  d.fx = event.x
  d.fy = event.y
}

function dragended(
  this: CircleGraph,
  d: FormattedBookmarkParticle
) {
  if (!event.active) this.simulation.alphaTarget(.03)
  d.fx = null
  d.fy = null
}

export { CircleGraph }