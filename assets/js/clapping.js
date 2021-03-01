// Credit: https://medium.com/hackernoon/how-i-implemented-the-medium-clap-from-scratch-4a16ac90ad3b
(function () {
    let timer;
    let countFromAPI = 0;
    let accCounter = 0;
    let totalCount = 0;
    const hitCounterURL = 'https://hitcounter.pythonanywhere.com/';
    const minDeg = 1;
    const maxDeg = 72;
    const animationDuration = 700;
    const particlesClasses = [
        { class: "pop-top" },
        { class: "pop-top-left" },
        { class: "pop-top-right" },
        { class: "pop-bottom-right" },
        { class: "pop-bottom-left" },
    ];

    document.getElementById('totalCounter').classList.add('d-none');
    document.getElementById('clap').onmouseover = onClapMouseover;
    document.getElementById('clap').onclick = onClapClick;

    setTimeout(() => getClapCount('/nocount').then((count) => init(count)), 0);

    function init(count) {
        totalCount = parseInt(count);
        countFromAPI = parseInt(count);
        document.getElementById('totalCounter').innerText = count;
        console.log('Initial count is ' + count);
    }

    function onClapClick() {
        const clap = document.getElementById('clap');
        const particles = document.getElementById('particles');
        const particles2 = document.getElementById('particles-2');
        const particles3 = document.getElementById('particles-3');
        clap.classList.add('clicked');
        upClickCounter();
        runAnimationCycle(clap, 'scale');
        if (!particles.classList.contains('animating')) {
            animateParticles(particles, animationDuration);
        } else if (!particles2.classList.contains('animating')) {
            animateParticles(particles2, animationDuration);
        } else if (!particles3.classList.contains('animating')) {
            animateParticles(particles3, animationDuration);
        }
        upTotalClickCounter();
        if (timer) {
            clearInterval(timer);
        }
        timer = setTimeout(makeDelayedCallsToAPI, animationDuration + 1);
    }

    function onClapMouseover() {
        let sonarClap = document.getElementById('sonar-clap');
        sonarClap.classList.add('hover-active');
        setTimeout(() => {
            sonarClap.classList.remove('hover-active');
        }, 2000);
    }

    function upClickCounter() {
        accCounter++;
        const clickCounter = document.getElementById("clicker");
        clickCounter.children[0].innerText = '+' + accCounter;
        if (clickCounter.classList.contains('first-active')) {
            runAnimationCycle(clickCounter, 'active');
        } else {
            runAnimationCycle(clickCounter, 'first-active');
        }
    }

    function upTotalClickCounter() {
        const totalClickCounter = document.getElementById('totalCounter');
        totalClickCounter.classList.remove('d-none');
        totalClickCounter.innerText = totalCount + accCounter;
        runAnimationCycle(totalClickCounter, 'fader');
    }

    function runAnimationCycle(el, className, duration) {
        if (el && !el.classList.contains(className)) {
            el.classList.add(className);
        } else {
            el.classList.remove(className);
            void el.offsetWidth; // Trigger a reflow in between removing and adding the class name
            el.classList.add(className);
        }
    }

    function runParticleAnimationCycle(el, className, duration) {
        if (el && !el.classList.contains(className)) {
            el.classList.add(className);
            setTimeout(() => {
                el.classList.remove(className);
            }, duration);
        }
    }

    function animateParticles(particles, dur) {
        addRandomParticlesRotation(particles.id, minDeg, maxDeg);
        for (let i = 0; i < particlesClasses.length; i++) {
            runParticleAnimationCycle(particles.children[i], particlesClasses[i].class, dur);
        }
        // Boolean functionality only to activate particles2, particles3 when needed
        particles.classList.add('animating');
        setTimeout(() => {
            particles.classList.remove('animating');
        }, dur);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function addRandomParticlesRotation(particlesName, minDegrees, maxDegrees) {
        const particles = document.getElementById(particlesName);
        const randomRotationAngle = getRandomInt(minDegrees, maxDegrees) + 'deg';
        particles.style.transform = `rotate(${randomRotationAngle})`;
    }

    async function getClapCount(endpoint = "/count") {
        try {
            let url = hitCounterURL + endpoint;
            const xmlHttp = new XMLHttpRequest();
            xmlHttp.withCredentials = true;
            xmlHttp.open('GET', url, false);
            xmlHttp.send(null);
            console.log(xmlHttp.responseText);
            return xmlHttp.responseText;
        } catch (error) {
            console.log(error);
        }
    }

    async function makeDelayedCallsToAPI() {
        if (totalCount + accCounter > countFromAPI) {
            countFromAPI = parseInt(await getClapCount());
            setTimeout(makeDelayedCallsToAPI, 0);
        }
    }
})();