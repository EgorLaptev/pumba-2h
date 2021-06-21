'use strict';

import Pumba from "./Pumba.js";

export default class Game {

    static cnv;
    static ctx;

    static bgImage = {
        src: '../media/Фоны/background-1.png',
        x: 0,
        y: 0,
    };
    static bgSound = new Audio('../media/music/41461198_326895439.mp3');

    static time = 0;

    static started = false;
    static paused  = false;

    static playerName = '';

    static caterpillars = [];
    static hyenas = [];

    static pressedKeys = [];


    static start()
    {

        if(Game.started) return false;

        Game.started = true;

        Pumba.y = Game.cnv.height/2;

        Game.generateCaterpillars(3);
        Game.generateHyenas(2);

        Game.bgSound.loop = true;
        Game.bgSound.play();

        Game.startTimer();
        Game.control();

        Game.loop();

    }

    static loop()
    {

        if(!Game.paused && Game.started) {

            if(Pumba.health <= 0) Game.gameOver();

            Game.movement();
            Game.collisions();
            Game.render();

        }

        requestAnimationFrame(Game.loop);

    }

    static render()
    {

        // Bg
        let bg = new Image();
        bg.src = Game.bgImage.src;
        Game.ctx.drawImage(bg, Game.bgImage.x, Game.bgImage.y, Game.cnv.width, Game.cnv.height);
        Game.ctx.drawImage(bg, Game.bgImage.x+Game.cnv.width, Game.bgImage.y, Game.cnv.width, Game.cnv.height);

        // Pumba
        let pumbaImage = new Image();
        pumbaImage.src = Pumba.skin;
        Game.ctx.drawImage(pumbaImage, Pumba.x, Pumba.y, Pumba.w, Pumba.h);

        // Caterpillars
        let caterpillarImage = new Image();
        caterpillarImage.src = '../media/Гусеницы/56745fe7c68a8151b696a185.png';

        Game.caterpillars.forEach(caterpillar => {
            Game.ctx.drawImage(caterpillarImage, caterpillar.x+Game.bgImage.x, caterpillar.y, caterpillar.w, caterpillar.h);
        });

        // Hyenas
        let hyenaImage = new Image();
        hyenaImage.src = '../media/Гиена/hyena_PNG52.png';

        Game.hyenas.forEach(hyena => {
            Game.ctx.drawImage(hyenaImage, hyena.x+Game.bgImage.x, hyena.y, hyena.w, hyena.h);
        });

        // Panel
        Game.ctx.fillStyle = '#111';
        Game.ctx.fillRect(0, Game.cnv.height-50, Game.cnv.width, Game.cnv.height);
        Game.ctx.font = 'normal 20px Arial';
        Game.ctx.fillStyle = 'darkgreen';

        Game.ctx.fillText(`Health: ${Pumba.health}`, 50, Game.cnv.height-15);
        Game.ctx.fillText(`Points: ${Pumba.points}`, 200, Game.cnv.height-15);

        let sec = Game.time % 60,
            min = Math.floor(Game.time / 60) ;

        if(sec < 10) sec = `0${sec}`;
        if(min < 10) min = `0${min}`;

        Game.ctx.fillText(`Time: ${min}:${sec}`, 350, Game.cnv.height-15);

        Game.ctx.fillText(`Name: ${Game.playerName}`, Game.cnv.width-250, Game.cnv.height-15);

    }

    static movement()
    {

        Pumba.skin = '../media/Пумба/Pumbaa02.png';

        if(Game.pressedKeys[37]) { // Left
            Pumba.x -= Pumba.speed;
            Pumba.skin = '../media/Пумба/Pumbaa03.png';
        }
        if(Game.pressedKeys[39]) { // Right
            Pumba.x += Pumba.speed;
            Pumba.skin = '../media/Пумба/Pumbaa04.png';
        }
        if(Game.pressedKeys[38] && !Pumba.inJump) { // Jump
            Pumba.y -= Pumba.jump;
            Pumba.inJump = true;
            setTimeout(()=>{
                Pumba.y += Pumba.jump;
                Pumba.inJump = false;
            }, Pumba.jumpDuration);
        }

        if(Pumba.x >= Game.cnv.width/2-Pumba.w && Game.bgImage.x+Game.cnv.width > 0 && Game.pressedKeys[39]) {
            this.bgImage.x-=3;
            Pumba.x = Game.cnv.width/2-Pumba.w;
            Pumba.skin = '../media/Пумба/Pumbaa04.png';
        } else if (Pumba.x <= Game.cnv.width/2-Pumba.w && Game.bgImage.x < 0 && Game.pressedKeys[37]) {
            this.bgImage.x+=3;
            Pumba.x = Game.cnv.width/2-Pumba.w;
            Pumba.skin = '../media/Пумба/Pumbaa03.png';
        }

    }

    static control()
    {

        document.addEventListener('keydown', ev => {
           Game.pressedKeys[ev.keyCode] = true;
        });

        document.addEventListener('keyup', ev => {
           Game.pressedKeys[ev.keyCode] = false;
        });

    }

    static gameOver()
    {

        let loseScreen = document.getElementById('loseScreen'),
            points     = document.getElementById('points');

        points.textContent = 1000 - Game.time + Pumba.points * 10;

        Game.started = false;
        Game.paused = false;

        Game.bgSound.pause();

        loseScreen.style.display = 'flex';

    }

    static startTimer()
    {

        let timer = setInterval(()=>{
            if(!Game.paused) {
                Game.time++;
                Pumba.health--;
            }
        }, 1000);

    }

    static generateCaterpillars(count)
    {
        for (let i=0;i<count;i++) {
            Game.caterpillars.push({
                x: Game._getRandom(75, Game.cnv.width-75),
                y: Game._getRandom(Game.cnv.height/2-100, Game.cnv.height/2+50),
                w: 50,
                h: 50
            });
        }
    }

    static generateHyenas(count)
    {
        for (let i=0;i<count;i++) {
            Game.hyenas.push({
                x: Game._getRandom(200, Game.cnv.width-75),
                y: Game.cnv.height/2,
                w: 175,
                h: 175
            });
        }
    }

    static collisions()
    {

        Game.caterpillars.forEach((caterpillar, i) => {

            if(Game._collision(Pumba, {
                x: caterpillar.x + this.bgImage.x,
                y: caterpillar.y,
                w: caterpillar.w,
                h: caterpillar.h
            })) {

                Pumba.points++;
                Pumba.health+=5;

                Game.caterpillars.splice(i, 1);
                Game.generateCaterpillars(1);

            }

        });

        Game.hyenas.forEach((hyena, i) => {

            if(Game._collision(Pumba, {
                x: hyena.x + this.bgImage.x,
                y: hyena.y,
                w: hyena.w,
                h: hyena.h
            })) Pumba.health--;

        });


    }

    static pause()
    {

        Game.paused = !Game.paused;

        if(Game.paused) Game.bgSound.pause();
        else Game.bgSound.play();

    }

    static _getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    static _collision(obj1, obj2)
    {
        return (
            obj1.y <= (obj2.y + obj2.h) &&
            obj1.x <= (obj2.x + obj2.w) &&
            (obj1.x + obj1.w) >= obj2.x &&
            (obj1.y + obj1.h) >= obj2.y
        );
    }

}