/// <reference path="require.d.ts" />

import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

// Contextual Data
const streetLamps: any = require("./data/streetLamps.json");
const streetTrees: any = require("./data/streetTrees.json");
const streetMarkings: any = require("./data/streetMarkings.json");
const trafficLights: any = require("./data/trafficLights.json");
const parcels: any = require("./data/parcels.json");
const sidewalks: any = require("./data/sidewalks.json");
const contextGroundBldgs: any = require("./data/contextGroundBldgs.json");

// Scenario specific data
const apts: any = require("./data/apts.json");
const cores: any = require("./data/cores.json");
const parking: any = require("./data/parking.json");
const balconies: any = require("./data/balconies.json");
const sidewalk: any = require("./data/sidewalk.json");
const openspace: any = require("./data/openspace.json");
const financialScenarios: any = require("./data/financialScenarios.json");

const renderData: any = {};


// ======================================================================
//     Data wrangling:
//         The following code organizes the scenario- specific data to able
//         to be looked up by key within the `renderData` object.
//
//         So by getting `renderData[<scenario-key>] you have access to
//         apartment, sidewalk, openspace, parking, core, balcony, and
//         financial data for that scenario.
//
// =======================================================================

financialScenarios.financialScenarios.forEach( (item: any) => {
    if (!renderData[item.name]) {
      renderData[item.name] = {};
      renderData[item.name].scenarios = [];
    }
    renderData[item.name].scenarios.push(item);
});

apts.forEach( (item: any) => {
    if (!renderData[item.name]) {
        renderData[item.name] = {};
    }
    renderData[item.name].apts = item;
});

cores.forEach((item: any) => {
  if (!renderData[item.name]) {
    renderData[item.name] = {};
  }
  renderData[item.name].cores = item;
});

parking.forEach((item: any) => {
    if (!renderData[item.name]) {
        renderData[item.name] = {};
    }
    renderData[item.name].parking = item;
});

balconies.forEach((item: any) => {
    if (!renderData[item.name]) {
        renderData[item.name] = {};
    }
    renderData[item.name].balconies = item;
});

sidewalk.forEach((item: any) => {
    if (!renderData[item.name]) {
        renderData[item.name] = {};
    }
    renderData[item.name].sidewalk = item;
});

openspace.forEach((item: any) => {
    if (!renderData[item.name]) {
        renderData[item.name] = {};
    }
    renderData[item.name].openspace = item;
});





// ======================================================================
//     BuildingRender class:
//         The building render class is what we create an instance of to
//         set up an interactive THREE JS render of our scenarios.
//
//         There are a few different types of methods:
//
//         create____()
//             Calling these methods updates an interal variable.
//         i.e createCamera() modifies the camera variable within a
//         BuildingRender instance.
//
//         add____()
//             Calling these methods add objects to the internal `scene`
//         variable.
//
//         build____()
//             These methods return built THREE JS objects and are used
//         for common operations like creating meshes.
//
// =======================================================================

export class BuildingRender {

    DEBUG_SCENE = false;

    containerEl: HTMLElement;
    sceneWidth: number;
    sceneHeight: number;
    camera: any;
    renderer: any;
    scene: any;
    controls: any;
    lights: any[] = [];
    savedControls: any = {};
    activeBuildingGroup: any = new THREE.Group();
    cameraZoom: number = 25;
    nextCameraZoom: number;
    isAnimating: boolean = false;

    constructor(element: HTMLElement) {
        this.containerEl = element;
        this.sceneWidth = this.containerEl.clientWidth;
        this.sceneHeight = this.containerEl.clientHeight;
    }

    createCamera() {
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
        this.controls.maxPolarAngle = (0.9 * Math.PI) / 2;
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
        this.controls.enablePan = true;

        this.savedControls.position = this.camera.position.clone();
        this.savedControls.rotation = this.camera.rotation.clone();
        this.savedControls.controlCenter = this.controls.target.clone();
    }

