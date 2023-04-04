
const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const FIELD_SIZE = 10
const DIFFICULTY_PERCENT = .3

class Field {
    constructor(field) {
        this.field = field
        this.playerCol = 0
        this.playerRow = 0
    }

    print() {
        let output = ''
        for (let i = 0; i < this.field.length; i++) {
            output += (this.field[i].join('') + '\n')
        }
        console.log(output)
    }

    playAgain() {
        const play = prompt('Do you want to play again? (y/n): ')
        if (play.toLowerCase() === 'y') {
            const nextGame = Field.generateField(FIELD_SIZE, DIFFICULTY_PERCENT)
            nextGame.movePlayer(true)
        } else {
            console.log('Thanks for playing!')
            return
        }
    }

    getFieldSquare(row, column) {
        try {
            return this.field[row][column];
        } catch (error) {
            return undefined;
        }
    }

    movePlayer(status) {
        let validInputs = ['a', 's', 'w', 'd']
        while (status) {

            //print current field
            console.log('')
            this.print()

            //ask user for direction
            let direction = prompt('Where to next? (a/w/s/d): ')
            //check if valid input
            if (validInputs.indexOf(direction) === -1) {
                console.log('Please enter a valid direction (a/w/s/d): ')
                continue;
            }

            //check if off map
            let offMap = this.checkOffMap(direction)
            if (offMap) {
                console.log('You fell off the map!')
                break;
            }

            //check if in hole
            let inHole = this.checkForCharacter(direction, hole);
            if (inHole) {
                console.log('You fell into a hole!')
                break;
            }

            //check if found the hat
            let foundHat = this.checkForCharacter(direction, hat);
            if (foundHat) {
                console.log('You found the hat!')
                break;
            }

            //check if backwards
            let backwards = this.checkForCharacter(direction, pathCharacter);
            if (backwards) {
                console.log('You\'re going backwards!')
                continue;
            }

            //update path position if game continues
            status = this.updatePath(direction)
        }
        this.playAgain()
    }

    checkForCharacter(direction, character) {
        let adjustmentKey = { a: [0, -1], w: [-1, 0], s: [1, 0], d: [0, 1] };
        let playerCol = this.playerCol;
        let playerRow = this.playerRow;
        let colAdj = adjustmentKey[direction][0];
        let rowAdj = adjustmentKey[direction][1];

        let nextCol = playerCol + colAdj;
        let nextRow = playerRow + rowAdj;

        let nextSquare = this.field[playerCol + colAdj][playerRow + rowAdj];
        return nextSquare === character;
    }

    checkOffMap(direction) {
        let adjustmentKey = { a: [0, -1], w: [-1, 0], s: [1, 0], d: [0, 1] };
        let playerCol = this.playerCol;
        let playerRow = this.playerRow;
        let colAdj = adjustmentKey[direction][0];
        let rowAdj = adjustmentKey[direction][1];

        let nextCol = playerCol + colAdj;
        let nextRow = playerRow + rowAdj;

        return !this.isWithinBounds(nextRow, nextCol);
    }

    isWithinBounds(row, col) {
        return row >= 0 && row < this.field.length && col >= 0 && col < this.field[0].length;
    }

    updatePath(direction) {
        let adjustmentKey = { a: [0, -1], w: [-1, 0], s: [1, 0], d: [0, 1] }
        let playerCol = this.playerCol
        let playerRow = this.playerRow
        let colAdj = adjustmentKey[direction][0]
        let rowAdj = adjustmentKey[direction][1]

        //update player position
        this.playerCol = playerCol + colAdj;
        this.playerRow = playerRow + rowAdj;

        //update field with new pathcharacter
        this.field[playerCol + colAdj][playerRow + rowAdj] = pathCharacter
        return true
    }

    static generateField(fieldLength, diffPercent = 0.1) {
        let field = new Array(fieldLength).fill(0).map(element => {
            return new Array(fieldLength);
        })

        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field.length; j++) {
                //randomly select new square to be generated
                if (Math.random() < diffPercent) {
                    field[i][j] = hole
                } else {
                    field[i][j] = fieldCharacter
                }
            }
        }
        //set pathChar to start
        field[0][0] = pathCharacter;

        //set hat location
        let randomY = Math.floor((Math.random() * fieldLength - 1)) + 1;
        let randomX = Math.floor((Math.random() * fieldLength - 1)) + 1;
        field[randomY][randomX] = hat;

        return new Field(field)

    }

}

const newGame = Field.generateField(FIELD_SIZE, DIFFICULTY_PERCENT)

function startNewGame() {
    const startGame = prompt('Do you want to start the game? (y/n): ')
    if (startGame.toLowerCase() === 'y') {
        newGame.movePlayer(true)
    } else {
        console.log('Exiting game...')
    }
}

startNewGame()