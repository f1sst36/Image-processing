var profileOn = false;
let TurnOnProfile = () => {
	profileOn = true;
}

canvParent.addEventListener('click', (e) => {
	if(!profileOn) return;

	let x = e.offsetX;
	let y = e.offsetY;
	let h = width * (y - ((canv.height - height) / 2)) * 4;
	
	let arrayPixels = {
		r: [],
		g: [],
		b: [],
	}

	for(let i = h + 1; i < (h + width * 4); i += 4){
		arrayPixels.r.push(imgData.data[i]);
		arrayPixels.g.push(imgData.data[i + 1]);
		arrayPixels.b.push(imgData.data[i + 2]);

		imgData.data[i] = 0;
		imgData.data[i + 1] = 0;
		imgData.data[i + 2] = 0;
		imgData.data[i + 3] = 0;
	}

	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = mainCanvasBGC;
	ctx.fillRect(0, 0, canv.width, canv.height);
	ctx.putImageData(imgData, 0, 0);

    chart.updateSeries([{
		data: []
    }])
    chartR.updateSeries([{
    	name: 'Значение',
    	data: arrayPixels.r
    }])
    chartG.updateSeries([{
    	name: 'Значение',
    	data: arrayPixels.g
    }])
    chartB.updateSeries([{
    	name: 'Значение',
    	data: arrayPixels.b
    }])

    arrayPixels.r = []
    arrayPixels.g = []
    arrayPixels.b = []

    boolChanges = false;
	profileOn = false;
})