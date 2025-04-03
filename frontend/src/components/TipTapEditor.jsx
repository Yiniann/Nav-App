import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const TipTapEditor = ({ note, onUpdate }) => {
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
            <button
                onClick={() => {
                    if (editor) {
                        onUpdate(note.id, editor.getHTML());
                    }
                }}
                className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
                Save
            </button>
        </div>
    );
};

export default TipTapEditor;
