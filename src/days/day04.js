import { boards, numbers } from "./day04.data";
import _ from 'lodash'

var markedBoards = boards.map((board) => {
    return board.map((line => {
        return line.map((value) => {
            return {value, marked: false}
        })
    }))
})

window.markedBoards = markedBoards
var winner = getWinner(markedBoards, numbers)
let sum = uncheckedSum(markedBoards[winner.boardIndex])

console.log({winner, sum, number: winner.number, product: sum*winner.number})

var lastWinner = getLastWinner(markedBoards, numbers)
var lastSum = uncheckedSum(markedBoards[lastWinner.boardIndex])
console.log({lastWinner, lastSum, number: lastWinner.number, product: lastSum*lastWinner.number})


function getWinner(markedBoards, numbers) {
    
    for (let n=0; n<numbers.length; n++) {
        let number = numbers[n]
        for (let iBoard=markedBoards.length-1; iBoard>=0; iBoard--) {
        // for (let iBoard=0; iBoard<markedBoards.length; iBoard++) {
            let board = markedBoards[iBoard]
            markBoard(board, number)
            let winner = checkBoard(board, iBoard)
            if (winner) {
                return {boardIndex: iBoard, number, numberIndex: n}
            }
        }
    }
}

function getLastWinner(markedBoards, numbers) {
    let remainingLoserIndex = 0
    for (let n=0; n<numbers.length; n++) {
        let wins = 0
        let number = numbers[n]
        for (let iBoard=markedBoards.length-1; iBoard>=0; iBoard--) {
        // for (let iBoard=0; iBoard<markedBoards.length; iBoard++) {
            let board = markedBoards[iBoard]
            markBoard(board, number)
            let winner = checkBoard(board, iBoard)
            if (winner) {
                wins++
            } else {
                remainingLoserIndex = iBoard
            }
            if (wins === markedBoards.length) {
                return {boardIndex: remainingLoserIndex, number, numberIndex: n}
            }
        }
    }
}

function uncheckedSum(board) {
    let sum = 0
    for (let i=0; i<5; i++) {
        for (let j=0; j<5; j++) {
            if (!board[i][j].marked) {
                sum += board[i][j].value
            }
        }
    }
    return sum
}


function markBoard(board, number) {
    for (let i=0; i<5; i++) {
        for (let j=0; j<5; j++) {
            if (board[i][j].value === number) {
                board[i][j].marked = true
                return
            }
        }
    }
}

function checkBoard(board, index) {
    let result = false
    let rows = _.fill(new Array(5), 0)
    let cols = _.fill(new Array(5), 0)
    for (let i=0; i<5; i++) {
        for (let j=0; j<5; j++) {
            if (board[i][j].marked) {
                rows[i]++
                cols[j]++
                if (rows[i] === 5 || cols[j] === 5) {
                    result = true
                    return result
                }
            }
        }
    }
    return result
}


console.log(markedBoards)

export default {}

// for (let i=0; i<5; i++) {
//     for (let j=0; j<5; j++) {

//     }
// }