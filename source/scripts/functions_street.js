
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
      console.log('game');
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
  };
