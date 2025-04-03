import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { fetchNotes, addNote, deleteNote, updateNote } from "./stores/notesSlice";
import TipTapEditor from "./components/TipTapEditor"; 
import formatDate from "./utils/formatDate"; 
import { showToast } from "./stores/toastSlice"

const Notepad = () => {
    const dispatch = useDispatch();
    const notes = useSelector((state) => state.notes.notes || []);
    console.log("Notes data:", notes);

    const [editingNote, setEditingNote] = useState(null);  // ✅ 记录当前编辑的笔记 ID
    const [showMenu, setShowMenu] = useState(null);  // ✅ 控制菜单的显示状态

    useEffect(() => {
        dispatch(fetchNotes());
    }, [dispatch]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
    });

    const handleAddNote = async () => {
        if (!editor) return;
    
        const rawContent = editor.getHTML();
        const textContent = rawContent.replace(/<[^>]*>/g, "").trim(); 
    
        if (!textContent) {
            dispatch(showToast("Note cannot be empty!")) 
            return;
        }
    
        const newNote = { content: rawContent };
    
        await dispatch(addNote(newNote));
        dispatch(fetchNotes());
        editor.commands.clearContent();
        dispatch(showToast("Note added successfully!"));
    };
    
    const handleUpdateNote = async (id, content) => {
        const textContent = content.replace(/<[^>]*>/g, "").trim();
    
        if (!textContent) {
            dispatch(showToast("Note content cannot be empty!")); 
            return;
        }
    
        await dispatch(updateNote({ id, content }));
        dispatch(fetchNotes());
        setEditingNote(null);
        dispatch(showToast("Note updated successfully!"))
    };

    const handleDeleteNote = async (id) => {
        await dispatch(deleteNote(id));
        dispatch(fetchNotes());
        dispatch(showToast("Note deleted successfully!"));
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
                        <div key={note.id} className="p-4 bg-white shadow-md rounded-lg relative">                            
                            {/* 格式化时间显示 */}
                            <div className="text-sm text-gray-500">{formatDate(note.created_at)}</div>
                            
                            {/* 显示 TipTap 编辑器，支持编辑模式 */}
                            {editingNote === note.id ? (
                                <TipTapEditor note={note} onUpdate={handleUpdateNote} />
                            ) : (
                                <div className="text-gray-800 mt-2" dangerouslySetInnerHTML={{ __html: note.content }} />
                            )}

                            {/* 右上角的 "..." 菜单 */}
                            <div className="absolute top-2 right-2">
                                <button
                                    className="px-2 py-1 bg-gray-200 rounded-full"
                                    onClick={() => setShowMenu(showMenu === note.id ? null : note.id)}
                                >
                                    ...
                                </button>

                                {/* 下拉菜单 */}
                                {showMenu === note.id && (
                                    <div className="absolute bottom-full right-0 mb-1 w-24 bg-white shadow-lg rounded-md border">
                                        <button
                                            onClick={() => {
                                                setEditingNote(note.id);  // 进入编辑模式
                                                setShowMenu(null);  // 关闭下拉菜单
                                            }}
                                            className="block w-full text-left px-3 py-1 text-gray-700 hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>handleDeleteNote(note.id)}
                                            className="block w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notepad;