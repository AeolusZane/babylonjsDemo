import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
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
        this.createLight();
        // this.createBox();
        this.loadModel();
    }

    createCamera(){
        const camera = new BABYLON.ArcRotateCamera("camera",Math.PI/4,Math.PI/4,700,BABYLON.Vector3.Zero(),this);
        camera.attachControl(canvas,true);
    }

    createLight(){
        const light = new BABYLON.HemisphericLight("light",new BABYLON.Vector3(0,1,0),this);
    }

    createBox(){
        const box = BABYLON.MeshBuilder.CreateBox("box",{ size: 2 },this);
    }

    async loadModel(){
        await BABYLON.SceneLoader.AppendAsync("/models/","gozanti.glb",this);
        const glow = new BABYLON.GlowLayer("glow",this);
        glow.intensity = 10;
    }
}

const engine = await createEngine();
const scene = new GameScene(engine);

engine.runRenderLoop(()=>{
    scene.render();
});
