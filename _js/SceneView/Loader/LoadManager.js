import { LoadingManager, TextureLoader, UnsignedByteType } from "three";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import Signal from 'signals';

class LoadManager {
    _loadedTotal = 0;
    _isLoading = false;
    _waitingQueue = [];
    _loadingQueue = [];
    _loadedFiles = new Map();
    onProgress = new Signal();
    onComplete = new Signal();

    constructor () {
        this.manager = new LoadingManager();
        this.loader = new TextureLoader();
    }

    load (url) {
        if (Array.isArray(url)) {
            // handle multiple urls
            url.map(value => this.load(value));
        } else if (url.type === 'cube') {
            this._waitingQueue.push(JSON.stringify(url));
        } else if (this._isUrlPresent(url)) {
            return console.log(`${url} is already present in queue`);
        } else {
            // add to queue
            this._waitingQueue.push(url);
        }

        if (!this._isLoading) {
            this._start();
        }
    }

    _isUrlPresent (url) {
        const isUrlToLoad = this._waitingQueue.indexOf(url) != -1,
            isUrlLoading = this._loadingQueue.indexOf(url) != -1,
            isUrlLoaded = this._loadedFiles.has(url),
            isUrlExist = isUrlToLoad || isUrlLoading || isUrlLoaded;

        return isUrlExist;
    }
    _start () {
        this._isLoading = true;
        this._loadedTotal = 0;
        this._loadNext();
    }
    _loadNext () {
        if (this._waitingQueue.length > 0) {
            const url = this._waitingQueue.shift();
            const loader = this._getLoader(url);
            this._loadingQueue.push(url);

            if (loader) {
                loader.load(
                    url,
                    // load success
                    (data) => {
                        this._onLoaded(url, data);
                    },
                    // loading progress
                    () => {
                        // ...
                    },
                    // can't load file
                    (error) => {
                        console.log("- load error", error);
                        this._onLoaded(url, null);
                    }
                );
            }
            // no loader found for this file type
            else {
                this._onLoaded(url, null);
            }
        }
        // all items loaded
        else {
            this._loadComplete();
        }
    }
    _onLoaded (url, data) {
        this._loadedTotal++;
        this._loadedFiles.set(url, data);
        // remove from loading
        this._loadingQueue.splice(this._loadingQueue.indexOf(url), 1);
        // calculate and dispatch progress
        const totalToLoad = this._loadedTotal + this._waitingQueue.length;
        const loadPercent = this._loadedTotal / totalToLoad;
        this.onProgress.dispatch(loadPercent);
        // load next item
        this._loadNext();
    }
    _loadComplete () {
        setTimeout(() => {
            this._isLoading = false;
            this.onComplete.dispatch();
            console.log('load complete !');
        }, 0);
    }
    _getExtension (url) {
        return url.substring(url.lastIndexOf(".") + 1, url.length);
    }
    _getLoader (url) {
        const extension = this._getExtension(url);

        switch (extension) {
            case "png":
            case "jpg":
            case "jpeg":
                return new TextureLoader();
            case "hdr":
                return new RGBELoader().setDataType(UnsignedByteType);
            case "ttf":
                return new TTFLoader();
            default:
                throw new Error(
                    `Error: [LoaderManager] Extension "${extension}" doesn't have proper loader.`
                );
        }
    }
    getFile (url) {
        if (this._loadedFiles.has(url)) {
            return this._loadedFiles.get(url);
        } else {
            console.log(`Error: [LoaderManager] File "${url}" isn't loaded.`);
            return null;
        }
    }
}

export default new LoadManager();