import mongoose from "mongoose";
import Note from './schemas/note.js';
import 'dotenv/config';

export default class Database {
    constructor() {
        this.Url = process.env.DATABASE_URL;
    }

    connect() {
        mongoose.connect(this.Url, {})
            .then(() =>
                console.log("Database connected succesfully"))
            .catch((err) =>
                console.log("Error in connecteing to Database", err))
    }

    addNote(note) {
        return new Promise((resolve, reject) => {
            note["createdDate"] = new Date();
            note["updatedDate"] = new Date();
            let newNote = new Note(note);
            newNote
                .save()
                .then((doc) => {
                    resolve(doc);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    updateNote(note) {
        return new Promise((resolve, reject) => {
            note["updatedDate"] = new Date();
            Note.findByIdAndUpdate(note["_id"], note)
                .then(data => {
                    resolve({ _id: data.id });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    getNotes() {
        return new Promise((resolve, reject) => {
            Note.find({})
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getNoteById(noteId) {
        return new Promise((resolve, reject) => {
            Note.findById(noteId)
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    getNotesByTitle(noteTitle) {
        return new Promise((resolve, reject) => {
            // this is equivalent to /${noteTitle}/i, i is a modifier to make the search case-insensitive
            const query = { title: { $regex: new RegExp(noteTitle, 'i') } };
            Note.find(query)
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    deleteNote(noteId) {
        return new Promise((resolve, reject) => {
            Note.findByIdAndDelete(noteId)
                .then((data) => {
                    console.log("deleted document:", data);
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
