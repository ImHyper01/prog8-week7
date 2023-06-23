const predictButton = document.getElementById('predictBtn').addEventListener("click", function() {makePrediction()});
const storageInput = document.getElementById('storage');
const resoloutionInput = document.getElementById('resoloution');
const weightInput = document.getElementById('weight');
const resultField =document.getElementById('result');

const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
nn.load('./model/model.json', modelLoaded)

function modelLoaded() {
    console.log("Model loaded!")
}

async function makePrediction() {
    const predictionValues = {
        storage: parseInt(storageInput.value, 10),
        resoloution: parseInt(resoloutionInput.value, 10),
        weight: parseInt(weightInput.value, 10)
    }

    const results = await nn.predict(predictionValues);
    console.log(`Verkoop Prijs is ${results[0].price}`)

    currencyTransformer(results[0].price);
}

function currencyTransformer(result) {
    const fmt = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
    resultField.innerHTML = "Verkoop Prijs is " + fmt.format(result);
}
