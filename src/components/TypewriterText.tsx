import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  phrases = [
    'Securing Digital Assets.',
    'Strengthening Web Applications.',
    'Eliminating WordPress Malware.',
    'Conducting Ethical Penetration Audits.'
  ],
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseTime = 1800,
  className = ''
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullPhrase = phrases[phraseIndex % phrases.length];

    if (!isDeleting) {
      // Typing phase
      if (currentText.length < currentFullPhrase.length) {
        timer = setTimeout(() => {
          setCurrentText(currentFullPhrase.substring(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing phrase, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      // Deleting phase
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentFullPhrase.substring(0, currentText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => prev + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={`inline ${className}`}>
      <span>{currentText}</span>
      <span className="typewriter-cursor align-middle" aria-hidden="true" />
    </span>
  );
};
