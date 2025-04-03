import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const TipTapEditor = ({ note, onUpdate, onCancel }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: note.content,
    });

    useEffect(() => {
        if (editor && note.content !== editor.getHTML()) {
            editor.commands.setContent(note.content);
        }
    }, [note.content, editor]);

    return (
        <div className="bg-white p-2 border rounded-md">
            <EditorContent editor={editor} />
            <div className="flex justify-end gap-2 mt-2">
                <button
                    onClick={() => {
                        if (editor) {
                            onUpdate(note.id, editor.getHTML());
                        }
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    Save
                </button>
                <button
                    onClick={onCancel} // 取消按钮，调用 onCancel 退出编辑
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default TipTapEditor;
