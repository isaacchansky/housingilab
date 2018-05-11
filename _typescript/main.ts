import { NameClass } from './class/name-class';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

import scrollTo from './scrollTo.module';

function getScrollOffset(element:Element) {
    let scrolledAmt = document.documentElement.scrollTop;
    return scrolledAmt + element.getBoundingClientRect().top;
}


const throttle = (func: Function , limit: Number) => {
    let inThrottle: boolean;
    return function () {
        const args = arguments
        const context = this
        if (!inThrottle) {
            func.apply(context, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}



// To be called after DOMContentLoaded
function scrollEventHandling() {
    let pageContent = document.querySelector('.page-content');
    // fire once then listen
    handleScroll();
    window.addEventListener('scroll', throttle(handleScroll, 10));

    function handleScroll() {
        if (pageContent.getBoundingClientRect().top <= 0) {
            pageContent.classList.add('is-scrolled');
        } else {
            pageContent.classList.remove('is-scrolled');
        }
    }
}

// To be called after DOMContentLoaded
function clickEventHandling() {
    let button = document.querySelector('#start');
    button.addEventListener('click', () => {
        scrollTo(getScrollOffset(document.querySelector('.lesson-modules')), 600);
    });

    let nextLessonBtns = Array.prototype.slice.call(document.querySelectorAll('.button--next-lesson'));
    nextLessonBtns.forEach((element: any) => {
        element.addEventListener('click', () => {
            scrollTo(getScrollOffset(element.parentElement.nextElementSibling), 600);

        })
    });
}

function initThree() {

    let vizSpace = document.querySelector('.visualization-module')


    // create the camera
    let camera = new THREE.PerspectiveCamera(75, vizSpace.clientWidth / vizSpace.clientHeight, 1, 1000)
    camera.position.set(700, 200, - 500);


    // create the scene
    let scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)


    // CONTROLS
    let controls = new OrbitControls(camera);
    controls.maxPolarAngle = 0.9 * Math.PI / 2;
    controls.enableZoom = false;


    // LIGHTS
    let light = new THREE.DirectionalLight(0xaabbff, 0.3);
    light.position.x = 300;
    light.position.y = 250;
    light.position.z = -500;
    scene.add(light);


    // // SKYDOME
    // var vertexShader = `
    //     varying vec3 vWorldPosition;
	// 		void main() {
	// 			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
	// 			vWorldPosition = worldPosition.xyz;
	// 			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //         }
    //     `;
    // var fragmentShader = `
	// 		uniform vec3 topColor;
	// 		uniform vec3 bottomColor;
	// 		uniform float offset;
	// 		uniform float exponent;
	// 		varying vec3 vWorldPosition;
	// 		void main() {
	// 			float h = normalize( vWorldPosition + offset ).y;
	// 			gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );
	// 		}
    //     `;
    // var uniforms = {
    //     topColor: { type: "c", value: new THREE.Color(0x0077ff) },
    //     bottomColor: { type: "c", value: new THREE.Color(0xffffff) },
    //     offset: { type: "f", value: 400 },
    //     exponent: { type: "f", value: 0.6 }
    // };
    // uniforms.topColor.value.copy(light.color);
    // var skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
    // var skyMat = new THREE.ShaderMaterial({
    //     uniforms: uniforms,
    //     vertexShader: vertexShader,
    //     fragmentShader: fragmentShader,
    //     side: THREE.BackSide
    // });
    // var sky = new THREE.Mesh(skyGeo, skyMat);
    // scene.add(sky);



    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(vizSpace.clientWidth, vizSpace.clientHeight)

    vizSpace.appendChild(renderer.domElement)


    // add axis to the scene
    let axis = new THREE.AxesHelper(10)

    scene.add(axis)


    let material = new THREE.MeshNormalMaterial({

    })

    // create a box and add it to the scene
    let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)

    scene.add(box)

    box.position.x = 0.5
    box.rotation.y = 0.5

    camera.position.x = 5
    camera.position.y = 5
    camera.position.z = 5

    camera.lookAt(scene.position)

    function animate(): void {
        requestAnimationFrame(animate)
        render()
    }

    function render(): void {
        // let timer = 0.00001 * Date.now()
        // box.position.y = 0.5 + 0.5 * Math.sin(timer)
        // box.rotation.x += 0.1
        renderer.render(scene, camera)
    }

    animate()

}

(function(){

    document.addEventListener('DOMContentLoaded', (event) => {

        scrollEventHandling();
        clickEventHandling();
        initThree();
    });


})();

