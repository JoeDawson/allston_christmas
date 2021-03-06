
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

      // self.handleKeyboardInput();

      console.log('game');
      document.getElementById('play').addEventListener('click', function() {
        self.pedestrianSpawner();
        self.setGameBoard();
        self.handleKeyboardInput();
        document.getElementById('music').play();
        document.getElementById('play').focus() = false;
      });
    },
    handleKeyboardInput: function () {
      // console.log('keys');

        var self=this;
        document.onkeydown = function(e) {
          var keyPress=e.keyCode
            ? event.keyCode
            : event.charCode;

        // console.log(keyPress);

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
          // console.log('space');
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
      var itemArr = self.shuffle(self.items);

      // begins with three items
      var i = 0;
      while (i < 3) {
          thingAdder();
          i++;
      }

      function thingAdder() {
        // find which squares are empty
        var emptySquares = self.gameBoardState(false);
        if (emptySquares.length !== 0 && self.itemCounter < self.items.length ) {
        // randomly choose an empty square
          var rando = self.randomizer(emptySquares.length, 0);

          var placeItem = emptySquares[rando];

          // add item to that square
          var item = document.createElement('div');
          item.classList.add('item');
          item.dataset.target = 'false';
          item.dataset.stolen = 'false';
          item.style.backgroundImage = 'url("/siteart/' + itemArr[self.itemCounter] + '.svg")'
          // item.innerHTML = itemArr[self.itemCounter];
          item.dataset.itemType = itemArr[self.itemCounter];
          placeItem.appendChild(item);
          incrementCounter = self.itemCounter + 1;
          self.itemCounter = incrementCounter;
        } else {
          console.log('full!');
        }
      }
      addItems = setInterval(thingAdder, 3500);

    },
    pedestrianSpawner: function() {
      var self=this;


    var pedestrianChannel = document.querySelectorAll('div.pedestrian-channel')[0];

    function makePedestrian() {
        var animationTime = self.randomizerDecimal(6, 4);
        var direction  = self.randomizer(2,1);
        var pedestrian = document.createElement('div');
        // pedestrian.style.backgroundImage = "url('bad_" +  self.randomizer(2,1) + ".svg')";
        pedestrian.style.backgroundImage = "url('siteart/bad_" +  self.randomizer(3, 1) + ".svg')";

        pedestrian.classList.add('pedestrian');
        // pedestrian.style.animationDuration = '.45s,' + animationTime + "s";
        pedestrian.dataset.guilty = 'false';

        var ethics = self.randomizer(3, 1);

        if (direction === 1) {
          pedestrian.classList.add('pedestrian-right');
          pedestrian.dataset.direction ='right';
        }
        if (direction !== 1) {
          pedestrian.classList.add('pedestrian-left');
          pedestrian.dataset.direction ='left';
        }
        // fake criminal
        if (ethics > 1) {
          self.handleFakeCriminals(pedestrian, animationTime);
          pedestrian.dataset.criminal = 'false';
        }
        // criminal
        if (ethics === 1) {
          pedestrian.classList.add('criminal');
          pedestrian.dataset.criminal = 'true';
          self.handleCriminals(pedestrian);
        }
        pedestrianChannel.appendChild(pedestrian);
        self.handleAnimationEnd(pedestrian);
      }
      makeAdder = setInterval(makePedestrian, 2000);
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

      // target.classList.add('target-item');
      // target.dataset.target = 'true';
      self.animationListener(criminal, target);
    },
    handleFakeCriminals: function(el, animationTime) {
      var self=this;

      var rando = self.randomizer(12, 1);
      var switchPoint = (animationTime / rando) * 1000;
      el.classList.add('fake-criminal');
      setTimeout(function(){
          el.classList.add('dodge-up');
       }, switchPoint);
    },
    handleMove: function(direction, shiftKey, metaKey) {

      var gameBoard = document.getElementById('game-board');
      var gameSquare = document.getElementById('mover');

      // console.log(direction);

      if (shiftKey) {
        var moveIncrement = 60;
        var moveTime = ".15s";
        var pace = 'run';
      } else {
        var moveIncrement = 20;
        var moveTime = ".25s";
        var pace = 'walk';
      }

      var startingPosition = 475;

      var gameSquarePosition = gameSquare.getBoundingClientRect();
      var gameBoardPosition = gameBoard.getBoundingClientRect();

      // console.log('game bound', gameBoardPosition.left);
      var offset = (gameSquarePosition.left -  gameBoardPosition.left) - 475;

      // console.log(gameSquarePosition.left -  gameBoardPosition.left, 475);

      gameSquare.classList.add('mover--animate');
      var animateEl = gameSquare.querySelector('div.mover-figure');

      var moveLeft = animateEl.classList.contains('mover-left');


      if (direction === "right") {
        gameSquare.style.transform = 'translateX(' + (offset + moveIncrement) + 'px)';
        animateEl.style.animationDuration = moveTime;
        animateEl.style.animationPlayState = "running";
        animateEl.classList.remove('mover-left');
      }

      if (direction === "left") {
        if (!moveLeft) {
          animateEl.classList.add('mover-left');
        }
        animateEl.style.animationDuration = moveTime;
        gameSquare.style.transform = 'translateX(' + (offset - moveIncrement) + 'px)';
        animateEl.style.animationPlayState = "running";

      }
      var counter = 0;
      animateEl.addEventListener("animationiteration",function(e){
          console.log("log at beginning of each subsequent iteration");

          counter++;

          if (pace === 'walk' && counter === 1) {
            console.log('once');
            animateEl.style.animationPlayState = "paused";
            counter = 0;
          }
          if (pace === 'run' && counter === 2) {
            console.log('two');
            animateEl.style.animationPlayState = "paused";
            counter = 0;
          }


      },false);
    },
    animationListener: function(criminal, target) {
      var self=this;

      var criminals = setInterval(criminalActivity, 100);
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
        criminal.dataset.guilty = 'true';
        item.dataset.stolen = 'true';
        target.classList.remove('target-item');
        document.getElementById('swipe').play();
      }, 600);
    },
    handleAnimationEnd: function(anim) {
      var self=this;
      var pedChannel = document.querySelector("#ped-channel");
      anim.addEventListener("animationend",function(e){

          var criminalStatus = anim.dataset.criminal;
          var guilty = anim.dataset.guilty;
          if (criminalStatus === 'true' && guilty === 'true') {
            var stolen = self.gameStatus.stolen + 1;
            self.gameStatus.stolen = stolen;
            self.handleScore();
            var item = anim.querySelector('div.item');
            console.log(item.dataset.itemType);

            self.stolenItems.push(item.dataset.itemType);

            console.log(self.stolenItems);
          }
          pedChannel.removeChild(anim);
          console.log('animation ended!');
      },false);
    },
    handlePunch: function() {
      var self=this;
      console.log('punch');
      var suspectArr = [].slice.call(document.querySelectorAll("div.criminal, div.fake-criminal"));
      var gameSquare = document.querySelector('#mover');
      var gameSquarePosition = gameSquare.getBoundingClientRect();

       var punchedGuy = suspectArr.filter(function (el) {
        suspectPosition = el.getBoundingClientRect();

        var leftAlign = gameSquarePosition.right > suspectPosition.left && gameSquarePosition.right < suspectPosition.right;

        var rightAlign = gameSquarePosition.left < suspectPosition.right && gameSquarePosition.right > suspectPosition.right;

        if (leftAlign || rightAlign) {
          el.classList.add('punched');
          document.getElementById('punch').play();
          self.godSortThemOut(el);
        }
      });
    },
    godSortThemOut: function(el) {
      var self=this;
      var criminalStatus = el.dataset.criminal;
      var guilty = el.dataset.guilty;
      var gameBoard = document.getElementById('game-board');

      if (criminalStatus === 'true' && guilty === 'true') {
        var score = self.gameStatus.stopped + 1;

        setTimeout(function(){
          document.getElementById('score').play();
      }, 700);

        self.gameStatus.stopped = score;
      }
      else if (criminalStatus === 'true' && guilty === 'false') {
        var assaults = self.gameStatus.assaults + 1;
        self.gameStatus.assaults = assaults;

        gameBoard.classList.add('game-board--active');
        setTimeout(function(){
           gameBoard.classList.remove('game-board--active');
         }, 200);
        setTimeout(function(){
          document.getElementById('fail').play();
        }, 100);

      }
      else if (criminalStatus === 'false') {
        gameBoard.classList.add('game-board--active');
        setTimeout(function(){
           gameBoard.classList.remove('game-board--active');
         }, 200);
        setTimeout(function(){
          document.getElementById('fail').play();
      }, 100);
        var assaults = self.gameStatus.assaults + 1;
        self.gameStatus.assaults = assaults;
      }
      self.handleScore();
    },
    handleScore: function() {
      var self=this;
      var savedScore = document.querySelector('#saved-counter');
      var assaultedScore = document.querySelector('#assault-counter');
      var stolenScore = document.querySelector('#stolen-counter');

      console.log(self.gameStatus.assaults, assaultedScore);

      savedScore.innerHTML = 'Stolen items recovered ' + self.gameStatus.stopped;
      assaultedScore.innerHTML = 'Innocent bystanders assaulted ' + self.gameStatus.assaults;
      stolenScore.innerHTML = 'Items stolen ' + self.gameStatus.stolen;

    },
    gameStatus: {'stopped': 0,'stolen':0, 'assaults':0},
    items:['chair', 'bong', 'underwear', 'box', 'laptop', 'box', 'shirt_red', 'chair', 'bong', 'underwear', 'box', 'laptop', 'box', 'shirt_red', 'chair', 'bong', 'underwear', 'box', 'laptop', 'box', 'shirt_red'],
    // items:['chair', 'table', 'vase', 'guitar', 'bong', 'box', 'shirt_red', 'shirt_blue', 'underwear', 'art', 'books', 'pan', 'shoes', 'tv', 'laptop', 'rug', 'dresser', 'coffe_table', 'video_game', 'pants', 'box', 'box', 'box'],
    itemCounter: 0,
    stolenItems: [],
    recoveredItems: [],
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
    shuffle: function(input) {
      for (var i = input.length-1; i >=0; i--) {

          var randomIndex = Math.floor(Math.random()*(i+1));
          var itemAtIndex = input[randomIndex];

          input[randomIndex] = input[i];
          input[i] = itemAtIndex;
      }
      return input;
    }
  };
