// --- CONFIG ---
const QUESTIONS = [
    {
        q: "Who gets angry the most?",
        options: ["Vikas", "Ammu"],
        correct: "Ammu",
        // User requested: "it should be you are my little angry bird"
        rightRoast: "Correct! You are my little angry bird 🐦💕",
        wrongRoast: "Incorrect! You are my little angry bird 🐦😤"
    },
    {
        q: "Who apologizes first?",
        options: ["Vikas", "Ammu"],
        correct: "Vikas",
        // User requested: "i am your sorry king"
        rightRoast: "Yes! I am your sorry king 👑",
        wrongRoast: "Wrong! I am your sorry king 👑"
    },
    {
        q: "Who is the better cook?",
        options: ["Vikas", "Ammu"],
        correct: "Vikas",
        // User requested: "after your pulav its obvious im the better cook"
        rightRoast: "Finally you admit it! After your pulav it's obvious I'm the better cook 👨‍🍳✨",
        wrongRoast: "Please! After your pulav it's obvious I'm the better cook 👨‍🍳✨"
    },
    {
        q: "Who spends more money?",
        options: ["Vikas", "Ammu"],
        correct: "Vikas",
        // User requested: "i spend more yeah but y care when i have the best investment ammuuuuu"
        rightRoast: "Correct! I spend more, but why care when I have the best investment Ammuuuuu 💰💕",
        wrongRoast: "It's me! I spend more, but why care when I have the best investment Ammuuuuu 💰💕"
    },
    {
        q: "Who is more dramatic?",
        options: ["Vikas", "Ammu"],
        correct: "Ammu",
        rightRoast: "Dramaqueen alert its youuu ammuuuuu 🎭💕",
        wrongRoast: "Dramaqueen alert its youuu ammuuuuu 🎭💕"
    },
    {
        q: "Who loves more?",
        options: ["Vikas", "Ammu"],
        correct: "Vikas",
        rightRoast: "You know I love u 1 ar ruba moreee 💖",
        wrongRoast: "No! You know I love u 1 ar ruba moreee 💖"
    },
    {
        q: "Who is the boss?",
        options: ["Vikas", "Ammu"],
        correct: "Vikas",
        // User: "yes i am the boss"
        rightRoast: "Yes! I am the boss 😎💪",
        wrongRoast: "Wrong! I am the boss 😎💪"
    },
    {
        q: "Who initiates the kiss?",
        options: ["Vikas", "Ammu"],
        correct: "Vikas",
        rightRoast: "It's me I can't resist kissing u 💋",
        wrongRoast: "You know it! It's me I can't resist kissing u 💋"
    },
    {
        q: "Who is the sleepy head?",
        options: ["Vikas", "Ammu"],
        correct: "Ammu",
        rightRoast: "Yes! you are my little Thungumoonji! 😴💕",
        wrongRoast: "Thungumoonji! 😴 It's definitely you!"
    },
    {
        q: "Who made the first move?",
        options: ["Vikas", "Ammu"],
        correct: "Ammu",
        rightRoast: "It was u remember Looking handsome kudos to photographer 😏💕",
        wrongRoast: "It was u remember Looking handsome kudos to photographer 😏💕"
    }
];

// --- STATE ---
let currentQuestionIndex = 0;
let noCount = 0;
let currentImageIndex = 0;
let zIndexCounter = 100;

// Physics State
const images = []; // Array to store image objects { element, x, y, vx, vy, width, height, isDragging }
const BOUNCE_FACTOR = 0.8;
const REPULSION_RADIUS = 200; // Increased radius for better separation
const MAX_SPEED = 1.5; // Slightly slower base speed
const EXCLUSION_ZONE_FORCE = 0.05;

// --- DOM ELEMENTS ---
// Layers
const layerPassword = document.getElementById('layer-password');
const layerProposal = document.getElementById('layer-proposal');
const layerContract = document.getElementById('layer-contract');
const layerQuiz = document.getElementById('layer-quiz');
const layerCountdown = document.getElementById('layer-countdown');
const layerSlideshow = document.getElementById('layer-slideshow');

// Audio
const audio1 = document.getElementById('audio1');
const audio2 = document.getElementById('audio2');

// Password Inputs
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');

// Proposal Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const noMsg = document.getElementById('noMsg');
const redFlash = document.getElementById('red-flash');
const scatterContainer = document.getElementById('scatter-container');

