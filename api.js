const express = require('express')
const cors =require('cors')

const api = express()

const db = require('./database/db')

api.use(express.json())
api.use(cors())

api.get('/', (req, res) => {
    res.send('The Wrongs API: track injustice!!')
})

api.get('/wrong', async (req, res) => {
    const data = await db.query("SELECT * FROM wrong;")
    res.send(data.rows)
})

api.get('/people/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    const data = await db.query("SELECT * FROM person WHERE person_id = $1;", [id])

    res.send(data.rows[0])
})

api.post('/person', async (req, res) => {
    try {
        const { person_name } = req.body
        const result = await db.query(
            "INSERT INTO person (person_name) VALUES ($1) RETURNING *;",
            [person_name]
        )
        res.status(201).send(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to insert new person.' })
    }
})



module.exports = api