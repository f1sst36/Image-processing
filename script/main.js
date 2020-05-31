var canv = document.querySelector("#canvas");
const miniCanv = document.querySelector("#mini-canvas");
var canvParent = document.querySelector("#canv-parent");

var imgData, startImgData, beforeBAW;
var boolChanges = false;

var ctx = canv.getContext('2d');

let mainCanvasBGC = '#15191E';

makeGraph();

canv.width = document.querySelector('#canv-parent').offsetWidth;
canv.height = document.querySelector('#canv-parent').offsetHeight;
ctx.fillStyle = mainCanvasBGC;
ctx.fillRect(0, 0, canv.width, canv.height);

let inputFile = document.querySelector('#buttonFile');
inputFile.addEventListener('change', handleImage);

var img, width, height;
function handleImage(e){
    let reader = new FileReader();
    reader.onload = function(event){
    	canv.width = document.querySelector('#canv-parent').offsetWidth;
		canv.height = document.querySelector('#canv-parent').offsetHeight;

    	ctx.clearRect(0, 0, canv.width, canv.height);

        img = new Image();
        img.onload = function(){
	        if((img.width <= canv.width) && (img.height <= canv.height)){
	        	width = img.width;
	        	height = img.height;
	        }else if(img.width >= img.height){
	        	let ratio = img.width / img.height;
				width = canv.width;
				height = width/ratio;
	        }else{
	        	let ratio = img.height / img.width;
				height = canv.height;
				width = height/ratio;
	        }

			nowWidth = width;
			nowHeight = height;

	        ctx.fillStyle = mainCanvasBGC;
	        ctx.fillRect(0, 0, canv.width, canv.height);
			ctx.drawImage(img, (canv.width - width) / 2, (canv.height - height) / 2, width , height);

			startImgData = ctx.getImageData((canv.width - width) / 2, (canv.height - height) / 2, width, height);
			imgData = ctx.getImageData((canv.width - width) / 2, (canv.height - height) / 2, width, height);

        	boolChanges = true;

			let infoImg = document.querySelector('.about-window').getElementsByTagName('p');
			inputFile = document.getElementsByClassName('inputfile')[0];
			for(let i = 0; i < 4; i++) infoImg[i].innerHTML = '';

		    infoImg[0].innerHTML = (`<b>Имя файла: </b>` + inputFile.files[0].name);
		    infoImg[1].innerHTML = (`<b>Разрешение: </b>` + img.width + 'px x ' + img.height + 'px');
		    infoImg[2].innerHTML = (`<b>Тип файла: </b>` + inputFile.files[0].type);
		    infoImg[3].innerHTML = (`<b>Размер: </b>` + ((inputFile.files[0].size / 1024) / 1024).toFixed(3) + 'MB');
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

let downloadImg = document.querySelector('#downloadImg');

downloadImg.addEventListener('click', function(){
	if(img == undefined){
		popError('На полотне отсутствует<br />изображение.');
	}else{
		let dataURL = canv.toDataURL("image/jpeg");
		let link = downloadImg;
		link.href = dataURL;
		link.download = "AdobeZhekosImage.jpg";
	}
});

let aboutImg = document.querySelector('#aboutImg');

aboutImg.addEventListener('click', function(){
	if(img != undefined){
		document.getElementsByClassName('about')[0].style.display = 'block';
		document.getElementsByClassName('about')[0].classList.add('faster');
		animateCSS(document.getElementsByClassName('about')[0], 'fadeIn');
	}else{
		popError('На полотне отсутствует<br />изображение.');
	}
	
});

document.getElementsByClassName('about-window-ok')[0].addEventListener('click', function(){
	animateCSS(document.getElementsByClassName('about')[0], 'fadeOut', function(){
		document.getElementsByClassName('about')[0].style.display = 'none';
	});
});

function ClearCanvas(){
	if(img == undefined){
		popError('На полотне отсутствует<br />изображение.');
	}else{
		ctx.clearRect(0, 0, canv.width, canv.height);
		ctx.fillStyle = mainCanvasBGC;
		ctx.fillRect(0, 0, canv.width, canv.height);

		imgData = null;
		startImgData = null;
		beforeBAW = null;
		img = null;
		width = null;
		height = null;

		boolChanges = true;

		filter_checkboxs.forEach(function(checkbox){
			checkbox.checked = false;
		});

		//img = undefined;
		inputFile.value = '';
	}
}

function ClearChanges(){
	if(img == undefined){
		popError('На полотне отсутствует<br />изображение.');
	}else{
		ctx.clearRect(0, 0, canv.width, canv.height);
		ctx.fillStyle = mainCanvasBGC;
		ctx.fillRect(0, 0, canv.width, canv.height);
		ctx.putImageData(startImgData, (canv.width - imgData.width) / 2, (canv.height - imgData.height) / 2);

		filter_checkboxs.forEach(function(checkbox){
			checkbox.checked = false;
		});
		binarizationItem.value = 50;
		brightnessItem.value = 50;
		contrastItem.value = 50;

		boolChanges = true;

		imgData.data = [...startImgData.data];
	}
}

function popError(text){
	let windowErr = document.getElementsByClassName('error')[0];
	if(windowErr.style.display != 'block'){
		windowErr.classList.add('fast');
		let q = setInterval(function(){
			if (windowErr.style.display == 'block'){
				animateCSS(windowErr, 'bounceOutLeft', function(){
					windowErr.style.display = 'none';
					windowErr.children[0].innerHTML = '';
					clearInterval(q);
				});
			}
		}, 4000);

		windowErr.style.display = 'block';
		windowErr.children[0].innerHTML = text;
		animateCSS(windowErr, 'bounceInLeft');
	}
	
}

function animateCSS(element, animationName, callback) {
    const node = element;
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

let coordsBar = document.getElementsByClassName('coords')[0];
function Coords(event){
	let x = event.offsetX;
	let y = event.offsetY;
	if(x >= 0 && y >= 0){
		coordsBar.innerHTML = "x: " + x + ", y: " + y;
	}
}

document.querySelector('#canvas').addEventListener('mousemove', function(){
	Coords(event);
});

function cropImage(image, ctx, miniCtx, croppingCoords) {
    var cc = croppingCoords;
    var workCan = document.querySelector("#canvas");

	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = mainCanvasBGC;
	ctx.fillRect(0, 0, canv.width, canv.height);

    ctx.drawImage(image, -Math.floor(cc.x), -Math.floor(cc.y));
    image.src = workCan.toDataURL();
    return image;
}

function zoomImage(image, ctx, zoom = false) {
    var workCan = document.querySelector("#canvas");

    if(zoom){
    	img.width += img.width / 25;
    	img.height += img.height / 25;
    }else{
    	img.width -= img.width / 25;
    	img.height -= img.height / 25;
    }

	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = mainCanvasBGC;
	ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.drawImage(image, (workCan.width - img.width) / 2, (workCan.height - img.height) / 2, img.width, img.height);
}
/*
document.querySelector('#canv-parent').addEventListener('wheel', function(e){
	if(e.deltaY > 0){
		zoomImage(img, ctx);
	}else{
		zoomImage(img, ctx, true);
	}
});
*/
let bigButtons = document.getElementsByClassName('big-buttons')[0];
let filters = document.getElementsByClassName('filters')[0];
let graphs = document.getElementsByClassName('graphs')[0];

document.getElementsByClassName('filtersBtn')[0].addEventListener('click', function(){
	bigButtons.style.display = 'none';
	graphs.style.display = 'none';
	filters.style.display = 'block';
});

document.getElementsByClassName('image')[0].addEventListener('click', function(){
	filters.style.display = 'none';
	graphs.style.display = 'none';
	bigButtons.style.display = 'block';
});

document.getElementsByClassName('graph')[0].addEventListener('click', function(){
	filters.style.display = 'none';
	bigButtons.style.display = 'none';
	graphs.style.display = 'block';

	updateGraph();
});

filter_checkbox = document.getElementsByClassName('filter_checkbox');
filter_checkboxs = [...filter_checkbox];
filter_checkboxs.forEach(function(checkbox){
	checkbox.addEventListener('change', function(){
		CheckChenges(checkbox);
	});
});

function CheckChenges(checkbox){
	if(checkbox.checked && (img != null)){
		eval(checkbox.id + "()");
	}else{
		eval("reverse_" + checkbox.id + "()");
	}
}

let btns = document.getElementsByClassName('btn1');
for(let i = 0; i < btns.length ; i++){
	btns[i].addEventListener('click', function(){
		for(let i = 0; i < btns.length ; i++){
			btns[i].classList.remove('left-btn-active');
		}
		this.classList.add('left-btn-active');
	});
}

function negative(){
	for(let i = 0; i < imgData.data.length; i += 4){
		imgData.data[i] = 255 - imgData.data[i];
		imgData.data[i + 1] = 255 - imgData.data[i + 1];
		imgData.data[i + 2] = 255 - imgData.data[i + 2];
		//0.3 0.6 0.11
	}
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = mainCanvasBGC;
	ctx.fillRect(0, 0, canv.width, canv.height);
	ctx.putImageData(imgData, (canv.width - imgData.width) / 2, (canv.height - imgData.height) / 2);

	boolChanges = true;
}

function reverse_negative(){
	negative();

	boolChanges = true;
}

function blackAndWhite(){

	beforeBAW = ctx.getImageData((canv.width - width) / 2, (canv.height - height) / 2, width, height);

	negative();
	for(let i = 0; i < imgData.data.length; i += 4){
		imgData.data[i + 3] = imgData.data[i] * 0.3 + imgData.data[i + 1] * 0.6 + imgData.data[i + 2] * 0.11;
		imgData.data[i] = imgData.data[i + 3];
		imgData.data[i + 1] = imgData.data[i + 3];
		imgData.data[i + 2] = imgData.data[i + 3];
		
		//[imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]] = [imgData.data[i + 3], imgData.data[i + 3], imgData.data[i + 3]];
		//0.3 0.6 0.11
	}
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = mainCanvasBGC;
	ctx.fillRect(0, 0, canv.width, canv.height);
	ctx.putImageData(imgData, (canv.width - imgData.width) / 2, (canv.height - imgData.height) / 2);
	
	negative();

	boolChanges = true;
}

function reverse_blackAndWhite(){
	for(let i = 0; i < imgData.data.length; i += 4){
		imgData.data[i + 3] = 
		beforeBAW.data[i + 3];
		imgData.data[i] = beforeBAW.data[i];
		imgData.data[i + 1] = beforeBAW.data[i + 1];
		imgData.data[i + 2] = beforeBAW.data[i + 2];
	}
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = mainCanvasBGC;
	ctx.fillRect(0, 0, canv.width, canv.height);
	ctx.putImageData(imgData, (canv.width - imgData.width) / 2, (canv.height - imgData.height) / 2);

	boolChanges = true;
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

let color = document.getElementsByClassName('color');
let colors = [...color];

let binarizationItem = document.getElementById('binarization');
binarizationItem.addEventListener('input', function(){
	colors = [...color];
	binarization(binarizationItem.value * 2.55, hexToRgb(colors[0].value), hexToRgb(colors[1].value));
});

function binarization(threshold, color1, color2){
	for(let i = 0; i < imgData.data.length; i += 4){
		if( ((startImgData.data[i] + startImgData.data[i + 1] + startImgData.data[i + 2]) / 3) >= threshold ){
			imgData.data[i] = color1.r;
			imgData.data[i + 1] = color1.g;
			imgData.data[i + 2] = color1.b;
		}else{
			imgData.data[i] = color2.r;
			imgData.data[i + 1] = color2.g;
			imgData.data[i + 2] = color2.b;
		}
	}
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = mainCanvasBGC;
	ctx.fillRect(0, 0, canv.width, canv.height);
	ctx.putImageData(imgData, (canv.width - imgData.width) / 2, (canv.height - imgData.height) / 2);

	boolChanges = true;
}


const noiseSlider = document.querySelector('#noise')
noiseSlider.addEventListener('input', () => setNoise(Number(noiseSlider.value)))
function setNoise(noiseMul){
	for (let i = 0; i < imgData.data.length; i += 4) {
        let v = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
        imgData.data[i] = v >= 127 ? 0 : 255;
        imgData.data[i + 1] = v >= 127 ? 0 : 255;
        imgData.data[i + 2] = v >= 127 ? 0 : 255;
    }

    for (let i = 0; i < imgData.data.length; i += 4) {
        let isBlack = imgData.data[i] == 0 ? true : false;
		let rand = Math.random();

        imgData.data[i] = isBlack ? (rand >= noiseMul ? 0 : 255) : (rand >= noiseMul ? 255 : 0);
        imgData.data[i + 1] = isBlack ? (rand >= noiseMul ? 0 : 255) : (rand >= noiseMul ? 255 : 0);
        imgData.data[i + 2] = isBlack ? (rand >= noiseMul ? 0 : 255) : (rand >= noiseMul ? 255 : 0);
	}
	
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = mainCanvasBGC;
	ctx.fillRect(0, 0, canv.width, canv.height);
	ctx.putImageData(imgData, (canv.width - imgData.width) / 2, (canv.height - imgData.height) / 2);
}
