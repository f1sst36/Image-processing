var canv = document.querySelector("#canvas");
const BGcanvas = document.querySelector("#BG-canvas");
var canvParent = document.querySelector("#canv-parent");

var imgData, startImgData, beforeBAW;
var boolChanges = false;

var ctx = canv.getContext('2d');
var BGctx = BGcanvas.getContext('2d')

// #15191E
let mainCanvasBGC = '#fff';

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
    	BGcanvas.width = document.querySelector('#canv-parent').offsetWidth;
		BGcanvas.height = document.querySelector('#canv-parent').offsetHeight;


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

			canv.style.width = width + 'px'
			canv.style.height = height + 'px'

	        BGctx.fillStyle = '#2E2E2E';
			BGctx.drawImage(img, 0, 0, BGcanvas.width, BGcanvas.height);
			ctx.drawImage(img, 0, 0, canv.width, canv.height);
			

			startImgData = ctx.getImageData(0, 0, canv.width, canv.height);
			imgData = ctx.getImageData(0, 0, canv.width, canv.height);

        	boolChanges = true;

			
			//console.log(height)

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
	if((img == undefined) && (img == null)){
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
	if((img != undefined)  || (img != null)){
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
	if((img == undefined)  && (img == null)){
		popError('На полотне отсутствует<br />изображение.');
	}else{
		ctx.clearRect(0, 0, canv.width, canv.height);
		ctx.fillStyle = mainCanvasBGC;
		ctx.fillRect(0, 0, canv.width, canv.height);
		BGctx.fillStyle = mainCanvasBGC;
		BGctx.fillRect(0, 0, BGcanvas.width, BGcanvas.height);

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
		ctx.putImageData(startImgData, 0, 0);
		//ctx.drawImage(img, 0, 0, canv.width, canv.height);

		filter_checkboxs.forEach(function(checkbox){
			checkbox.checked = false;
		});
		binarizationItem.value = 50;
		brightnessItem.value = 50;
		contrastItem.value = 50;
		noiseSlider.value = 0

		boolChanges = true;

		imgData.data = [...startImgData.data];
		blackAndWhite()
		reverse_blackAndWhite()
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
let true_filters = document.getElementsByClassName('true-filters')[0]

document.getElementsByClassName('filtersBtn')[0].addEventListener('click', function(){
	bigButtons.style.display = 'none';
	graphs.style.display = 'none';
	true_filters.style.display = 'none'
	filters.style.display = 'block';
});

document.getElementsByClassName('image')[0].addEventListener('click', function(){
	filters.style.display = 'none';
	graphs.style.display = 'none';
	true_filters.style.display = 'none'
	bigButtons.style.display = 'block';
});

document.getElementsByClassName('filter')[0].addEventListener('click', function(){
	filters.style.display = 'none';
	graphs.style.display = 'none';
	bigButtons.style.display = 'none';
	true_filters.style.display = 'block'
});

document.getElementsByClassName('graph')[0].addEventListener('click', function(){
	filters.style.display = 'none';
	bigButtons.style.display = 'none';
	true_filters.style.display = 'none'
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
	ctx.putImageData(imgData, 0, 0);

	boolChanges = true;
}

function reverse_negative(){
	negative();

	boolChanges = true;
}

function blackAndWhite(){

	beforeBAW = ctx.getImageData(0, 0, canv.width, canv.height);;

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
	ctx.putImageData(imgData, 0, 0);
	
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
	ctx.putImageData(imgData, 0, 0);

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
	ctx.putImageData(imgData, 0, 0);

	boolChanges = true;
}


const noiseSlider = document.querySelector('#noise')
noiseSlider.addEventListener('input', () => setNoise(Number(noiseSlider.value)), false)
function setNoise(noiseMul){
	ctx.putImageData(startImgData, 0, 0);
	imgData = ctx.getImageData(0, 0, canv.width, canv.height);

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
	ctx.putImageData(imgData, 0, 0);
}

function toMatrix(array, chunkSize) {
    let R = [];
    for (let i = 0; i < array.length; i += chunkSize)
        R.push(array.slice(i, i + chunkSize));
    return R;
}

function convolution(pixels, weights) {
    let side = Math.round(Math.sqrt(weights.length));
    let halfSide = Math.floor(side / 2);
    let src = pixels.data;
    let canvasWidth = pixels.width;
    let canvasHeight = pixels.height;
    let temporaryCanvas = document.createElement('canvas');
    let temporaryCtx = temporaryCanvas.getContext('2d');
    let outputData = temporaryCtx.createImageData(canvasWidth, canvasHeight);

    for (let y = 0; y < canvasHeight; y++) {

        for (let x = 0; x < canvasWidth; x++) {

            let dstOff = (y * canvasWidth + x) * 4;
            let sumReds = 0, sumGreens = 0, sumBlues = 0;

            for (let kernelY = 0; kernelY < side; kernelY++) {
                for (let kernelX = 0; kernelX < side; kernelX++) {

                    let currentKernelY = y + kernelY - halfSide;
                    let currentKernelX = x + kernelX - halfSide;

                    if (currentKernelY >= 0 &&
                        currentKernelY < canvasHeight &&
                        currentKernelX >= 0 &&
                        currentKernelX < canvasWidth) {

                        let offset = (currentKernelY * canvasWidth + currentKernelX) * 4;
                        let weight = weights[kernelY * side + kernelX];

                        sumReds += src[offset] * weight;
                        sumGreens += src[offset + 1] * weight;
                        sumBlues += src[offset + 2] * weight;
                    }
                }
            }

            outputData.data[dstOff] = sumReds;
            outputData.data[dstOff + 1] = sumGreens;
            outputData.data[dstOff + 2] = sumBlues;
            outputData.data[dstOff + 3] = 255;
        }
    }
    return outputData;
}

const linear = document.querySelector('#linear');
linear.addEventListener('click', LinearFilter)

function LinearFilter(){
    ctx.drawImage(img, 0, 0, canv.width, canv.height);

	let imgData = ctx.getImageData(0, 0, canv.width, canv.height);

    let temp = toMatrix(imgData.data, imgData.width * 4);

    for (let i = 0; i < temp.length; i++)
        temp[i] = toMatrix(temp[i], 4);

    try {
        for (let j = 0; j < canv.width; j++) {
            for (let i = 0; i < canv.height; i++) {
                if (i == 0 || j == 0 || i + 1 == canv.height || j + 1 == canv.width) { }
                else {
                    let r_summ = temp[i - 1][j - 1][0];
                    let g_summ = temp[i - 1][j - 1][1];
                    let b_summ = temp[i - 1][j - 1][2];

                    r_summ = r_summ + temp[i - 1][j][0];
                    g_summ = g_summ + temp[i - 1][j][1];
                    b_summ = b_summ + temp[i - 1][j][2];

                    r_summ += temp[i - 1][j + 1][0];
                    g_summ += temp[i - 1][j + 1][1];
                    b_summ += temp[i - 1][j + 1][2];

                    r_summ = r_summ + temp[i][j - 1][0];
                    g_summ = g_summ + temp[i][j - 1][1];
                    b_summ = b_summ + temp[i][j - 1][2];

                    r_summ = r_summ + temp[i][j][0];
                    g_summ = g_summ + temp[i][j][1];
                    b_summ = b_summ + temp[i][j][2];

                    r_summ = r_summ + temp[i][j + 1][0];
                    g_summ = g_summ + temp[i][j + 1][1];
                    b_summ = b_summ + temp[i][j + 1][2];

                    r_summ = r_summ + temp[i + 1][j - 1][0];
                    g_summ = g_summ + temp[i + 1][j - 1][1];
                    b_summ = b_summ + temp[i + 1][j - 1][2];

                    r_summ = r_summ + temp[i + 1][j][0];
                    g_summ = g_summ + temp[i + 1][j][1];
                    b_summ = b_summ + temp[i + 1][j][2];

                    r_summ = r_summ + temp[i + 1][j + 1][0];
                    g_summ = g_summ + temp[i + 1][j + 1][1];
                    b_summ = b_summ + temp[i + 1][j + 1][2];

                    r_summ = r_summ / 9;
                    g_summ = g_summ / 9;
                    b_summ = b_summ / 9;

                    temp[i][j][0] = Math.floor(r_summ);
                    temp[i][j][1] = Math.floor(g_summ);
                    temp[i][j][2] = Math.floor(b_summ);
                }
            }
        }
    }
    catch{ }

    temp = new Uint8ClampedArray(temp.toString().split(',').map(v => +v));

    imgData.data.set(temp);

	ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.putImageData(imgData, 0, 0);
}


let median = document.querySelector('#median')
median.addEventListener('click', MedianFilter)
function MedianFilter(){
	ctx.drawImage(img, 0, 0, canv.width, canv.height);
	let imgData = ctx.getImageData(0, 0, canv.width, canv.height);

    let temp = toMatrix(imgData.data, imgData.width * 4);

    for (let i = 0; i < temp.length; i++)
        temp[i] = toMatrix(temp[i], 4);

    for (let j = 0; j < canv.width; j++) {
        for (let i = 0; i < canv.height; i++) {
            if (i == 0 || j == 0 || i + 1 == canv.height || j + 1 == canv.width) { }
            else {
                let r_summ = [
                    temp[i - 1][j - 1][0],
                    temp[i - 1][j][0],
                    temp[i - 1][j + 1][0],
                    temp[i][j - 1][0],
                    temp[i][j][0],
                    temp[i][j + 1][0],
                    temp[i + 1][j - 1][0],
                    temp[i + 1][j][0],
                    temp[i + 1][j + 1][0]
                ];

                let g_summ = [
                    temp[i - 1][j - 1][1],
                    temp[i - 1][j][1],
                    temp[i - 1][j + 1][1],
                    temp[i][j - 1][1],
                    temp[i][j][1],
                    temp[i][j + 1][1],
                    temp[i + 1][j - 1][1],
                    temp[i + 1][j][1],
                    temp[i + 1][j + 1][1]
                ];

                let b_summ = [
                    temp[i - 1][j - 1][2],
                    temp[i - 1][j][2],
                    temp[i - 1][j + 1][2],
                    temp[i][j - 1][2],
                    temp[i][j][2],
                    temp[i][j + 1][2],
                    temp[i + 1][j - 1][2],
                    temp[i + 1][j][2],
                    temp[i + 1][j + 1][2]
                ];

                r_summ.sort();
                g_summ.sort();
                b_summ.sort();

                temp[i][j][0] = r_summ[4];
                temp[i][j][1] = g_summ[4];
                temp[i][j][2] = b_summ[4];
            }
        }
    }

    temp = new Uint8ClampedArray(temp.toString().split(',').map(v => +v));

    imgData.data.set(temp);

    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.putImageData(imgData, 0, 0);
}

let cirsh = document.querySelector('#cirsh')
cirsh.addEventListener('click', CirshFilter)
function CirshFilter() {
    ctx.drawImage(img, 0, 0, canv.width, canv.height);

    let imgData = ctx.getImageData(0, 0, canv.width, canv.height);

    let weight = [
        -3, 5, 5,
        -3, 0, 5,
        -3, -3, -3
    ];

    imgData = convolution(imgData, weight);

    ctx.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height);
}

let laplas = document.querySelector('#laplas')
laplas.addEventListener('click', LaplasFilter)
function LaplasFilter() {
    ctx.drawImage(img, 0, 0, canv.width, canv.height);

    let imgData = ctx.getImageData(0, 0, canv.width, canv.height);

    let weight = [
        -1, -2, -1,
        -2, 12, -2,
        -1, -2, -1
    ]

    imgData = convolution(imgData, weight)

    ctx.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height);
}

let roberts = document.querySelector('#roberts')
roberts.addEventListener('click', RobertsFilter)
function RobertsFilter() {
    ctx.drawImage(img, 0, 0, canv.width, canv.height);

    let imgData = ctx.getImageData(0, 0, canv.width, canv.height);

    let temp = toMatrix(imgData.data, imgData.width * 4);

    for (let i = 0; i < temp.length; i++)
        temp[i] = toMatrix(temp[i], 4);

    for (let j = 0; j < canv.width; j++) {
        for (let i = 0; i < canv.height; i++) {
            if (i == 0 || j == 0 || i + 1 == canv.height || j + 1 == canv.width) { }
            else {
                let r = Math.abs(temp[i][j][0] - temp[i + 1][j + 1][0]) + Math.abs(temp[i][j + 1][0] - temp[i + 1][j][0]);
                let g = Math.abs(temp[i][j][1] - temp[i + 1][j + 1][1]) + Math.abs(temp[i][j + 1][1] - temp[i + 1][j][1]);
                let b = Math.abs(temp[i][j][2] - temp[i + 1][j + 1][2]) + Math.abs(temp[i][j + 1][2] - temp[i + 1][j][2]);

                temp[i][j][0] = r;
                temp[i][j][1] = g;
                temp[i][j][2] = b;
            }
        }
    }

    temp = new Uint8ClampedArray(temp.toString().split(',').map(v => +v));

    imgData.data.set(temp);

    ctx.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height);
}

let sobel = document.querySelector('#sobel')
sobel.addEventListener('click', SobelFilter)
function SobelFilter() {
    ctx.drawImage(img, 0, 0, canv.width, canv.height);

    let imgData = ctx.getImageData(0, 0, canv.width, canv.height);
    let temp = toMatrix(imgData.data, imgData.width * 4);
    for (let i = 0; i < temp.length; i++)
        temp[i] = toMatrix(temp[i], 4);

    let temporaryCanvas = document.createElement('canvas');
    let temporaryCtx = temporaryCanvas.getContext('2d');
    let outputData = temporaryCtx.createImageData(canv.width, canv.height);
    outputData = toMatrix(outputData.data, outputData.width * 4);
    for (let i = 0; i < outputData.length; i++)
        outputData[i] = toMatrix(outputData[i], 4);

    for (let i = 0; i < canv.height; i++) {
        for (let j = 0; j < canv.width; j++) {
            if (i == 0 || j == 0 || i + 1 == canv.height || j + 1 == canv.width) { }
            else {
                let x_r =
                    (temp[i - 1][j + 1][0] + 2 * temp[i][j + 1][0] + temp[i + 1][j + 1][0]) -
                    (temp[i - 1][j - 1][0] + 2 * temp[i][j - 1][0] + temp[i + 1][j - 1][0]);
                let y_r =
                    (temp[i - 1][j - 1][0] + 2 * temp[i - 1][j][0] + temp[i - 1][j + 1][0]) -
                    (temp[i + 1][j - 1][0] + 2 * temp[i + 1][j][0] + temp[i + 1][j + 1][0]);

                let x_g =
                    (temp[i - 1][j + 1][1] + 2 * temp[i][j + 1][1] + temp[i + 1][j + 1][1]) -
                    (temp[i - 1][j - 1][1] + 2 * temp[i][j - 1][1] + temp[i + 1][j - 1][1]);
                let y_g =
                    (temp[i - 1][j - 1][1] + 2 * temp[i - 1][j][1] + temp[i - 1][j + 1][1]) -
                    (temp[i + 1][j - 1][1] + 2 * temp[i + 1][j][1] + temp[i + 1][j + 1][1]);

                let x_b =
                    (temp[i - 1][j + 1][2] + 2 * temp[i][j + 1][2] + temp[i + 1][j + 1][2]) -
                    (temp[i - 1][j - 1][2] + 2 * temp[i][j - 1][2] + temp[i + 1][j - 1][2]);
                let y_b =
                    (temp[i - 1][j - 1][2] + 2 * temp[i - 1][j][2] + temp[i - 1][j + 1][2]) -
                    (temp[i + 1][j - 1][2] + 2 * temp[i + 1][j][2] + temp[i + 1][j + 1][2]);

                let g_r = Math.sqrt(x_r * x_r + y_r * y_r);
                let g_g = Math.sqrt(x_g * x_g + y_g * y_g);
                let g_b = Math.sqrt(x_b * x_b + y_b * y_b);

                outputData[i][j][0] = g_r;
                outputData[i][j][1] = g_g;
                outputData[i][j][2] = g_b;
                outputData[i][j][3] = 255;
            }
        }
    }

    outputData = new Uint8ClampedArray(outputData.toString().split(',').map(v => +v));
    imgData.data.set(outputData);

    ctx.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height);
}