// Finale Elements
const layerFinale = document.getElementById('layer-finale');
const finalScore = document.getElementById('final-score'); // Ensure this ID exists in HTML or I will add it dynamically if needed. Wait, the previous HTML had p id="final-score".


// Contract Elements
const startQuizBtn = document.getElementById('startQuizBtn');

// Quiz Elements
const quizContainer = document.getElementById('quiz-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const quizProgress = document.getElementById('quiz-progress');
const roastMessage = document.getElementById('roast-message');

// Image lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');

// Slideshow
const finalSlideshowImg = document.getElementById('final-slideshow-img');
const countdownTimer = document.getElementById('countdown-timer');

// --- FUNCTIONS ---

function showLayer(layer) {
    document.querySelectorAll('.layer').forEach(l => l.classList.add('hidden'));
    layer.classList.remove('hidden');
}

// 1. PASSWORD LOGIC
unlockBtn.addEventListener('click', () => {
    const p1 = document.getElementById('pass1').value.trim().toLowerCase();
    const p2 = document.getElementById('pass2').value.trim().toLowerCase();
    const p3 = document.getElementById('pass3').value.trim().toLowerCase();

    if (p1 === 'handsome' && p2 === 'kudos' && p3 === 'photographer') {
        startProposal();
    } else {
        errorMsg.classList.remove('hidden');
        shake(unlockBtn);
    }
});

function shake(element) {
    element.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0)' }
    ], { duration: 300 });
}

function startProposal() {
    showLayer(layerProposal);
    // Play Audio 1
    audio1.volume = 0.5;
    audio1.play().catch(e => console.log("Auto-play blocked:", e));
    initPhysicsGallery();
}

// 2. PHYSICS GALLERY LOGIC & GAME LOOP
// 2. PHYSICS GALLERY LOGIC & GAME LOOP
function initPhysicsGallery() {
    scatterContainer.innerHTML = '';
    const totalImages = 25; // User Request: "no at start only 25"
    const containerW = window.innerWidth;
    const containerH = window.innerHeight;

    for (let i = 1; i <= totalImages; i++) {
        const div = document.createElement('div');
        div.className = 'scatter-img';

        // Start from boundary edges
        const side = Math.floor(Math.random() * 4);
        let x, y;
        const imgW = 120;
        const imgH = 140;

        switch (side) {
            case 0: // Top
                x = Math.random() * (containerW - imgW);
                y = -imgH - 20;
                break;
            case 1: // Right
                x = containerW + 20;
                y = Math.random() * (containerH - imgH);
                break;
            case 2: // Bottom
                x = Math.random() * (containerW - imgW);
                y = containerH + 20;
                break;
            case 3: // Left
                x = -imgW - 20;
                y = Math.random() * (containerH - imgH);
                break;
        }

        div.style.left = `${x}px`;
        div.style.top = `${y}px`;

        const img = document.createElement('img');
        img.src = `photo${i}.jpg`;
        img.draggable = false;
        div.appendChild(img);
        scatterContainer.appendChild(div);

        // Physics Object
        const obj = {
            element: div,
            x: x,
            y: y,
            // Random direction, spread out (User Request: "start spread and not all in same direction")
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            width: 120,
            height: 140,
            isDragging: false,
            id: i
        };

        // Push slightly towards screen if it's currently flying away
        if (side === 0 && obj.vy < 0) obj.vy *= -1;
        if (side === 1 && obj.vx > 0) obj.vx *= -1;
        if (side === 2 && obj.vy > 0) obj.vy *= -1;
        if (side === 3 && obj.vx < 0) obj.vx *= -1;

        images.push(obj);

        attachInteraction(div, obj, () => openLightbox(i - 1));
    }

    requestAnimationFrame(animateImages);
}

function animateImages() {
    if (layerProposal.classList.contains('hidden')) return;

    updatePhysics();
    requestAnimationFrame(animateImages);
}

