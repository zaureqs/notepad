export default class NotesView{
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}){
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;

        this.root.innerHTML = `
            <div class="header">
                <h2>My Notes App</h2>
            </div>
        
            <div class="notesPreview">
                <div id="editBtns">
                    <button class="editBtn" type="button"><b>B</b></button>
                    <button class="editBtn" type="button"><i>I</i></button>
                    <button class="editBtn" type="button"><u>U</u></button>
                </div>

                <input
                class="notesTitle"
                type="text"
                id="noteTitle"
                placeholder="New Note..."
                />

                <textarea
                class="notesBody"
                id="noteContent"
                placeholder="Write your note here..."
                rows="5"
                ></textarea>

                <button id="addNotesBtn" type="button">add notes</button>
            </div>
            <div class="notesContainer">

            </div>
        `;

        const btnAddNote = this.root.querySelector("#addNotesBtn");
        const inpTitle = this.root.querySelector("#noteTitle");
        const inpBody = this.root.querySelector("#noteContent");

        btnAddNote.addEventListener("click" , () => {
            onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });


        // console.log(this._createListItemHTML(300,"heydafd dsf","dsfjdsajf jjflkjad lfjlskdj lkdsjf jj", new Date()))
        
        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated){
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notesContainerItem" data-note-id="${id}">
                <div class="notesSmallTitle">${title}</div>
                <div class="notesSmallBody">
                    ${body.substring(0,MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH? "..." : ""}
                </div>
                <div class = "notesUpdated" > 
                    ${updated.toLocaleString(undefined, {dateStyle: "full",timeStyle:"short"})}
                    </div>
            </div>
        `;
    }

    updateNoteList(notes){
        const notesListContainer = this.root.querySelector(".notesContainer");
        //Empty list
        notesListContainer.innerHTML = "";

        for(const note of notes){
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        //add select/delete events for each list item
        notesListContainer.querySelectorAll(".notesContainerItem").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if(doDelete){
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }
    

    updateActiveNote(note){
        this.root.querySelector(".notesTitle").value = note.title;
        this.root.querySelector(".notesBody").value = note.body;

        this.root.querySelectorAll(".notesContainerItem").forEach(noteListItem => {
            noteListItem.classList.remove("notesContainerItemSelected");
        });

        this.root.querySelector(`notesContainerItem[data-note-id= ${note.id}]`).classList.add("notesContainerItemSelected");
    }

    updateNotePreviewVisibility(visible){
        this.root.querySelector(".notesPreview").style.visiblity = visible ? "visible" : "hidden";
    }


}