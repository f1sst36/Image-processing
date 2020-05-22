var chart, chartR, chartG, chartB, node;

function makeGraph(){
    let arrayBrightness = [];
    for(let i = 0; i < 255; i++){
      arrayBrightness[i] = 0;
    }

    var options = {
      series: [{
        name: 'Кол-во пикселей',
        data: arrayBrightness
      }],
        chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {//////////
        enabled: false,
        formatter: function (val) {
          return val + "";
        },
        offsetY: -10,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      fill: {
        colors: ['#fff']
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "";
          }
        }
      
      },
      /*title: {
        text: 'Гистограмма по яркости',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#fff'
        }
      }*/
      };

      node = document.querySelector("#chart");
      nodeR = document.querySelector("#chartR");
      nodeG = document.querySelector("#chartG");
      nodeB = document.querySelector("#chartB");
      //node.innerHTML = '';
      chart = new ApexCharts(node, options);
      chartR = new ApexCharts(nodeR, options);
      chartG = new ApexCharts(nodeG, options);
      chartB = new ApexCharts(nodeB, options);

      chart.render();
      chartR.render();
      chartR.updateOptions({
        fill: {
          colors: ['#f13630']
        }
      })
      chartG.render();
      chartG.updateOptions({
        fill: {
          colors: ['#22a221']
        }
      })
      chartB.render();
      chartB.updateOptions({
        fill: {
          colors: ['#2e95f1']
        }
      })
}


function updateGraph(){
  if(boolChanges){
    let brightnessPixel;
    let arrayBrightness = [], arrayRed = [], arrayGreen = [], arrayBlue = [];
    for(let i = 0; i < 255; i++){
      arrayBrightness[i] = 0;
      arrayRed[i] = 0;
      arrayGreen[i] = 0;
      arrayBlue[i] = 0;
    }
    
    if(imgData != null){
      imgData = ctx.getImageData((canv.width - width) / 2, (canv.height - height) / 2, width, height);
      for(let i = 0; i < imgData.data.length; i += 4){
        brightnessPixel = imgData.data[i] * 0.3 + imgData.data[i + 1] * 0.59 + imgData.data[i + 2] * 0.11;
        arrayBrightness[brightnessPixel]++;

        arrayRed[imgData.data[i]]++;
        arrayGreen[imgData.data[i + 1]]++;
        arrayBlue[imgData.data[i + 2]]++;
      }
    }
    
    chart.updateSeries([{
      name: 'Кол-во пикселей',
      data: arrayBrightness
    }])
    chartR.updateSeries([{
      name: 'Кол-во пикселей',
      data: arrayRed
    }])
    chartG.updateSeries([{
      name: 'Кол-во пикселей',
      data: arrayGreen
    }])
    chartB.updateSeries([{
      name: 'Кол-во пикселей',
      data: arrayBlue
    }])

    boolChanges = false;
  }
}