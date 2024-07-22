import React, { useState, useEffect } from 'react';
import WebFont from 'webfontloader';
import FontSelector from './FontSelector';
import FontWeightSelector from './FontWeightSelector';
import ItalicToggle from './ItalicToggle';
import fontData from '../fontData.json';
import './TextEditor.css';

const TextEditor = () => {
  const [text, setText] = useState(localStorage.getItem('text') || '');
  const [fontFamily, setFontFamily] = useState(localStorage.getItem('fontFamily') || 'ABeeZee');
  const [fontWeight, setFontWeight] = useState(localStorage.getItem('fontWeight') || '400');
  const [italic, setItalic] = useState(localStorage.getItem('italic') === 'true');

  useEffect(() => {
    const savedText = localStorage.getItem('text') || '';
    const savedFontFamily = localStorage.getItem('fontFamily') || 'ABeeZee';
    const savedFontWeight = localStorage.getItem('fontWeight') || '400';
    const savedItalic = localStorage.getItem('italic') === 'true';

    setText(savedText);
    setFontFamily(savedFontFamily);
    setFontWeight(savedFontWeight);
    setItalic(savedItalic);
    loadFont(savedFontFamily, savedFontWeight, savedItalic);
  }, []);

  useEffect(() => {
    localStorage.setItem('text', text);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('fontWeight', fontWeight);
    localStorage.setItem('italic', italic.toString());
  }, [text, fontFamily, fontWeight, italic]);

  const loadFont = (family, weight, italic) => {
    const variants = italic ? `${weight}italic` : weight;
    WebFont.load({
      google: {
        families: [`${family}:${variants}`]
      }
    });
  };

  const handleFontChange = (newFontFamily) => {
    const variants = Object.keys(fontData[newFontFamily]);
    const newVariant = getClosestFontVariant(variants, fontWeight, italic);
    setFontFamily(newFontFamily);
    setFontWeight(newVariant.weight);
    setItalic(newVariant.italic);
    loadFont(newFontFamily, newVariant.weight, newVariant.italic);
  };

  const getClosestFontVariant = (variants, currentWeight, currentItalic) => {
    if (currentItalic) {
      const italicVariants = variants.filter(variant => variant.includes('italic'));
      if (italicVariants.length > 0) {
        const closestItalic = italicVariants.reduce((prev, curr) => (
          Math.abs(parseInt(curr.replace('italic', '')) - parseInt(currentWeight)) < Math.abs(parseInt(prev.replace('italic', '')) - parseInt(currentWeight)) ? curr : prev
        ));
        return { weight: closestItalic.replace('italic', ''), italic: true };
      }
    }

    const closestWeight = variants.reduce((prev, curr) => (
      Math.abs(parseInt(curr) - parseInt(currentWeight)) < Math.abs(parseInt(prev) - parseInt(currentWeight)) ? curr : prev
    ));
    return { weight: closestWeight, italic: false };
  };

  const handleSave = () => {
    localStorage.setItem('text', text);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('fontWeight', fontWeight);
    localStorage.setItem('italic', italic.toString());
    alert('Your content has been saved!');
  };

  const handleReset = () => {
    setText('');
    setFontFamily('ABeeZee');
    setFontWeight('400');
    setItalic(false);
    loadFont('ABeeZee', '400', false);
    localStorage.removeItem('text');
    localStorage.removeItem('fontFamily');
    localStorage.removeItem('fontWeight');
    localStorage.removeItem('italic');
    alert('Editor reset!');
  };

  return (
    <div className="text-editor-container">
      <div className="select-container">
        <div className="select-item">
          <label>Font Family:</label>
          <FontSelector selectedFont={fontFamily} onFontChange={handleFontChange} />
        </div>
        <div className="select-item">
          <label>Variant:</label>
          <FontWeightSelector selectedFont={fontFamily} selectedWeight={fontWeight} onWeightChange={setFontWeight} />
        </div>
        <div className="select-item">
          <ItalicToggle 
            enabled={Object.keys(fontData[fontFamily]).includes(fontWeight + 'italic')} 
            italic={italic} 
            onToggle={setItalic} 
          />
        </div>
      </div>
      <textarea
        className="text-area"
        style={{ fontFamily, fontWeight, fontStyle: italic ? 'italic' : 'normal' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="button-container">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default TextEditor;
