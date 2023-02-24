animateElements();

const ASCII_OF_A = "A".charCodeAt();
const NO_OF_ALPHABETS = 26;

function animateElement(element, originalText, options) {
    let iteration = 0;

    if (options.interval) {
        return;
    }

    options.interval = setInterval(() => {
        const newWord = originalText
            .split("")
            .map((_, idx) => {
                if (idx < iteration) {
                    return originalText[idx];
                }
                return String.fromCharCode(
                    Math.trunc(Math.random() * NO_OF_ALPHABETS) + ASCII_OF_A
                );
            })
            .join("");
        element.innerText = newWord;

        iteration += 1;

        if (iteration > originalText.length) {
            clearInterval(options.interval);
            options.interval = null;
        }
    }, 30);
}

function getRandomLetter() {}

function animateElements() {
    const elements = document.getElementsByClassName("animate");

    for (const element of elements) {
        const originalText = element.innerText;
        const options = {
            interval: null
        };
        animateElement(element, originalText, options);

        element.addEventListener("mouseover", (event) => {
            animateElement(event.target, originalText, options);
        });
    }
}

function onKonamiCode(cb) {
    var input = '';
    var key = '38384040373937396665';
    document.addEventListener('keydown', function (e) {
      input += ("" + e.keyCode);
      if (input === key) {
        return cb();
      }
      if (!key.indexOf(input)) return;
      input = ("" + e.keyCode);
    });
  }
  
  onKonamiCode(function () {window.location.replace("../gift/slides.html");})