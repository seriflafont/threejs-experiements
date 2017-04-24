requirejs.config({
    baseUrl: 'js',
    paths: {
        vendor:'vendor'
    }
});

require(['jquery'], function($) {	
	$(function() {
	    function createHeadingCanvas(str){
	    	var cnvs = document.createElement('canvas');
			cnvs.width = 120;
			cnvs.height = 30;
			var cntxt = cnvs.getContext('2d');
			cntxt.font = "Bold 20px Arial";
			cntxt.textBaseline = 'top';
			cntxt.fillStyle = "rgba(0,0,0,1)";
		    cntxt.fillText(str, 0, 0);
		    return cnvs;
	    }

	    function createBodyCanvas(str){
	    	var cnvs = document.createElement('canvas');
			cnvs.width = 120;
			cnvs.height = 80;
			var cntxt = cnvs.getContext('2d');
			cntxt.font = "Bold 12px Arial";
			cntxt.textBaseline = 'top';
			cntxt.fillStyle = "rgba(0,0,0,1)";
		    cntxt.fillText(str, 0, 0);
		    return cnvs;
	    }

		//document.getElementById('base').appendChild(createHeadingCanvas('Heading'));
		//document.getElementById('base').appendChild(createBodyCanvas('Body'));
		var img = document.getElementById('sampleImage');
		var cnvs = document.createElement('canvas');
		cnvs.width = img.width/2;
		cnvs.height = img.height/2;
		var cntxt = cnvs.getContext('2d');
	    cntxt.drawImage(img, 0,0, img.width/2, img.height/2);
	    document.getElementById('base').appendChild(cnvs);
	});
});
