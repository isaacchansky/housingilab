import { NameClass } from './class/name-class';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

import scrollTo from './scrollTo.module';

function getScrollOffset(element:any) {
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

function isScrolledIntoView(el: any) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Partially visible elements return true:
    let isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}

function nodelistToArray(nodelist: NodeList) {
    return Array.prototype.slice.call(nodelist);
}


// To be called after DOMContentLoaded
function scrollEventHandling() {
    let pageContent = document.querySelector('.page-content');
    // fire once then listen

    let lessonSections = nodelistToArray(document.querySelectorAll('.lesson-modules [data-lesson]'));

    handleScroll();
    window.addEventListener('scroll', throttle(handleScroll, 10));

    function handleScroll() {
        if (pageContent.getBoundingClientRect().top <= 0) {
            pageContent.classList.add('is-scrolled');
        } else {
            pageContent.classList.remove('is-scrolled');
        }
        lessonSections.forEach( (lessonModule: any) => {
            if ( isScrolledIntoView(lessonModule)) {
                let inputOptions = nodelistToArray(document.querySelectorAll('.visualization-module__options [data-lesson]'));
                inputOptions.forEach( (el: any) => {
                    el.classList.remove('is-visible');
                    el.classList.add('is-hidden');
                });
                let currentOption = document.querySelector(`.visualization-module__options [data-lesson="${lessonModule.dataset.lesson}"]`);
                currentOption.classList.remove('is-hidden');
                currentOption.classList.add('is-visible');
            }
        });
    }
}

// To be called after DOMContentLoaded
function clickEventHandling() {
    let button = document.querySelector('#start');
    button.addEventListener('click', () => {
        scrollTo(getScrollOffset(document.querySelector('.lesson-modules')), 600);
    });

    let nextLessonBtns = nodelistToArray(document.querySelectorAll('.button--next-lesson'));
    nextLessonBtns.forEach((element: any) => {
        element.addEventListener('click', () => {
            scrollTo(getScrollOffset(element.parentElement.nextElementSibling), 600);

        })
    });
}

function initThree() {

    let vizSpace = <HTMLCanvasElement> document.querySelector('.visualization-module__canvas')


    // create the camera
    let camera = new THREE.PerspectiveCamera(75, vizSpace.clientWidth / vizSpace.clientHeight, 1, 1000)


    // create the scene
    let scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)


    // CONTROLS
    let controls = new OrbitControls(camera, vizSpace);
    controls.maxPolarAngle = 0.9 * Math.PI / 2;
    controls.enableZoom = true;


    let ambient = new THREE.AmbientLight(0xffffff, .75);
    scene.add(ambient);

    let spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 40, 35);
    spotLight.angle = Math.PI / 8;
    spotLight.penumbra = 0.05;
    spotLight.decay = 3;
    spotLight.distance = 300;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2000;
    spotLight.shadow.mapSize.height = 2000;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    scene.add(spotLight);


    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(vizSpace.clientWidth, vizSpace.clientHeight)

    vizSpace.appendChild(renderer.domElement)


    // add axis to the scene
    // let axis = new THREE.AxesHelper(10)
    // scene.add(axis)


    let material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    material.metalness = 0;
    // create a box and add it to the scene
    let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
    box.castShadow = true
    box.receiveShadow = false
    scene.add(box)
    box.position.x = 0
    box.position.y = 0.5
    box.rotation.y = 1
    box.position.z = 0

    material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    material.metalness = 0;
    // create a box and add it to the scene
    let box2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2), material)
    box2.castShadow = true
    box2.receiveShadow = false
    scene.add(box2)
    box2.position.x = 2
    box2.position.y = 0.5
    box2.rotation.y = 1
    box2.position.z = 2


    var fmaterial = new THREE.MeshPhongMaterial({ color: 0xe8e5c6, dithering: true });
    fmaterial.metal = false
    var fgeometry = new THREE.PlaneBufferGeometry(2000, 2000);
    var fmesh = new THREE.Mesh(fgeometry, fmaterial);
    fmesh.position.set(0, 0, 0);
    fmesh.rotation.x = - Math.PI * 0.5;
    fmesh.receiveShadow = true;
    scene.add(fmesh);










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

