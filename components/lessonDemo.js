import { useEffect, useRef, useState } from "react";
import styles from "./lessonDemo.module.css";
import Script from 'next/script';
import * as THREE from 'three';
// import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function LessonDemo({lessonTitle, handDominant}) {

    // const imageSrc = `/images/hands_annotated/${lessonTitle.toLowerCase()}.jpg`;
    //const imageSrc = `/images/hands/${lessonTitle.toLowerCase()}.jpg`;
    const righthandUrl = new URL('/3Dmodel/righthand_poseforawhile.glb', import.meta.url);

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

    camera.position.set(10, 10, 10);
    orbit.update();

    // light still has but (tried ambient, rect, point, no one works)
    // const light = new THREE.PointLight( 0xff0000, 1, 100 );
    // light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    // light.position.set( 50, 50, 50 );
    // scene.add( light );

    const grid = new THREE.GridHelper(30, 30);
    scene.add(grid);

    const assetLoader = new GLTFLoader();

    let mixer;
    assetLoader.load(righthandUrl.href, function(gltf) {
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

// window.addEventListener('resize', function() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });
    return(<>
        </>)
}