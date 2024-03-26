import { GoogleGenerativeAI } from "@google/generative-ai";
let API_KEY;
var genAI; 
const animarBtn = document.querySelector(".animarBtn");
const resultadoDiv = document.querySelector("#responseDiv");
const resultadoText = document.querySelector("#responseText");
const loadIcon = document.querySelector("#spinner");
const copyIcon = document.querySelector(".copyBtn");
const shareBtn = document.querySelector(".shareBtn");
const botoesResponse = document.querySelector(".responseBtn");
const name = document.getElementById("name").value;
const persona = document.getElementById("persona").value;
const objetivo = document.getElementById("objetivo").value;
const estadoEmocional = document.getElementById("estadoEmocional").value;
const areaInteresse = document.getElementById("areaInteresse").value;
loadConfig();

shareBtn.addEventListener("click", (e) => {
    if (navigator.share) {
        navigator.share({
            title: 'Little Vision - Pega a visão!',
            text: `Mensagem que recebi do ${persona} via LittleVision: \n "${resultadoText.innerHTML}"`,
            url: 'https://littlevision.netlify.app'
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch((error) => {
            console.error('Error sharing:', error);
        })
    } else {
        console.log('Sharing not supported');
    }
})


copyIcon.addEventListener("click", (e) => {
    navigator.clipboard.writeText(resultadoText.innerHTML);
})

async function loadConfig() {
    const response = await fetch('https://api-keys-fb69e-default-rtdb.firebaseio.com/config.json');
    const data = await response.json();
    API_KEY = data.api_key;
    genAI = new GoogleGenerativeAI(API_KEY);
}
  
animarBtn.addEventListener("click", async (e) => {
    if (!checarCampos()) {
        alert("Por favor, preencha todos os campos");
    } else {
        botoesResponse.style.display = "none";
        resultadoText.innerHTML = "";
        resultadoDiv.style.display = "block";
        loadIcon.style.display = "block";
        e.preventDefault();
        animar();
    }
   
})

async function animar() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const prompt = montarPrompt();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        resultadoText.innerHTML = text;
        loadIcon.style.display = "none";
        botoesResponse.style.display = "flex";
        scrollToBottom();
    } catch (error) {
        console.log(error);
        resultadoText.innerHTML = "Algo deu errado. Tente outro objetivo!";
        loadIcon.style.display = "none";
    }
}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' // Para uma rolagem suave
    });
}

function montarPrompt() {
    
    let prompt

    if (persona === "Groot") {
        prompt = 'o que o Groot diria?';
    } else {
        prompt = `Escreva uma frase motivacional sobre ${areaInteresse}, fale como se voce fosse o ${persona}. 
                    leve em consideração estas informações: 
                    Meu nome é ${name}.
                    Meu atual objetivo é ${objetivo} e hoje me sinto ${estadoEmocional}.`;
    
    }

     return prompt;         
}

function checarCampos() {
    const name = document.getElementById("name").value;
    const objetivo = document.getElementById("objetivo").value;
    const estadoEmocional = document.getElementById("estadoEmocional").value;
    const areaInteresse = document.getElementById("areaInteresse").value;

    if (name === "" || objetivo === "" || estadoEmocional === "" || areaInteresse === "") {
        return false;
    } else {
        return true;
    }
}

