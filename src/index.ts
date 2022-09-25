import * as BABYLON from "@babylonjs/core";

const canvas = document.querySelector<HTMLCanvasElement>("#babylon-view")!;



const createEngine = async ()=>{
    const engine = new BABYLON.WebGPUEngine(canvas,{
        adaptToDeviceRatio: true, // 是否支持高分辨率设备，不开的话mac上会模糊
        powerPreference: "high-performance", // 优先使用高性能设备
    });

    await engine.initAsync();
    return engine;
}

class GameScene extends BABYLON.Scene {
    constructor(engine:BABYLON.WebGPUEngine){
        super(engine);
        this.createCamera();
        this.createBox();
    }

    createCamera(){
        const camera = new BABYLON.ArcRotateCamera("camera",Math.PI/4,Math.PI/4,5,BABYLON.Vector3.Zero(),this);
        camera.attachControl(canvas,true);
    }

    createBox(){
        const box = BABYLON.MeshBuilder.CreateBox("box",{ size: 2 },this);
    }
}

const engine = await createEngine();
const scene = new GameScene(engine);

engine.runRenderLoop(()=>{
    scene.render();
});