function updatePhysics() {
    const containerW = window.innerWidth;
    const containerH = window.innerHeight;

    for (let i = 0; i < images.length; i++) {
        const obj = images[i];
        if (obj.isDragging) continue;

        // Apply Velocity
        obj.x += obj.vx;
        obj.y += obj.vy;

        // Wall Bounce (Keep them on screen)
        if (obj.x <= -50) { obj.x = -50; obj.vx *= -1; }
        if (obj.x + obj.width >= containerW + 50) { obj.x = containerW + 50 - obj.width; obj.vx *= -1; }

        if (obj.y <= -50) { obj.y = -50; obj.vy *= -1; }
        if (obj.y + obj.height >= containerH + 50) { obj.y = containerH + 50 - obj.height; obj.vy *= -1; }

        // Speed Cap & Min Speed Maintenance
        // Keep them moving GENTLY (User Request: "decrease the photo speed")
        const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);

        // If too fast, slow down (Limit to ~1.0)
        if (speed > 1.0) {
            obj.vx *= 0.95;
            obj.vy *= 0.95;
        }

        // If too slow, speed up slightly but keep it random
        if (speed < 0.2) {
            obj.vx += (Math.random() - 0.5) * 0.1;
            obj.vy += (Math.random() - 0.5) * 0.1;
        }

        // Update DOM
        obj.element.style.left = `${obj.x}px`;
        obj.element.style.top = `${obj.y}px`;
    }
}

// 2.5 INTERACTION HELPERS


function attachInteraction(element, obj, onClick) {
    let startX = 0, startY = 0;

    // Mouse
    element.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));

    // Touch
    element.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
    }, { passive: false });

    function startDrag(x, y) {
        obj.isDragging = true;
        startX = x;
        startY = y;

        zIndexCounter++;
        element.style.zIndex = zIndexCounter;

        // Add move/up listeners
        if (typeof window.ontouchstart !== 'undefined') {
            window.addEventListener('touchmove', onMove, { passive: false });
            window.addEventListener('touchend', endDrag);
        } else {
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', endDrag);
        }
    }

    function onMove(e) {
        e.preventDefault(); // Stop scroll
        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

        // Calculate delta for tossing effect
        const dx = clientX - startX;
        const dy = clientY - startY;

        // Update velocity based on drag speed
        obj.vx = dx * 0.2; // Damping factor for toss
        obj.vy = dy * 0.2;

        obj.x = clientX - obj.width / 2;
        obj.y = clientY - obj.height / 2;

        // Update DOM immediately for responsiveness
        element.style.left = `${obj.x}px`;
        element.style.top = `${obj.y}px`;

        startX = clientX;
        startY = clientY;
    }

    function endDrag() {
        obj.isDragging = false;

        // Check if it was a click (very low velocity on release)
        const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
        if (speed < 1) { // Threshold for click
            onClick();
        }

        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', endDrag);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', endDrag);
    }
}


// 3. PROPOSAL LOGIC
yesBtn.addEventListener('click', () => {
    showLayer(layerContract);
});

// Remove static mouseover. We will handle it dynamically.
// noBtn.addEventListener('mouseover', moveNoButton); 

noBtn.addEventListener('click', (e) => {
    // Logic: First 5 clicks show messages.
    // User Update: Do NOT move/disappear for first 5 clicks. Just show message.
    if (noCount < 5) {
        const msgs = [
            "Penalty: 5 kisses 💋",
            "Buttons are slippery! 😈",
            "Wrong choice babe 😝",
            "Try the other one! 🥺",
            "Okay this is funny now 😌"
        ];
        const currentMsg = msgs[noCount];
        noMsg.innerText = currentMsg;

        // Grow Yes button
        const currentScale = 1 + ((noCount + 1) * 0.2);
        yesBtn.style.transform = `scale(${currentScale})`;

        // do NOT move the button. Keep it there so they can click it 5 times easily.
        // moveNoButton(); 

    } else {
        // After 5 times, it gets impossible
        noMsg.innerText = "Okay, you have no choice now! ❤️";
        noBtn.style.display = "none"; // Hide after 5 clicks
        yesBtn.style.transform = `scale(2.5)`;
    }

    noCount++;
    flashRed();

    // We removed the mouseover listener logic, so it won't run away.
});

function moveNoButton() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;

    // Ensure it doesn't go off screen
    const maxLeft = w - btnW - 50;
    const maxTop = h - btnH - 50;

    const newLeft = Math.max(20, Math.random() * maxLeft);
    const newTop = Math.max(20, Math.random() * maxTop);

    noBtn.style.position = 'fixed';
    noBtn.style.left = newLeft + 'px';
    noBtn.style.top = newTop + 'px';
}

