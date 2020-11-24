/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.onload = function () {
    document.querySelector("#ballScore").focus();
    document.querySelector("#enterBall").addEventListener("click", addBall);
    document.querySelector("#undoBall").addEventListener('click', undoBall);
};//end window onload

var balls = new Array;
var arrFrameScores = new Array;
function addBall() {
    let reg = /[0-9 X x \/ ]{1}/;

    let ballScore = document.querySelector("#ballScore").value;
    if (reg.exec(ballScore)) {
        if (ballScore == "x") {
            ballScore = ballScore.toString().toUpperCase();
        }

        balls.push(ballScore);
        refreshFrames(balls);
        document.querySelector("#undoBall").removeAttribute("disabled");

    } else {
        window.alert("Invalid value for number of pins knocked down!");
        document.querySelector("#ballScore").value = "";
        document.querySelector("#ballScore").focus();
    }

    frameScores();
}
;//end addball()

function undoBall() {
    balls.pop();
    refreshFrames(balls);
    if (balls.length === 0) {
        document.querySelector("#undoBall").setAttribute("disabled", false);
    }
    frameScores();
    document.querySelector("#enterBall").removeAttribute("disabled");
    document.querySelector("#submitScore").setAttribute("disabled", false);
}
;// end undoBall


function refreshFrames(arrBalls) {
    let frameTable = document.querySelector("#gameFrames");
    let frameScoreTable = document.querySelector("#frameScores");
//console.log(frameTable);

    let frames = frameTable.getElementsByTagName("td");
    let frameScores = frameScoreTable.getElementsByTagName("td");
    let arrBallLength = arrBalls.length;
    let ballScoreIndex = 0;
    let frameNum = 0;
    arrFrameScores = new Array;
    let aFrame = [];
    let frameTotalScore = 0;
    let totalScore = 0;
    for (var i = 0; i < frames.length; i++) {
        frames[i].innerHTML = "";
        frameScores[i].innerHTML = "";
        frames[i].classList.remove("highlightFrame");
    }//end for i
    for (var i = 0; i < balls.length; i++) {
        let score = balls[i].toString().toUpperCase();

        if (score == "/" && frames[frameNum].innerHTML == "") {

            undoBall();
            window.alert("cannot be a spare only a number from 0-9 or a strike (X)!");

        } else if (score == "X" && frames[frameNum].innerHTML != "") {

            undoBall();
            window.alert("Invalid value, only spare or number less than the current frame score!");

        } else if (frames[frameNum].innerHTML != "" && (parseInt(frames[frameNum].innerHTML) + parseInt(score)) > 9) {
            undoBall();
            window.alert("Invalid value, only spare or number less than the current frame score!");
        } else if (score == "X" && frames[frameNum].innerHTML == "") {
            if (frameNum == 10) {
                document.querySelector("#enterBall").setAttribute("disabled", false);
                document.querySelector("#submitScore").removeAttribute("disabled");
            } else {

            }
            frames[frameNum].innerHTML = score;
            frameNum++;
        } else if (frames[frameNum].innerHTML == "") {
            frames[frameNum].innerHTML = score;
            if (frameNum == 10) {
                if (balls[i - 1] == "/") {
                    document.querySelector("#enterBall").setAttribute("disabled", false);
                    document.querySelector("#submitScore").removeAttribute("disabled");
                }
            }
        } else {
            frames[frameNum].innerHTML += " " + score;
            if (frameNum == frames.length - 1 && score != "/") {
                document.querySelector("#enterBall").setAttribute("disabled", false);
                document.querySelector("#submitScore").removeAttribute("disabled");
            } else if (frameNum == 10 && score == "/") {
                document.querySelector("#enterBall").setAttribute("disabled", false);
                document.querySelector("#submitScore").removeAttribute("disabled");
            } else {

                frameNum++;
            }

        }
    }//end for i
    if (frameNum < 10) {
        frames[frameNum].classList.add("highlightFrame");
        frames[10].classList.add("hidden");
        frameScores[10].classList.add("hidden")
    } else {
        frames[10].classList.remove("hidden");
        frameScores[10].classList.remove("hidden");
    }

    document.querySelector("#ballScore").value = "";
    document.querySelector("#ballScore").focus();
}//end refreshFrames()

function frameScores() {
    let gameFrameTable = document.querySelector("#gameFrames");
    let gameFrames = gameFrameTable.getElementsByTagName("td");
    let frameScoreTable = document.querySelector("#frameScores");
    let frameScores = frameScoreTable.getElementsByTagName("td");
    let frameBall = 0;
    let ballCount = balls.length;
    let nextBallStart = 0;
    let counter = 0;
    let addToNextFrame = false;
    let score = 0;
    let reset = false;
    let anotherStrike = false;
    let extraBalls = false;
    let currentFrameIndex = 0;
    let lastFrame = false;
    let overallTotal = 0;

    for (var i = 0; i < frameScores.length; i++) {
        let currentFrame = frameScores[i];
        if (i == 9) {
            lastFrame = true;
        } else {
            lastFrame = false;
        }
        score = 0;
        counter = 0;
        reset = false;
        if (nextBallStart > ballCount || gameFrames[i].innerHTML == "") {
            currentFrame.innerHTML = "";
        } else {


            for (var j = 0; j < ballCount; j++) {

                if (counter == 0) {
                    j = nextBallStart;
                }
                console.log(j);


                if (balls[j] == "X") {
                    score += 10;

                    if (counter == 0) {
                        nextBallStart = (j + 1);
                        extraBalls = true;
                        anotherStrike = true;
                        if (lastFrame) {
                            gameFrames[10].classList.remove("hidden");
                        }

                    } else if (counter == 2) {
                        reset = true;
                        addToNextFrame = true;
                    }

                    counter++;
                } else if (balls[j] == "/") {
                    score += (10 - parseInt(balls[j - 1]));
                    if (counter == 1) {
                        nextBallStart = (j + 1);
                        extraBalls = true;
                        if (lastFrame) {
                            gameFrames[10].classList.remove("hidden");


                        }
                    } else if (counter == 2) {
                        reset = true;

                    }
                    counter++;
                } else {
                    score += parseInt(balls[j]);
                    console.log(score);
                    if (counter == 2) {
                        reset = true;
                        addToNextFrame = true;

                    } else if (counter == 1 && extraBalls == false) {
                        reset = true;
                        if (lastFrame) {
                            gameFrames[10].classList.add("hidden");
                            frameScores[10].classList.add("hidden");
                            document.querySelector("#enterBall").setAttribute("disabled", false);
                            document.querySelector("#submitScore").removeAttribute("disabled");
                        }
                        nextBallStart = (j + 1);
                    }
                    counter++;

                }

                currentFrame.innerHTML = score;
                //  if (addToNextFrame) {
                //      frameScores[i+1].innerHTML = parseInt(balls[j]);
                //      console.log(parseInt(balls[j]));

                //  }

                //console.log(score);
                if (reset) {
                    counter = 0;
                    score = 0;
                    extraBalls = false;
                    addToNextFrame = false;
                    anotherStrike = false;
                    reset = false;
                    break;

                }


            }//end for j 
        }//end else
    }//end for i
    for (var i = 0; i < frameScores.length; i++) {
        let frameScore = parseInt(frameScores[i].innerHTML);
        if (Number.isInteger(frameScore)) {
            overallTotal += frameScore;
        }
    }
    document.querySelector("#totalScore").innerHTML = overallTotal;
}//end frameScores()