let uolles = document.querySelector('#uolles')
uolles.addEventListener('click', UollesFilter)
function UollesFilter() {
    ctx.drawImage(img, 0, 0, canv.width, canv.height);

    let imgData = ctx.getImageData(0, 0, canv.width, canv.height);
    let temp = toMatrix(imgData.data, imgData.width * 4);
    for (let i = 0; i < temp.length; i++)
        temp[i] = toMatrix(temp[i], 4);

    let temporaryCanvas = document.createElement('canvas');
    let temporaryCtx = temporaryCanvas.getContext('2d');
    let outputData = temporaryCtx.createImageData(canv.width, canv.height);
    outputData = toMatrix(outputData.data, outputData.width * 4);
    for (let i = 0; i < outputData.length; i++)
        outputData[i] = toMatrix(outputData[i], 4);

    for (let i = 0; i < canv.height; i++) {
        for (let j = 0; j < canv.width; j++) {
            if (i == 0 || j == 0 || i + 1 == canv.height || j + 1 == canv.width) { }
            else {
                let f_r = Math.log((
                    ((temp[i][j][0] + 1) / (temp[i - 1][j][0] + 1)) *
                    ((temp[i][j][0] + 1) / (temp[i][j + 1][0] + 1)) *
                    ((temp[i][j][0] + 1) / (temp[i + 1][j][0] + 1)) *
                    ((temp[i][j][0] + 1) / (temp[i][j - 1][0] + 1))
                )) / 4;
                let f_g = Math.log((
                    ((temp[i][j][1] + 1) / (temp[i - 1][j][1] + 1)) *
                    ((temp[i][j][1] + 1) / (temp[i][j + 1][1] + 1)) *
                    ((temp[i][j][1] + 1) / (temp[i + 1][j][1] + 1)) *
                    ((temp[i][j][1] + 1) / (temp[i][j - 1][1] + 1))
                )) / 4;
                let f_b = Math.log((
                    ((temp[i][j][2] + 1) / (temp[i - 1][j][2] + 1)) *
                    ((temp[i][j][2] + 1) / (temp[i][j + 1][2] + 1)) *
                    ((temp[i][j][2] + 1) / (temp[i + 1][j][2] + 1)) *
                    ((temp[i][j][2] + 1) / (temp[i][j - 1][2] + 1))
                )) / 4;

                outputData[i][j][0] = f_r * 1000;
                outputData[i][j][1] = f_g * 1000;
                outputData[i][j][2] = f_b * 1000;
                outputData[i][j][3] = 255;
            }
        }
    }

    outputData = new Uint8ClampedArray(outputData.toString().split(',').map(v => +v));
    imgData.data.set(outputData);

    ctx.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height);
}

