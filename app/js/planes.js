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
		var debug = true,
			wrapper = document.getElementById('base'),
			width = window.innerWidth,
			aspectRatio = 3/2,
			viewportWidth = width,
			viewportHeight = width / aspectRatio,
			numpanels = 1;
		
		//3d scene vars
		var scene, 
			camera, 
			renderer,
			floor, 
			panels,
			mousetracker = new THREE.Vector2(),
			raycaster = new THREE.Raycaster();

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
			camera.position.z = 700;
			camera.position.x = 0;
			camera.position.y = 100;
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
		}

		function addSceneElements(){
			var floorGeo = new THREE.PlaneGeometry(1000,1000);
			var floorMat = new THREE.MeshLambertMaterial({color:0xcccccc});
			floor = new THREE.Mesh(floorGeo, floorMat);
			floor.rotation.x = UTILS.degreeToRadian(-90);
			floor.receiveShadow = true;
			floor.position.y = 0;
			scene.add(floor);

			// panels = new PanelCarousel(UTILS,numpanels);
			// scene.add(panels.construct());
			addPlanes();

			scene.add(new THREE.AmbientLight(0x666666));
			var dlight = new THREE.DirectionalLight(0xffffff, 0.75);
			dlight.position.set(0, 100, 120);
			dlight.castShadow = true;
			var d = 50;

			var radius = 500;//panels.getradius();
		    dlight.shadow.camera.left = -radius;
		    dlight.shadow.camera.right = radius;
		    dlight.shadow.camera.top = radius;
		    dlight.shadow.camera.bottom = -radius;
		    dlight.shadow.camera.far = 400;
		    dlight.shadow.camera.near = -200;

			scene.add(dlight);
			if(debug){
				UTILS.addCameraHelper(dlight.shadow.camera, scene);
			}
		}

		function addPlanes(){
			var img = document.getElementById('sampleImage');
			var cnvs = document.createElement('canvas');
			cnvs.width = img.width;
			cnvs.height = img.height;
			var cntxt = cnvs.getContext('2d');
		    cntxt.drawImage(img, 0,0,img.width, img.height);

			var headTexture = new THREE.Texture(cnvs) 
			headTexture.needsUpdate = true;
		      
		    var material1 = new THREE.MeshPhongMaterial( {map: headTexture, shininess:10} );
		    var backtopplane = new THREE.Mesh(
		        new THREE.PlaneGeometry(img.width/2, img.height/2),
		        material1
		      );
			backtopplane.position.set(0,img.height/4,0);
			//backtopplane.rotation.y = -180 * (Math.PI/180);
			backtopplane.receiveShadow = true;
			scene.add(backtopplane);
		}

		function onFrame() {
			updateScene();
		    render();
		    requestAnimationFrame(onFrame);
		}

		function updateScene(){
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

	});
});
