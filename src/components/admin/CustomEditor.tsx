"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to support font registration and avoid SSR issues
const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import('react-quill');
  
  // Register custom fonts with Quill
  const Quill = (RQ as any).Quill;
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
}

const QUILL_COLORS = [
  'transparent', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
  '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
  '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff',
  '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
  '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'
];

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
      [{ color: [] }, { background: QUILL_COLORS }],
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
