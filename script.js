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
const persona = document.getElementById("personaSelect");
const objetivo = document.getElementById("objetivo");
const estadoEmocional = document.getElementById("estadoEmocional");
const areaInteresse = document.getElementById("areaInteresse");
const copySpan = document.querySelector("#copySpan");
const interesses = document.querySelectorAll(".interesse");
var name = localStorage.getItem('name');
var dropDown = [false, false, false];
loadConfig();
getNameOnCache();

console.log(interesses);

areaInteresse.addEventListener("click", (e) => {
    
    if (dropDown[0]) {
        interesses.forEach((interesse) => {
            interesse.style.opacity = 0;
            interesse.style.pointerEvents = 'none';
            interesse.style.display = 'none';
        })
        dropDown[0] = false;
    } else {
        interesses.forEach((interesse) => {
            interesse.style.display = 'block';
            interesse.style.opacity = 1;
            interesse.style.pointerEvents = 'auto';
        })
        dropDown[0] = true;
        }
})

function getNameOnCache() {
    if (name === '' || name === null || name === undefined) {
        name = prompt('Qual o seu nome?');    
        localStorage.setItem('name', name);
    } else {
        return;
    }
}

shareBtn.addEventListener("click", (e) => {
    if (navigator.share) {
        navigator.share({
            title: 'Little Vision',
            text: `Mensagem que recebi do ${persona.value} via LittleVision: \n ${resultadoText.innerHTML}`,
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
    copySpan.style.visibility = "visible";
    copySpan.style.opacity = "1";
    setTimeout(() => {
        copySpan.style.visibility = "hidden";
        copySpan.style.opacity = "0";
    }, 3000)
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
        document.querySelector(".container").style.height = 'auto';
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

    if (persona.value === "Groot") {
        prompt = 'o que o Groot diria?';
    } else {
        prompt = `Escreva uma frase motivacional sobre ${areaInteresse.value}, fale como se voce fosse o ${persona.value}. 
                    leve em consideração estas informações: 
                    Meu nome é ${name}.
                    Meu atual objetivo é ${objetivo.value} e hoje me sinto ${estadoEmocional.value}.`;
    }
        console.log(prompt);
     return prompt;         
}

function checarCampos() {
    const objetivo = document.getElementById("objetivo").value;
    const estadoEmocional = document.getElementById("estadoEmocional").value;
    const areaInteresse = document.getElementById("areaInteresse").value;

    if (objetivo === "" || estadoEmocional === "" || areaInteresse === "") {
        return false;
    } else {
        return true;
    }
}

