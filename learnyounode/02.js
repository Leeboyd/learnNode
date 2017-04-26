
const input = process.argv.slice(2)

const sum = input.reduce((pre, cur) => {
    return pre += cur*1
}, 0)

console.log(sum)
