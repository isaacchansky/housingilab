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

    activeBuildingGroup: any = new THREE.Group();

    cameraZoom: number = 25;
    nextCameraZoom: number;

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
        this.camera = new THREE.PerspectiveCamera(this.cameraZoom, this.sceneWidth / this.sceneHeight, 1, 10000);
        this.camera.fov = this.cameraZoom;
        this.camera.updateProjectionMatrix();
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

    createBackground() {
        let mat = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          dithering: true
        });
        mat.metal = false
        let geo = new THREE.PlaneBufferGeometry(20000, 20000);
        let mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(0, -10, 0);
        mesh.rotation.x = - Math.PI * 0.5;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }

    buildGeometry(geometryData: any): any {
        const { vertices, faces, guid, type } = geometryData;

        let group = new THREE.Group();
        let geo = new THREE.Geometry();

        if (vertices.length === 0 || faces.length === 0) {
          return null;
        }

        for (let i = 2; i < vertices.length; i += 3) {
          geo.vertices.push(new THREE.Vector3(// Add offset to account for position in initial dataset
              vertices[i - 2], vertices[i - 1], vertices[i]));
        }

        let k = 0;
        while (k < faces.length) {
          // QUAD FACE
          if (faces[k] === 1) {
            geo.faces.push(new THREE.Face3(faces[k + 1], faces[k + 2], faces[k + 3]));
            geo.faces.push(new THREE.Face3(faces[k + 1], faces[k + 3], faces[k + 4]));
            k += 5;
          } else if (faces[k] === 0) {
            geo.faces.push(new THREE.Face3(faces[k + 1], faces[k + 2], faces[k + 3]));
            k += 4;
          } else {
            break;
          }
        }

        geo.computeFaceNormals();
        geo.computeVertexNormals();

        return geo;
    }


    addGround() {
        let group = new THREE.Group();

        let geo = this.buildGeometry(ground.geoms[0].geom);

        // set up edges
        let mat = new THREE.MeshStandardMaterial({ color: 0x999999 });
        let mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.rotation.x = - Math.PI * 0.5;
        group.add(mesh);

        this.scene.add(group);
    }

    addContext() {
        let group = new THREE.Group();

        context.geoms.forEach((item: any) => {
            let geo = this.buildGeometry(item.geom);

            let mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            mat.metalness = 0;
            let mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true
            mesh.receiveShadow = true
            // set up edges
            // let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
            // let edges = new THREE.LineSegments(eGeometry, eMaterial);
            // mesh.add(edges);
            mesh.rotation.x = - Math.PI * 0.5;
            group.add(mesh);
        });

        this.scene.add(group);
    }

    addBuilding() {
        let group = new THREE.Group();
        this.activeBuildingGroup = group;

        largeSixHalf.geoms
          .forEach((item: any) => {
            let geo = this.buildGeometry(item.geom);

            let mat = new THREE.MeshStandardMaterial({
              color: 0xe0d65d,
              transparent: true,
              opacity: 0.5
            });
            mat.metalness = 0;
            let mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            // set up edges
            let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
            let eMaterial = new THREE.LineBasicMaterial({
              color: 0xe0d65d,
              linewidth: 1
            });
            let edges = new THREE.LineSegments(eGeometry, eMaterial);
            mesh.add(edges);
            mesh.rotation.x = -Math.PI * 0.5;
            group.add(mesh);
          });

        this.scene.add(group);
    }

    rerenderBuilding(opts: any) {
        // 1st section slice(0, 6)
        // 2nd section slice(6, 24)
        // full section no slicing
        let geometrySlice = largeSixHalf.geoms;
        if (opts.size === 'small') {
            geometrySlice = largeSixHalf.geoms.slice(0, 6);
        }
        if (opts.size === 'medium') {
            geometrySlice = largeSixHalf.geoms.slice(6, 24);
        }
        let group = new THREE.Group();

        geometrySlice.forEach((item: any) => {
            let geo = this.buildGeometry(item.geom);

            let mat = new THREE.MeshStandardMaterial({ color: 0xe0d65d, transparent: true, opacity: 0.5 });
            mat.metalness = 0;
            let mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            // set up edges
            let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
            let eMaterial = new THREE.LineBasicMaterial({ color: 0xe0d65d, linewidth: 1 });
            let edges = new THREE.LineSegments(eGeometry, eMaterial);
            mesh.add(edges);
            mesh.rotation.x = -Math.PI * 0.5;
            group.add(mesh);
        });

        this.scene.remove(this.activeBuildingGroup);
        this.scene.add(group);
        this.activeBuildingGroup = group;

    }

    getOutcomes(opts: any) {
        let geometrySlice = largeSixHalf.geoms;
        if (opts.size === "small") {
          geometrySlice = largeSixHalf.geoms.slice(0, 6);
        }
        if (opts.size === "medium") {
          geometrySlice = largeSixHalf.geoms.slice(6, 24);
        }

        let typeMap: any = {};
        let types: string[] = [];
        let totalArea = 0
        let totalUnits = geometrySlice.length;
        geometrySlice.forEach((geom:any) => {
            totalArea += parseInt(geom.aptArea.replace('m2', ''), 10);
            if (typeMap[geom.aptType]) {
                typeMap[geom.aptType]++;
            } else {
                typeMap[geom.aptType] = 1;
            }
        });

        Object.keys(typeMap).forEach( (t) => {
            types.push(`${typeMap[t]} ${t}`);
        });

        return {
            types: types.join(', '),
            totalArea: totalArea,
            totalUnits: totalUnits
        }
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

    handleWindowResize() {
        // adjust aspect ratio on resize
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    decreaseZoom() {
        this.nextCameraZoom = this.cameraZoom < 40 ? this.cameraZoom + 4 : this.cameraZoom;
    }

    increaseZoom() {
        this.nextCameraZoom = this.cameraZoom > 2 ? this.cameraZoom - 4 : this.cameraZoom;
    }

    resetZoom() {
        this.nextCameraZoom = 25;
    }

    render() {
        if (this.nextCameraZoom && this.nextCameraZoom !== this.cameraZoom) {
            if ( this.nextCameraZoom < this.cameraZoom) {
                this.cameraZoom = this.cameraZoom - 0.5;
                console.log("zoomin out", this.cameraZoom);
            } else {
                this.cameraZoom = this.cameraZoom + 0.5;
                console.log("zoomin in", this.cameraZoom);
            }
        }
        this.camera.fov = this.cameraZoom;
        this.camera.updateProjectionMatrix();
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
        this.createBackground();
        this.addGround();
        this.addContext();
        this.addBuilding();
        this.composeScene();
        this.animate();

    };


};
