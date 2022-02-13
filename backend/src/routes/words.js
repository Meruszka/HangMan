const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

const messages = {
    WORD_DUPLICATE: 'WORD_DUPLICATE',
    ELEMENT_NOT_EXIST: 'ELEMENT_NOT_EXIST'
};

router.get('/', async (req, res) => {
    const words = await client.query("SELECT * FROM word");
    return res.send(words.rows);
});

router.get('/random', async (req, res) => {
    const words = await client.query("SELECT * FROM word");
    return res.send(words.rows[Math.floor(Math.random()*words.rows.length)]);
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const wordsRows = await client.query("SELECT * FROM word WHERE id = $1", [id]); 

    const word = wordsRows.rows[0];

    if(!word) {
        return res.status(500).send(messages.ELEMENT_NOT_EXIST);
    }

    return res.send(word);
  });

router.post('/', async (req, res) => {
    const wordToAdd = req.body;

    const insertedWordRows = await client.query(
        "INSERT INTO word (text) VALUES ($1) RETURNING *",
        [wordToAdd.text]
      );

    const insertedWord = insertedWordRows.rows[0];
    return res.send(insertedWord);  
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const response = await client.query("DELETE from word WHERE id = $1", [id]);

    return response.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400); 
});

router.put('/:id', async (req, res) => {
    const wordToAdd = req.body;
    const id = req.params.id;

    const result = await client.query(`UPDATE word SET nick = $1 WHERE id = $2`,
        [wordToAdd.text, id]
    );
    
    return result.rowCount > 0 ? res.send(wordToAdd) : res.sendStatus(400);
});

router.delete('/', async (req, res) => {
    const response = await client.query("DELETE from word");
    return response.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400); 
})

module.exports = router;
