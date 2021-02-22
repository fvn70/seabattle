// объект Представления
var view = {
  
//  вывод сообщения в строку информации
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
//  вывести маркер Hit
  displayHit: function(location) {
    var td = document.getElementById(location);
    td.setAttribute("class", "hit");
  },
//  вывести маркер Miss
  displayMiss: function(location) {
    var td = document.getElementById(location);
    td.setAttribute("class", "miss");
  }
};

// объект Модель
var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  
  ships: [{locations: [0, 0, 0], hits: ["", "", ""] },
    {locations: [0, 0, 0], hits: ["", "", ""] },
    {locations: [0, 0, 0], hits: ["", "", ""] }],
      
  fire: function(guess) {    
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },
  
  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] != "hit") {
        return false;
      }
    }
    return true;
  },
  
  // заполнить массив ships
  generateShipLocations: function() {
    var ship;
    for (var i = 0; i < this.numShips; i++) {
      do {
        ship = this.generateShip();
      } while (this.collision(ship))
      this.ships[i] = ship;
    }
  },
  
  // создать отдельный корабль
  generateShip: function() {
    var ship = {
      locations: [],
      hits: []
    };
    // orientation: 0 - horizontal, 1 - vertical
    var orientation = Math.floor(Math.random()*2);
    var startRow = Math.floor(Math.random()*(this.boardSize-this.shipLength+1));
    var startCol = Math.floor(Math.random()*(this.boardSize-this.shipLength+1));
    var loc;
    for (var i = 0; i < this.shipLength; i++) {
      if (orientation) {
        // vertical
        loc = "" + (startRow + i) + startCol;
      } else {
        loc = "" + startRow + (startCol + i);
      }
      ship.locations[i] = loc;
      ship.hits[i] = "";
    }
    return ship;
  },
  
  // проверить, что корабль не перекрывается с другими
  collision: function(ship) {
    for (var i = 0; i < this.numShips; i++) {
      for (var j = 0; j < this.shipLength; j++) {
        var loc = ship.locations[j];
        var locs = this.ships[i].locations;
        if (locs.indexOf(loc) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};

// Контроллер
var controller = {
  guesses: 0,
  
  processGuess: function(guess) {
    var loc = parseGuess(guess);
    if (loc) {
      this.guesses++;
      var hit = model.fire(loc);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
      }
    }    
  }
};

function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  
  if (guess === null || guess.length !==2) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    firstChar = guess.charAt(0).toUpperCase();
    var row = alphabet.indexOf(firstChar);
    var col = guess.charAt(1);
    
    if (isNaN(row) || isNaN(col)) {
      alert("Oops, that isn't on the board.");
    } else if (row < 0 || row >= model.boardSize ||
              col < 0 || col >= model.boardSize) {
      alert("Oops, that's off the board!");
      } else {
        return row + col;
      }
  }
  return null;
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
}

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
}

window.onload = init;
