
//  this is a test

var pageFunctionsStreet = {
    intialize: function () {
      console.log('works');
      var self=this;
      this.intializeWatchers(); //listens for clicks
    },
    intializeWatchers: function () {
    },
    initializeGame: function() {
      var self=this;

      console.log('game');
      document.getElementById('play').addEventListener('click', function() {
        self.pedestrianSpawner();
        self.setGameBoard();
        self.handleKeyboardInput();
      });

    },
    handleKeyboardInput: function () {
      console.log('keys');

        var self=this;
        document.onkeydown = function(e) {
          var keyPress=e.keyCode
            ? event.keyCode
            : event.charCode;

        console.log(keyPress);

        var shiftKey = e.shiftKey;
        var commandKey = event.metaKey;

        if (keyPress === 37) {
          self.handleMove('left', shiftKey, commandKey);
        }
        if (keyPress === 39) {
          self.handleMove('right', shiftKey, commandKey);
        }
        // if (keyPress === 38) {
        //   self.handleMove('up', shiftKey, commandKey);
        // }
        // if (keyPress === 40) {
        //   self.handleMove('down', shiftKey, commandKey);
        // }
        if (keyPress === 32) {
          console.log('space');
          self.handlePunch();
        }
      }
    },
    gameBoardState: function(state) {
      var self=this;
      var itemContainers = [].slice.call(document.querySelectorAll("div.item-container"));

      // true == has items, false == no items;
      var gameState = itemContainers.filter(function(el) {
        var bar = el.querySelectorAll(".item");
        // console.log(bar.length);
          if (bar.length === 0 && !state) {
            return el;
          } else if (bar.length !== 0 && state) {
            return el;
          };
      });
      return gameState;
    },
    setGameBoard: function() {
      var self=this;
      function thingAdder() {
        // find which squares are empty
        var emptySquares = self.gameBoardState(false);
        if (emptySquares.length !== 0) {
        // randomly choose an empty square
          var rando = self.randomizer(emptySquares.length, 0);

          var placeItem = emptySquares[rando];

          // add item to that square
          var item = document.createElement('div');
          item.classList.add('item');
          placeItem.appendChild(item);
        } else {
          console.log('full!');
        }
      }
      addItems = setInterval(thingAdder, 3500);

    },
    pedestrianSpawner: function() {
      var self=this;

    //  var pedestrianChannel =  document.querySelectorAll("div.pedestrian-channel");

    var pedestrianChannel = document.querySelectorAll('div.pedestrian-channel')[0];

    function makePedestrian() {
        var animationTime = self.randomizerDecimal(6, 4);
        var direction  = self.randomizer(2,1);
        var pedestrian = document.createElement('div');
        pedestrian.classList.add('pedestrian');
        pedestrian.style.animationDuration = animationTime + "s";


        var ethics = self.randomizer(3, 0);

        // var ethics = 0;

        // non criminals
        if (direction === 1) {
          pedestrian.classList.add('pedestrian-right');
        }
        if (direction !== 1) {
          pedestrian.classList.add('pedestrian-left');
        }
        // fake criminal
        if (ethics === 0) {
          self.handleFakeCriminals(pedestrian, animationTime);
        }
        // criminal
        if (ethics === 1) {
          pedestrian.classList.add('criminal');
          self.handleCriminals(pedestrian);
        }
        pedestrianChannel.appendChild(pedestrian);

        self.handleAnimationEnd(pedestrian);
      }

      makeAdder = setInterval(makePedestrian, 1500);

    },
    handleCriminals: function(criminal) {
      var self=this;
      var potentialTargets = self.gameBoardState(true);
      var inactiveTargets = potentialTargets.filter(function(el) {
        if (!el.classList.contains('target-item')) {
          return el;
        }
      });
      var targetRando = self.randomizer(inactiveTargets.length, 1);
      var target = inactiveTargets[targetRando - 1];

      target.classList.add('target-item');

      self.animationListener(criminal, target);


    },
    handleFakeCriminals: function(el, animationTime) {
      var self=this;

      var rando = self.randomizer(8, 1);
      var switchPoint = (animationTime / rando) * 1000;
      el.classList.add('fake-criminal');
      setTimeout(function(){
          el.classList.add('dodge-up');
       }, switchPoint);
    },
    handleMove: function(direction, shiftKey, metaKey) {

      var gameBoard = document.getElementById('game-board');
      var gameSquare = document.getElementById('mover');

      console.log(direction);

      if (shiftKey) {
        var moveIncrement = 80;
      } else if (metaKey) {
        var moveIncrement = 10;
      }
      else {
        var moveIncrement = 35;
      }

      var startingPosition = 475;

      var gameSquarePosition = gameSquare.getBoundingClientRect();
      var gameBoardPosition = gameBoard.getBoundingClientRect();

      // console.log('game bound', gameBoardPosition.left);
      var offset = (gameSquarePosition.left -  gameBoardPosition.left) - 475;

      console.log(gameSquarePosition.left -  gameBoardPosition.left, 475);

      gameSquare.classList.add('game-square--animate');

      if (direction === "right") {
        gameSquare.style.transform = 'translateX(' + (offset + moveIncrement) + 'px)';
      }
      if (direction === "left") {
        gameSquare.style.transform = 'translateX(' + (offset - moveIncrement) + 'px)';
      }
    },
    animationListener: function(criminal, target) {
      var self=this;

      criminals = setInterval(criminalActivity, 100);
      var targetPosition = target.getBoundingClientRect();

      function criminalActivity() {
        var criminalPosition = criminal.getBoundingClientRect();

        var test = criminalPosition.left < targetPosition.left && criminalPosition.left > targetPosition.left - 150;


        var testX = criminalPosition.left > targetPosition.left && criminalPosition.left < targetPosition.left + 150;

        var testToo = criminal.classList.contains('dodge-up');

        if (criminal.classList.contains('pedestrian-right')) {
          var direction = 'right';
        } else if  (criminal.classList.contains('pedestrian-left')) {
          var direction = 'left';
        }
        if (test && !testToo && direction === 'left') {
          criminal.classList.add('dodge-up');
          self.stealShit(criminal, target);
        }
        if (testX && !testToo && direction === 'right') {
          criminal.classList.add('dodge-up');
          self.stealShit(criminal, target);
        }

      }
    },
    stealShit: function(criminal, target) {
      var self=this;
      var item = target.querySelectorAll("div.item")[0];
      setTimeout(function(){
        criminal.appendChild(item);
        target.classList.remove('target-item');
        document.getElementById('swipe').play();
      }, 600);
    },
    handleAnimationEnd: function(anim) {
      var self=this;

      var pedChannel = document.querySelector("#ped-channel");
      anim.addEventListener("animationend",function(e){
          pedChannel.removeChild(anim);

          console.log('animation ended!');
      },false);

    },
    handlePunch: function() {
      var self=this;

      console.log('punch');

      var suspectArr = [].slice.call(document.querySelectorAll("div.criminal, div.fake-criminal"));
      var gameSquare = document.querySelector('#mover');

      // console.log('suspectArr', suspectArr);
      // console.log('mover', mover);

      var gameSquarePosition = gameSquare.getBoundingClientRect();

       var punchedGuy = suspectArr.filter(function (el) {
        suspectPosition = el.getBoundingClientRect();

        var leftAlign = gameSquarePosition.right > suspectPosition.left && gameSquarePosition.right < suspectPosition.right;

        var rightAlign = gameSquarePosition.left < suspectPosition.right && gameSquarePosition.right > suspectPosition.right;

        if (leftAlign || rightAlign) {
          el.classList.add('punched');
          document.getElementById('punch').play();
        }

      });



    },
    randomizer: function(large, small) {
      var rando = Math.floor((Math.random() * large) + small);
      return rando;
    },
    randomizerDecimal: function(large, small) {
      // var rando = Math.floor(Math.random() * large);
      var rando = Math.random() * (large - small) + small;
      return rando;
    },
    randomizerBloolean: function() {
      var rando = Math.floor((Math.random() * 2) + 1);
      // return (rando === 1);
      return rando === 1;

    },
  };
