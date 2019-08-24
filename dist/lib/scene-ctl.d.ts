declare type SceneOptions = {
    id: string;
    render?: Function;
};
declare type SEvent = {
    selector: string;
    eType: string;
};
declare class Scene {
    id: string;
    displayType: string;
    render?: Function;
    constructor(opts: SceneOptions);
    when(sev: SEvent): {
        /**
         * A handling pipeline, functions are called one by one
         *
         * The first callback in the pipeline receives d3 `event`,
         * later callbacks receive return value from the previous
         * callback.
         */
        do: (...handlers: Function[]) => void;
    };
}
declare type SceneList = Scene[];
declare class SceneController {
    scenes: SceneList;
    currentSceneId: string;
    constructor(...scenes: Scene[]);
    add(...scenes: Scene[]): void;
    switchTo(scene: Scene): void;
    _switchView(): void;
}
export { Scene, SceneController };
//# sourceMappingURL=scene-ctl.d.ts.map