    createLights() {
        let ambient = new THREE.AmbientLight(0xffffff, 0.75);

        let spotLight = new THREE.SpotLight(0xffffff, 0.5);
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

        let spotLight2 = new THREE.SpotLight(0xffffff, 0.25);
        spotLight2.position.set(0, 100, 500);
        spotLight2.angle = 1;
        spotLight2.penumbra = 0.05;
        spotLight2.decay = 3;
        spotLight2.distance = 3000;
        spotLight2.castShadow = true;
        spotLight2.shadow.mapSize.width = 2000;
        spotLight2.shadow.mapSize.height = 2000;
        spotLight2.shadow.camera.near = 10;
        spotLight2.shadow.camera.far = 1000;

        this.lights.push(ambient);
        this.lights.push(spotLight);
        this.lights.push(spotLight2);
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

    buildGeometry(geometryData: any): any {
        const { vertices, faces, guid, type } = geometryData;

        let group = new THREE.Group();
        let geo = new THREE.Geometry();

        for (let i = 2; i < vertices.length; i += 3) {
            geo.vertices.push(new THREE.Vector3(vertices[i - 2], vertices[i - 1], vertices[i]));
        }

        if(faces) {
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
        }

        geo.computeFaceNormals();
        geo.computeVertexNormals();
        return geo;
    }

    buildMesh(geom: any, matOpts: any, edgeOpts: any, offset?: number) {
        let g = this.buildGeometry(geom);
        let mat = new THREE.MeshStandardMaterial(matOpts);
        mat.metalness = 0;
        let mesh = new THREE.Mesh(g, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (offset) {
            mesh.position.y = mesh.position.y + offset;
        }
        mesh.rotation.x = -Math.PI * 0.5;

        if (edgeOpts) {
            let egeom = new THREE.EdgesGeometry(mesh.geometry, 1);
            let edges = new THREE.LineSegments(egeom, new THREE.LineBasicMaterial(edgeOpts));
            mesh.add(edges);
        }
        return mesh;
    }

    buildLines(geom: any, lineOpts: any) {
        let g = this.buildGeometry(geom);
        let lines = new THREE.Line(g, new THREE.LineBasicMaterial(lineOpts));
        lines.rotation.x = -Math.PI * 0.5;
        return lines;
    }

    addBackground() {
        const mat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            dithering: true
        });
        mat.metal = false;
        const geo = new THREE.PlaneBufferGeometry(20000, 20000);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(0, -10, 0);
        mesh.rotation.x = -Math.PI * 0.5;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }

    addGroundAndContext() {
        let group = new THREE.Group();

        contextGroundBldgs[0].geoms.forEach( (g: any) => {
            let groundbldgMesh = this.buildMesh(g.geom, { color: 0x333333}, { color: 0x222222});
            group.add(groundbldgMesh);
        })
        streetLamps[0].geoms.forEach( (g: any) => {
            let streetlampMesh = this.buildMesh(g.geom, {color: 0xCCCCCC}, {color: 0xFFFFFF});
            group.add(streetlampMesh);
        });

        streetTrees[0].geoms.forEach( (g: any) => {
            let streettreeMesh = this.buildMesh(g.geom, {color: 0X317734}, null);
            group.add(streettreeMesh);
        });
        streetMarkings[0].geoms.forEach( (g: any) => {
            let streetmarkingMesh = this.buildMesh(g.geom, {color: 0xFFFFFF}, null);
            group.add(streetmarkingMesh);
        });

        trafficLights[0].geoms.forEach( (g: any) => {
            let trafficlightMesh = this.buildMesh(g.geom, {color: 0xCCCCCC}, {color: 0xFFFFFF});
            group.add(trafficlightMesh);
        });

        parcels[0].geoms.forEach( (g: any) => {
            let parcelsMesh = this.buildLines(g.geom, {color: 0xCCCCCC});
            group.add(parcelsMesh);
        });

        sidewalks[0].geoms.forEach( (g: any) => {
            let sidewalksMesh = this.buildMesh(g.geom, {color: 0x999999}, null, 0);
            group.add(sidewalksMesh);
        });

        this.scene.add(group);
    }

