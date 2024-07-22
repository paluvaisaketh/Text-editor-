import React from 'react';

const ItalicToggle = ({ enabled, italic, onToggle }) => {
  return (
    <button disabled={!enabled} onClick={() => onToggle(!italic)}>
      {italic ? 'Disable Italic' : 'Enable Italic'}
    </button>
  );
};

export default ItalicToggle;
