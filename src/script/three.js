// <-- Libreria de THREE.js --> //
import * as THREE from 'three';
//import { FontLoader } from 'three/addons/loaders/FontLoader.js';
//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import Stats from 'three/addons/libs/stats.module.js';
//import { FlyControls } from 'three/addons/controls/FlyControls.js';
//import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
//import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
//import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
//import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

// <-- Declarar Parte del HTML -->
/*
const Nav = document.querySelector('.Nav');
const Section = document.querySelector(".Detalles");
const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('click', function() {
    Nav.style.display = Nav.style.display === "none" ? "flex" : "none";
    Section.style.display = Section.style.display === "flex" ? "none" : "flex";
});

const Background = document.getElementById("Background");
const Day = document.querySelector(".Day");
const Moon = document.querySelector(".Moon");
*/
//Sol
let EstadoSol = 1.5;
let ElevaSol = 4;
let GiroSol = 180;
/*
Background.addEventListener('click', function() {
	//Cambia el Estilo de CSS
    Day.style.display = Day.style.display === "none" ? "block" : "none";
    Moon.style.display = Moon.style.display === "block" ? "none" : "block";

	//Cambia el Valor de JS
	EstadoSol = EstadoSol === 1.5 ? 0 : 1.5;
	ElevaSol = ElevaSol === 4 ? -2 : 4;
	GiroSol = GiroSol === 180 ? 0 : 180;

	//Devuelve el Nuevo Valor a la Funcion que se le esta Llamando
	return SunGlobal(EstadoSol)
	return SunGlobal(ElevaSol)
	return SunGlobal(GiroSol)
});
*/


// <-- Declararciones de THREE.js -->
let camera, container, scene, renderer, stats;
let DracoLoader, Loader, Models;
let zoom, Manager, ProgresBar, Load, Start;
let light, Sun, SkySun;
let INTERSECTED, raycaster;
 let gamepadIndex = null;
const moveSpeed = 0.08;
const rotateSpeed = 0.03;
const forward = new THREE.Vector3();
const right = new THREE.Vector3();

const pointer = new THREE.Vector2();

init ();



// <-- Funciones de THREE.js -->
function init() {
	container = document.getElementById( 'container' );

	// <-- Funciones -->
	Camera();
	render();
	LoadingManager();
	Zoom();

	// <-- -->
	Ilumination();
	//Loader3d();
	SunGlobal();
	Controls();

	window.addEventListener('resize', onWindowResize, false);
	//window.addEventListener('resize', onWindowResize);
}

// <-- -->

function Camera() {
	scene = new THREE.Scene();
	//scene.background = new THREE.Color(0X000000, 0X000000, 0);

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 50;
	camera.position.y = 50;
	camera.position.x = 50;
}

function render() {
	//render Pointer
	raycaster = new THREE.Raycaster();

	//render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animate );
	container.appendChild( renderer.domElement );
	//renderer.setPixelRatio( window.devicePixelRatio );
	stats = new Stats();

	//renderer.toneMapping = new THREE.NeutralToneMapping;
	//renderer.toneMappingExposure = 0.5;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//render Pointer
	RenderUpdate()

	//container.appendChild( stats.dom );
}

