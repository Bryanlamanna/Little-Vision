import { GoogleGenerativeAI } from "@google/generative-ai";
let API_KEY;
var genAI; 
const animarBtn = document.querySelector(".animarBtn");
const resultadoDiv = document.querySelector("#responseDiv");
const resultadoText = document.querySelector("#responseText");
const loadIcon = document.querySelector("#spinner");
loadConfig();

async function loadConfig() {
    const response = await fetch('/configAPI.json');
    const data = await response.json();
    API_KEY = data.api_key;
    genAI = new GoogleGenerativeAI(API_KEY);
    
}
  
animarBtn.addEventListener("click", async (e) => {
    resultadoText.innerHTML = "";
    resultadoDiv.style.display = "block";
    loadIcon.style.display = "block";
    e.preventDefault();
    animar();   
})

async function animar() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = montarPrompt();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);

    resultadoText.innerHTML = text;
    loadIcon.style.display = "none";
}

function montarPrompt() {
    const name = document.getElementById("name").value;
    const dicas = document.getElementById("dicas").value;
    const objetivo = document.getElementById("objetivo").value;
    const estadoEmocional = document.getElementById("estadoEmocional").value;
    const areaInteresse = document.getElementById("areaInteresse").value;

    const prompt = `Escreva uma frase motivacional sobre ${areaInteresse}, seja carinhoso e motivador, demonstre empatia. 
                    leve em consideração estas informações: 
                    Meu nome é ${name}.
                    Meu atual objetivo é ${objetivo} e hoje me sinto ${estadoEmocional}.
                    Me de ${dicas} dicas de como ${objetivo}`;
    return prompt;                
}
