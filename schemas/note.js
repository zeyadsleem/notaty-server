import { Schema, model } from 'mongoose';

const noteSchema = Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdDate: { type: Date, required: true },
    updatedDate: { type: Date, required: true }
});

export default model('Note', noteSchema);
