const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Notes = require("../models/Notes")
const { body, validationResult } = require("express-validator");


//ROUTE 1: Fetch all the Notes : GET "/api/auth/fetchallnotes".Login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {


    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }

})

//ROUTE 2: Add a new Notes : POST "/api/auth/addnote".login required
router.post('/addnote', fetchuser,
    [
        body('title', "Title is required").isLength({ min: 3 }),
        body('description', "Description is required").isLength({ min: 3 }),
    ],
    async (req, res) => {


        //if there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const note = await Notes.create({
                title: req.body.title,
                description: req.body.description,
                tag: req.body.tag,
                user: req.user.id
            })
            res.json(note);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");

        }
    }
)
//ROUTE 3: Update an existing Notes : PUT "/api/auth/updatenote".login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //Create a new note object
        const newNote = {};
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }

        //Find the note to be updated and update it

        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 4: Delete an existing Notes : DELETE "/api/auth/deletenote".login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //Find the note to be deleted
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") }

        //Allow deletion only if user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})




module.exports = router  