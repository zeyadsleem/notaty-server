import express, { json, urlencoded } from 'express';
import cors from 'cors';

import Database from './Database.js';

const app = express();
const db = new Database();

app.use(cors())
app.use(json());
app.use(urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

app.get('/', (_, res) => {
    let json = { health: true };
    res.send(json);
});

app.get('/notes', (req, res) => {
    const { title } = req.query;
    if (title) {
        db.getNotesByTitle(title)
            .then(data => {
                res.send(data);
            })
            .catch(error => {
                res.status(500).send(error);
            });

    } else {
        db.getNotes()
            .then(data => {
                res.send(data);
            })
            .catch(error => {
                res.status(500).send(error);
            })
    }
});

app.post('/notes', (req, res) => {
    db.addNote(req.body)
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send(error);
        })
});

app.get('/notes/:id', (req, res) => {
    const { id } = req.params;
    db.getNoteById(id)
        .then(data => {
            if (!data) {
                res.status(404).send(`Note with id ${id} doesn't exist`);
            } else {
                res.send(data);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        })
});

app.put('/notes', (req, res) => {
    db.updateNote(req.body)
        .then(data => {
            if (!data) {
                res.status(404).send(`Note doesn't exist`);
            } else {
                res.send(data);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    db.deleteNote(id)
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send(error);
        })
});


app.listen(PORT, () => {
    console.log(`Server has strted in http:localhost://${PORT}`);
    db.connect();
});
