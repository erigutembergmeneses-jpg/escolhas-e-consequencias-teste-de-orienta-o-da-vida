// Questões do LOT-R/TOV-R
const questions = [
    { id: 1, text: "Em tempos incertos, geralmente espero o melhor.", type: "positive", scored: true },
    { id: 2, text: "É fácil para mim relaxar.", type: "filler", scored: false },
    { id: 3, text: "Se algo pode dar errado para mim, dará.", type: "negative", scored: true },
    { id: 4, text: "Sou sempre otimista quanto ao meu futuro.", type: "positive", scored: true },
    { id: 5, text: "Aproveito muito meus amigos.", type: "filler", scored: false },
    { id: 6, text: "É importante para mim manter-me ocupado.", type: "filler", scored: false },
    { id: 7, text: "Quase nunca espero que as coisas saiam do meu jeito.", type: "negative", scored: true },
    { id: 8, text: "Não me aborreço muito facilmente.", type: "filler", scored: false },
    { id: 9, text: "Raramente conto que coisas boas aconteçam para mim.", type: "negative", scored: true },
    { id: 10, text: "No geral, espero que mais coisas boas me aconteçam do que ruins.", type: "positive", scored: true }
];

const options = [
    { value: 0, label: "Discordo totalmente" },
    { value: 1, label: "Discordo" },
    { value: 2, label: "Neutro" },
    { value: 3, label: "Concordo" },
    { value: 4, label: "Concordo totalmente" }
];

let currentQuestion = 0;
let answers = new Array(questions.length).fill(null);

// Elementos do DOM
const introScreen = document.getElementById('intro-screen');
const questionnaireScreen = document.getElementById('questionnaire-screen');
const resultsScreen = document.getElementById('results-screen');
const questionContainer = document.getElementById('question-container');
const currentQSpan = document.getElementById('current-q');
const progressBar = document.getElementById('progress');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const startBtn = document.getElementById('start-btn');
const retakeBtn = document.getElementById('retake-btn');
const shareBtn = document.getElementById('share-btn');

// Event Listeners
startBtn.addEventListener('click', startTest);
prevBtn.addEventListener('click', prevQuestion);
nextBtn.addEventListener('click', nextQuestion);
retakeBtn.addEventListener('click', retakeTest);
shareBtn.addEventListener('click', shareResult);

function startTest() {
    introScreen.classList.remove('active');
    questionnaireScreen.classList.add('active');
    showQuestion();
}

function showQuestion() {
    const question = questions[currentQuestion];
    currentQSpan.textContent = currentQuestion + 1;
    
    // Atualizar barra de progresso
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Criar HTML da questão
    let html = `
        <div class="question-text">${question.id}. ${question.text}</div>
        <div class="options">
    `;
    
    options.forEach(option => {
        const isChecked = answers[currentQuestion] === option.value ? 'checked' : '';
        html += `
            <label class="option ${isChecked ? 'selected' : ''}">
                <input type="radio" 
                       name="question${currentQuestion}" 
                       value="${option.value}" 
                       ${isChecked}
                       onchange="selectOption(${option.value})">
                <span>${option.label}</span>
            </label>
        `;
    });
    
    html += '</div>';
    questionContainer.innerHTML = html;
    
    // Atualizar botões de navegação
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.textContent = currentQuestion === questions.length - 1 ? 'Ver Resultado' : 'Próxima';
}

