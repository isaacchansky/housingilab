/// <reference path="require.d.ts" />

import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';


const ground: any = require('./data/ground.json');
const context: any = require('./data/context.json');
const largeSixHalf: any = require('./data/large6half.json');

const apts: any = require("./data/apts.json");
const cores: any = require("./data/cores.json");
const parking: any = require("./data/parking.json");
const balconies: any = require("./data/balconies.json");


const busStop: any = require("./data/busStop.json");
const streetLamps: any = require("./data/streetLamps.json");
const streetMarkings: any = require("./data/streetMarkings.json");
const trafficLights: any = require("./data/trafficLights.json");



const financialScenarios: any = require("./data/financialScenarios.json");


const renderData: any = {};

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

        isAnimating: boolean = false;

        constructor(element: HTMLElement) {
            this.containerEl = element;
            this.setDimensionsFromElement(element);
        }

        setDimensionsFromElement(element = this.containerEl) {
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
            this.controls.maxPolarAngle = (0.9 * Math.PI) / 2;
            this.controls.enableZoom = true;
        }

        createLights() {
            let ambient = new THREE.AmbientLight(0xffffff, 0.75);

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
            mat.metal = false;
            let geo = new THREE.PlaneBufferGeometry(20000, 20000);
            let mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(0, -10, 0);
            mesh.rotation.x = -Math.PI * 0.5;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
        }

        buildGeometry(geometryData: any): any {
            const { vertices, faces, guid, type } = geometryData;

            let group = new THREE.Group();
            let geo = new THREE.Geometry();

            // if (geometryData.type === 'Polyline') {
            //     console.log('TODO: implement polyline rendering');
            //     console.log(geometryData);
            //     for (let i = 0; i < geometryData.vertices.length; i += 3) {
            //       const element = array[i];
            //     }
            //     return null;
            // }
            // if (!vertices || !faces) {
            //     console.log('missing vertices or faces', type);
            //     return null;
            // }
            // if (vertices.length === 0 || faces.length === 0) {
            //     console.log('no vertices or faces', type);
            //     return null;
            // }

            for (let i = 2; i < vertices.length; i += 3) {
                geo.vertices.push(new THREE.Vector3(vertices[i - 2], vertices[i - 1], vertices[i])); // Add offset to account for position in initial dataset
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

        addGround() {
            let group = new THREE.Group();

            let groundGeom = this.buildGeometry(ground.geoms[0].geom);

            // set up edges
            let groundMat = new THREE.MeshStandardMaterial({
                color: 0x666666
            });
            let groundMesh = new THREE.Mesh(groundGeom, groundMat);
            groundMesh.castShadow = true;
            groundMesh.receiveShadow = true;
            groundMesh.rotation.x = -Math.PI * 0.5;
            group.add(groundMesh);

            let busstopGeom = this.buildGeometry(busStop[0].geoms[0].geom);

            // set up edges
            let busstopMat = new THREE.MeshStandardMaterial({
                color: 0xcccccc
            });
            let busstopMesh = new THREE.Mesh(busstopGeom, busstopMat);
            busstopMesh.castShadow = true;
            busstopMesh.receiveShadow = true;
            busstopMesh.rotation.x = -Math.PI * 0.5;
            group.add(busstopMesh);

            let streetlampGeom = this.buildGeometry(streetLamps[0].geoms[0].geom);

            // set up edges
            let streetlampMat = new THREE.MeshStandardMaterial({
                color: 0xcccccc
            });
            let streetlampMesh = new THREE.Mesh(streetlampGeom, streetlampMat);
            streetlampMesh.castShadow = true;
            streetlampMesh.receiveShadow = true;
            streetlampMesh.rotation.x = -Math.PI * 0.5;
            group.add(streetlampMesh);

            let streetmarkingGeom = this.buildGeometry(streetMarkings[0].geoms[0].geom);

            // set up edges
            let streetmarkingMat = new THREE.MeshStandardMaterial({
                color: 0xffffff
            });
            let streetmarkingMesh = new THREE.Mesh(streetmarkingGeom, streetmarkingMat);
            streetmarkingMesh.castShadow = true;
            streetmarkingMesh.receiveShadow = true;
            streetmarkingMesh.rotation.x = -Math.PI * 0.5;
            group.add(streetmarkingMesh);

            let trafficlightGeom = this.buildGeometry(trafficLights[0].geoms[0].geom);

            // set up edges
            let trafficlightMat = new THREE.MeshStandardMaterial({
                color: 0xcccccc
            });
            let trafficlightMesh = new THREE.Mesh(trafficlightGeom, trafficlightMat);
            trafficlightMesh.castShadow = true;
            trafficlightMesh.receiveShadow = true;
            trafficlightMesh.rotation.x = -Math.PI * 0.5;
            group.add(trafficlightMesh);


            this.scene.add(group);
        }

        addContext() {
            let group = new THREE.Group();

            context.geoms.forEach((item: any) => {
                let geo = this.buildGeometry(item.geom);

                let mat = new THREE.MeshStandardMaterial({
                  color: 0x999999
                });
                mat.metalness = 0;
                let mesh = new THREE.Mesh(geo, mat);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                // set up edges
                // let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
                // let edges = new THREE.LineSegments(eGeometry, eMaterial);
                // mesh.add(edges);
                mesh.rotation.x = -Math.PI * 0.5;
                group.add(mesh);
            });

            this.scene.add(group);
        }

        addBuilding() {
            let group = new THREE.Group();
            this.activeBuildingGroup = group;

            largeSixHalf.geoms.forEach((item: any) => {
                let geo = this.buildGeometry(item.geom);

                let mat = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 1
                });
                mat.metalness = 0;
                let mesh = new THREE.Mesh(geo, mat);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                // set up edges
                let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
                let eMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    linewidth: 1
                });
                let edges = new THREE.LineSegments(eGeometry, eMaterial);
                mesh.add(edges);
                mesh.rotation.x = -Math.PI * 0.5;
                group.add(mesh);
            });

            this.scene.add(group);
        }

        // let renderOptions = {
        //     parking: '1.0',
        //     floors: '6',
        //     apts: '16'
        // };
        renderScenario(opts: any) {
            console.log({renderOpts: opts});
            let key = `${opts.numApts}|${opts.numFloors}|${opts.ratioParking}`;
            let data = renderData[key];


            if (data) {
                let group = new THREE.Group();

                if (data.apts.geoms) {
                    data.apts.geoms.forEach( (item: any) => {
                        if(item.geom && item.geom.type) {
                            let geo = this.buildGeometry(item.geom);
                            let mat = new THREE.MeshStandardMaterial(
                              {
                                color: 0xffffff,
                                transparent: true,
                                opacity: 1
                              }
                            );
                            mat.metalness = 0;
                            if (geo && mat) {
                                let mesh = new THREE.Mesh(geo, mat);
                                mesh.castShadow = true;
                                mesh.receiveShadow = true;
                                // set up edges
                                let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
                                let eMaterial = new THREE.LineBasicMaterial(
                                {
                                    color: 0xffffff,
                                    linewidth: 1
                                }
                                );
                                let edges = new THREE.LineSegments(eGeometry, eMaterial);
                                mesh.add(edges);
                                mesh.rotation.x = -Math.PI * 0.5;
                                group.add(mesh);
                            }

                        }
                    });
                }
                if (data.parking.geoms) {
                    data.parking.geoms.forEach((item: any) => {
                        if (item.geom && item.geom.type) {
                            let geo = this.buildGeometry(item.geom);
                            let mat = new THREE.MeshStandardMaterial(
                                {
                                    color: 0xff0000,
                                    transparent: true,
                                    opacity: 0.5
                                }
                            );
                            mat.metalness = 0;
                            if(geo && mat) {
                                let mesh = new THREE.Mesh(geo, mat);
                                mesh.castShadow = true;
                                mesh.receiveShadow = true;
                                // set up edges
                                let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
                                let eMaterial = new THREE.LineBasicMaterial(
                                  {
                                    color: 0xff0000,
                                    linewidth: 1
                                  }
                                );
                                let edges = new THREE.LineSegments(eGeometry, eMaterial);
                                mesh.add(edges);
                                mesh.rotation.x = -Math.PI * 0.5;
                                group.add(mesh);
                            }
                        }
                    })
                }
                if (data.cores.geoms) {
                    data.cores.geoms.forEach((item: any) => {
                        if (item.geom && item.geom.type) {
                            let geo = this.buildGeometry(item.geom);
                            let mat = new THREE.MeshStandardMaterial(
                              {
                                color: 0xeeeeee,
                                transparent: true,
                                opacity: 1
                              }
                            );
                            mat.metalness = 0;
                            if (geo && mat) {
                                let mesh = new THREE.Mesh(geo, mat);
                                mesh.castShadow = true;
                                mesh.receiveShadow = true;
                                // set up edges
                                let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
                                let eMaterial = new THREE.LineBasicMaterial(
                                    {
                                        color: 0xeeeeee,
                                        linewidth: 1
                                    }
                                );
                                let edges = new THREE.LineSegments(eGeometry, eMaterial);
                                mesh.add(edges);
                                mesh.rotation.x = -Math.PI * 0.5;
                                group.add(mesh);
                            }

                        }
                    })
                }
                if (data.balconies.geoms) {
                    data.balconies.geoms.forEach((item: any) => {
                        if (item.geom && item.geom.type) {
                            let geo = this.buildGeometry(item.geom);
                            let mat = new THREE.MeshStandardMaterial(
                              {
                                color: 0xdddddd,
                                transparent: true,
                                opacity: 1
                              }
                            );
                            mat.metalness = 0;
                            if (geo && mat) {
                                let mesh = new THREE.Mesh(geo, mat);
                                mesh.castShadow = true;
                                mesh.receiveShadow = true;
                                // set up edges
                                let eGeometry = new THREE.EdgesGeometry(mesh.geometry, 1);
                                let eMaterial = new THREE.LineBasicMaterial(
                                    {
                                        color: 0xcccccc,
                                        linewidth: 1
                                    }
                                );
                                let edges = new THREE.LineSegments(eGeometry, eMaterial);
                                mesh.add(edges);
                                mesh.rotation.x = -Math.PI * 0.5;
                                group.add(mesh);
                            }

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
            console.log({renderOptions});
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

        resetZoom() {
            this.nextCameraZoom = 25;
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
            this.createBackground();
            this.addGround();
            this.addContext();
            // this.addBuilding();
            this.composeScene();
            this.animate();
        }
    };
