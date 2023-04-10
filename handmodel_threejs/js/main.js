import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const righthandUrl = '../models/righthand_withcolor.glb';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 1.5, 2);

orbit.update();

// light still has but (tried ambient, rect, point, no one works)
const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );
// directionalLight = new THREE.DirectionalLight( 0xffffff, API.directionalLightIntensity );
// directionalLight.position.set( 10, 10, 10 );
// scene.add( directionalLight );

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const assetLoader = new GLTFLoader();

const hand_material = new THREE.MeshStandardMaterial( {
    color: 0x444444,
    metalness: 0,
    roughness: 0,
} );

let mixer;
assetLoader.load(righthandUrl, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    // Play a certain ASL
    const clip = THREE.AnimationClip.findByName(clips, 'ASL_b'); //we current have ASL_b ASL_f
    const action = mixer.clipAction(clip);

    // if we use righthand_250, uncomment the following lines for playing once
    // action.setLoop(THREE.LoopOnce);
    // action.clampWhenFinished = true;

    action.play();

}, undefined, function(error) {
    console.error(error);
});

const clock = new THREE.Clock();
function animate() {
    if(mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
