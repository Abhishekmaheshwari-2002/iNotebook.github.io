import React, { useContext } from 'react';
import noteContext from '../context/notes/noteContext';


const NoteItem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    return (
        <div className='col-md-3'>
            <div className="card my-3" style={{ "border": "1px solid black" }} >
                <div className="card-body">
                    <div className='d-flex align-items-center'>
                        <h5 className="card-title">{note.title}</h5>
                        <i class="fa-regular fa-trash-can mx-2" onClick={() => {
                            deleteNote(note._id);
                            // showAlert("deleted Note Successfully");
                        }}></i>
                        <i class="fa-regular fa-pen-to-square mx-2" onClick={() => {
                            updateNote(note);
                        }}></i>
                    </div>
                    <p className="card-text">{note.description}</p>
                    <p className="card-text">{note.tag}</p>
                </div>
            </div>
        </div >
    )
}

export default NoteItem

