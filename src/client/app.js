import 'bootstrap';
import './scss/app.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
import * as UIL from 'uil';
import { testTemplate } from '../shared/templates/test.js';

import * as wireframeVertexShader from './shaders/wireframe.vs';
import * as wireframeFragmentShader from './shaders/wireframe.fs';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
const onWindowResize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
onWindowResize();
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize, false);

function setupAttributes(geometry) {
  var vectors = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];

  var position = geometry.attributes.position;
  var centers = new Float32Array(position.count * 3);

  for (var i = 0, l = position.count; i < l; i++) {
    vectors[i % 3].toArray(centers, i * 3);
  }

  geometry.setAttribute('center', new THREE.BufferAttribute(centers, 3));
}

const geometry = new THREE.IcosahedronBufferGeometry();
geometry.deleteAttribute('normal');
geometry.deleteAttribute('uv');
setupAttributes(geometry);

const uniforms = { widthFactor: { value: 2.0 } };

const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: wireframeVertexShader,
  fragmentShader: wireframeFragmentShader,
  side: THREE.DoubleSide,
});

material.extensions.derivatives = true;

// const material = new MeshBasicMaterial({ color: 0x008800 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const animate = function () {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
};

const ui = new UIL.Gui({
  css: 'top:145px; left:50%;',
  size: 300,
  center: true,
});
ui.add('title', { name: 'Title' });
ui.add('bool', {
  name: 'Bool',
  callback: (value) => {
    console.log(`The value is ${value}`);
    console.log(testTemplate({ title: 'test' }));
  },
});

if (WEBGL.isWebGLAvailable()) {
  animate();
} else {
  var warning = WEBGL.getWebGLErrorMessage();
  console.log(warning);
}