let static = document.querySelector('#static')
static.addEventListener('click', StaticFilter)
function StaticFilter() {
    ctx.drawImage(img, 0, 0, canv.width, canv.height);

    let imgData = ctx.getImageData(0, 0, canv.width, canv.height);
    let temp = toMatrix(imgData.data, imgData.width * 4);
    for (let i = 0; i < temp.length; i++)
        temp[i] = toMatrix(temp[i], 4);

    let temporaryCanvas = document.createElement('canvas');
    let temporaryCtx = temporaryCanvas.getContext('2d');
    let outputData = temporaryCtx.createImageData(canv.width, canv.height);
    outputData = toMatrix(outputData.data, outputData.width * 4);
    for (let i = 0; i < outputData.length; i++)
        outputData[i] = toMatrix(outputData[i], 4);

    for (let j = 0; j < canv.width; j++) {
        for (let i = 0; i < canv.height; i++) {
            if (i == 0 || j == 0 || i + 1 == canv.height || j + 1 == canv.width) { }
            else {
                let summ1_r = temp[i][j][0] + temp[i + 1][j][0] + temp[i][j + 1][0] + temp[i + 1][j + 1][0];
                let summ1_g = temp[i][j][1] + temp[i + 1][j][1] + temp[i][j + 1][1] + temp[i + 1][j + 1][1];
                let summ1_b = temp[i][j][2] + temp[i + 1][j][2] + temp[i][j + 1][2] + temp[i + 1][j + 1][2];

                let mu_r = 1 / 4 * summ1_r;
                let mu_g = 1 / 4 * summ1_g;
                let mu_b = 1 / 4 * summ1_b;

                let summ2_r = Math.pow((temp[i][j][0] - mu_r), 2) + Math.pow((temp[i + 1][j][0] - mu_r), 2) + Math.pow((temp[i][j + 1][0] - mu_r), 2) + Math.pow((temp[i + 1][j + 1][0] - mu_r), 2);
                let summ2_g = Math.pow((temp[i][j][1] - mu_g), 2) + Math.pow((temp[i + 1][j][1] - mu_g), 2) + Math.pow((temp[i][j + 1][1] - mu_g), 2) + Math.pow((temp[i + 1][j + 1][1] - mu_g), 2);
                let summ2_b = Math.pow((temp[i][j][2] - mu_b), 2) + Math.pow((temp[i + 1][j][2] - mu_b), 2) + Math.pow((temp[i][j + 1][2] - mu_b), 2) + Math.pow((temp[i + 1][j + 1][2] - mu_b), 2);

                let tau_r = Math.sqrt(1 / 4 * summ2_r);
                let tau_g = Math.sqrt(1 / 4 * summ2_g);
                let tau_b = Math.sqrt(1 / 4 * summ2_b);

                let val = -100;

                outputData[i][j][0] = (tau_r * temp[i][j][0] + val);
                outputData[i][j][1] = (tau_g * temp[i][j][1] + val);
                outputData[i][j][2] = (tau_b * temp[i][j][2] + val);
                outputData[i][j][3] = 255;
                outputData[i][j + 1][0] = (tau_r * temp[i][j + 1][0] + val);
                outputData[i][j + 1][1] = (tau_g * temp[i][j + 1][1] + val);
                outputData[i][j + 1][2] = (tau_b * temp[i][j + 1][2] + val);
                outputData[i][j + 1][3] = 255;

                outputData[i + 1][j][0] = (tau_r * temp[i + 1][j][0] + val);
                outputData[i + 1][j][1] = (tau_g * temp[i + 1][j][1] + val);
                outputData[i + 1][j][2] = (tau_b * temp[i + 1][j][2] + val);
                outputData[i + 1][j][3] = 255;
                outputData[i + 1][j + 1][0] = (tau_r * temp[i + 1][j + 1][0] + val);
                outputData[i + 1][j + 1][1] = (tau_g * temp[i + 1][j + 1][1] + val);
                outputData[i + 1][j + 1][2] = (tau_b * temp[i + 1][j + 1][2] + val);
                outputData[i + 1][j + 1][3] = 255;
            }
        }
    }

    outputData = new Uint8ClampedArray(outputData.toString().split(',').map(v => +v));
    imgData.data.set(outputData);

    ctx.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height);
}