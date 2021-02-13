let getInfoContainerEl = document.querySelector("#info-container");
let getScoreEl = document.querySelector("#score");
let startGameEl = document.querySelector("#startGame");
let getBodyEl = document.querySelector("body");
let getLivesEl = document.querySelector("#lives");
let getGuideEl = document.querySelector("#guide");
let getDifMeterEl = document.querySelector("#dif-meter");
let getLevelEl = document.querySelector("#level");
let getGameOver = document.querySelector("#game-over");
let getRestartGame = document.querySelector("#restart-game");
let countDown;

let score = 0;
let lives = 5;
let winScore = 150;
let difficulty = 1;
let level = 1;
let levelUpFailSafe;

function changeBG() {
    getBodyEl.style.backgroundImage = `radial-gradient(circle at center center, rgb(${difficulty * 5}, 0, ${difficulty * 2}), rgb(2, 2, 2))`;
}

function increaseDif() {
    if(difficulty < 10) {
        difficulty++;
        getDifMeterEl.value = difficulty;
        level++;
        getLevelEl.innerHTML = level.toString();
        getLevelEl.classList.add("level-up");
        let levelUpAnimation = setInterval(function () {
            getLevelEl.classList.remove("level-up");
            clearInterval(levelUpAnimation);
        },1990);
        changeBG();
    }

    switch (difficulty) {
        case 4:
            getDifMeterEl.classList.add("meter-yellow");
            break;
        case 7:
            getDifMeterEl.classList.add("meter-orange");
            break;
        case 9:
            getDifMeterEl.classList.add("meter-red");
            break;
    }
}

// -- Starts the game
function startGame() {
    timer();
    startGameEl.remove();
    getGuideEl.remove();
    getInfoContainerEl.style.display = "block";
    getBodyEl.classList.remove("body-start");
    getBodyEl.classList.add("body");
}

// -- Timer function
function timer(){
    let sec = 3;
    countDown = setInterval(function(){
        document.getElementById('timer').innerHTML= '' + sec;
        sec--;
        if (sec < 0) {
            clearInterval(countDown);
            document.getElementById('timer').remove();

            createShape();
        }
    }, 700);
}