function RenderUpdate() {
	// find intersections

	raycaster.setFromCamera( pointer, camera );

	const intersects = raycaster.intersectObjects( scene.children, false );

	if ( intersects.length > 0 ) {

		if ( INTERSECTED != intersects[0].water ) {

			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

			INTERSECTED = intersects[0].water;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );

		}

	} else {

		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

		INTERSECTED = null;

	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function Animacion () {
	requestAnimationFrame(animate);
      if (gamepadIndex !== null) updateGamepad();
      renderer.render(scene, camera);
}

function animate() {
	Animacion();

	zoom.update();
	stats.update();

	renderer.render( scene, camera );
}

function LoadingManager() {
	Manager = new THREE.LoadingManager();
	ProgresBar = document.getElementById('progress-bar');
	Load = document.querySelector('.Load');
	Start = document.querySelector('.Start');

	Manager.onStart = function ( item, loaded, total ) {
        Start.style.display = 'none';
    };

    Manager.onProgress = function ( item, loaded, total ) {
        ProgresBar.value = ( loaded / total ) * 100 ;
    };

	Manager.onLoad = function () {
        Load.style.display = 'none';
		Start.style.display = 'block';
    };

    //Manager.onError = function () {
    //    console.error( 'Started loading: ' );
    //};
}

//Movimiento de la camara con mouse
function Zoom() {
	zoom = new OrbitControls(camera, renderer.domElement);
	//zoom.autoRotate = true;
	//zoom.autoRotateSpeed = 0.2;
	zoom.autoRotate = false;
	zoom.zoomSpeed = 3;
	zoom.minDistance = 7;
	zoom.maxDistance = 55;
	zoom.maxPolarAngle = 1.4;
	zoom.maxTargetRadius = 0;
}

function SunGlobal() {

	// Add Sky
	SkySun = new Sky();
	SkySun.scale.setScalar( 450000 );
	scene.add( SkySun );

	Sun = new THREE.Vector3();

	/// GUI

	const effectController = {
		turbidity: EstadoSol,
		rayleigh: 3,
		mieCoefficient: 0.005,
		mieDirectionalG: 0.7,
		elevation: ElevaSol,
		azimuth: GiroSol,
		exposure: renderer.toneMappingExposure
	};

	function guiChanged() {

		const uniforms = SkySun.material.uniforms;
		uniforms[ 'turbidity' ].value = effectController.turbidity;
		uniforms[ 'rayleigh' ].value = effectController.rayleigh;
		uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
		uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

		const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
		const theta = THREE.MathUtils.degToRad( effectController.azimuth );

		Sun.setFromSphericalCoords( 1, phi, theta );

		uniforms[ 'sunPosition' ].value.copy( Sun );

		renderer.toneMappingExposure = effectController.exposure;
		renderer.render( scene, camera );

	}

	guiChanged();

}

function Loader3d () {
	DracoLoader = new DRACOLoader();
	DracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/' );
	/*Todavia no se que hace
	DracoLoader.setDecoderConfiguration({type: 'js'});
	Loader.setDRACOLoader(DracoLoader);*/

	/*Loader = new GLTFLoader(Manager);
	Loader.setDRACOLoader( DracoLoader );
	Loader.load( '/public/models/gltf/Cubo/Cubo-Textura.gltf', function ( gltf ) {
		Models = gltf.scene
		Models.position.set( 0, 0.3, 0 );
		Models.scale.set( 8, 0.1, 8 );
		scene.add( Models );
		//gltf.animations; // Array<THREE.AnimationClip>
		//gltf.scene; // THREE.Group
		//gltf.scenes; // Array<THREE.Group>
		//gltf.cameras; // Array<THREE.Camera>
		//gltf.asset; // Object
	})*/

	Loader = new GLTFLoader(Manager);
	Loader.setDRACOLoader( DracoLoader );
	Loader.load( url, function ( gltf ) {
		Models = gltf.scene
		Models.position.set( 0, -0.3, 0 );
		Models.scale.set( 12, 12, 12 );
		scene.add( Models );
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset;
		gltf.texture;
		gltf.animations; // Array<THREE.AnimationClip
		})
}

function Ilumination() {
	const Ambient = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
	const light = new THREE.DirectionalLight( 0xffffff, 5 );
	light.position.set( 0, 10, 0 );
	scene.add( Ambient, light );
}

function Controls () {
	window.addEventListener("gamepadconnected", (e) => {
      gamepadIndex = e.gamepad.index;
      document.getElementById("info").innerText = `Gamepad conectado: ${e.gamepad.id}`;
    });

    window.addEventListener("gamepaddisconnected", () => {
      gamepadIndex = null;
      document.getElementById("info").innerText = "Gamepad desconectado";
    });
}

function updateGamepad() {
      const gp = navigator.getGamepads()[gamepadIndex];
      if (!gp) return;

      // Sticks
      const lx = gp.axes[0], ly = gp.axes[1]; // movimiento
      const rx = gp.axes[2], ry = gp.axes[3]; // rotación

      // Dirección de cámara
      camera.getWorldDirection(forward);
      forward.y = 0; forward.normalize();

      right.crossVectors(forward, camera.up).normalize();

      // Movimiento
      if (Math.abs(lx) > 0.1) camera.position.addScaledVector(right, lx * moveSpeed);
      if (Math.abs(ly) > 0.1) camera.position.addScaledVector(forward, -ly * moveSpeed);

      // Rotación
      if (Math.abs(rx) > 0.1) camera.rotation.y -= rx * rotateSpeed;
      if (Math.abs(ry) > 0.1) {
        camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x - ry * rotateSpeed, -Math.PI/2, Math.PI/2);
      }
    }