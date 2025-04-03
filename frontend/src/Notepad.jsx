import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { fetchNotes, addNote, deleteNote, updateNote } from "./stores/notesSlice";
import TipTapEditor from "./components/TipTapEditor";  // 确保正确导入

const Notepad = () => {
    const dispatch = useDispatch();
    const notes = useSelector((state) => state.notes.notes || []);  // 确保 notes 是数组
    console.log("Notes data:", notes);

    useEffect(() => {
        dispatch(fetchNotes());
    }, [dispatch]);

    // TipTap 编辑器实例
    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
    });

    const handleAddNote = () => {
        if (!editor || !editor.getHTML().trim()) return;

        const newNote = { content: editor.getHTML() };
        dispatch(addNote(newNote));
        editor.commands.clearContent();
    };

    const handleUpdateNote = (id, content) => {
        dispatch(updateNote({ id, content }));
    };

    return (
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Notepad</h2>

            {/* TipTap 编辑器 */}
            <div className="bg-white p-2 border rounded-md">
                <EditorContent editor={editor} />
            </div>
            <button
                onClick={handleAddNote}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Add Note
            </button>

            {/* 笔记列表 */}
            <div className="mt-6 space-y-3">
                {notes.length === 0 ? (
                    <p className="text-center text-gray-500">No notes available.</p>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} className="p-3 bg-white shadow-md rounded-lg">
                            <TipTapEditor note={note} onUpdate={handleUpdateNote} />
                            <button
                                onClick={() => dispatch(deleteNote(note.id))}
                                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notepad;
