import { WEBGL } from './webgl'
import SceneView from './SceneView/SceneView'

if (WEBGL.isWebGLAvailable()) {
    new SceneView()
} else {
  let warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
