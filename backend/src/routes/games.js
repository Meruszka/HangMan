const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});
const uuid = require('uuid');
const mqtt = require('mqtt');
const fs = require('fs');



// games = [{
//    gameid,       id gry
//    word,         słowo wylosowane
//    guesses,      odsłoniete litery
//    num,          ilość strzałów błędnych
//    letters       litery użyte
//    help          boolen, potrzebna pomoc
// }]
let games = []

const clientMQTT = mqtt.connect('mqtt://192.168.8.124:1883/mqtt');
clientMQTT.on('connect', () => {
  console.log('Connected')
});
clientMQTT.on('error', () => {
  console.log('Error')
});
clientMQTT.on('message', (topic, message) => {
    // game messages 
    if(topic.includes('game/')){
        let game = games.filter(ele => ele.gameid == topic.replace('game/', ''))[0]
        let letterGuess = message.toString()
        if(letterGuess.length == 1){
            game.letters = game.letters + letterGuess
        }
        let change = 'bad'
        game.word.split('').map((letter, index) => {
            if(letter == letterGuess){
                game.guesses = game.guesses.substring(0, index) + letterGuess + game.guesses.substring(index+1)
                change = 'good'
            }
        })
        clientMQTT.publish(`${topic}/letters`, game.letters, {retain: 0})
        if (game.word === game.guesses || game.word === letterGuess) {
            change = 'win'; game.guesses = game.word
        }
        if(game.num >= 10){
            change = 'lose'
        }
        if(change === 'good'){
            clientMQTT.publish(`${topic}/r`, game.guesses, {retain: 0})
        }
        if(change === 'bad'){
            game.num = game.num + 1
            clientMQTT.publish(`${topic}/r`, 'bad', {retain: 0})
        }
        //lose

        if(change === 'lose'){
            clientMQTT.publish(`${topic}/r`, game.word, {retain: 0})
            clientMQTT.publish(`${topic}/rw`, "lose", {retain: 0})
            clientMQTT.unsubscribe(`game/${game.gameid}`, () => {
                console.log(`UnSub to${game.gameid}`);
            })
            games = games.filter(ele => ele.gameid !== game.gameid)
        }
        // win
        if(change === 'win'){
            clientMQTT.publish(`${topic}/r`, game.word, {retain: 0})
            clientMQTT.publish(`${topic}/rw`, "win", {retain: 0})
            clientMQTT.unsubscribe(`game/${game.gameid}`)
            games = games.filter(ele => ele.gameid !== game.gameid)
        }
    }
    // end of game messages
    if(topic.includes('chat/')){
        clientMQTT.publish(`${topic}/R`, message, {retain: 0})
    }
    if(topic.includes('help/')){
        if(message.toString() === 'help'){
            let game = games.filter(ele => ele.gameid == topic.replace('help/', ''))[0]
            game.help = true
        }
    }
})

const logIT = (text) => {
    const path = 'C:/Users/48531/OneDrive/Pulpit/Protokoly/merski-szymon/projekt/backend/logs/logs.txt'
    const date = new Date
    fs.writeFile(path, date+':'+text+'\n', {
        flag: 'a'
    }, (err)=> {
        err?console.log(err):null
    })
}

router.get('/', async (req, res) => {
    const gameid = uuid.v4();
    const words = await client.query("SELECT * FROM word");
    const word = words.rows[Math.floor(Math.random()*words.rows.length)];
    games = [...games, {
        gameid: gameid,
        word: word.text,
        guesses: '-'.repeat(word.text.length),
        num: 0,
        letters: '',
        help: false
    }]
    clientMQTT.subscribe(`game/${gameid}`, () => {
        console.log(`Sub to game ${gameid}`)
        logIT(`Sub to game ${gameid}`)
    })
    clientMQTT.subscribe(`chat/${gameid}`, () => {
        console.log(`Sub to chat ${gameid}`)
        logIT(`Sub to chat ${gameid}`)
    })
    clientMQTT.subscribe(`help/${gameid}`, () => {
        console.log(`Sub to help ${gameid}`)
        logIT(`Sub to help ${gameid}`)
    })
    res.send({gameid: gameid, wordLen: word.text.length, guesses: '-'.repeat(word.text.length), letters: '', num:0, help:false})
});

router.get('/allGames', async (req, res) => {
    res.send(games)
});

  
module.exports = router;