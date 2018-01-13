//import * as BABYLON from 'babylonjs';
window.addEventListener('DOMContentLoaded', function () {
        var canvas = document.getElementById("renderCanvas"); // Get the canvas element 

        var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);


        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.5;
        var pointLight = new BABYLON.HemisphericLight("pointLight", new BABYLON.Vector3(-1, -1, 0), scene);
        pointLight.intensity = 0.5;


        // set constants
        var secondAngle = -(2.0 * Math.PI) / 60.0;
        var axis = new BABYLON.Vector3(0, 0, 100.0);
        var point = BABYLON.Vector3.Zero();
        var timeOld = new Date();

        // define a hand for seconds
        var secondHandLength = 3.0;
        var secondHand = BABYLON.MeshBuilder.CreateBox("secondHand", {
                width: secondHandLength,
                height: 0.05,
                depth: 0.05,
                faceColors: [BABYLON.Color3.Blue(),
                BABYLON.Color3.Red(),
                BABYLON.Color3.Green(),
                BABYLON.Color3.Black(),
                BABYLON.Color3.Yellow(),
                BABYLON.Color3.White()]
        }, scene, true);

        secondHand.position.x = secondHandLength / 2;
        secondHand.position.y = 0.0;
        secondHand.position.z = -0.15;
        secondHand.rotateAround(point, axis, (secondAngle * timeOld.getSeconds()) + (Math.PI / 2)); // + moves from x (horizontal) axis to y (upright)

        // define a hand for minutes
        var minuteHandLength = 2.5;
        var minuteHand = BABYLON.MeshBuilder.CreateBox("minuteHand", {
                width: minuteHandLength,
                height: 0.2,
                depth: 0.05,
                faceColors: [BABYLON.Color3.Red(),
                BABYLON.Color3.Blue(),
                BABYLON.Color3.Green(),
                BABYLON.Color3.Black(),
                BABYLON.Color3.Yellow(),
                BABYLON.Color3.White()]
        }, scene, true);

        minuteHand.position.x = minuteHandLength / 2;
        minuteHand.position.y = 0.0;
        minuteHand.position.z = -0.09;
        minuteHand.rotateAround(point, axis, (secondAngle * timeOld.getMinutes()) + (Math.PI / 2)); // + moves from x (horizontal) axis to y (upright)

        // define a hand for hours
        var hourHandLength = 2.0;
        var hourHand = BABYLON.MeshBuilder.CreateBox("hourHand", {
                width: hourHandLength,
                height: 0.3,
                depth: 0.05,
                faceColors: [BABYLON.Color3.Red(),
                BABYLON.Color3.Green(),
                BABYLON.Color3.Blue(),
                BABYLON.Color3.Black(),
                BABYLON.Color3.Yellow(),
                BABYLON.Color3.White()]
        }, scene, true);

        hourHand.position.x = hourHandLength / 2;
        hourHand.position.y = 0.0;
        hourHand.position.z = -0.03;
        hourHand.rotateAround(point, axis, (5 * secondAngle * (timeOld.getHours() % 12)) + (Math.PI / 2)); // + moves from x (horizontal) axis to y (upright)

        // make a clock face
        // var face = BABYLON.MeshBuilder.CreateDisc("face", { radius: secondHandLength * 1.2 }, scene);
        var face = BABYLON.MeshBuilder.CreateCylinder("face", {
                diameter: secondHandLength * 2.2, height: 0.02, tessellation: 60,
                faceColors: [BABYLON.Color3.White(), BABYLON.Color3.Blue(), BABYLON.Color3.Black()]
        }, scene);

        face.position.x = 0;
        face.position.y = 0;
        face.position.z = 0;

        var material = new BABYLON.StandardMaterial("mat", scene);
        material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        // material.diffuseTexture = new BABYLON.Texture("WP_20170401_17_35_59_Pro.jpg",scene);
        // face.material=material;

        var dot = BABYLON.MeshBuilder.CreateCylinder("dot", {
                diameter: 0.15, height: 0.1, tessellation: 60,
                faceColors: [BABYLON.Color3.Red(), BABYLON.Color3.Blue(), BABYLON.Color3.Black()]
        }, scene);

        // fix dot to the face and position to top of face at 12 oclock
        face.addChild(dot);
        dot.position.x = 0;
        dot.position.y = -0.02;
        dot.position.z = -secondHandLength * 1.05;

        face.rotateAround(point, new BABYLON.Vector3(1.0, 0, 0), (Math.PI / 2)); // + moves from x (horizontal) axis to y (upright)

        // move hands on change of time
        scene.registerAfterRender(function () {
                var dateNow = new Date();
                if (dateNow.getSeconds() != timeOld.getSeconds()) {

                        if (dateNow.getSeconds()==0){
                                dot.setEnabled(true);
                        }else{
                                dot.setEnabled(false);
                        }

                        secondHand.rotateAround(point, axis, secondAngle);
                        console.log("seconds=%s", dateNow.getSeconds());

                        if (dateNow.getMinutes() != timeOld.getMinutes()) {
                                minuteHand.rotateAround(point, axis, secondAngle);
                                console.log("minutes=%s", dateNow.getMinutes());

                                if (dateNow.getHours() != timeOld.getHours()) {
                                        hourHand.rotateAround(point, axis, 5 * secondAngle);
                                        console.log("hours=%s", dateNow.getHours());
                                }
                        }

                        timeOld = dateNow;

                }

        });



        engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene

                scene.render();
        });


        window.addEventListener("resize", function () { // Watch for browser/canvas resize events
                engine.resize();
        });
});