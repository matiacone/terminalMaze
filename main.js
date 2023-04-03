
    const prompt = require('prompt-sync')({sigint: true});

    const hat = '^';
    const hole = 'O';
    const fieldCharacter = '░';
    const pathCharacter = '*';
    
    class Field {
        constructor(field) {
            this.field = field
            this.playerPosition = [0,0]
        }
    
        // get field() {
        //     return this.field
        // }
    
        // set field(newField) {
        //     this.field = newField;
        // }
    
        print() {
            let output = ''
            for (let i=0; i < this.field.length; i++) {
                output += (this.field[i].join('') + '\n')
            }
            console.log(output)
            return
        }
    
        findFieldSquare(row, column) {        
            try {
                return this.field[row][column];
              } catch (error) {
                return undefined;
              }
        }

        movePlayer(status) {
            let validInputs = ['a','s','w','d']
            while (status) {
                console.log('')
                this.print()
                let direction = prompt('Where next? (a/w/s/d): ')
                if (validInputs.indexOf(direction) === -1) {
                    console.log('Please enter a valid direction (a/w/s/d): ')
                    return this.movePlayer(true)       
                }
                status = this.updateField(direction)
            }
            playAgain() 
        }
        
    
        updateField(direction) {
            let playerPosition = this.playerPosition;
            let playerRow = playerPosition[0]
            let playerColumn = playerPosition[1]
            let currentField = this.field
            
            let inputA = direction === 'a'
            let inputS = direction === 's'
            let inputW = direction === 'w'
            let inputD = direction === 'd'
            
            //check if player falls off the map
            if ((playerRow === 0 && inputW) || (playerRow === currentField.length - 1 && inputS) || (playerColumn === 0 && inputA) || (playerColumn === currentField.length - 1 && inputD)) {
                console.log('You fell off the map!')
                return false
            }
    
            let rightSquare = this.findFieldSquare(playerRow, playerColumn + 1)
            let leftSquare = this.findFieldSquare(playerRow, playerColumn - 1)
            let aboveSquare = this.findFieldSquare(playerRow - 1, playerColumn)
            let belowSquare = this.findFieldSquare(playerRow + 1, playerColumn)
    
            //check if player falls into a hole
            if ((rightSquare === hole && inputD) || (leftSquare === hole && inputA) || (aboveSquare === hole && inputW) || (belowSquare === hole && inputS)) {
                console.log('You fell into a hole!')
                return false
            }
    
            //check if player found the hat
            if ((rightSquare === hat && inputD) || (leftSquare === hat && inputA) || (aboveSquare === hat && inputW) || (belowSquare === hat && inputS)) {
                console.log('You found the hat! Congrats on winning the game!')
                return false
            }
    
            //check if player went backwards
            if ((rightSquare === pathCharacter && inputD) || (leftSquare === pathCharacter && inputA) || (aboveSquare === pathCharacter && inputW) || (belowSquare === pathCharacter && inputS)) {
                console.log('You\'re going backwards!')
                return true
            }
    
            //update player position
            let newField = currentField.slice()
    
            if (inputA) {
                newField[playerRow][playerColumn - 1] = pathCharacter;
                this.field = newField;
                this.playerPosition = [playerRow, playerColumn - 1];
                return true
              }
            
              if (inputS) {
                newField[playerRow + 1][playerColumn] = pathCharacter;
                this.field = newField;
                this.playerPosition = [playerRow + 1, playerColumn];
                return true
              }
            
              if (inputW) {
                newField[playerRow - 1][playerColumn] = pathCharacter;
                this.field = newField;
                this.playerPosition = [playerRow - 1, playerColumn];
                return true
              }
            
              if (inputD) {
                newField[playerRow][playerColumn + 1] = pathCharacter;
                this.field = newField;
                this.playerPosition = [playerRow, playerColumn + 1];
                return true
              }
    
        }
    
        static generateField(fieldLength, diffPercent) {
            let squareTypes = [hat, hole, fieldCharacter]
            let fieldSquares = fieldLength * fieldLength;
            let holesAvailable = diffPercent * fieldSquares;
            let hatsAvailable = 1
            let generatedField = [];
            for (let i=0; i < fieldLength; i++) {
                let row = [];
                for (let j=0; j < fieldLength; j++) {                
                    //check if first square and implement pathCharcter if so
                    if (i + j === 0) {
                        row.push(pathCharacter)
                        continue;
                    }
    
                    //randomly select new square to be generated
                    let newSquareIndex = Math.floor(Math.random() * 3)
                    //check if new square is a hat & adjusting based on hats left
                    if (newSquareIndex === 0) {
                        if (hatsAvailable === 0 || i <= (Math.ceil(fieldLength/3))) {
                            newSquareIndex += 1;
                        } else {
                            hatsAvailable -= 1;
                        }
                    } 
    
                    //check if new square is a hole & adjusting based on holes left
                    if (newSquareIndex === 1) {
                        let currentAmtHoles = row.filter(square => square === squareTypes[1]).length
                        if (holesAvailable === 0 || currentAmtHoles >= ((diffPercent * fieldSquares) / fieldLength)) {
                            newSquareIndex += 1
                        } else {
                            holesAvailable -= 1
                        }
                    }
    
                    row.push(squareTypes[newSquareIndex])
                    //console.log(row.length)
                    if (row.length === fieldLength) {
                        generatedField.push(row)
                        //console.log(generatedField)
                    }
                    
                }
            }
    
            return new Field(generatedField)
        }
    }
    
    //Custom New Game
    // function newGame() {
    //     const standard = prompt('Do you want to play standard or custom? (s/c): ')
    //     let fieldSize, diffPercent
    //     if (standard.toLowerCase() === 's') {
    //         fieldSize = 10;
    //         diffPercent = .4;
    //     } else {
    //         fieldSize = parseInt(prompt('Enter field size: '))
    //         diffPercent = parseFloat(prompt('Enter difficulty as a decimal: '))
    //     }
    //     const newGame = Field.generateField(fieldSize, diffPercent)
    //     console.log('')
    //     console.log(newGame.print())
    //     movePlayer(newGame)
    // }
    
    function newGame() {
        let fieldSize = 10, diffPercent = .1
        const newGame = Field.generateField(fieldSize, diffPercent)
        newGame.movePlayer(true)
    }

    function playAgain() {
        const play = prompt('Do you want to play again? (y/n): ')
            if (play.toLowerCase() === 'y') {
                return newGame()           
            } else {
                console.log('Thanks for playing!')
                return 
            } 
    }
    
    // function movePlayer() {
    //     let direction = prompt('Where next? (a/w/s/d): ')
    //     let validInputs = ['a','s','w','d']
    //     if (validInputs.indexOf(direction) === -1) {
    //         console.log('Please enter a valid direction (a/w/s/d): ')
    //         movePlayer(gameObject)       
    //     } else {
    //         gameObject.updateField(direction)
    //     }
    //     console.log('')
    //     console.log(gameObject.print())
    // }

    
    const startGame = prompt('Do you want to start the game? (y/n): ')
    if (startGame.toLowerCase() === 'y') {
        newGame();
    } else {
        console.log('Exiting game...')
    }