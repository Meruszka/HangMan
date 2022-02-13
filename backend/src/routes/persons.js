const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

const messages = {
    NICK_DUPLICATE: 'NICK_DUPLICATE',
    ELEMENT_NOT_EXIST: 'ELEMENT_NOT_EXIST'
};


router.get('/', async (req, res) => {
    const persons = await client.query("SELECT * FROM person");
    return res.send(persons.rows);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const personsRows = await client.query("SELECT * FROM person WHERE id = $1", [id]); 

    const person = personsRows.rows[0];

    if(!person) {
        return res.status(500).send(messages.ELEMENT_NOT_EXIST);
    }

    return res.send(person);
  });

router.post('/', async (req, res) => {
    const personToAdd = req.body;
    const duplicate = await client.query("SELECT * FROM person WHERE nick = $1 AND password != $2", [personToAdd.nick, personToAdd.password]);
    const login = await client.query("SELECT * FROM person WHERE nick = $1 AND password = $2", [personToAdd.nick, personToAdd.password]);
    
    if(duplicate.rows[0]){
        return res.status(500).send(messages.NICK_DUPLICATE);
    }

    if(login.rows[0]){
        return res.status(201).send("ok");
    }

    const insertedPersonRows = await client.query(
        "INSERT INTO person (nick, password) VALUES ($1, $2) RETURNING *",
        [personToAdd.nick, personToAdd.password]
      );
    const insertedPerson = insertedPersonRows.rows[0];
    return res.send(insertedPerson);  
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const response = await client.query("DELETE from person WHERE id = $1", [id]);

    return response.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400); 
});

router.put('/:id', async (req, res) => {
    const personToAdd = req.body;
    const id = req.params.id;

    const result = await client.query(`UPDATE person SET nick = $1, password = $2 WHERE id = $3`,
        [personToAdd.nick, personToAdd.password, id]
    );
    
    return result.rowCount > 0 ? res.send(personToAdd) : res.sendStatus(400);
});

module.exports = router;
