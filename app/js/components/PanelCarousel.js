//PanelCarousel "class"

(function (window, $) {
	//constructor function
	function PanelCarousel(UTILS, num){
		//private variables
		var arAngles = [],
			arPanels = [],
			numpanels = num, 
			angleIndex = 0,
			selectedPanelIndex = 0,
			panelWidth = 128,
			panelHeight = panelWidth,
			panelMargin = 55,
			panelDepth = 10,
			origPanelPositions = generatePanelPositions(numpanels, panelWidth, panelMargin),
			enlargedPanelPositions = generatePanelPositions(numpanels, panelWidth*1.65, panelMargin),
			panelTween, 
			panelObj;

		//public functions
		this.construct = function(){
			return addPanels(numpanels);
		};

		this.getradius = function(){
			return origPanelPositions.radius;
		};

		this.getpanels = function(){
			return panelObj;
		};

		this.right = function(){
			//decrement angle
			var newAngleIndex = UTILS.decrementIndex(angleIndex,arAngles.length-2);
			selectedPanelIndex = (arAngles.length-1) - newAngleIndex;
			selectPanel(newAngleIndex);
		};

		this.left = function(){
			//increment angle
			var newAngleIndex = UTILS.incrementIndex(angleIndex,arAngles.length-2);
			selectedPanelIndex = (arAngles.length-1) - newAngleIndex;
			selectPanel(newAngleIndex);
		};

		this.clickPanel = function(intersects){
			selectedPanelIndex = intersects[0].object.index;
			var newAngleIndex = (arPanels.length-1)-selectedPanelIndex;
			selectPanel(newAngleIndex);
		};

		function selectPanel(newAngleIndex){
			newAngleIndex = newAngleIndex == 10 ? 0 : newAngleIndex;
			selectedPanelIndex = selectedPanelIndex == 10 ? 0 : selectedPanelIndex;
			resetAllPanels();
			switchAngle(angleIndex, newAngleIndex);
			angleIndex = newAngleIndex;
			rotatePanels(arAngles[angleIndex]);
			arPanels[selectedPanelIndex].select();
		};

		function switchAngle(curIndex, newIndex){
			if(curIndex == arAngles.length-2 && newIndex == 0){
				panelObj.rotation.y = -arAngles[1];
			}else if(curIndex == 0 && newIndex == arAngles.length-2){
				panelObj.rotation.y = arAngles[arAngles.length-1];
			}
		};

		function generatePanelPositions(n, w, m){
			var obj = {};
			obj.angleIncrement = UTILS.degreeToRadian(360/n);
			var totalLength = (w+m)*n;
			obj.diameter = totalLength/Math.PI;
			obj.radius = obj.diameter/2;
			return obj;
		}

		function resetAllPanels(){
			for(var i=0;i<arPanels.length;i++){
				arPanels[i].deselect();
			}
		}

		function rotatePanels(rad){
			panelTween = new TWEEN.Tween(panelObj.rotation)
	    		.to({y: rad}, 600)
	    		.easing(TWEEN.Easing.Back.Out)
	    		.start();
		}

		function addPanels(n){
			panelObj = new THREE.Object3D();
			var planeGeo = new THREE.CubeGeometry(panelWidth, panelHeight, panelDepth);
			for(var i=0;i<=n;i++){
				var planeMat = new THREE.MeshPhongMaterial({color:'#cc00'+String("" + i + i).slice(0,2)});
				arPanels[i] = new Panel(planeGeo, planeMat, i);
				arAngles[i] = origPanelPositions.angleIncrement*i;
				arPanels[i].rotation.y = arAngles[i];
				arPanels[i].position.x = Math.sin(arAngles[i]) * origPanelPositions.radius;
				arPanels[i].position.z = Math.cos(arAngles[i]) * origPanelPositions.radius;
				arPanels[i].castShadow = true;
				arPanels[i].setPositions({
					rotationY: enlargedPanelPositions.angleIncrement*i,
					positionX: enlargedPanelPositions.radius * Math.sin(enlargedPanelPositions.angleIncrement*i),
					positionZ: enlargedPanelPositions.radius * Math.cos(enlargedPanelPositions.angleIncrement*i)
				});
				arPanels[i].addContent();
				if(i<n) panelObj.add(arPanels[i]);
			}
			return panelObj;
		}

	}

	window.PanelCarousel = PanelCarousel;
	
}(window, jQuery));
