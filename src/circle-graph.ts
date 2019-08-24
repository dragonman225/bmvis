import * as d3 from 'd3' // only for typings
import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'
import { forceSimulation, forceCenter, forceX, forceY, forceCollide, forceManyBody } from 'd3-force'
import { scaleOrdinal } from 'd3-scale'

import { FormattedBookmark } from 'bookmark'

class CircleGraph {
  targetNode: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  data: FormattedBookmark[]
  graph: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
  allGroups: any
  width: number
  height: number
  circleRadius: number
  circleBorder: number
  getCircleColor: d3.ScaleOrdinal<string, unknown>
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>
  constructor(data: FormattedBookmark[], target: string) {

    this.targetNode = select(target)

    this.width = (this.targetNode.node() as unknown as HTMLElement).offsetWidth - 10
    this.height = (this.targetNode.node() as unknown as HTMLElement).offsetHeight - 10
    this.circleRadius = 60
    this.circleBorder = 4
    this.getCircleColor = scaleOrdinal(['#F8766D', '#00BA38', '#619CFF', '#9ef4fa', '#ee9df4', '#f2ef9e'])

    /** Tooltip, before graph so that it's visible */
    this.tooltip = this.targetNode.append('div')
      .attr('id', 'graph__tooltip')

    this.data = data
    this.graph = this.targetNode.append('svg')

    this.graph.attr('width', this.width)
      .attr('height', this.height)

    this.allGroups = this._drawGroups()
    this.simulation = this._startSimulation()

  } // constructor



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
      .on('hover', updateTooltipPos.bind(this) as any)
      .on('mousemove', updateTooltipPos.bind(this) as any)
      .on('mouseleave', mouseleave.bind(this))

    /** Draw a SVG <circle> */
    this.allGroups.append('circle')
      .attr('r', this.circleRadius)
      .attr('fill', (d: FormattedBookmark) => this.getCircleColor(d.folderPath))
      .attr('stroke', 'black')
      .attr('stroke-width', this.circleBorder)
      .attr('cx', this.width / 2)
      .attr('cy', this.height / 2)

    /**
     * Draw a SVG <a>, then inside <a>, draw two HTML <div>.
     * The size of <div> is set to the max size of a square 
     * the <circle> can contain. Example picture:
     * @see https://ds055uzetaobb.cloudfront.net/brioche/uploads/YebdMMueFz-ukinnam.jpg
     * 
     * To make HTML works in SVG
     * @see https://stackoverflow.com/questions/45518545/svg-foreignobject-not-showing-on-any-browser-why
     */
    let htmlContainer = this.allGroups.append('a')
      .attr('href', (d: FormattedBookmark) => d.url)
      .attr('target', '_blank')
      .attr('rel', 'nofollow noopener noreferrer')
      .append('foreignObject')
      .attr('x', this.width / 2)
      .attr('y', this.height / 2)
      .attr('width', this.circleRadius / Math.sqrt(2) * 2)
      .attr('height', this.circleRadius / Math.sqrt(2) * 2)

    htmlContainer.append('xhtml:div')
      .append('xhtml:div')
      .text((d: FormattedBookmark) => d.name)

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



  _drawSimulationFrame() {

    this.allGroups.selectAll('circle')
      .attr('cx', (d: any) => d.x =
        Math.max(this.circleRadius + this.circleBorder,
          Math.min(this.width - this.circleRadius - this.circleBorder, d.x)))
      .attr('cy', (d: any) => d.y =
        Math.max(this.circleRadius + this.circleBorder,
          Math.min(this.height - this.circleRadius - this.circleBorder, d.y)))

    /**
     * `this` is current DOM element
     * @see https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_attr
     * 
     * `getBBox()` to get the bounding box of the SVG text
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getBBox
     * 
     * Note: From performance profiler, I found `getBBox()` costs CPU time 
     * the most, thus make animation laggy when there're tens of nodes.
     * 
     * Later I found that it's possible to use HTML in SVG with 
     * `<foreignObject>`, and use CSS to style the HTML. This way 
     * I don't need `getBBox()` since HTML can wrap text automatically.
     * The result is, force simulation animation is much faster.
     * 
     */
    // this.allGroups.selectAll('foreignObject')
    //   .attr('x',
    //     function (this: SVGGraphicsElement, d: FormattedBookmarkParticle) {
    //       return d.x - this.getBBox().width / 2
    //     })
    //   .attr('y',
    //     function (this: SVGGraphicsElement, d: FormattedBookmarkParticle) {
    //       return d.y - this.getBBox().height / 2
    //     })

    this.allGroups.selectAll('foreignObject')
      .attr('x',
        (d: FormattedBookmarkParticle) => {
          return d.x - this.circleRadius / Math.sqrt(2)
        })
      .attr('y',
        (d: FormattedBookmarkParticle) => {
          return d.y - this.circleRadius / Math.sqrt(2)
        })

  } // drawSimulationFrame



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
  this.tooltip.style('display', 'none')

  if (!event.active) this.simulation.alphaTarget(.03).restart()
  d.fx = d.x
  d.fy = d.y
}

function dragged(
  this: CircleGraph,
  d: FormattedBookmarkParticle
) {
  this.tooltip.style('display', 'none')

  d.fx = event.x
  d.fy = event.y
}

function dragended(
  this: CircleGraph,
  d: FormattedBookmarkParticle
) {
  updateTooltipPos.call(this, d)
  this.tooltip.style('display', 'block')

  if (!event.active) this.simulation.alphaTarget(.03)
  d.fx = null
  d.fy = null
}

function updateTooltipPos(
  this: CircleGraph,
  d: FormattedBookmarkParticle
) {

  const offbase = this.circleRadius / Math.sqrt(2) + 5
  const mwMargin = 20

  let tx: string, ty: string, mw: number, mh: number,
    offx: number, offy: number

  if (d.x > this.width / 2) {
    tx = '-100%'
    offx = -offbase
    mw = d.x + offx - mwMargin
  } else {
    tx = '0%'
    offx = offbase
    mw = this.width - d.x - offx - mwMargin
  }

  if (d.y > this.height / 2) {
    ty = '-100%'
    offy = -offbase
    mh = d.y + offy - mwMargin
  } else {
    ty = '0%'
    offy = offbase
    mh = this.height - d.y - offy - mwMargin
  }

  this.tooltip
    .html(`\
<div class="tooltip__name">${d.name}</div>
<div class="tooltip__folder">${d.folderPath.split('/').join(' → ')}</div>
<div class="tooltip__url" >${d.url}</div>`)
    .style('left', `${d.x + offx}px`)
    .style('top', `${d.y + offy}px`)
    .style('transform', `translate(${tx}, ${ty})`)
    .style('max-width', `${mw}px`)
    .style('max-height', `${mh}px`)
    .style('display', 'block')

}

function mouseleave(
  this: CircleGraph
) {
  this.tooltip.style('display', 'none')
}

export { CircleGraph }