"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to support font registration and avoid SSR issues
const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import('react-quill');
  
  // Register custom fonts with Quill
  const Quill = RQ.Quill;
  if (Quill) {
    const Font = Quill.import('formats/font');
    Font.whitelist = [
      'notosanskr', 
      'nanumgothic', 
      'nanummyeongjo', 
      'blackhansans', 
      'bagelfat',
      'nanumpen',
      'thin',
      'normal',
      'thick'
    ];
    Quill.register(Font, true);
  }
  
  return RQ;
}, { ssr: false });

interface CustomEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'light' | 'dark';
}

const CustomEditor = ({ value, onChange, placeholder, className, variant = 'light' }: CustomEditorProps) => {
  // Memoize modules to avoid unnecessary re-renders
  const modules = useMemo(() => ({
    toolbar: [
      [{ font: [
        false, // 기본 폰트
        'thin',
        'normal',
        'thick',
        'notosanskr', 
        'nanumgothic', 
        'nanummyeongjo', 
        'blackhansans', 
        'bagelfat',
        'nanumpen'
      ] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean']
    ],
  }), []);

  const formats = [
    'font', 'size', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'align'
  ];

  return (
    <div className={`custom-quill-editor ${variant === 'dark' ? 'dark-editor' : ''} ${className || ''}`}>
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default CustomEditor;
