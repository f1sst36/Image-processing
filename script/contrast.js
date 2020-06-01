let contrastItem = document.getElementById('contrast');
contrastItem.addEventListener('input', function(){
	contrast()
});

function contrast(){
	let contrastMul = ((contrastItem.value - 50) * 2) / 100 + 1;
	let intercept = 128 * (1 - contrastMul);

	for(let i = 0; i < imgData.data.length; i += 4){
		imgData.data[i] = startImgData.data[i] * contrastMul + intercept;
		imgData.data[i + 1] = startImgData.data[i + 1] * contrastMul + intercept;
		imgData.data[i + 2] = startImgData.data[i + 2] * contrastMul + intercept;
	}
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = mainCanvasBGC;
	ctx.fillRect(0, 0, canv.width, canv.height);
	ctx.putImageData(imgData, 0, 0);
	
	boolChanges = true;
}
