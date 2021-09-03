import { Mesh, SphereBufferGeometry, MeshStandardMaterial } from 'three'
import SceneBase from './Scene/SceneBase';
import LoadManager from './Loader/LoadManager';
import ASSETS from './assets';
import SETTINGS from './settings';

export default class SceneView extends SceneBase {
    isReady = false;
    init () {
        super.init();
        this.load();

        // HELPERS
        if (SETTINGS.DEBUG) {
            this.setControls();
            this.setHelpers();
        }
    }

    preload () {
        if (ASSETS.length > 0) {
            this.load();
        } else {
            this.setup();
        }
    }

    load () {
        const loaderTextDom = document.querySelector('.js-scene-loader-text'),
            progressDom = document.querySelector('.js-scene-loader-progress');

        LoadManager.onProgress.add((percent) => {
            loaderTextDom.innerText = `${percent * 100}%`;
            progressDom.style.width = `${percent * 100}%`;
        });

        LoadManager.onComplete.addOnce(() => {
            setTimeout(() => {
                this.setup();
            }, 200);
        });

        LoadManager.load(Object.values(ASSETS));
    }

    setup () {
        // Remove loader
        document.querySelector('.js-scene-loader').style.display = 'none';

        this.setEnvironmentBox(LoadManager.getFile(ASSETS.studio));

        this.addTestBox();
        this.isReady = true;
    }

    addTestBox () {
        const sphere = new Mesh(
            new SphereBufferGeometry(1, 32, 32),
            new MeshStandardMaterial({
                color: 0xDDDDDD,
                metalness: 1,
                roughness: 0.3
            })
        );

        this.scene.add(sphere);
    }

    update () {
        if (!this.isReady) return null;
    }
}
