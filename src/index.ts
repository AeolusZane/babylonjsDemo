import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import gsap from "gsap";

const canvas = document.querySelector<HTMLCanvasElement>("#babylon-view")!;

// 关闭加载屏幕
BABYLON.SceneLoader.ShowLoadingScreen = false;

const createEngine = async () => {
  const engine = new BABYLON.WebGPUEngine(canvas, {
    adaptToDeviceRatio: true, // 是否支持高分辨率设备，不开的话mac上会模糊
    powerPreference: "high-performance", // 优先使用高性能设备
  });

  await engine.initAsync();
  return engine;
};

class GameScene extends BABYLON.Scene {
  camera!: BABYLON.ArcRotateCamera;
  constructor(engine: BABYLON.WebGPUEngine) {
    super(engine);
    this.createCamera();
    this.createLight();
    // this.createBox();
    this.loadModel();
  }

  createCamera() {
    const camera = new BABYLON.ArcRotateCamera(
      "ArcRotateCamera",
      Math.PI / 4,
      Math.PI / 4,
      2000,
      BABYLON.Vector3.Zero(),
      this
    );
    camera.attachControl(canvas, true);
    this.camera = camera;
  }

  createLight() {
    // const light = new BABYLON.HemisphericLight(this);

    const directionalLiGHT = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(-4, -4, 4 * Math.PI),
      this
    );
    directionalLiGHT.intensity = 3;
  }

  createBox() {
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, this);
  }

  seeAirShip() {
    this.camera.radius = 2000;
  }

  seeAK() {
    console.log(123);
    this.camera.radius = 20;
  }

  async loadModel() {
    await BABYLON.SceneLoader.AppendAsync("/models/", "gozanti.glb", this);
    const glow = new BABYLON.GlowLayer("glow", this);
    glow.intensity = 1;
    gsap.to(glow, {
      intensity: 4,
      repeat: -1,
      ease: "linear",
      yoyo: true,
    });

    /**
     * 模型加载内存中
     */
    const assetArrayBuffer = await BABYLON.Tools.LoadFileAsync("/models/ak-74.glb", true);

    const blob = new Blob([assetArrayBuffer]);
    const url = URL.createObjectURL(blob);

    document.querySelector('#load')?.addEventListener('click', async () => {
      await BABYLON.SceneLoader.AppendAsync(url, undefined, this, undefined, '.glb');
    });

    document.querySelector('#ak')?.addEventListener('click', () => this.seeAK());
    document.querySelector('#airship')?.addEventListener('click', () => this.seeAirShip());

    /**
     * 模型加载动画
     */
    const list = <BABYLON.Mesh[]>this.getTransformNodeById('Gozanti.obj.cleaner.materialmerger.gles')!.getChildren();
    list.forEach(node => {
      node.rotation = new BABYLON.Vector3(0, 0, 0);
      gsap.to(node.rotation, {
        z: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: 'linear'
      })
    });


  }
}

const engine = await createEngine();
const scene = new GameScene(engine);
scene.debugLayer.show(
  {
    embedMode: true,
  }
);

engine.runRenderLoop(() => {
  scene.render();
});
