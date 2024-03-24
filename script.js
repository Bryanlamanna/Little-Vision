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
    if (!checarCampos()) {
        alert("Por favor, preencha todos os campos");
    } else {
        resultadoText.innerHTML = "";
        resultadoDiv.style.display = "block";
        loadIcon.style.display = "block";
        e.preventDefault();
        animar();
    }
   
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
    scrollToBottom();
}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' // Para uma rolagem suave
    });
}

function montarPrompt() {
    const name = document.getElementById("name").value;
    const dicas = document.getElementById("dicas").value;
    const objetivo = document.getElementById("objetivo").value;
    const estadoEmocional = document.getElementById("estadoEmocional").value;
    const areaInteresse = document.getElementById("areaInteresse").value;

    const prompt = `Escreva uma frase motivacional sobre ${areaInteresse}, fale como se voce fosse o homem aranha. 
                    leve em consideração estas informações: 
                    Meu nome é ${name}.
                    Meu atual objetivo é ${objetivo} e hoje me sinto ${estadoEmocional}.
                    Me de ${dicas} dicas de como ${objetivo}`;
    return prompt;                
}

function checarCampos() {
    const name = document.getElementById("name").value;
    const dicas = document.getElementById("dicas").value;
    const objetivo = document.getElementById("objetivo").value;
    const estadoEmocional = document.getElementById("estadoEmocional").value;
    const areaInteresse = document.getElementById("areaInteresse").value;

    if (name === "" || dicas === "" || objetivo === "" || estadoEmocional === "" || areaInteresse === "") {
        return false;
    } else {
        return true;
    }
}