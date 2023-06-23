import { createChart, updateChart } from "./scatterplot.js"

let saveButton = document.getElementById('saveButton').addEventListener("click", function() {saveModel(nn)});

function loadData(){
    Papa.parse("./data/mobilephones.csv", {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => checkData(results.data)
    })
}

function checkData(data) {
    data.sort(() => (Math.random() - 0.5))
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    const chartdata = trainData.map(mobile => ({
        x: mobile.storage,
        y: mobile.price,
    }))

    console.log(chartdata)

    createChart(chartdata, "storage", "price")
    neuralNetwork(trainData, testData);
}

function neuralNetwork(trainData, testData) {

    const nn = ml5.neuralNetwork({ task: 'regression', debug: true })

    for (let mobile of trainData) {
        nn.addData({storage: mobile.storage, resoloution: mobile.resoloution, battery: mobile.battery}, {price: mobile.price})
    }

    nn.normalizeData()
    nn.train({ epochs: 10 }, () => finishedTraining(nn, testData))
}

async function finishedTraining(nn, testData){
    console.log("Finished training!")

    makePrediction(nn, testData);
}

async function makePrediction(nn, testData) {
    const mobileTest = {storage: testData[0].storage, resoloution: testData[0].resoloution, battery: testData[0].battery }
    const results = await nn.predict(mobileTest);
    console.log(`De prijs is: ${results[0].price}`)

    let predictions = []
    for (let i = 0; i < testData.length; i += 1) {
        const prediction = await nn.predict({storage: testData[i].storage, resoloution: testData[i].resoloution, battery: testData[i].battery})
        prediction.push({x: testData[i].storage, y: prediction[0].price})
    }

    updateChart("Predictions", predictions)
}
function saveModel(nn) {
    nn.save()
}

// load data
loadData();