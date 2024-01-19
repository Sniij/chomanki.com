import React from 'react';

interface AngleBracketProps {
  children: React.ReactNode;
}

const AngleBracket: React.FC<AngleBracketProps> = ({ children }) => (
  <span>&lt;{children}&gt;</span>
);

export default AngleBracket;