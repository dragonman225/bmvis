import * as d3 from 'd3';
import { FormattedBookmark } from 'bookmark';
declare class CircleGraph {
    targetNode: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    data: FormattedBookmark[];
    graph: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    allGroups: any;
    width: number;
    height: number;
    circleRadius: number;
    circleBorder: number;
    getCircleColor: d3.ScaleOrdinal<string, unknown>;
    simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>;
    constructor(data: FormattedBookmark[], target: string);
    resize(): void;
    update(newData: FormattedBookmark[]): void;
    _drawGroups(): any;
    _startSimulation(): d3.Simulation<d3.SimulationNodeDatum, undefined>;
    _drawSimulationFrame(): void;
    clear(): void;
}
export { CircleGraph };
//# sourceMappingURL=circle-graph.d.ts.map