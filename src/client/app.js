import 'bootstrap';
import './scss/app.scss';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as UIL from 'uil';
import { testTemplate } from '../shared/templates/test.js';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({ color: 0x008800 });
const cube = new Mesh(geometry, material);
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

animate();
