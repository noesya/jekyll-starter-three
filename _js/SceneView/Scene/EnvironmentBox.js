import {
    PMREMGenerator,
    UnsignedByteType,
    BoxBufferGeometry,
    MeshStandardMaterial,
    Mesh,
    BackSide
} from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import LoadManager from '../Loader/LoadManager';

export default class EnvironmentBox {
    constructor (app, texture) {
        this.app = app;
        this.texture = texture;
        this.load();
    }

    load () {
        const pmremGenerator = new PMREMGenerator(this.app.renderer);
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(this.texture).texture;

        this.app.scene.environment = envMap;

        this.texture.dispose();
        pmremGenerator.dispose();

        this.init();
    }

    init () {
        const geometry = new BoxBufferGeometry();
        geometry.deleteAttribute('uv');

        const roomMaterial = new MeshStandardMaterial({ metalness: 0, side: BackSide }),
            room = new Mesh(geometry, roomMaterial);

        room.scale.setScalar(100);

        this.app.scene.add(room);
    }
}