function selectOption(value) {
    answers[currentQuestion] = value;
    
    // Atualizar visualmente
    document.querySelectorAll('.option').forEach((opt, index) => {
        if (index === value) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
}

function nextQuestion() {
    if (answers[currentQuestion] === null) {
        alert('Por favor, selecione uma opção antes de continuar.');
        return;
    }
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function calculateScore() {
    let totalScore = 0;
    let positiveScore = 0;
    let negativeScore = 0;
    
    // Itens positivos: 1, 4, 10
    positiveScore += answers[0]; // Questão 1
    positiveScore += answers[3]; // Questão 4
    positiveScore += answers[9]; // Questão 10
    
    // Itens negativos invertidos: 3, 7, 9
    // Inverter: 0→4, 1→3, 2→2, 3→1, 4→0
    negativeScore += (4 - answers[2]); // Questão 3
    negativeScore += (4 - answers[6]); // Questão 7
    negativeScore += (4 - answers[8]); // Questão 9
    
    totalScore = positiveScore + negativeScore;
    
    return { total: totalScore, positive: positiveScore, negative: negativeScore };
}

function showResults() {
    questionnaireScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    
    const scores = calculateScore();
    const { total, positive, negative } = scores;
    
    // Animar pontuação
    animateScore(total);
    
    // Determinar categoria
    let category, categoryClass, interpretation;
    
    if (total <= 8) {
        category = "Tendência ao Pessimismo";
        categoryClass = "low";
        interpretation = `
            <h4>Interpretação:</h4>
            <p>Sua pontuação sugere uma tendência ao pessimismo. Você tende a esperar resultados menos favoráveis e pode focar mais nos aspectos negativos das situações.</p>
            <p><strong>Recomendações:</strong> Considere trabalhar técnicas de reestruturação cognitiva, praticar gratidão diária e buscar apoio psicológico se sentir que isso está afetando sua qualidade de vida.</p>
        `;
    } else if (total <= 16) {
        category = "Otimismo Moderado";
        categoryClass = "medium";
        interpretation = `
            <h4>Interpretação:</h4>
            <p>Você apresenta um nível moderado de otimismo. Consegue equilibrar expectativas positivas com realismo, o que é saudável para a tomada de decisões.</p>
            <p><strong>Recomendações:</strong> Continue desenvolvendo seu otimismo realista. Pratique identificar pensamentos automáticos negativos e desafie-os com evidências concretas.</p>
        `;
    } else {
        category = "Alto Otimismo";
        categoryClass = "high";
        interpretation = `
            <h4>Interpretação:</h4>
            <p>Você demonstra alto otimismo disposicional. Tende a esperar resultados positivos e a ver oportunidades mesmo em situações desafiadoras.</p>
            <p><strong>Recomendações:</strong> Seu otimismo é um recurso valioso. Mantenha-o equilibrado com planejamento realista para evitar frustrações por expectativas excessivamente altas.</p>
        `;
    }
    
    document.getElementById('final-score').textContent = total;
    document.getElementById('score-category').textContent = category;
    document.getElementById('score-category').className = `category ${categoryClass}`;
    document.getElementById('interpretation').innerHTML = interpretation;
    document.getElementById('positive-score').textContent = `${positive}/12`;
    document.getElementById('negative-score').textContent = `${negative}/12`;
}

function animateScore(finalScore) {
    let current = 0;
    const element = document.getElementById('final-score');
    const interval = setInterval(() => {
        if (current >= finalScore) {
            clearInterval(interval);
        } else {
            current++;
            element.textContent = current;
        }
    }, 50);
}

function retakeTest() {
    currentQuestion = 0;
    answers = new Array(questions.length).fill(null);
    resultsScreen.classList.remove('active');
    introScreen.classList.add('active');
}

function shareResult() {
    const score = document.getElementById('final-score').textContent;
    const category = document.getElementById('score-category').textContent;
    const text = `Fiz o Teste de Orientação da Vida (LOT-R) e obtive: ${score}/24 - ${category}. #Otimismo #Autoconhecimento`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Meu Resultado - Teste de Orientação da Vida',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
        // Fallback: copiar para área de transferência
        navigator.clipboard.writeText(text).then(() => {
            alert('Resultado copiado para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
        });
    }
}

// Prevenir fechamento acidental durante o teste
window.addEventListener('beforeunload', (e) => {
    if (questionnaireScreen.classList.contains('active') && answers.some(a => a !== null)) {
        e.preventDefault();
        e.returnValue = '';
    }
});