// -- Create shape
function createShape() {
    let shape = document.createElement("div");
    let shapeTime =  2 - (difficulty / 7.5);
    let exists = true;
    let shapeX = Math.random() * (window.innerWidth / 1.04);
    let shapeY = Math.random() * (window.innerHeight / 1.06 - 40);
    let clickType = Math.floor(Math.random() * 500);
    let shapeSize = 50;
    let bar;

    // bind variables to styling
    shape.style.height = shapeSize + "px";
    shape.style.width = shapeSize + "px";
    shape.style.position = "absolute";
    shape.style.left = shapeX + "px";
    shape.style.bottom = shapeY + "px";
    shape.style.borderRadius = "50%";
    shape.style.cursor = "pointer";

    // ------------------------------- Determine what type of shape is created
    ////////////////////////////////////
    // --------- HEART SHAPE----------//
    ////////////////////////////////////
    if (clickType < 15){
        shape.style.width = 25 + 'px';
        shape.style.height = 25 + "px";
        shape.style.backgroundColor = "#ff003f";
        shape.classList.add('heart');
        shapeTime = 0.5;
        exists = false;
        shape.addEventListener("mouseenter", function (e) {
            e.preventDefault();
            lives++;
            getLivesEl.innerHTML = lives.toString();
            shape.remove();
            exists = false;
            let currentBackground = getBodyEl.style.backgroundImage;
            getBodyEl.style.background = "linear-gradient(#002b04, #002b04)";
            setTimeout(function () {
                getBodyEl.style.backgroundImage = currentBackground;
            }, 10);
        });
        bar = new ProgressBar.Circle(shape, {
            strokeWidth: 0,
            easing: 'linear',
            duration: 0,
            color: 'rgba(255,255,255,0)',
            trailColor: 'rgba(238,238,238,0)',
            trailWidth: 0,
            svgStyle: null
        });
    }
    ////////////////////////////////////
    // --------- HOVER SHAPE----------//
    ////////////////////////////////////
    else if (clickType < 50){
        shape.style.width = 30 + 'px';
        shape.style.height = 30 + "px";
        shape.style.backgroundColor = "#00ff86";

        randomizeCardPosition(shape);

        // -- Determine float direction
        let floatRotation = Math.floor(Math.random() * 4) + 1;
        switch (floatRotation) {
            case 1:
                shape.style.transformOrigin = "top left";
                break;
            case 2:
                shape.style.transformOrigin = "top right";
                break;
            case 3:
                shape.style.transformOrigin = "bottom left";
                break;
            case 4:
                shape.style.transformOrigin = "bottom right";
                break;
        }

        if (difficulty < 3) {
            shapeTime = 5;
        }else if (difficulty < 7) {
            shapeTime = 4.5;
        } else if (difficulty <= 10) {
            shapeTime = 3.9;
        }

        let hoverTime;
        // -- Firefox specific code. Because of how firefox handles the mouseenter event, this is required to fix issues
        if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
            hoverTime = 10;
        }else {
            hoverTime = 30;
        }

        shape.innerHTML = shapeTime.toString();

        let floatDirection = Math.floor(Math.random() * 2) + 1;

        if (floatDirection === 1){
            let shapeOffset = 0;
            let shapeFloat = setInterval(function () {
                shapeOffset++;
                shape.style.transform = "translate(" + (shapeOffset*3) + "px) rotate("+ (shapeOffset*5) +"deg)";
                if (shapeTime <= 0) {
                    clearInterval(shapeFloat);
                }
            },50);
        } else {
            let shapeOffset = 0;
            let shapeFloat = setInterval(function () {
                shapeOffset--;
                shape.style.transform = "translate(" + (shapeOffset*3) + "px) rotate("+ (shapeOffset*5) +"deg)";
                if (shapeTime <= 0) {
                    clearInterval(shapeFloat);
                }
            },50);
        }


        let shapeTimeCountDown = setInterval(function () {
            shapeTime = shapeTime - 0.1;
            shape.innerHTML = Math.floor(shapeTime).toString();
            if (shapeTime <= 0) {
                clearInterval(shapeTimeCountDown);
            }
        },100);

        let hoverTimerFunction;
        shape.classList.add('flex');
        let opacity = 1;
        shape.style.transition = "300ms";
        shape.style.opacity = "1";
        shape.addEventListener("mouseover", function () {
            shape.style.boxShadow = "0px 0px 0px 7px white";

            hoverTimerFunction = setInterval(function () {
                hoverTime--;
                opacity = opacity - 0.033;
                shape.style.opacity = opacity;
                if( hoverTime <= 0){
                    score++;
                    getScoreEl.innerHTML = score.toString();
                    shape.remove();
                    exists = false;
                    levelUpFailSafe = true;
                    clearInterval(hoverTimerFunction);
                }
            },100);
        });
        shape.addEventListener("mouseleave", function () {
            clearInterval(hoverTimerFunction);
            shape.style.boxShadow = "0px 0px 0px 0px rgba(255,255,255,1)";
        });
        bar = new ProgressBar.Circle(shape, {
            strokeWidth: 0,
            easing: 'linear',
            duration: 0,
            color: 'rgba(255,255,255,0)',
            trailColor: 'rgba(238,238,238,0)',
            trailWidth: 0,
            svgStyle: null
        });
    }
    ////////////////////////////////////
    // --------- BOSS SHAPE ----------//
    ////////////////////////////////////
    else if (clickType < 75){
        let clickNumber = 10;

        shape.style.backgroundColor = "#b57d00";
        shape.classList.add("boss");
        shapeTime = shapeTime - (difficulty/7) + 2.6 ;
        shape.insertAdjacentHTML('afterbegin', `<span id="boss-span">${clickNumber.toString()}</span>`);

        shape.addEventListener("click", function (e) {
            e.preventDefault();
            clickNumber--;
            document.querySelector('#boss-span').remove();
            shape.insertAdjacentHTML('afterbegin', `<span id="boss-span">${clickNumber.toString()}</span>`);
            if (clickNumber === 0){
                score++;
                getScoreEl.innerHTML = score.toString();
                shape.remove();
                exists = false;
                levelUpFailSafe = true;
            }
        });
        bar = new ProgressBar.Circle(shape, {
            strokeWidth: 10,
            easing: 'linear',
            duration: shapeTime * 1000,
            color: 'rgba(255,255,255,0.51)',
            trailColor: 'rgba(238,238,238,0)',
            trailWidth: 1,
            svgStyle: null
        });
    }
    ////////////////////////////////////
    // ---RIGHT CLICK SHAPE----------//
    ////////////////////////////////////
    else if (clickType < 150){
        shape.style.backgroundColor = "#006370";
        shape.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            score++;
            getScoreEl.innerHTML = score.toString();
            shape.remove();
            exists = false;
            levelUpFailSafe = true;
        });
        bar = new ProgressBar.Circle(shape, {
            strokeWidth: 10,
            easing: 'linear',
            duration: shapeTime * 1000,
            color: 'rgba(255,255,255,0.51)',
            trailColor: 'rgba(238,238,238,0)',
            trailWidth: 1,
            svgStyle: null
        });
    }
    ////////////////////////////////////
    // -----LEFT CLICK SHAPE----------//
    ////////////////////////////////////
    else if (clickType < 500){
        shape.style.backgroundColor = "#700032";
        // shapeTime = shapeTim;
        shape.addEventListener("click", function () {
            score++;
            getScoreEl.innerHTML = score.toString();
            shape.remove();
            exists = false;
            levelUpFailSafe = true;
        });

        bar = new ProgressBar.Circle(shape, {
            strokeWidth: 10,
            easing: 'linear',
            duration: shapeTime * 1000,
            color: 'rgba(255,255,255,0.51)',
            trailColor: 'rgba(238,238,238,0)',
            trailWidth: 1,
            svgStyle: null
        });
    }

    // -- Append shape to body
    getBodyEl.append(shape);

    // progressbar


    bar.animate(1.0);
    // -- Check if the shape has been clicked in time
    setTimeout(function(){
        if (exists === true) {
            lives--;
            getLivesEl.innerHTML = lives.toString();
            checkLives(lives);

            // -- Damage effect
            getBodyEl.style.transition = "0s";
            let currentBackground = getBodyEl.style.backgroundImage;
            getBodyEl.style.background = "linear-gradient(#63001b, #63001b)";
            setTimeout(function () {
                getBodyEl.style.transition = "1s ease-in-out";
                getBodyEl.style.backgroundImage = currentBackground;
            }, 10);
        }
        shape.remove();

        checkScore(score);

    },shapeTime * 1000);
}

