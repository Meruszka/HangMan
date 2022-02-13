const fs = require('fs')
const axios = require('axios')


fs.readFile('words.txt', (err, data) => {
    let lista = data.toString().split('\n')
    lista = lista.map(ele => ele.replace(/(\r\n|\n|\r)/gm, ""));
    lista = lista.filter(ele => ele.length >= 5)
    
    
})

