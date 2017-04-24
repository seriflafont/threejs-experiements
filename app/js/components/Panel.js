
//Panel "class"

(function (window) {
	// Make Panel have the same methods as Mesh
	Panel.prototype = Object.create(THREE.Mesh.prototype);
	Panel.prototype.type = 'Panel';
	// Make sure the right constructor gets called
	Panel.prototype.constructor = Panel;

	//constructor function
	function Panel(geom, mat, index){
	    THREE.Mesh.call(this, geom, mat);

	    //public vars
		this.type = 'Panel';
		this.index = index;
		//private variables
		var origcolor = mat.color.clone(),
			tweenMS = 500,
			enlargeTween,
			rotateTween,
			imageTween,
			enlargedPos,
			defaultPos,
			backImage;
		//public functions
		this.select = function(){
			//this.material.color.set(0xff0000);
			enlarge(this);
		};
		this.deselect = function(){
			//this.material.color.set(origcolor);
			reset(this);
		};
		this.addContent = function(){
			front(this);
			back(this);
			backImage.material.opacity = 0.35;
		};

		this.setPositions = function(obj){
			enlargedPos = obj;
			defaultPos = {
				rotationY: this.rotation.y,
				positionZ: this.position.z,
				positionX: this.position.x
			};
		};
		//private functions
		function enlarge(scope){			
			enlargeTween = new TWEEN.Tween(scope.position)
	    		.to({z: enlargedPos.positionZ, x: enlargedPos.positionX, y:20}, tweenMS)
	    		.easing(TWEEN.Easing.Back.Out)
	    		.start();

	    	var r = 180 * (Math.PI / 180);
	    	rotateTween = new TWEEN.Tween(scope.rotation)
	    		.to({y: r+defaultPos.rotationY}, tweenMS)
	    		.easing(TWEEN.Easing.Sinusoidal.Out)
	    		.start();
	    	imageTween = new TWEEN.Tween(backImage.material)
	    		.to({opacity:.8}, tweenMS)
	    		.easing(TWEEN.Easing.Sinusoidal.Out)
	    		.start();
		};
		function reset(scope){			
			enlargeTween = new TWEEN.Tween(scope.position)
	    		.to({z: defaultPos.positionZ, x: defaultPos.positionX, y:0}, tweenMS)
	    		.easing(TWEEN.Easing.Back.Out)
	    		.start();
	    	rotateTween = new TWEEN.Tween(scope.rotation)
	    		.to({y: defaultPos.rotationY}, tweenMS)
	    		.easing(TWEEN.Easing.Sinusoidal.Out)
	    		.start();
	    	imageTween = new TWEEN.Tween(backImage.material)
	    		.to({opacity:.35}, tweenMS)
	    		.easing(TWEEN.Easing.Sinusoidal.Out)
	    		.start();
		};
		function front(scope){
			// canvas contents will be used for a texture
			var texture1 = new THREE.Texture(createTextCanvas(scope.index, 'Bold 60px Arial', 128)) 
			texture1.needsUpdate = true;
		      
		    var material1 = new THREE.MeshBasicMaterial( {map: texture1} );
		    material1.transparent = true;
		    var frontplane = new THREE.Mesh(
		        new THREE.PlaneGeometry(scope.geometry.parameters.width, scope.geometry.parameters.height),
		        material1
		      );
			frontplane.position.set(12,0,10);
			scope.add( frontplane );
		};

		function back(scope){
			var img = document.getElementById('image'+scope.index);
			var cnvs = document.createElement('canvas');
			cnvs.width = img.width;
			cnvs.height = img.height;
			var cntxt = cnvs.getContext('2d');
			//cntxt.globalAlpha = .5;
		    cntxt.drawImage(img, 0,0, img.width, img.height);

			var headTexture = new THREE.Texture(cnvs) 
			headTexture.needsUpdate = true;
		      
		    var material1 = new THREE.MeshPhongMaterial( {map: headTexture, shininess:10} );
		    material1.transparent = true;
		    backImage = new THREE.Mesh(
		        new THREE.PlaneGeometry(scope.geometry.parameters.width, scope.geometry.parameters.height),
		        material1
		      );
			backImage.position.set(0,0,-6);
			backImage.rotation.y = 180 * (Math.PI/180);
			backImage.receiveShadow = true;
			scope.add(backImage);
		};

		function textBack(scope){
			var heading = createTextCanvas('Test Heading', 'Bold 10px Arial', 32);
			var body = createTextCanvas('Test Body', 'Bold 12px Arial', 80);

			var headTexture = new THREE.Texture(heading) 
			headTexture.needsUpdate = true;
		      
		    var material1 = new THREE.MeshBasicMaterial( {map: headTexture} );
		    material1.transparent = true;
		    var backtopplane = new THREE.Mesh(
		        new THREE.PlaneGeometry(scope.geometry.parameters.width, 30),
		        material1
		      );
			backtopplane.position.set(-10,40,-10);
			backtopplane.rotation.y = 180 * (Math.PI/180);
			scope.add(backtopplane);
		};

		function createTextCanvas(str, style, height){
			var cnvs = document.createElement('canvas');
			cnvs.width = 128;
			cnvs.height = height;
			var cntxt = cnvs.getContext('2d');
			cntxt.font = style;
			cntxt.textBaseline = 'top';
			cntxt.fillStyle = "rgba(255,255,255,1)";
		    cntxt.fillText(str, 0, 0);
		    return cnvs;
		};
	}

	window.Panel = Panel;
	
}(window));


