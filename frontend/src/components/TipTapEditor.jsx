import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const TipTapEditor = ({ note, onUpdate }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: note.content,
        onUpdate: ({ editor }) => {
            onUpdate(note.id, editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(note.content);
        }
    }, [note.content, editor]);

    return <EditorContent editor={editor} className="bg-white p-2 border rounded-md" />;
};

export default TipTapEditor;