function flashRed() {
    redFlash.classList.remove('hidden');
    setTimeout(() => {
        redFlash.classList.add('hidden');
    }, 200);
}

// 4. IMAGE LIGHTBOX
function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = `photo${index + 1}.jpg`;
    lightbox.classList.remove('hidden');
}

closeLightbox.addEventListener('click', () => {
    lightbox.classList.add('hidden');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.add('hidden');
    }
});

// 5. CONTRACT & QUIZ LOGIC
startQuizBtn.addEventListener('click', () => {
    showLayer(layerQuiz);
    loadQuestion(0);
});

function loadQuestion(index) {
    if (index >= QUESTIONS.length) {
        finishQuiz();
        return;
    }

    const q = QUESTIONS[index];
    questionText.innerText = `${index + 1}. ${q.q}`;
    quizProgress.innerText = `${index + 1} / ${QUESTIONS.length}`;
    roastMessage.innerText = '';
    roastMessage.className = 'roast-message';

    optionsContainer.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, opt);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(index, selectedAnswer) {
    const q = QUESTIONS[index];
    const isCorrect = selectedAnswer === q.correct;

    // Show roast message
    roastMessage.innerText = isCorrect ? q.rightRoast : q.wrongRoast;
    roastMessage.className = isCorrect ? 'roast-message correct' : 'roast-message wrong';

    // Wait 2 seconds before next question
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }, 2500);
}

// 6. FINALE, COUNTDOWN & SLIDESHOW
function finishQuiz() {
    // Show Beating Heart Finale WITH Score AND Countdown together
    if (layerFinale) {
        showLayer(layerFinale);
        startCountdownInFinale(); // Start countdown right away
    } else {
        startFinalSlideshow(); // Fail-safe
    }
}

function startCountdownInFinale() {
    const finalTimer = document.getElementById('final-timer');
    const heart = document.querySelector('.heart-beat');
    if (!finalTimer) return;

    let seconds = 10;
    finalTimer.innerText = seconds;

    const interval = setInterval(() => {
        seconds--;
        finalTimer.innerText = seconds;

        // Pulse timer and heart in sync
        finalTimer.style.transition = "transform 0.1s ease-out";
        finalTimer.style.transform = "scale(1.3)";
        if (heart) {
            heart.style.transition = "transform 0.1s ease-out";
            heart.style.transform = "scale(1.5)";
            heart.style.animationDuration = (0.4 + (seconds / 15)) + "s";
        }

        // Play synthesized heartbeat
        playHeartbeat();

        setTimeout(() => {
            finalTimer.style.transform = "scale(1)";
            if (heart) heart.style.transform = "scale(1)";
        }, 150);

        if (seconds <= 0) {
            clearInterval(interval);
            startFinalSlideshow();
        }
    }, 1000);
}

// Synthesized Heartbeat Sound
function playHeartbeat() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    function beat(time, freq) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.5, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.3);
    }

    const now = ctx.currentTime;
    beat(now, 60);       // First thump
    beat(now + 0.2, 50); // Second thump
}

function startFinalSlideshow() {
    showLayer(layerSlideshow);

    // Stop Audio 1
    audio1.pause();

    // Play Audio 2
    audio2.volume = 0.5;
    audio2.play().catch(e => {
        console.log("Audio 2 play error:", e);
    });

    let slideIndex = 1;
    const totalSlides = 40; // Updated to 40

    startEmojiRain();

    setInterval(() => {
        slideIndex++;
        if (slideIndex > totalSlides) slideIndex = 1;
        finalSlideshowImg.src = `photo${slideIndex}.jpg`;
    }, 1500); // 1.5 seconds per slide (User Request: "each pic for 1.5 s")

    // Initial load
    finalSlideshowImg.src = `photo1.jpg`;
}

function startEmojiRain() {
    setInterval(() => {
        const e = document.createElement("div");
        e.className = "rain";
        e.innerHTML = ["💖", "🌹", "💋", "❤️", "😍", "💕", "✨", "🎀"][Math.floor(Math.random() * 8)];
        e.style.left = Math.random() * 100 + "vw";
        e.style.animationDuration = (3 + Math.random() * 3) + "s"; // 3-6 seconds
        document.body.appendChild(e);
        setTimeout(() => e.remove(), 6000);
    }, 300);
}
