'use client';

import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Custom plugins and configurations
const editorConfiguration = {
  licenseKey: 'GPL',
  toolbar: [
    'heading',
    '|',
    'bold', 
    'italic', 
    'underline', 
    'strikethrough',
    '|',
    'link',
    'bulletedList', 
    'numberedList',
    '|',
    'indent', 
    'outdent',
    '|',
    'blockQuote',
    'insertTable',
    '|',
    'undo', 
    'redo'
  ],
  heading: {
    options: [
      { 
        model: 'paragraph', 
        title: 'Paragraph', 
        class: 'ck-heading_paragraph' 
      },
      { 
        model: 'heading1', 
        view: 'h1', 
        title: 'Heading 1', 
        class: 'ck-heading_heading1',
        styles: {
          'font-size': '2.5rem',
          'font-weight': 'bold'
        }
      },
      { 
        model: 'heading2', 
        view: 'h2', 
        title: 'Heading 2', 
        class: 'ck-heading_heading2',
        styles: {
          'font-size': '2rem',
          'font-weight': 'bold'
        }
      },
      { 
        model: 'heading3', 
        view: 'h3', 
        title: 'Heading 3', 
        class: 'ck-heading_heading3',
        styles: {
          'font-size': '1.75rem',
          'font-weight': 'bold'
        }
      }
    ]
  },
  language: 'en',
  placeholder: 'Start typing your product description...'
};

/**
 * Reusable Rich Text Editor Component
 * @param {Object} props - Component props
 * @param {function} props.onChange - Callback function when editor content changes
 * @param {string} [props.value=''] - Initial content of the editor
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function RichTextEditor({ 
  onChange, 
  value = '', 
  className = '' 
}) {
  const [editorData, setEditorData] = useState(value);

  // Log when the value prop changes
  useEffect(() => {
    console.log('RichTextEditor: Received new value', {
      value,
      valueType: typeof value,
      valueLength: value.length
    });
    setEditorData(value);
  }, [value]);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    console.log('RichTextEditor: Editor content changed', {
      data,
      dataType: typeof data,
      dataLength: data.length
    });
    setEditorData(data);
    if (onChange) {
      onChange(data);
    }
  };

  return (
    <div className={`rich-text-editor ${className} rounded-lg`}>
      <CKEditor
        editor={ClassicEditor}
        config={{
          ...editorConfiguration,
          initialData: value  // Explicitly set initial data
        }}
        data={editorData}
        onChange={handleEditorChange}
      />
    </div>
  );
}

// Optional: Global styles for CKEditor
export function RichTextEditorStyles() {
  return (
    <style jsx global>{`
      .ck-editor__editable {
        min-height: 200px;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
      }
      .ck-editor__editable.ck-focused {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
      }
    `}</style>
  );
}
