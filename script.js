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
const emocoes = document.querySelectorAll(".emocao");
const perconas = document.querySelectorAll(".persona");
const interesseDiv = document.querySelector(".interessesDiv");
const emocoesDiv = document.querySelector(".emocoesDiv");
const personasDiv = document.querySelector(".personasDiv");
const chevron = document.querySelectorAll("li i");
var name = localStorage.getItem('name');
var dropDown = [false, false, false];
loadConfig();
getNameOnCache();




interesses.forEach((interesse) => {
    interesse.addEventListener("click", (e) => {
        document.querySelector(".selectedInteresseText").innerHTML = interesse.innerHTML;
    })
})

emocoes.forEach((emocao) => {
    emocao.addEventListener("click", (e) => {
        document.querySelector(".selectedEmotionText").innerHTML = emocao.innerHTML;
    })
})

perconas.forEach((persona) => {
    persona.addEventListener("click", (e) => {
        document.querySelector(".selectedPersonaText").innerHTML = persona.innerHTML;
    })
})


persona.addEventListener("click", (e) => {

    if (dropDown[2]=== false) {
        personasDiv.style.height = 'fit-content';
        interesseDiv.style.height = '0%';
        emocoesDiv.style.height = '0%';
        chevron[2].style.transform = 'rotate(180deg)';
        chevron[1].style.transform = 'rotate(0deg)';
        chevron[0].style.transform = 'rotate(0deg)';
        dropDown[1] = false;
        dropDown[0] = false;
        dropDown[2] = true;
    } else {
        chevron[2].style.transform = 'rotate(0deg)';
        personasDiv.style.height = '0%';
        dropDown[2] = false;    
    }

})

estadoEmocional.addEventListener("click", (e) => {
    
    if (dropDown[1]=== false) {
        emocoesDiv.style.height = 'fit-content';
        interesseDiv.style.height = '0%';
        personasDiv.style.height = '0%';
        chevron[1].style.transform = 'rotate(180deg)';
        chevron[0].style.transform = 'rotate(0deg)';
        chevron[2].style.transform = 'rotate(0deg)';
        dropDown[0] = false;
        dropDown[2] = false;
        dropDown[1] = true;
    } else {
        chevron[1].style.transform = 'rotate(0deg)';
        emocoesDiv.style.height = '0%';
        dropDown[1] = false;
    }
})

areaInteresse.addEventListener("click", (e) => {
    
    if (dropDown[0]=== false) {
        interesseDiv.style.height = 'fit-content';
        personasDiv.style.height = '0%';
        emocoesDiv.style.height = '0%';
        chevron[0].style.transform = 'rotate(180deg)';
        chevron[1].style.transform = 'rotate(0deg)';
        chevron[2].style.transform = 'rotate(0deg)';
        dropDown[1] = false;
        dropDown[2] = false;
        dropDown[0] = true;
    } else {
        chevron[0].style.transform = 'rotate(0deg)';
        interesseDiv.style.height = '0%';
        dropDown[0] = false;
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
        prompt = `Meu nome é ${name}.
                Escreva uma frase motivacional sobre ${document.querySelector(".selectedInteresseText").innerHTML}, fale como se voce fosse o ${document.querySelector(".selectedPersonaText").innerHTML}. 
                leve em consideração estas informações: 
                
                Meu atual objetivo é ${objetivo.value} e hoje me sinto ${document.querySelector(".selectedEmotionText").innerHTML}.`;
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

