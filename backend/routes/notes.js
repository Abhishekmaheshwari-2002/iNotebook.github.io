const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require
    ("express-validator");

// Route 1 : Get all the notes of logged-in user using Get "/api/notes/fetchallnotes " - login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.findOne({ user: req.user.id });
        res.json(notes)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("some error ocurred");
    }
})

// Route 2 : Add a new notes using POST "/api/notes/addnote" - login required

router.post("/addnote", fetchuser, [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast  5 char").isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // if there are,return bad request and the errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("some error ocurred");
    }
})



// Route 3 : update a existing note  using PUT "/api/notes/update" - login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;


    //create a newnote object

    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(404).send("not found");
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("not allwoed")
    }
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

    res.json({ note });

})


// Route 4 : Delete a existing note using DELETE "/api/notes/deletenote" - login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("not found");
        }
        //Allow deletion only if user own this no te 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allwoed")
        }
        note = await Note.findByIdAndDelete(req.params.id);

        res.json({ "Success": "Note has been deleted", note: note });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("some error ocurred");
    }

})
module.exports = router;



