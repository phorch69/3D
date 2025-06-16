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

const Background = document.getElementById("Background");
const Day = document.querySelector(".Day");
const Moon = document.querySelector(".Moon");

//Sol
let EstadoSol = 1.5;
let ElevaSol = 4;
let GiroSol = 180;

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



// <-- Declararciones de THREE.js -->
let camera, container, scene, renderer, stats;
let DracoLoader, Loader, Models;
let zoom, Manager, ProgresBar, Load, Start;
let light, Sun, SkySun;
let water;
let INTERSECTED, raycaster;
//let controls, Clock, HDRLoader, textGeo, renderTarget;

//var url = 'https://drive.google.com/uc?export=download&id=1Uqlm3rr6nmCmfeeRa8LrDf_QUeodEWlL';
var url = '/Modelos/gltf/Isla-Three.gltf'
//var Texture_1 = 'https://drive.google.com/uc?export=download&id=1xFESLmYUX1E0-xJEb1sR-jIDW9WntK6M';
//var Texture_1 = "https://drive.google.com/drive/u/1/folders/1HXhHnKncp47wy4yTFv7T0W3wJR7h2u-F";
var Texture_1 = '/Modelos/Texture/Mar.jpg'
//setCrossOrigin('anonymous');
//script.crossOrigin = 'anonymous';

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
	Loader3d();
	SunGlobal();
	Oceano();
	//Text()

	// <-- NO se Usaran en este Proyecto -->
	//Controls();
	//Background();

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
	//Oceano
	water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
	//Control
	/*Clock = new THREE.Clock();
	controls.update( Clock.getDelta() );*/
	//Pointer
	//document.body.appendChild( stats.dom );
	document.addEventListener( 'mousemove', onPointerMove );
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

// <-- -->

//Movimiento de la camara con mouse
function Zoom() {
	zoom = new OrbitControls(camera, renderer.domElement);
	/*zoom.autoRotate = true;
	zoom.autoRotateSpeed = 0.2;*/
	zoom.autoRotate = false;
	zoom.zoomSpeed = 3;
	zoom.minDistance = 7;
	zoom.maxDistance = 55;
	zoom.maxPolarAngle = 1.4;
	zoom.maxTargetRadius = 0;
}

function Oceano() {
	const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

	water = new Water(
		waterGeometry,
		{
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: new THREE.TextureLoader().load( Texture_1, function ( texture ) {

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

		} ),
		sunDirection: new THREE.Vector3(),
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 3.7,
		fog: scene.fog !== undefined
		}
	);

	water.rotation.x = - Math.PI / 2;

	scene.add( water );
}

// sin entender todavia
function Text() {
	//
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

//Pointer
function onPointerMove( event ) {

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

// <-- Funciones extras que no se usaran en este proyecto. Pero quedan de Muesta -->

/*
	<-- Funcion HDR -->
function Background() {
	//HDRLoader = new RGBELoader();
    //HDRLoader.setDataType( THREE.FloatType );
	//HDRLoader.setDataType( THREE[ HalfFloatType ] );
	HDRLoader = new RGBELoader(Manager).load( '', ( environmentMap ) => {
		
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
		//environmentMap.needsUpdate = true;

		scene.background = environmentMap;
		scene.environment = environmentMap;
    } );
}

	<-- Movimiento de la camara con teclado -->
function Controls () {
	controls = new FlyControls(camera, renderer.domElement)
	controls.movementSpeed = 20;
	controls.domElement = container;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;
	controls.handleResize();
}
*/