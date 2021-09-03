import {
    AmbientLight,
    DirectionalLight
} from 'three';

export default class Lights {
    constructor (app) {
        this.app = app;
        this.create();
    }

    create () {
        this.ambientLight = new AmbientLight(0x808080);
        this.app.scene.add(this.ambientLight);

        this.lights = [];

        this.add({
            x: 3,
            y: 10,
            z: 0.5
        });

        this.add({
            x: -3,
            y: 10,
            z: 0.5
        });
    }

    add ({ x, y, z }) {
        const dirLight = new DirectionalLight(0xffffff);
        dirLight.position.set(x, y, z).normalize();
        this.lights.push(dirLight);
        this.app.scene.add(dirLight);
    }

    update () {
        //
    }
}
