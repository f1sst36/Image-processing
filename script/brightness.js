let brightnessItem = document.getElementById('brightness');
brightnessItem.addEventListener('input', function(){
	brightness()
});

function brightness(){
	let value = 2.55 * (brightnessItem.value - 50) * 2;

	for(let i = 0; i < imgData.data.length; i += 4){
		imgData.data[i] = startImgData.data[i] + value;
		imgData.data[i + 1] = startImgData.data[i + 1] + value;
		imgData.data[i + 2] = startImgData.data[i + 2] + value;
	}
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = mainCanvasBGC;
	ctx.fillRect(0, 0, canv.width, canv.height);
	ctx.putImageData(imgData, 0, 0);

	boolChanges = true;
}
