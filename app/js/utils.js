
//utils "class"

(function (window, $, THREE) {
	//public variables
	//utils.prototype.var_name = "";

	//constructor function
	function utils(){
		//public functions

		this.incrementIndex = function(index, max){
			return index == max ? 0 : index + 1;
		};

		this.decrementIndex = function(index, max){
			return index == 0 ? max : index - 1;
		};

		this.degreeToRadian = function(degree){
			return degree * (Math.PI / 180);
		};

		this.addCameraHelper = function(camera, scene){
			var helper = new THREE.CameraHelper(camera);
			scene.add(helper);
		};

		this.buildAxes = function(length) {
			var axes = new THREE.Object3D();
			axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
			axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
			axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
			axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
			axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
			axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
			return axes;
		};

		//private functions
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
		};

	}

	window.utils = utils;
	
}(window, jQuery, THREE));
