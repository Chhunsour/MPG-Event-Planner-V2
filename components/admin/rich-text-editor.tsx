'use client';

import { useState, useRef, useEffect } from 'react';

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  locale?: string;
};

export function RichTextEditor({ name, defaultValue = '', placeholder }: RichTextEditorProps) {
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [htmlContent, setHtmlContent] = useState<string>(defaultValue);
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);

  // Sync initial defaultValue into contentEditable when mounted or mode changes
  useEffect(() => {
    if (editorRef.current && mode === 'visual') {
      if (editorRef.current.innerHTML !== htmlContent) {
        editorRef.current.innerHTML = htmlContent;
      }
    }
  }, [mode]);

  // When switching modes, preserve content
  const handleModeChange = (newMode: 'visual' | 'code') => {
    if (newMode === mode) return;
    if (mode === 'visual' && editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
    setSelectedImg(null);
    setMode(newMode);
  };

  // Sync contentEditable innerHTML changes back to state
  const handleInput = () => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  // Execute formatting commands using document.execCommand
  const exec = (command: string, value: string | undefined = undefined) => {
    if (mode !== 'visual') return;
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  // Handle format block dropdown (p, h1, h2, h3, h4, blockquote)
  const handleFormatBlock = (tag: string) => {
    if (tag) exec('formatBlock', `<${tag}>`);
  };

  // Insert link prompt
  const handleInsertLink = () => {
    const url = prompt('Enter URL link:', 'https://');
    if (url) exec('createLink', url);
  };

  // Insert image prompt (support URL or upload reference)
  const handleInsertImage = () => {
    const url = prompt('Enter image URL or path (e.g. https://... or /storage/...):', 'https://');
    if (url) {
      const alt = prompt('Enter image alt description (optional):', '') || '';
      const imgHtml = `<img src="${url}" alt="${alt}" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 1.25rem 0; border-radius: 0.5rem;" />`;
      exec('insertHTML', imgHtml);
    }
  };

  // Detect image click inside contentEditable editor to trigger floating resize controls
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'IMG') {
      setSelectedImg(target as HTMLImageElement);
    } else {
      setSelectedImg(null);
    }
  };

  // Image scaling functions
  const setImgWidth = (widthPercent: string) => {
    if (!selectedImg) return;
    selectedImg.style.width = widthPercent;
    selectedImg.style.maxWidth = '100%';
    selectedImg.style.height = 'auto';
    handleInput();
  };

  const setImgAlign = (align: 'left' | 'center' | 'right') => {
    if (!selectedImg) return;
    if (align === 'left') {
      selectedImg.style.float = 'left';
      selectedImg.style.margin = '0 1.25rem 1rem 0';
      selectedImg.style.display = 'inline-block';
    } else if (align === 'right') {
      selectedImg.style.float = 'right';
      selectedImg.style.margin = '0 0 1rem 1.25rem';
      selectedImg.style.display = 'inline-block';
    } else {
      selectedImg.style.float = 'none';
      selectedImg.style.margin = '1.25rem auto';
      selectedImg.style.display = 'block';
    }
    handleInput();
  };

  const setImgAlt = () => {
    if (!selectedImg) return;
    const currentAlt = selectedImg.alt || '';
    const newAlt = prompt('Edit image alt description:', currentAlt);
    if (newAlt !== null) {
      selectedImg.alt = newAlt;
      handleInput();
    }
  };

  const removeImg = () => {
    if (!selectedImg) return;
    selectedImg.remove();
    setSelectedImg(null);
    handleInput();
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Hidden input to pass value with standard HTML form submission */}
      <input type="hidden" name={name} value={htmlContent} />

      {/* Editor Header Bar with Visual / Text Mode Tabs */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-3 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-md">
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              mode === 'visual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => handleModeChange('visual')}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Visual Editor</span>
          </button>
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              mode === 'code' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => handleModeChange('code')}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>HTML Code</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
          {mode === 'visual' ? 'WYSIWYG Mode' : 'HTML Mode'}
        </span>
      </div>

      {/* Visual Toolbar (Only visible in Visual mode) */}
      {mode === 'visual' && (
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1" role="toolbar">
          {/* Format Block (Headings) */}
          <select
            className="h-8 text-xs font-semibold px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
            onChange={(e) => handleFormatBlock(e.target.value)}
            defaultValue="p"
            title="Paragraph & Heading Format"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="blockquote">Quote Block</option>
          </select>

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          {/* Inline Styles */}
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors font-bold text-sm"
            onClick={() => exec('bold')}
            title="Bold (Ctrl+B)"
          >
            B
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors italic font-serif text-sm"
            onClick={() => exec('italic')}
            title="Italic (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors underline text-sm"
            onClick={() => exec('underline')}
            title="Underline (Ctrl+U)"
          >
            U
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors line-through text-sm"
            onClick={() => exec('strikeThrough')}
            title="Strikethrough"
          >
            S
          </button>

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          {/* Lists */}
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={() => exec('insertUnorderedList')}
            title="Bulleted List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={() => exec('insertOrderedList')}
            title="Numbered List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          {/* Alignments */}
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={() => exec('justifyLeft')}
            title="Align Left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
            </svg>
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={() => exec('justifyCenter')}
            title="Align Center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
            </svg>
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={() => exec('justifyRight')}
            title="Align Right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
            </svg>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          {/* Add Image Button */}
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded transition-colors"
            onClick={handleInsertImage}
            title="Insert Image URL or Path"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Add Image</span>
          </button>

          {/* Links */}
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={handleInsertLink}
            title="Insert Hyperlink"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={() => exec('unlink')}
            title="Remove Link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          {/* Clear & Undo/Redo */}
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={() => exec('removeFormat')}
            title="Clear Formatting"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={() => exec('undo')}
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={() => exec('redo')}
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m16-10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* Floating Image Resize Bar */}
      {mode === 'visual' && selectedImg && (
        <div className="bg-slate-900 text-white p-2 flex items-center gap-2 flex-wrap text-xs border-b border-slate-800 animate-fadeIn">
          <span className="font-bold text-sky-400">Selected Image:</span>
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded">
            <span className="text-[11px] text-slate-400 px-1">Width:</span>
            <button type="button" className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px]" onClick={() => setImgWidth('25%')}>25%</button>
            <button type="button" className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px]" onClick={() => setImgWidth('50%')}>50%</button>
            <button type="button" className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px]" onClick={() => setImgWidth('75%')}>75%</button>
            <button type="button" className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px]" onClick={() => setImgWidth('100%')}>100%</button>
          </div>
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded">
            <span className="text-[11px] text-slate-400 px-1">Align:</span>
            <button type="button" className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px]" onClick={() => setImgAlign('left')}>Left</button>
            <button type="button" className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px]" onClick={() => setImgAlign('center')}>Center</button>
            <button type="button" className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px]" onClick={() => setImgAlign('right')}>Right</button>
          </div>
          <button type="button" className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs" onClick={setImgAlt}>Alt Text</button>
          <button type="button" className="px-2 py-1 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded text-xs ml-auto" onClick={removeImg}>Delete</button>
        </div>
      )}

      {/* Editor Canvas / Textarea */}
      <div className="p-4 bg-white min-h-[350px]">
        {mode === 'visual' ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none min-h-[320px] prose max-w-none text-slate-800 leading-relaxed focus:outline-none"
            onInput={handleInput}
            onClick={handleEditorClick}
            data-placeholder={placeholder}
          />
        ) : (
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            rows={16}
            placeholder={placeholder}
            className="w-full h-full font-mono text-xs bg-slate-900 text-slate-100 p-3 rounded border-0 outline-none leading-normal"
          />
        )}
      </div>
    </div>
  );
}
