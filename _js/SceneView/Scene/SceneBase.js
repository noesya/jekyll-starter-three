import {
    WebGLRenderer,
    Scene,
    Color,
    PerspectiveCamera,
    GridHelper,
    Mesh,
    BoxGeometry,
    MeshBasicMaterial
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Lights from './Lights';
import EnvironmentBox from './EnvironmentBox';

export default class SceneBase {
    constructor () {
        this.init();
    }

    get width () {
        return window.innerWidth;
    }

    get height () {
        return window.innerHeight;
    }

    init () {
        this.setRenderer();
        this.setScene();
        this.setLights();
        this.setCamera();
        this.render();

        // EVENTS
        this.bindEvents();
    }

    bindEvents () {
        window.addEventListener('resize', this.resize.bind(this), false);
    }

    setRenderer () {
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        document.body.appendChild(this.renderer.domElement);
    }

    setScene () {
        this.scene = new Scene();
        this.scene.background = new Color(0x000000);
    }

    setLights () {
        this.lights = new Lights(this);
    }

    setCamera () {
        this.camera = new PerspectiveCamera(
            45,
            this.width / this.height,
            1,
            10000
        );
        this.camera.position.set(0, 30, 30);
    }

    setControls () {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.enableDamping = true;
        this.controls.update();
    }

    setHelpers () {
        this.gridHelper = new GridHelper(100, 10);
        this.scene.add(this.gridHelper);

        const cube = new Mesh(
            new BoxGeometry(10, 10, 10),
            new MeshBasicMaterial({ color: 0x003300 })
        );

        cube.position.set(45, 5, -45);
        this.scene.add(cube);
    }

    setEnvironmentBox (texture) {
        this.environmentBox = new EnvironmentBox(this, texture);
    }

    resize () {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    update () {
        //
    }

    render () {
        requestAnimationFrame(this.render.bind(this));
        if (this.controls) this.controls.update();
        this.update();
        this.renderer.render(this.scene, this.camera);
    }
}
