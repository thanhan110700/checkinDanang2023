import * as pc from 'playcanvas';
import * as TWEEN from '@tweenjs/tween.js';

let tweenList = [];

function createTween(config = {
  from: 0,
  to: 0,
  duration: 1000,
  easing: TWEEN.Easing.Linear.None,
  onUpdate: () => { },
  onComplete: () => { },
  onStart: () => { },
}) {

  let tween = new TWEEN.Tween({ value: config.from })
    .to({ value: config.to }, config.duration)
    .easing(config.easing)
    .onUpdate((obj) => {
      config.onUpdate && config.onUpdate(obj.value);
    })
    .onComplete(() => {
      config.onComplete && config.onComplete();
    });
  tweenList.push(tween);

  let start = tween.start;
  tween.start = (time, overrideStartingValues) => {
    if (tweenList.length === 1) {
      updateTween(Date.now());
    }
    start.call(tween, time, overrideStartingValues);
  }

  return tween;

}

function updateTween(time = 0) {
  tweenList.forEach(tween => {
    tween.update(time);
  });
  requestAnimationFrame(updateTween);
}

function destroyAllTween() {
  tweenList.forEach(tween => {
    tween.stop();
  });
  tweenList = [];
}


export default class LuckyWheelRender {

  /** @type {pc.Application|null} */
  app = null;

  init(canvas, callback) {

    window.pc = pc;

    const ammoPath = process.env.PUBLIC_URL + 'assets/ammo/';

    pc.WasmModule.setConfig('Ammo', {
      glueUrl: ammoPath + 'ammo.wasm.js',
      wasmUrl: ammoPath + 'ammo.wasm.wasm',
      fallbackUrl: ammoPath + 'ammo.js'
    });

    pc.WasmModule.getInstance("Ammo", (ammo) => {
      this._createApp(canvas, () => {
        callback && callback();
      });
    });


  }

  _createApp(canvas, callback) {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    const app = new pc.Application(canvas);

    // window.addEventListener('resize', () => {
    //   canvas.width = window.innerWidth * 0.8;
    //   canvas.height = window.innerHeight * 0.8;
    //   app.resizeCanvas(canvas.width, canvas.height);
    // })

    this.app = app;


    let assets = {
      "wired-sphere.glb": new pc.Asset("wired-sphere.glb", "model", { url: process.env.PUBLIC_URL + "assets/models/wired-sphere.glb" }),
      "sphere.glb": new pc.Asset("sphere.glb", "model", { url: process.env.PUBLIC_URL + "assets/models/sphere.glb" }),
    };

    const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
    assetListLoader.load(() => {
      app.start();
      this._initCamera();
      callback && callback();
    });
  }

  destroy() {
    this.app?.destroy();
    this.app = null;
  }

  _initCamera() {
    const camera = new pc.Entity('camera');
    camera.addComponent('camera', {
      clearColor: new pc.Color(1, 1, 1),
      projection: pc.PROJECTION_PERSPECTIVE,
    });
    this.app.root.addChild(camera);
    camera.setPosition(0, 0, 5);

    const light = new pc.Entity('light');
    light.addComponent('light', {
      type: "directional",
      color: new pc.Color(1, 1, 1),
      intensity: 1,
      castShadows: true,
      shadowBias: 0.05,
      normalOffsetBias: 0.03,
      shadowResolution: 2048,
      shadowDistance: 20,
    });
    this.app.root.addChild(light);
    light.setEulerAngles(45, 45, 0);

    this.camera = camera;

    this.plane = new pc.Entity('plane');
    this.plane.addComponent('model', {
      type: "plane",
      receiveShadows: true,
    });
    this.plane.addComponent('collision', {
      type: "box",
      halfExtents: new pc.Vec3(5, 0.01, 5)
    });
    this.plane.addComponent('rigidbody', {
      type: "static",
      friction: 1,
      restitution: 0.5,
    });
    this.plane.setLocalScale(10, 1, 10);
    let material = new pc.StandardMaterial();
    material.diffuse = new pc.Color(0.9, 0.9, 0.9);
    material.update();
    this.plane.model.meshInstances[0].material = material;
    this.plane.setLocalPosition(0, -1.8, 0);

    this.app.root.addChild(this.plane);

    this.app.scene.ambientLight = new pc.Color(0.5, 0.5, 0.5);
  }

  /**
   * @typedef UserData
   * @property {string} name
   * @property {string} avatarUrl
   * @property {number} index
   */