    // let renderOptions = {
    //     parking: '1.0',
    //     floors: '6',
    //     apts: '16'
    // };
    renderScenario(opts: any, outcomes?: any) {
        // console.log('opts', {renderOpts: opts});
        let key = `${opts.numApts}|${opts.numFloors}|${opts.ratioParking}`;
        let data = renderData[key];
        let buildingColor = 0xFFFFFF;
        if (outcomes) {

            // buildingColor = outcomes.surplus > 0 ? 0x8cfbc7 : 0xfb8c8c;
        }

        // console.log('data', data);
        if (data) {
            let group = new THREE.Group();

            if (data.apts && data.apts.geoms) {
                data.apts.geoms.forEach( (item: any) => {
                    if(item.geom && item.geom.type) {
                        let mesh = this.buildMesh(item.geom, { color: buildingColor, opacity: 1, transparent: true }, null);
                        group.add(mesh);
                    }
                });
            }
            if (data.parking && data.parking.geoms) {
                data.parking.geoms.forEach((item: any) => {
                    if (item.geom && item.geom.type) {
                        if (item.geom.type === "Mesh") {
                            let mesh = this.buildMesh(item.geom, { color: 0x999999 }, { color: 0x000000, linewidth: 1 });
                            group.add(mesh);
                        }
                        if (item.geom.type === "Polyline") {
                            let g = this.buildGeometry(item.geom);
                            let lines = new THREE.Line(g, new THREE.LineBasicMaterial({color: 0x000000}));
                            lines.rotation.x = -Math.PI * 0.5;
                            group.add(lines);
                        }

                    }
                })
            }
            if (data.cores && data.cores.geoms) {
                // console.log('rendering cores');
                data.cores.geoms.forEach((item: any) => {
                    // console.log(item);
                    if (item.geom && item.geom.type) {
                        let mesh = this.buildMesh(item.geom, { color: 0xCCCCCC }, { color: 0xEEEEEE, linewidth: 1 });
                        group.add(mesh);

                    }
                })
            }
            if (data.sidewalk && data.sidewalk.geoms) {
                // console.log('rendering sidewalk');
                data.sidewalk.geoms.forEach((item: any) => {
                    // console.log(item);
                    if (item.geom && item.geom.type) {
                        let mesh = this.buildMesh(item.geom, { color: 0x999999 }, null);
                        group.add(mesh);
                    }
                })
            }
            if (data.openspace && data.openspace.geoms) {
                // console.log('rendering openspace');
                data.openspace.geoms.forEach((item: any) => {
                    // console.log(item);
                    if (item.geom && item.geom.type) {
                        let mesh = this.buildMesh(item.geom, { color: 0x317734 }, { color: 0xeeeeee, linewidth: 1 });
                        group.add(mesh);
                    }
                })
            }
            if (data.balconies && data.balconies.geoms) {
                data.balconies.geoms.forEach((item: any) => {
                    if (item.geom && item.geom.type) {
                        let mesh = this.buildMesh(item.geom, { color: 0xDDDDDD }, null);
                        group.add(mesh);
                    }
                })
            }

            this.scene.remove(this.activeBuildingGroup);
            this.scene.add(group);
            this.activeBuildingGroup = group;
        }
        // if is not currently running animate loop,
        // force one re-render.
        if (!this.isAnimating) {
            this.animate();
        }
    }


    // let renderOptions = {
    //     parking: '1.0',
    //     floors: '6',
    //     apts: '16'
    // };
    getOutcomes(renderOptions: any) {
        // console.log('outcome opts', {renderOptions});
        let data = renderData[`${renderOptions.numApts}|${renderOptions.numFloors}|${renderOptions.ratioParking}`];
        let selectedScenario = {};

        data.scenarios.forEach( (s: any) => {
            if (s.type === renderOptions.type && s.rentScenario === renderOptions.rentScenario) {
                selectedScenario = s;
            }
        });

        return selectedScenario;
    }

    composeScene() {
        this.lights.forEach(light => {
            this.scene.add(light);
            if (this.DEBUG_SCENE) {
                this.scene.add(new THREE.SpotLightHelper(light));
            }
        });
        this.containerEl.appendChild(this.renderer.domElement);
        this.camera.position.x = 500;
        this.camera.position.y = 500;
        this.camera.position.z = 500;
        this.camera.lookAt(this.scene.position);
    }

    handleWindowResize() {
        // adjust aspect ratio on resize
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    decreaseZoom() {
        this.nextCameraZoom = this.cameraZoom < 40 ? this.cameraZoom + 4 : this.cameraZoom;
    }

    increaseZoom() {
        this.nextCameraZoom = this.cameraZoom > 2 ? this.cameraZoom - 4 : this.cameraZoom;
    }

    setFocusedZoom() {
        this.nextCameraZoom = 20;
    }

    resetZoom() {
        this.nextCameraZoom = 30;
        // this.camera.position.set(this.savedControls.position.x, this.savedControls.position.y, this.savedControls.position.z);
        // this.camera.rotation.set(this.savedControls.rotation.x, this.savedControls.rotation.y, this.savedControls.rotation.z);

        // this.controls.target.set(this.savedControls.controlCenter.x, this.savedControls.controlCenter.y, this.savedControls.controlCenter.z);
        // this.controls.update();

    }

    render() {
        if (this.nextCameraZoom && this.nextCameraZoom !== this.cameraZoom) {
            if (this.nextCameraZoom < this.cameraZoom) {
                this.cameraZoom = this.cameraZoom - 0.5;
            } else {
                this.cameraZoom = this.cameraZoom + 0.5;
            }
        }
        this.camera.fov = this.cameraZoom;
        this.camera.updateProjectionMatrix();
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        if (this.isAnimating) {
            requestAnimationFrame(() => {
                this.animate();
            });
        }
        this.render();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createControls();
        this.createLights();
        this.createRenderer();
        this.addBackground();
        this.addGroundAndContext();
        this.composeScene();
        this.animate();
    }
};
