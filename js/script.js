'use strict';

import Game from "./Game.js";

Game.cnv = document.getElementById('canvas');
Game.ctx = Game.cnv.getContext('2d');

Game.cnv.width  = innerWidth;
Game.cnv.height = innerHeight;

document.addEventListener('keydown', ev => {
    if(ev.keyCode == 27) Game.pause();
});

let formName = document.getElementById('nameForm'),
    name = document.getElementById('name'),
    play = document.getElementById('play'),
    replay = document.getElementById('replay'),
    intro = document.getElementById('intro'),
    startScreen = document.getElementById('startScreen');

name.addEventListener('input', evt=>{
   play.disabled = !name.value.trim();
});

formName.addEventListener('submit', evt=>{
    evt.preventDefault();
    startScreen.style.display = 'none';
    Game.playerName = name.value.trim();

    intro.style.display = 'block';
    intro.play();

})

replay.addEventListener('click', evt=>{
   window.location.reload();
});

document.addEventListener('keydown', evt => {
    if(evt.keyCode == 32) intro.pause();
})

intro.addEventListener('pause', evt => {
    intro.style.display = 'none';
    Game.start();
});