  /**
   * @param {UserData[]} users
   */
  createWheel(users) {
  
    let data = [...users]
    if(data.length > 100) { 
      data = data.slice(0, 100);
    }
    else {
      while(data.length < 50) {
        data = data.concat(data);
      }
    }

    this.users = [];

    this.wheel = new pc.Entity('wheel');
    this.app.root.addChild(this.wheel);

    this.wheel.addComponent('model', {
      asset: this.app.assets.find('wired-sphere.glb', 'model'),
      castShadows: true,
    });

    let material = new pc.StandardMaterial();
    material.diffuse = new pc.Color(0.5, 0.5, 0.5);
    material.useMetalness = true;
    material.metalness = 1;
    material.shininess = 100;
    material.emissive = new pc.Color(1, 1, 1);
    material.emissiveIntensity = 0.25;
    material.update();

    this.wheel.addComponent("collision", {
      type: "mesh",
      asset: this.app.assets.find('sphere.glb', 'model'),
      radius: 1
    });

    this.wheel.addComponent("rigidbody", {
      type: "kinematic",
      friction: 0.05,
    });

    setTimeout(() => {
      this.wheel.rigidbody.body.setCcdMotionThreshold(0.0000000000000001);
      this.wheel.rigidbody.body.setCcdSweptSphereRadius(0.5);
    }, 10);

    let index = 0;
    let intervalId = setInterval(() => {
      if (index === data.length) {
        clearInterval(intervalId);
        // this._start();
      }
      let userData = data[index];
      if (userData) {
        let user = this._createUser(userData);
        user.data = userData;
        this.users.push(user);
        this.app.root.addChild(user);
      }
      index++;
    }, 10);

    this.camera.lookAt(this.wheel.getPosition());

    if (!this.rotateTween) {
      this.rotateTween = createTween({
        from: { x: 0, y: 0, z: 0 },
        to: { x: 360 * 20, y: 360 * 2, z: 0 },
        duration: 30000,
        easing: TWEEN.Easing.Sinusoidal.InOut,
        onUpdate: (obj) => {
          this.wheel.setEulerAngles(obj.x, obj.y, obj.z);
        },
      });
    }
    else {
      this.rotateTween.stop();
    }
  }

  /**
   * @param {UserData} userData
   */
  random(userData, callback) {

    if (this.rotateTween.isPlaying()) {
      return;
    }
    this.rotateTween.onComplete(() => {
      this._dropRandom(userData, callback);
    })
    this.rotateTween.start();
  }

  _dropRandom(userData, callback) {
    let randomUser = this._createUser(userData);
    this.app.root.addChild(randomUser);
    this.winner = randomUser;
    this.rotateTween.stop();
    this.rotateTween.onComplete = null;

    setTimeout(() => {
      randomUser.rigidbody.teleport(0, -1.1, 0);
    }, 500);

    setTimeout(() => {
      randomUser.rigidbody.enabled = false;

      let tween = createTween({
        from: randomUser.getLocalPosition(),
        to: new pc.Vec3(0, 0, 4.5),
        duration: 2000,
        easing: TWEEN.Easing.Sinusoidal.InOut,
        onUpdate: (obj) => {
          randomUser.setLocalPosition(obj.x, obj.y, obj.z);
        },
      });
      let tween2 = createTween({
        from: randomUser.getLocalEulerAngles(),
        to: new pc.Vec3(0, 0, 0),
        duration: 2000,
        easing: TWEEN.Easing.Sinusoidal.InOut,
        onUpdate: (obj) => {
          randomUser.setLocalEulerAngles(obj.x, obj.y, obj.z);
        },
      });
      tween.start();
      tween2.start();

    }, 2000);

    setTimeout(() => {
      callback && callback();
    }, 4000);
  }

  close() {
    this.wheel?.destroy();
    this.wheel = null;
    this.users?.forEach(user => {
      user?.destroy();
    });
    this.users = [];
    this.winner?.destroy();
    this.winner = null;
    this.rotateTween = null;

    destroyAllTween();
  }


  /**
   * @param {UserData} user
   */
  _createUser(user) {
    const entity = new pc.Entity('user');
    entity.addComponent('model', {
      type: "box",
    });
    entity.addComponent('collision', {
      type: "box",
      halfExtents: new pc.Vec3(0.1, 0.1, 0.1)
    });

    entity.addComponent('rigidbody', {
      type: "dynamic",
      mass: 10,
    });

    setTimeout(() => {
      entity.rigidbody.body.setCcdMotionThreshold(0.0000000000000001);
      entity.rigidbody.body.setCcdSweptSphereRadius(0.05);
    }, 10);

    entity.setLocalScale(0.2, 0.2, 0.2);
    this._loadImageTexture(user.avatarUrl, texture => {
      let material = new pc.StandardMaterial();
      material.diffuseMap = texture;
      material.update();
      entity.model.meshInstances[0].material = material;
    });
    return entity;
  }

  /**
   * @param {string} url
   * @returns
   */
  _loadImageTexture(url, onload) {
    const texture = new pc.Texture(this.app.graphicsDevice);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      texture.setSource(img);
      texture.upload();
      onload && onload(texture);
    }
    img.src = url;

  }

  _loadModel(url, onload) {

    let filename = this._getFileName(url);

    const asset = new pc.Asset(filename, 'model', {
      url: url
    });
    asset.once('load', function (asset) {
      onload && onload(asset);
    });
    this.app.assets.add(asset);
    this.app.assets.load(asset);
  }

  _loadModels(urls, onload) {
    let total = urls.length;
    let count = 0;
    let check = () => {
      count++;
      if (count === total) {
        onload && onload();
      }
    }
    urls.forEach(url => {
      this._loadModel(url, check);
    });
  }

  _getFileName(url) {
    return url.substring(url.lastIndexOf('/') + 1);
  }
}