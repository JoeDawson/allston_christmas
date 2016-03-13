//  this is a test

var pageFunctions = {
    intialize: function () {
      console.log('works');
      var self=this;
      this.intializeWatchers(); //listens for clicks
    },
    intializeWatchers: function () {
      var self=this;
    },

    initializeGame: function () {
      var self=this;

      document.getElementById('play').addEventListener('click', function() {
        self.handleKeyDown();
        self.spawner(true);
        self.barrierStatus();
      });


    },
    randomizeGap: function() {
      var self=this;
      var rando = Math.floor((Math.random() * 80) + 5);
      // console.log(rando);
      return rando;
    },
    randomizeInterval: function() {
      var self=this;
      var rando = Math.random() * (2.5-1) + 1;

      // console.log(rando);
      return rando;
    },
    randomizeGapSize: function() {
      var rando = Math.floor((Math.random() * 60) + 45);
      return rando;
    },
    setSquareLocation:function () {
      var self=this;

      var gapOne = document.getElementById('barrier-gap-one');
      var gapTwo = document.getElementById('barrier-gap-two');
      setInterval(function() {
        var randomPosition = self.randomizeGap();
        gapOne.style.top = randomPosition + '%';
      }, 8000);
      setInterval(function() {
        var randomPosition = self.randomizeGap();
        gapTwo.style.top = randomPosition + '%';
      }, 8000);
    },
    makeBarrier: function() {
      var self=this;

      var gameBoard = document.getElementById('game-board');

      var randomPosition = self.randomizeGap();
      var background = self.patternRandomizer();
      var height = self.randomizeGapSize();

      var barrier = document.createElement('DIV');
      barrier.classList.add("barrier");
      barrier.style.backgroundImage = 'url(' + background + ')';
      barrier.style.animationDuration = "2.5s"

      var gap = document.createElement('DIV');
      gap.classList.add('barrier-gap');
      gap.style.top = randomPosition + '%';
      gap.style.height = height + 'px';

      var score = document.createElement("H2");
      score.classList.add('score-box');
      score.innerHTML = '100';

      gap.appendChild(score);
      barrier.appendChild(gap);
      gameBoard.appendChild(barrier);

      self.animationListener(barrier);
    },
    spawner: function(state) {
      var self=this;
      console.log('state', state);

      // if (state === true) {
      var interval = (4 - self.randomizeInterval()) * 1000;

      if(state){
              timer = setInterval(function(){
              console.log('timer');
              self.makeBarrier(true);
            },interval);
        }else{
          console.log('timer stopped');
          clearInterval(timer);
        }
    },
    animationListener: function (anim) {
      var self=this;
      console.log('animation listener');
      var gameBoard = document.getElementById('game-board');
      // var anim = document.getElementById("barrier-two");
      anim.addEventListener("animationend",function(e){
          console.log("log at end of monkey animation");
          gameBoard.removeChild(anim);
          // self.spawner();
      },false);
      anim.addEventListener("animationstart",function(e){
          console.log("begin monkey animation");
          var barrierPos = self.getPosition(anim);
          console.log('barrierPos', barrierPos);
          // self.spawner(true);
      },false);
    },
    getPosition: function (element) {
      var elementPosition = element.getBoundingClientRect();

      // console.log('top', elementPosition.top, 'right', elementPosition.right, 'bottom', elementPosition.bottom, 'left', elementPosition.left);
      return elementPosition;
    },
    handleKeyDown: function () {
        var self=this;
        document.onkeydown = function(e) {
          var keyPress=e.keyCode
            ? event.keyCode
            : event.charCode;

        var shiftKey = e.shiftKey;
        var commandKey = event.metaKey;

        if (keyPress === 38) {
          console.log('up');
          self.handleTruckmove('up', shiftKey, commandKey);
        }
        if (keyPress === 40) {
          console.log('down');
          self.handleTruckmove('down', shiftKey, commandKey);
        }
        if (keyPress === 32) {
          console.log('pause');
          self.pauseGame();
        }
      }
    },
    handleTruckmove: function(direction, shiftKey, metaKey) {
      var self=this;


      var gameSquare = document.getElementById('game-square');
      var gameBoard = document.getElementById('game-board');
      var startingPosition = 310;

      if (shiftKey) {
        var moveIncrement = 60;
      } else if (metaKey) {
        var moveIncrement = 3;
      }
      else {
        var moveIncrement = 15;
      }

      var gameSquarePosition = self.getPosition(gameSquare);
      var gameBoardPosition = self.getPosition(gameBoard);

      var offset = (gameSquarePosition.top - startingPosition);

      var topBound = (gameSquarePosition.top - moveIncrement) <= gameBoardPosition.top;

      var bottomBound = (gameSquarePosition.bottom + moveIncrement) >= gameBoardPosition.bottom;


      if (!self.paused && direction === 'up' && !topBound) {
        var move = offset - moveIncrement;
      }
      if (!self.paused && direction === 'down' && !bottomBound) {
        var move = offset + moveIncrement;
      }

      gameSquare.classList.add('game-square--animate');
      gameSquare.style.transform = "translateY(" + move + "px)";
    },
    barrierStatus: function() {
      var self=this;
      var truck = document.getElementById('game-square');

      console.log('barrier status');

      // ADD THIS BACK TO MAKE IT WORK WITH INTERVALS

      var myVar = setInterval(function(){ myTimer() }, 100);

      function myTimer() {
        var barrierNodes = document.getElementsByClassName('barrier');


        if (barrierNodes) {
        var nodeArray = Array.prototype.slice.call(barrierNodes);

        nodeArray.forEach(function(el) {
          var truckPos = self.getPosition(truck);
          var barrierPos = self.getPosition(el);
          var gap = [].slice.call(el.querySelectorAll("div"))[0];
          var gapPosition = self.getPosition(gap);

          if (gapPosition.top  > truckPos.top || truckPos.bottom > gapPosition.bottom) {
           var  alignedVertically = false;
          } else {
            var alignedVertically = true;
          }

          if (barrierPos.left <= truckPos.right && !alignedVertically) {
            el.classList.add('barrier-crash');
            self.handleCrash();
          }
          if (barrierPos.right <= truckPos.left && alignedVertically && !el.classList.contains('barrier-crash')) {
            el.classList.add('barrier-pass');
            self.handlePass(gap);
          }
        });
        }
      }
      function myStopFunction() {
          clearInterval(myVar);
      }
    },
    patternRandomizer: function() {
      var backgrounds = ['brick_tiles_1.svg', 'brick_tiles_2.svg', 'brick_tiles_3.svg'];
      var rando = Math.floor((Math.random() * 3) + 1);
      return '/siteart/' + backgrounds[rando - 1];
    },
    handleCrash: function() {
        document.getElementById('crash').play();
        var gameBoard = document.getElementById('game-board');
        gameBoard.classList.add('game-board--active');
        setTimeout(function(){
           gameBoard.classList.remove('game-board--active');
         }, 200);
    },
    barrierCount: 0,
    score: 0,
    handlePass: function(gap) {
      var self=this;
      var score = 100;
      var scoreBox = document.getElementById('score-box');
      var barrier = gap.parentNode;
      var bridgeCounter = document.getElementById('bridge-counter');
      var scoreCounter = document.getElementById('score-counter');

      scoreBox.innerHTML = score;
      scoreBox.classList.add('score-box--active');

      setTimeout(function() {
        scoreBox.innerHTML = '';
        scoreBox.classList.remove('score-box--active');
      }, 300);

      if (!barrier.classList.contains('counted')) {
          self.barrierCount++;
          self.score = self.score + score;
          barrier.classList.add('counted');

          document.getElementById('score').play();

          bridgeCounter.innerHTML = 'Bridges passed ' + self.barrierCount;

          console.log(self.score);

          scoreCounter.innerHTML = 'Score ' + self.score;
      }



    },
    paused: false,
    pauseGame:function() {
      var self=this;

      self.paused = !self.paused;
      console.log('paused', self.paused);


      if (self.paused) {
        var pause = document.getElementById('pause');
        self.spawner(false);
        var barriersArr = [].slice.call(document.querySelectorAll(".barrier"));
          barriersArr.forEach(function(el) {
              el.classList.toggle('paused');
          });
      } else {
        var pause = document.getElementById('pause');
        self.spawner(true);
        var barriersArr = [].slice.call(document.querySelectorAll(".barrier"));
          barriersArr.forEach(function(el) {
              el.classList.toggle('paused');
          });


      }
    }
  };
