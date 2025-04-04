import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { fetchNotes, addNote, deleteNote, updateNote } from "./stores/notesSlice";
import TipTapEditor from "./components/TipTapEditor"; 
import formatDate from "./utils/formatDate"; 
import { showToast } from "./stores/toastSlice"

const Notepad = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const notes = useSelector((state) => state.notes.notes || []);
    console.log("Notes data:", notes);

    const [editingNote, setEditingNote] = useState(null);  // 当前编辑的笔记 ID
    const [showMenu, setShowMenu] = useState(null);  // 控制菜单的显示状态

    useEffect(() => {
        dispatch(fetchNotes());
    }, [dispatch]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editorProps: {
            attributes: {
                style: "min-height: 150px; padding: 8px; border: 1px solid #ccc; border-radius: 5px; white-space: pre-wrap;",
            },
        },
    });

    const handleAddNote = async () => {
        if (!isAuthenticated) {
            dispatch(showToast("Please login to delete notes"));
            return;
          }

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
        if (!isAuthenticated) {
            dispatch(showToast("Please login to edit notes"));
            return;
        }
        const textContent = content.replace(/<[^>]*>/g, "").trim();  // 去除 HTML 标签，只保留文本内容
        
        if (!textContent) {
            dispatch(showToast("Note content cannot be empty!")); 
            return;
        }
    
        // 调试输出，确保正确传递内容
        console.log("Updating note with id:", id, "content:", content);
    
        await dispatch(updateNote({ id, content }));  // 发送请求更新笔记
        dispatch(fetchNotes());
        setEditingNote(null);
        dispatch(showToast("Note updated successfully!"));
    };
    

    const handleDeleteNote = async (id) => {
        if (!isAuthenticated) {
            dispatch(showToast("Please login to delete notes"));
            setShowMenu(null)
            return;
          }
        await dispatch(deleteNote(id));
        dispatch(fetchNotes());
        dispatch(showToast("Note deleted successfully!"));
    };
    
    const handleCancelEdit = () => {
        setEditingNote(null);
    };
    

    return (
        <div className="w-full  max-w-screen-lg mx-auto mt-6 p-4 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Notepad</h2>

            <div className="w-full bg-white p-2 rounded-md relative flex flex-col">
            {/* TipTap 编辑器 */}
            <EditorContent editor={editor} />
            <div className="mt-3 flex justify-end">
                <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Add Note
                </button>
            </div>
        </div>

            {/* 笔记列表 */}
            <div className="mt-6 space-y-3">
                {notes.length === 0 ? (
                    <p className="text-center text-gray-500">No notes available.</p>
                ) : (
                    notes.slice().reverse().map((note) => (
                        <div key={note.id} className="p-4 bg-white shadow-md rounded-lg relative">                            
                            {/* 格式化时间显示 */}
                            <div className="text-sm text-gray-500">{formatDate(note.created_at)}</div>
                            
                            {/* 显示 TipTap 编辑器，支持编辑模式 */}
                            {editingNote === note.id ? (
                                <TipTapEditor note={note} onUpdate={handleUpdateNote} onCancel={handleCancelEdit}/>
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
                                                setEditingNote(note.id); 
                                                setShowMenu(null); 
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