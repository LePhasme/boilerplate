import 'bootstrap';
import './scss/app.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
import * as UIL from 'uil';
import { testTemplate } from '../shared/templates/test.js';
import io from 'socket.io-client';
import * as wireframeVertexShader from './shaders/wireframe.vs';
import * as wireframeFragmentShader from './shaders/wireframe.fs';

const socket = io();

socket.on('init', (data) => {
  console.log('init', data);
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
const onWindowResize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
const settings = {
  lineWidth: 2,
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

const uniforms = { widthFactor: { value: settings.lineWidth } };

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

camera.position.z = 3;
controls.update();
controls.saveState();
const animate = function () {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
};

const ui = new UIL.Gui({
  css: 'top:5px; left:5px;',
  w: 200,
  center: false,
});
ui.add('title', { name: 'Kinerama' });
ui.add('button', {
  name: 'Reset Camera',
  callback: () => {
    controls.reset();
  },
  h: 30,
  p: 0,
});
ui.add('bool', {
  name: 'Bool',
  callback: (value) => {
    console.log(`The value is ${value}`);
    console.log(testTemplate({ title: 'test' }));
  },
});
ui.add('circular', {
  name: 'Epaisseur',
  w: 100,
  value: settings.lineWidth,
  min: 1,
  max: 10,
  precision: 0,
  step: 1,
}).onChange((v) => {
  settings.lineWidth = cube.material.uniforms.widthFactor.value = v;
});
ui.add('joystick', { name: 'Rotation', w: 100, multiplicator: 0.5, precision: 2 }).onChange((v) => {
  cube.rotation.x = -v[1];
  cube.rotation.y = v[0];
});

if (WEBGL.isWebGLAvailable()) {
  animate();
} else {
  var warning = WEBGL.getWebGLErrorMessage();
  console.log(warning);
}
