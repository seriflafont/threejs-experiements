requirejs.config({
    baseUrl: 'js',
    paths: {
        vendor:'vendor'
    }
});

require(['jquery','components/Panel','components/PanelCarousel', 'utils'], function($) {	
	$(function() {
		//static vars
		var LEFT = 37;
		var RIGHT = 39;
		var UTILS = new utils();

		//config vars
		var debug = false,
			wrapper = document.getElementById('base'),
			width = window.innerWidth,
			height = window.innerHeight,
			aspectRatio = width/height,
			viewportWidth = width,
			viewportHeight = width / aspectRatio,
			numpanels = 10,
			cameraX = 0,
			cameraY = 40,
			cameraZ = 700;
		
		//3d scene vars
		var scene, 
			camera, 
			renderer,
			floor, 
			panels,
			mousetracker = new THREE.Vector2(),
			raycaster = new THREE.Raycaster(),
			zoomTween;

		setupSceneBase();
		addListeners();
		addSceneElements();
		
		if(debug){
			//add axes
			axes = UTILS.buildAxes(1000);
			scene.add(axes);
			//add camera helper
			UTILS.addCameraHelper(camera, scene);
		}
		
		onFrame();

		function setupSceneBase(){
			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(45, aspectRatio, 100, 1500);
			camera.position.z = cameraZ;
			camera.position.x = cameraX;
			camera.position.y = cameraY;
			camera.lookAt({x:0, y:0, z:0});

			renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
			renderer.shadowMap.enabled = true;
			renderer.shadowMapSoft = true;
			renderer.setSize(viewportWidth, viewportHeight);
			wrapper.appendChild(renderer.domElement);
		}

		function addListeners(){
			window.addEventListener('resize', onWindowResize, false);
			window.addEventListener('keydown', onKeyDown, false);
			wrapper.addEventListener('mousedown', onMouseClick, false);
			document.getElementById('zoomin').addEventListener('click', onZoomIn, false);
			document.getElementById('zoomout').addEventListener('click', onZoomOut, false);
		}

		function addSceneElements(){
			var floorGeo = new THREE.PlaneGeometry(2000,1000);
			var floorMat = new THREE.MeshLambertMaterial({color:0xcccccc});
			floor = new THREE.Mesh(floorGeo, floorMat);
			floor.rotation.x = UTILS.degreeToRadian(-90);
			floor.receiveShadow = true;
			floor.position.y = -60;
			scene.add(floor);

			panels = new PanelCarousel(UTILS,numpanels);
			scene.add(panels.construct());

			scene.add(new THREE.AmbientLight(0x666666));
			var shadowLight = new THREE.DirectionalLight(0xffffff, 0.75);
			shadowLight.position.set(0, 200, 80);
			shadowLight.castShadow = true;
			var d = 50;

			var radius = panels.getradius();
		    shadowLight.shadow.camera.left = -radius;
		    shadowLight.shadow.camera.right = radius;
		    shadowLight.shadow.camera.top = radius;
		    shadowLight.shadow.camera.bottom = -radius*1.65;
		    shadowLight.shadow.camera.far = 400;
		    shadowLight.shadow.camera.near = -80;

			scene.add(shadowLight);
			if(debug){
				UTILS.addCameraHelper(shadowLight.shadow.camera, scene);
			}

			var dlight = new THREE.DirectionalLight(0xffffff, 0.35);
			dlight.position.set(0, 50, 200);
			scene.add(dlight);
			//UTILS.addCameraHelper(dlight.shadow.camera, scene);
		}

		function onFrame() {
			updateScene();
		    render();
		    requestAnimationFrame(onFrame);
		}

		function updateScene(){
			camera.lookAt({x:0, y:0, z:0});
			TWEEN.update();
		}

		function render(){
			renderer.render(scene, camera);
		}

		function onWindowResize(){
			renderer.setSize( wrapper.clientWidth, wrapper.clientWidth/aspectRatio);
	    	render();
		}

		function onKeyDown(e){
			if(e.keyCode == RIGHT){
				panels.left();
			}else if(e.keyCode == LEFT){
				panels.right();
			}
		}
		function onMouseClick(event){
		   	mousetracker.x = ((event.offsetX / wrapper.clientWidth) * 2 - 1) ;
		    mousetracker.y = - (event.offsetY / wrapper.clientHeight) * 2 + 1;
		    //update pick position with the camera and mouse position
		    raycaster.setFromCamera(mousetracker, camera);

		    //calculate objects intersecting with the ray
		    var intersects = raycaster.intersectObjects(panels.getpanels().children);

		    if(intersects.length >=1) panels.clickPanel(intersects);
		}

		function onMouseMove(event){
		    mousetracker.x = ((event.offsetX / wrapper.clientWidth) * 2 - 1) ;
		    mousetracker.y = - (event.offsetY / wrapper.clientHeight) * 2 + 1;

		    calculatedRotationX = 180-((event.clientX / wrapper.clientWidth) * Math.PI);
		    calculatedRotationY = 180-((event.clientY / wrapper.clientHeight) * Math.PI);
		}

		function onZoomIn(){
			zoomTween = new TWEEN.Tween(camera.position)
	    		.to({z: cameraZ, x: cameraX, y:cameraY}, 1000)
	    		.easing(TWEEN.Easing.Sinusoidal.InOut)
	    		.start();
		}

		function onZoomOut(){
			zoomTween = new TWEEN.Tween(camera.position)
	    		.to({z: 700, x: 800, y:400}, 1000)
	    		.easing(TWEEN.Easing.Sinusoidal.InOut)
	    		.start();
		}

	});
});
