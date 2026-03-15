<script>
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
    import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
    import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
    import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    // Import Tween.js if using for smooth animations (optional)
    // import { Tween, Easing } from "three/examples/jsm/libs/tween.module.min.js";

    let scene, camera, renderer, composer, raycaster, mouse;
    let container;

    const neonColors = [
        0xff00ff, // Magenta
        0x00ffff, // Cyan
        0xffff00, // Yellow
        0xffa500, // Orange
        0x00ff00, // Green
        0x0000ff, // Blue
    ];

    const planetPositions = []; // Array to store planet data (position and mesh)

    // Zoom parameters
    const zoomSpeed = 0.05; // Adjusts how fast the camera zooms
    const minZoom = 1; // Minimum camera z-position (closest zoom)
    const maxZoom = 200; // Maximum camera z-position (farthest zoom)

    // Array to store active packets
    const activePackets = [];

    // Function to create fractal cubes with relative positioning
    function createFractalCube(size, position, depth, parent = scene) {
        if (depth === 0) return;

        const geometry = new THREE.BoxGeometry(size, size, size);
        const color = neonColors[Math.floor(Math.random() * neonColors.length)];
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: new THREE.Color(color),
            emissiveIntensity: 1.2,
            metalness: 1.0,
            roughness: 0.2,
        });
        const cube = new THREE.Mesh(geometry, material);

        // Set the position relative to the parent
        cube.position.set(position.x, position.y, position.z);
        cube.castShadow = true;
        parent.add(cube);

        // Calculate the new size for smaller cubes
        const newSize = size / 2;

        const offsets = [
            { x: newSize, y: newSize, z: newSize },
            { x: -newSize, y: newSize, z: newSize },
            { x: newSize, y: -newSize, z: newSize },
            { x: -newSize, y: -newSize, z: newSize },
            { x: newSize, y: newSize, z: -newSize },
            { x: -newSize, y: newSize, z: -newSize },
            { x: newSize, y: -newSize, z: -newSize },
            { x: -newSize, y: -newSize, z: -newSize },
        ];

        // Recursively create smaller fractal cubes
        offsets.forEach((offset) => {
            createFractalCube(
                newSize,
                {
                    x: offset.x,
                    y: offset.y,
                    z: offset.z,
                },
                depth - 1,
                cube,
            );
        });

        return cube; // Return the created mesh
    }

    // Packet class definition
    class Packet {
        constructor(start, end, scene) {
            this.start = start.clone();
            this.end = end.clone();
            this.scene = scene;

            // Create the packet mesh (e.g., a glowing sphere)
            const geometry = new THREE.SphereGeometry(0.5, 16, 16);
            const material = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x00ffff, // Emissive color for glow
                emissiveIntensity: 1.0,
                metalness: 0.5,
                roughness: 0.2,
            });
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.copy(this.start);
            scene.add(this.mesh);

            // Add a point light to the packet
            this.light = new THREE.PointLight(0x00ffff, 1.5, 10);
            this.light.position.copy(this.start);
            scene.add(this.light);

            // Calculate the direction vector
            this.direction = new THREE.Vector3()
                .subVectors(this.end, this.start)
                .normalize();

            // Set the speed (units per second)
            this.speed = 20; // Adjust as needed for desired speed

            // Calculate the total distance
            this.distance = this.start.distanceTo(this.end);

            // Track the traveled distance
            this.traveled = 0;
        }

        // Update the packet's position
        update(deltaTime) {
            const distanceToTravel = this.speed * deltaTime;
            this.traveled += distanceToTravel;

            if (this.traveled >= this.distance) {
                // Packet has reached the destination
                this.scene.remove(this.mesh);
                this.scene.remove(this.light);
                this.dispose();
                return false; // Indicate that the packet should be removed
            } else {
                // Move the packet
                const moveVector = this.direction
                    .clone()
                    .multiplyScalar(distanceToTravel);
                this.mesh.position.add(moveVector);
                this.light.position.add(moveVector);
                return true; // Packet is still active
            }
        }

        // Dispose of resources
        dispose() {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.light.dispose();
        }
    }

    // Function to create distant fractal cube "planets"
    function createDistantPlanets() {
        const planetCount = 31; // Number of planets
        for (let i = 0; i < planetCount; i++) {
            const distance = Math.random() * 100 + 50; // Random distance from the camera
            const angle = Math.random() * Math.PI * 2; // Random angle for circular placement
            const position = {
                x: Math.cos(angle) * distance * 2,
                y: Math.sin(angle) * distance * 2,
                z: Math.random() * 50 - 25, // Slightly randomizing the height
            };

            const mesh = createFractalCube(2, position, 3); // Create smaller fractal cube as a planet
            planetPositions.push({ position, mesh }); // Store both position and mesh
        }
    }

    // Function to create line graph connecting planets
    function createLineGraph() {
        const points = planetPositions.map(
            (pos) =>
                new THREE.Vector3(
                    pos.position.x,
                    pos.position.y,
                    pos.position.z,
                ),
        );

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 2,
        }); // White color for the line
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    }

    // Function to send packets between planets
    function sendPacket(senderIndex, receiverIndex) {
        const sender = planetPositions[senderIndex].mesh;
        const receiver = planetPositions[receiverIndex].mesh;

        // Glow effect on sender
        const originalSenderEmissive = sender.material.emissive.clone();
        const glowColor = new THREE.Color(0xffffff); // White glow
        sender.material.emissive.set(glowColor);
        sender.material.emissiveIntensity = 2.0; // Increased intensity for more pronounced effect

        // Create the packet and add it to the active packets list
        const packet = new Packet(sender.position, receiver.position, scene);
        activePackets.push(packet);

        // Restore sender's emissive properties after a short delay
        setTimeout(() => {
            sender.material.emissive.copy(originalSenderEmissive);
            sender.material.emissiveIntensity = 1.2; // Reset intensity
        }, 500); // Glow duration
    }

    // Function to create the starry background
    function createStarField(numStars = 10000, radius = 200) {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8,
        });

        const positions = [];

        for (let i = 0; i < numStars; i++) {
            // Randomly distribute stars within a sphere
            const theta = THREE.MathUtils.degToRad(
                THREE.MathUtils.randFloatSpread(360),
            );
            const phi = THREE.MathUtils.degToRad(
                THREE.MathUtils.randFloatSpread(360),
            );

            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(theta);

            positions.push(x, y, z);
        }

        starsGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3),
        );

        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);
    }

    // Function to periodically send packets between random planets
    function initiatePacketNetwork() {
        setInterval(() => {
            if (planetPositions.length < 2) return; // Ensure there are at least two planets
            const senderIndex = Math.floor(
                Math.random() * planetPositions.length,
            );
            let receiverIndex = Math.floor(
                Math.random() * planetPositions.length,
            );
            while (receiverIndex === senderIndex) {
                receiverIndex = Math.floor(
                    Math.random() * planetPositions.length,
                );
            }

            sendPacket(senderIndex, receiverIndex);
        }, 1000); // Send a packet every second
    }

    onMount(() => {
        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); // Black background

        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        camera.position.z = 20; // Initial camera position

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);

        // Effect Composer setup
        composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Unreal Bloom Pass for glow effect
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // Increased Strength for more pronounced bloom
            0.4, // Radius
            0.85, // Threshold
        );
        composer.addPass(bloomPass);

        // Afterimage Pass for trailing effect
        const afterimagePass = new AfterimagePass();
        afterimagePass.uniforms["damp"].value = 0.85; // Dampening factor
        composer.addPass(afterimagePass);

        // Add Ambient Light with reduced intensity
        const ambientLight = new THREE.AmbientLight(0x404040, 1.2); // Reduced intensity
        scene.add(ambientLight);

        // Add Multiple Point Lights with reduced intensities
        const pointLight1 = new THREE.PointLight(0xff00ff, 0.9, 100);
        pointLight1.position.set(10, 10, 10);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00ffff, 0.9, 100);
        pointLight2.position.set(-10, -10, -10);
        scene.add(pointLight2);

        // Optional: Add a Hemisphere Light with reduced intensity
        const hemisphereLight = new THREE.HemisphereLight(
            0x4444ff,
            0x000000,
            0.6,
        );
        scene.add(hemisphereLight);

        // Create the main fractal cubes
        createFractalCube(4, { x: 0, y: 0, z: 0 }, 3); // Central fractal cube

        // Create distant fractal cube planets
        createDistantPlanets();

        // Create line graph connecting the planets
        createLineGraph();

        // Create a pivot for the orbiting fractal cube
        const orbitPivot = new THREE.Object3D();
        scene.add(orbitPivot);

        // Define orbit radius
        const orbitRadius = 12;

        // Create the orbiting fractal cube and add it to the pivot
        createFractalCube(2, { x: orbitRadius, y: 0, z: 0 }, 2, orbitPivot);

        // Create orbit ring to visualize the path
        const orbitSegments = 64;
        const orbitGeometry = new THREE.RingGeometry(
            orbitRadius - 0.05,
            orbitRadius + 0.05,
            orbitSegments,
            1,
            0,
            Math.PI * 2,
        );
        // Create a material that is wireframe-like
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        });
        const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitRing.rotation.x = Math.PI / 2; // Align the ring to the XZ plane
        scene.add(orbitRing);

        // Create the starry background
        createStarField(8000, 300); // 8,000 stars within a radius of 200 units

        // Raycaster for mouse interaction
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Initialize OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Enable damping for smoother experience
        controls.dampingFactor = 0.05;
        controls.minDistance = minZoom;
        controls.maxDistance = maxZoom;

        // Handle window resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            composer.setSize(width, height);
        };
        window.addEventListener("resize", handleResize);

        // Animation loop setup
        let previousTime = performance.now();

        const animate = function () {
            requestAnimationFrame(animate);

            const currentTime = performance.now();
            const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds
            previousTime = currentTime;

            // Rotate the main scene (slowed down by half)
            scene.rotation.x += 0.0025; // Halved from 0.005
            scene.rotation.y += 0.0025; // Halved from 0.005

            // Rotate the orbit pivot to make the moon orbit (slowed down by half)
            orbitPivot.rotation.y += 0.005; // Halved from 0.01

            // Update all active packets
            for (let i = activePackets.length - 1; i >= 0; i--) {
                const isActive = activePackets[i].update(deltaTime);
                if (!isActive) {
                    activePackets.splice(i, 1); // Remove inactive packet
                }
            }

            controls.update(); // Update OrbitControls
            composer.render();
        };
        animate();

        // Enhanced Mouse move interaction
        let previousIntersected = null;
        let previousEmissive = new THREE.Color(0);

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update the raycaster
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true); // Include nested children

            if (intersects.length > 0) {
                const intersected = intersects[0].object;
                if (intersected !== previousIntersected) {
                    if (previousIntersected) {
                        // Reset previous intersected object's emissive color
                        resetHighlight(previousIntersected, previousEmissive);
                    }
                    // Store new intersected object
                    previousIntersected = intersected;
                    previousEmissive = intersected.material.emissive.clone();
                    // Highlight new intersected object
                    highlightObject(intersected);
                }
            } else if (previousIntersected) {
                // Reset if no intersections
                resetHighlight(previousIntersected, previousEmissive);
                previousIntersected = null;
            }
        };

        // Helper functions for highlighting
        function highlightObject(object) {
            // Increase emissive intensity smoothly
            // If using Tween.js, uncomment and use the following lines
            /*
            new Tween(object.material.emissive)
                .to({ r: 1, g: 1, b: 1 }, 200)
                .easing(Easing.Quadratic.Out)
                .start();
            */
            // Alternatively, directly set emissive properties for simplicity
            object.material.emissive.set(0xffffff);
            object.material.emissiveIntensity = 2.0;
        }

        function resetHighlight(object, originalEmissive) {
            // Reset emissive color smoothly
            /*
            new Tween(object.material.emissive)
                .to({ r: originalEmissive.r, g: originalEmissive.g, b: originalEmissive.b }, 200)
                .easing(Easing.Quadratic.Out)
                .start();
            */
            object.material.emissive.copy(originalEmissive);
            object.material.emissiveIntensity = 1.2;
        }

        window.addEventListener("mousemove", onMouseMove);

        // Initialize packet network after creating planets
        initiatePacketNetwork();

        // Cleanup on component destroy
        return () => {
            renderer.dispose();
            composer.dispose();
            document.body.removeChild(renderer.domElement);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    });
</script>

<style>
    .three-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1; /* Ensure it's behind other content */
        pointer-events: none; /* Allows clicks to pass through */
    }

    /* Ensure the body takes the full height */
    :global(html, body) {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden; /* Prevent scrollbars from the Three.js scene */
    }
</style>
