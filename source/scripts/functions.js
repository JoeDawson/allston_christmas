//  this is a test

var pageFunctions = {
    intialize: function () {
      console.log('works');
      var self=this;
      this.intializeWatchers(); //listens for clicks
    },
    intializeWatchers: function() {
      var self=this;
      var gameBoard = document.querySelector('#game-board');

      gameBoard.addEventListener('transitionend', function(e) {
        if (e.target.classList.contains('score-box')) {
          e.target.classList.remove('score-box--active');
        }
      });
      gameBoard.addEventListener('animationend', function(e){
        if (e.target.classList.contains('game-board--active')) {
          e.target.classList.remove('game-board--active');
        }
        if (e.target && e.target.classList.contains('barrier')) {
          gameBoard.removeChild(e.target);
        }
      });
      // gameBoard.addEventListener('animationstart', function(e){
      //   if (e.target && e.target.classList.contains('barrier')) {
      //     console.log('barrier start');
      //   }
      // });
    },
    initializeGame: function () {
      var self=this;

      document.getElementById('play').addEventListener('click', function() {
        self.handleKeyboardInput();
        self.spawner(true);
        self.barrierStatus(false);
        document.getElementById('music').play();
        document.getElementById('truck').play();
        document.getElementById('play').blur();
        document.querySelector('.game-square-item').classList.add('game-square-item--animate');
      });

    },
    randomize: function(large, small) {
      var rando = Math.floor((Math.random() * large) + small);
      return rando;
    },
    adjustDifficultyLevel: function() {
      var self=this;

      var difficultyLevel = {};
      var rando = self.randomize(200, 1);

      self.gameStatus.barrierCount <= 5
      ? (
        difficultyLevel.animationDur = '2s',
        difficultyLevel.gapHeight = 45 + self.randomize(15, 25),
        difficultyLevel.score = 50,
        difficultyLevel.interval = self.randomize(25000, 20000)
      ) :
      self.gameStatus.barrierCount > 5 && self.gameStatus.barrierCount <= 10
      ? (
        difficultyLevel.animationDur = '1.75s',
        difficultyLevel.gapHeight = 45 + self.randomize(15, 20),
        difficultyLevel.score = 100,
        difficultyLevel.interval = self.randomize(20000, 15000)
      ) :
      self.gameStatus.barrierCount > 10 && self.gameStatus.barrierCount <= 20
      ? (
        difficultyLevel.animationDur = '1.25s',
        difficultyLevel.gapHeight = 40 + self.randomize(10, 15),
        difficultyLevel.score = 150,
        difficultyLevel.interval = self.randomize(15000, 10000)
      ) :
      (
        difficultyLevel.animationDur = '1s',
        difficultyLevel.gapHeight = 40 + self.randomize(5, 8),
        difficultyLevel.score = 500,
        difficultyLevel.interval = self.randomize(8000, 5000)
      );
      return difficultyLevel;
    },
    makeBarrier: function() {
      var self=this;

      var gameBoard = document.getElementById('game-board');

      var difficultyLevel = self.adjustDifficultyLevel();

      var randomPosition = self.randomizeGap();
      var background = self.patternRandomizer();
      var height = difficultyLevel.gapHeight;

      var animationDur = difficultyLevel.animationDur;


      var barrier = document.createElement('DIV');
      barrier.classList.add("barrier");
      barrier.style.backgroundImage = 'url(' + background + ')';
      barrier.style.animationDuration = animationDur;

      if (self.gameStatus.barrierCount === 6 || self.gameStatus.barrierCount === 11 || self.gameStatus.barrierCount === 16 || self.gameStatus.barrierCount === 20) {
        self.spawner(false);
        self.spawner(true);
      }

      var gap = document.createElement('DIV');
      gap.classList.add('barrier-gap');
      gap.style.top = randomPosition + '%';
      gap.style.height = height + 'px';
      barrier.appendChild(gap);
      gameBoard.appendChild(barrier);

      self.animationListener(barrier);
      self.adjustDifficultyLevel();
    },
    spawner: function(state) {
      var self=this;
      if(state){
        timer = setInterval(function(){
          self.makeBarrier(true);
        },self.adjustDifficultyLevel().interval);
        }else{
          clearInterval(timer);
        }
    },
    animationListener: function (anim) {
      var self=this;
      var gameBoard = document.getElementById('game-board');
      // var anim = document.getElementById("barrier-two");
      anim.addEventListener("animationend",function(e){
          gameBoard.removeChild(anim);
          // self.spawner();
      },false);
      anim.addEventListener("animationstart",function(e){
          var barrierPos = self.getPosition(anim);
          // self.spawner(true);
      },false);
    },
    getPosition: function (element) {
      var elementPosition = element.getBoundingClientRect();

      return elementPosition;
    },
    handleKeyboardInput: function () {
        var self=this;
        document.onkeydown = function(e) {
          var keyPress=e.keyCode
            ? event.keyCode
            : event.charCode;

        var shiftKey = e.shiftKey;
        var commandKey = event.metaKey;

        if (keyPress === 38) {
          self.handleTruckmove('up', shiftKey, commandKey);
        }
        if (keyPress === 40) {
          self.handleTruckmove('down', shiftKey, commandKey);
        }
        if (keyPress === 32) {
          self.pauseGame();
        }
      }

      var cheatCodeArr = [];

      document.onkeyup = function(e) {
        var keyUp=e.keyCode
          ? event.keyCode
          : event.charCode;

      if (keyUp === 83) {
        cheatCodeArr.push('s');
      }
      else if (keyUp === 84 ) {
        cheatCodeArr.push('t');
      }
      else if (keyUp === 73 ) {
        cheatCodeArr.push('i');
      }
      else if (keyUp === 71 ) {
        cheatCodeArr.push('g');

      }
      var cheatCode = cheatCodeArr.join('');
      if(cheatCode.match(/stig/gi)) {
        self.barrierStatus(true);
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
    barrierStatus: function(cheat) {
      var self=this;
      var truck = document.getElementById('game-square');
      // ADD THIS BACK TO MAKE IT WORK WITH INTERVALS

      var myVar = setInterval(function(){ myTimer() }, 100);

      function myTimer() {
        var barrierNodes = document.getElementsByClassName('barrier');

        if (barrierNodes) {
        var nodeArray = Array.prototype.slice.call(barrierNodes);

        if (cheat) {
          var cheatGap = nodeArray[0].childNodes[0];
          var gapSize = (cheatGap.clientHeight - 45);
          truck.style.top = cheatGap.style.top;
          truck.style.bottom  = 'auto';
          truck.style.transform = "translateY(" + gapSize + "px)";
          document.getElementById('stig-mode').innerHTML = "Stig mode engaged!";
          truck.classList.add('truck-stig-mode')
        }

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
            self.handleCrash(gap.parentNode);
          }
          if (barrierPos.right <= truckPos.left && alignedVertically && !el.classList.contains('barrier-crash')) {
            el.classList.add('barrier-pass');
            self.handlePass(gap.parentNode);
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
    handleCrash: function(barrier) {
        var self=this;
        var gameBoard = document.getElementById('game-board');
        var crashCountBox = document.getElementById("crash-counter");
        var crashCount = self.gameStatus.crashCount;

        if (!barrier.classList.contains('counted')) {
            self.gameStatus.crashCount++;
            barrier.classList.add('counted');

            document.getElementById('crash').play();

            gameBoard.classList.add('game-board--active');
            setTimeout(function(){
               gameBoard.classList.remove('game-board--active');
             }, 200);

            crashCountBox.innerHTML = 'Bridges hit ' + self.gameStatus.crashCount;

            var secDep = 100 - (self.gameStatus.crashCount * 20);

            console.log(secDep);

            if (secDep !== 0 && secDep > 0) {
              document.getElementById('security-deposit').innerHTML = 'Percent of security deposit remaining: ' + secDep;
            }

        }

    },
    gameStatus: {"barrierCount": 0, "score": 0, "crashCount": 0},
    handlePass: function(barrier) {
      var self=this;
      var score = self.adjustDifficultyLevel().score;
      var scoreBox = document.getElementById('score-box');
      // var barrier = gap.parentNode;
      var bridgeCounter = document.getElementById('bridge-counter');
      var scoreCounter = document.getElementById('score-counter');

      scoreBox.innerHTML = score;
      scoreBox.classList.add('score-box--active');

      setTimeout(function() {
        scoreBox.innerHTML = '';
        scoreBox.classList.remove('score-box--active');
      }, 300);

      if (!barrier.classList.contains('counted')) {
          self.gameStatus.barrierCount++;
          self.gameStatus.score = self.gameStatus.score + score;
          barrier.classList.add('counted');

          document.getElementById('score').play();

          bridgeCounter.innerHTML = 'Bridges passed ' + self.gameStatus.barrierCount;
          scoreCounter.innerHTML = 'Score ' + self.gameStatus.score;
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
