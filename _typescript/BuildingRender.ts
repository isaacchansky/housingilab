/// <reference path="require.d.ts" />

import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';


const ground: any = require('../_data/ground.json');
const context: any = require('../_data/context.json');
const largeSixHalf: any = require('../_data/large6half.json');

console.log(largeSixHalf);

export class BuildingRender {

    containerEl: HTMLElement;
    sceneWidth: number;
    sceneHeight: number;

    camera: any;
    renderer: any;
    scene: any;
    controls: any;
    lights: any[] = [];



    constructor(element: HTMLElement) {
        this.containerEl = element;
        this.setDimensionsFromElement(element);
    };

    setDimensionsFromElement(element=this.containerEl) {
        this.sceneWidth = this.containerEl.clientWidth;
        this.sceneHeight = this.containerEl.clientHeight;
    }

    createCamera() {
        // create the camera
        this.camera = new THREE.PerspectiveCamera(30, this.sceneWidth / this.sceneHeight, 1, 10000);
    }

    createScene() {
        // create the scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
    }

    createControls() {
        // CONTROLS
        this.controls = new OrbitControls(this.camera, this.containerEl);
        this.controls.maxPolarAngle = 0.9 * Math.PI / 2;
        this.controls.enableZoom = true;
    }

    createLights() {

        let ambient = new THREE.AmbientLight(0xffffff, .75);

        let spotLight = new THREE.SpotLight(0xffffff, 0.15);
        spotLight.position.set(0, 500, 100);
        spotLight.angle = 1;
        spotLight.penumbra = 0.05;
        spotLight.decay = 3;
        spotLight.distance = 3000;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2000;
        spotLight.shadow.mapSize.height = 2000;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 1000;

        this.lights.push(ambient);
        this.lights.push(spotLight);
        // var spotLightHelper = new THREE.SpotLightHelper(spotLight);
        // this.scene.add(spotLightHelper);
    }

    createRenderer() {

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.setSize(this.sceneWidth, this.sceneHeight);

    }

    createMaterials() {

        let material = new THREE.MeshStandardMaterial({ color: 0xffffff })
        material.metalness = 0;
        // create a box and add it to the scene
        let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
        box.castShadow = true
        box.receiveShadow = false
        box.position.x = 0
        box.position.y = 0.5
        box.rotation.y = 1
        box.position.z = 0
        // this.scene.add(box)

        material = new THREE.MeshStandardMaterial({ color: 0xffffff })
        material.metalness = 0;
        // create a box and add it to the scene
        let box2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2), material)
        box2.castShadow = true
        box2.receiveShadow = false
        box2.position.x = 2
        box2.position.y = 0.5
        box2.rotation.y = 1
        box2.position.z = 2
        // this.scene.add(box2)


        var fmaterial = new THREE.MeshPhongMaterial({ color: 0xe8e5c6, dithering: true });
        fmaterial.metal = false
        var fgeometry = new THREE.PlaneBufferGeometry(20000, 20000);
        var fmesh = new THREE.Mesh(fgeometry, fmaterial);
        fmesh.position.set(0, -10, 0);
        fmesh.rotation.x = - Math.PI * 0.5;
        fmesh.receiveShadow = true;
        this.scene.add(fmesh);
    }


    addGround() {
        let group = new THREE.Group();

        let offset = {
            x: 0,
            y: 0,
            z: 0
        };
        let geo = new THREE.Geometry();
        let {vertices, faces, guid, type} = ground.geoms[0].geom;
        if (vertices.length === 0 || faces.length === 0) {
            console.log('something is weird');
            console.log(ground.geoms[0].geom);
            return;
        }
        for (let i = 2; i < vertices.length; i += 3) {
            geo.vertices.push(new THREE.Vector3(
                // Add offset to account for position in initial dataset
                vertices[i - 2] + offset.x,
                vertices[i - 1] + offset.y,
                vertices[i] + offset.z
            ));
        }

        let k = 0
        while (k < faces.length) {
            // QUAD FACE
            if (faces[k] === 1) {
                geo.faces.push(new THREE.Face3(faces[k + 1], faces[k + 2], faces[k + 3]))
                geo.faces.push(new THREE.Face3(faces[k + 1], faces[k + 3], faces[k + 4]))
                k += 5
            } else if (faces[k] === 0) {
                geo.faces.push(new THREE.Face3(faces[k + 1], faces[k + 2], faces[k + 3]))
                k += 4
            } else {
                break
            }
        }

        geo.computeFaceNormals();
        geo.computeVertexNormals();

        // set up edges
        let mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        let mesh = new THREE.Mesh(geo, mat);
        let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
        // let edges = new THREE.LineSegments(eGeometry, eMaterial);
        // mesh.add(edges);
        mesh.castShadow = true
        mesh.receiveShadow = false
        mesh.rotation.x = - Math.PI * 0.5;
        group.add(mesh);

        this.scene.add(group);
    }

    addContext() {
        let group = new THREE.Group();

        let offset = {
            x: 0,
            y: 0,
            z: 0
        };
        context.geoms.forEach((item: any) => {
            let geo = new THREE.Geometry();
            let { vertices, faces, guid, type } = item.geom;

            if (vertices.length === 0 || faces.length === 0) {
                console.log('something is weird');
                console.log(ground.geoms[0].geom);
                return;
            }
            for (let i = 2; i < vertices.length; i += 3) {
                geo.vertices.push(new THREE.Vector3(
                    // Add offset to account for position in initial dataset
                    vertices[i - 2] + offset.x,
                    vertices[i - 1] + offset.y,
                    vertices[i] + offset.z
                ));
            }
            let k = 0
            while (k < faces.length) {
                // QUAD FACE
                if (faces[k] === 1) {
                    geo.faces.push(new THREE.Face3(faces[k + 1], faces[k + 2], faces[k + 3]))
                    geo.faces.push(new THREE.Face3(faces[k + 1], faces[k + 3], faces[k + 4]))
                    k += 5
                } else if (faces[k] === 0) {
                    geo.faces.push(new THREE.Face3(faces[k + 1], faces[k + 2], faces[k + 3]))
                    k += 4
                } else {
                    break
                }
            }

            geo.computeFaceNormals();
            geo.computeVertexNormals();

            let mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            mat.metalness = 0;
            let mesh = new THREE.Mesh(geo, mat);
            // set up edges
            let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
            mesh.castShadow = true
            mesh.receiveShadow = false
            // let edges = new THREE.LineSegments(eGeometry, eMaterial);
            // mesh.add(edges);
            mesh.rotation.x = - Math.PI * 0.5;
            // mesh.material.color.set(0x333333);
            group.add(mesh);
        });



        this.scene.add(group);
    }

    composeScene() {
        this.lights.forEach(light => {
            this.scene.add(light);
        });

        this.containerEl.appendChild(this.renderer.domElement)

        this.camera.position.x = 500
        this.camera.position.y = 500
        this.camera.position.z = 500

        this.camera.lookAt(this.scene.position)
    }


    render() {
        // let timer = 0.00001 * Date.now()
        // box.position.y = 0.5 + 0.5 * Math.sin(timer)
        // box.rotation.x += 0.1
        this.renderer.render(this.scene, this.camera)
    }

    animate() {
        requestAnimationFrame(() => {this.animate()})
        this.render()
    }

    init() {
        console.log('initialize!');
        this.createScene();
        this.createCamera();
        this.createControls();
        this.createLights();
        this.createRenderer();
        this.createMaterials();
        this.addGround();
        this.addContext();
        this.composeScene();
        this.animate();

    };


};