// -- Keep track of lives
function checkLives(lives) {
    if (lives <= 0){
        getGameOver.innerHTML = "You lost";
        getGameOver.style.display = "block";
        getRestartGame.style.display = "block";

        updateHighscore();
    }
}

// -- Keep track of the score
function checkScore(score) {

    if (score % 10 === 0 && score !== 0 && levelUpFailSafe === true) {
        increaseDif();
        levelUpFailSafe = false;
    }

    if (score >= winScore) {
        updateHighscore();
        getScoreEl.style.color = "#00ff68";
        getGameOver.innerHTML = "You win!";
        getGameOver.style.display = "block";
    }
    if (score < winScore && lives > 0){
        createShape(); // < Sends back to function to create a new shape
    }
}

function restartGame() {
    location.reload();
}

let getHighscoreEl = document.getElementById('highscore');

// Load Highscore that has been saved
window.addEventListener('load', () => {
    getHighscoreEl.innerHTML = localStorage.getItem('highscore');

});

// Prevent contextmenu from popping up
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Set new highscore
function updateHighscore () {
    if(localStorage.getItem('highscore') < score) {
        localStorage.setItem('highscore', score.toString());
        getHighscoreEl.innerHTML = localStorage.getItem('highscore');
    }
}

// Temp fix for floating elements going off-screen
// Custom positioning function for the floating element
function randomizeCardPosition(shape) {
    function randomCardX() {
        let randomX = Math.floor(Math.random() * innerWidth);
        if (randomX < (innerWidth - 200) && randomX > 200){
            shape.style.left = randomX + "px";
        }else {
            randomCardX();
        }
    }

    function randomCardY() {
        let randomY = Math.floor(Math.random() * innerHeight);
        if (randomY < (innerHeight - 50) && randomY > 50){
            shape.style.bottom = randomY + "px";
        }else {
            randomCardY();
        }
    }
    randomCardX();
    randomCardY();

}

