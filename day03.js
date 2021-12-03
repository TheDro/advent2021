import binaryInput from "./day03.data.js"
import _ from 'lodash'
import { closingSingleTagOptionEnum } from "posthtml-render"


var input = binaryInput.split("\n")

var columnSums = getColumnSums(input)

var gammaBinary = columnSums.reduce((result, value) => {
    return result + (value > input.length/2 ? '1' : '0')
}, '')

function getColumnSums(input) {
    result = _.fill(Array(input[0].length), 0)
    for (let i=0; i<input.length; i++) {
        let line = input[i]
        for (let j=0; j<line.length; j++) {
            result[j] += parseInt(line[j])
        }
    }
    return result
}


function binaryToDecimal(str) {
    let result = 0
    for (let i=0; i<str.length; i++) {
        let exponent = str.length-1-i
        if (str[i] == '1') {
            result += 2**exponent
        }
    }
    return result
}

function getCodes(binary) {
    let gamma = binaryToDecimal(binary)
    let epsilon = 2**binary.length-1-gamma
    return [gamma, epsilon]
}

var [gamma, epsilon] = getCodes(gammaBinary)

console.log({gamma, epsilon})
console.log('power', gamma*epsilon)













