import { useEffect, useRef } from 'react';
import { appendRichNodes, domToHtml, parseRichHtml } from './richText';
import './RichText.css';

const ACTIONS = [
  { label: 'Negrita', command: 'bold' },
  { label: 'Cursiva', command: 'italic' },
  { label: 'Subrayado', command: 'underline' },
  { label: 'Título', command: 'formatBlock', value: 'h3' },
  { label: 'Lista', command: 'insertUnorderedList' },
  { label: 'Lista numerada', command: 'insertOrderedList' },
];

export default function RichTextEditor({ id, value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.replaceChildren();
    appendRichNodes(editor, parseRichHtml(value || ''));
  }, []);

  function emitChange() {
    onChange(domToHtml(editorRef.current));
  }

  function applyFormat(event, action) {
    event.preventDefault();
    editorRef.current?.focus();
    document.execCommand(action.command, false, action.value);
    emitChange();
  }

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar" role="toolbar" aria-label="Formato de la descripción">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            className="rich-editor__btn"
            onMouseDown={(event) => applyFormat(event, action)}
          >
            {action.label}
          </button>
        ))}
      </div>
      <div
        id={id}
        ref={editorRef}
        className="rich-editor__area"
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Descripción"
        data-placeholder="Escribe la descripción del restaurante"
        onInput={emitChange}
        onBlur={emitChange}
      />
    </div>
  );
}
