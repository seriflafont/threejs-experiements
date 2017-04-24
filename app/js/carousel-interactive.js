(function () {

	var debug = true;
	var LEFT = 37;
	var RIGHT = 39;

	//3d vars
	var wrapper = document.getElementById('base');
	var width = window.innerWidth;
	var aspectRatio = 3/2;
	var viewportWidth = width;
	var viewportHeight = width / aspectRatio;

	var scene, camera, renderer;
	var floor, panels, dlight;

	//poly vars
	var arAngles =[], numpanels = 10, panelIndex = 0;
	var angleIncrement = degreeToRadian(360/numpanels);
	var panelWidth = 100;
	var panelHeight = panelWidth;
	var panelMargin = 20;
	var panelDepth = 10;
	var tLength = (panelWidth+panelMargin)*numpanels;
	var diameter = tLength/Math.PI;
	var radius = diameter/2;
	var panelTween;

	setupSceneBase();
	addListeners();
	addSceneElements();
	
	if(debug){
		//add axes
		axes = buildAxes(1000);
		scene.add(axes);
		//add camera helper
		addCameraHelper(camera);
	}
	
	onFrame();

	function setupSceneBase(){
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, aspectRatio, 100, 1500);
		camera.position.z = 500;
		camera.position.x = 0;
		camera.position.y = 100;
		camera.lookAt({x:0, y:0, z:0});

		renderer = new THREE.WebGLRenderer({alpha:true});
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		renderer.setSize(viewportWidth, viewportHeight);
		wrapper.appendChild(renderer.domElement);
	}

	function addListeners(){
		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('keydown', onKeyDown, false);
	}

	function addSceneElements(){
		var floorGeo = new THREE.PlaneGeometry(1000,1000);
		var floorMat = new THREE.MeshLambertMaterial({color:0xcccccc});
		floor = new THREE.Mesh(floorGeo, floorMat);
		floor.rotation.x = degreeToRadian(-90);
		floor.receiveShadow = true;
		floor.position.y = -60;
		scene.add(floor);

		panels = addPanels(numpanels);
		scene.add(panels);

		scene.add(new THREE.AmbientLight(0x666666));
		var dlight = new THREE.DirectionalLight(0xffffff, 0.75);
		dlight.position.set(0, 100, 120);
		dlight.castShadow = true;
		var d = 50;

	    dlight.shadow.camera.left = -radius;
	    dlight.shadow.camera.right = radius;
	    dlight.shadow.camera.top = radius;
	    dlight.shadow.camera.bottom = -radius;
	    dlight.shadow.camera.far = 400;
	    dlight.shadow.camera.near = 0;

		scene.add(dlight);
		if(debug){
			addCameraHelper(dlight.shadow.camera);
		}
	}

	function addCameraHelper(camera){
		var helper = new THREE.CameraHelper(camera);
		scene.add(helper);
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
		var currotationy = panels.rotation.y;
		if(e.keyCode == RIGHT){
			left();
		}else if(e.keyCode == LEFT){
			right();
		}
	}

	function right(){
		//decrement angle
		if(panelIndex == 0) panels.rotation.y = arAngles[arAngles.length-1];
		panelIndex = decrementIndex(panelIndex,arAngles.length-2);
		rotatePanels(arAngles[panelIndex]);
	}

	function left(){
		//increment angle
		if(panelIndex == (arAngles.length-2)) panels.rotation.y = -arAngles[1];
		panelIndex = incrementIndex(panelIndex,arAngles.length-2);
		rotatePanels(arAngles[panelIndex]);
	}

	function rotatePanels(rad){
		panelTween = new TWEEN.Tween(panels.rotation)
    		.to({y: rad}, 600)
    		.easing(TWEEN.Easing.Back.Out)
    		.start();
	}

	function addPanels(n){
		var panels = new THREE.Object3D();
		var planeGeo = new THREE.CubeGeometry(panelWidth, panelHeight, panelDepth);
		var arPanels = [];
		for(var i=0;i<=n;i++){
			var planeMat = new THREE.MeshPhongMaterial({color:'#cc00'+String("" + i + i).slice(0,2)});
			arPanels[i] = new THREE.Mesh(planeGeo, planeMat);
			arAngles[i] = angleIncrement*i;
			arPanels[i].rotation.y = arAngles[i];
			arPanels[i].position.x = Math.sin(arAngles[i]) * radius;
			arPanels[i].position.z = Math.cos(arAngles[i]) * radius;
			arPanels[i].castShadow = true;
			panels.add(arPanels[i]);
		}
		return panels;
	}

	function incrementIndex(index, max){//(arAngles.length-2)
		return index == max ? 0 : index + 1;
	}

	function decrementIndex(index, max){//(arAngles.length-2)
		return index == 0 ? max : index - 1;
	}

	function degreeToRadian(degree){
		return degree * (Math.PI / 180);
	}

	function buildAxes( length ) {
		var axes = new THREE.Object3D();

		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

		return axes;

	}

	function buildAxis( src, dst, colorHex, dashed ) {
		var geom = new THREE.Geometry(),
			mat; 

		if(dashed) {
			mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
		} else {
			mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
		}

		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );
		geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

		var axis = new THREE.Line( geom, mat, THREE.LineSegments );

		return axis;

	}
}());