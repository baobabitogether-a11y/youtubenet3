import React, { useMemo } from 'react';

interface HighlightableTextProps {
  text: string;
  isSpeaking: boolean;
  activeCharIndex: number | null;
  className?: string;
  activeWordClassName?: string;
  pastWordClassName?: string;
  futureWordClassName?: string;
}

interface Token {
  id: number;
  text: string;
  isWord: boolean;
  start: number;
  end: number;
}

export const HighlightableText: React.FC<HighlightableTextProps> = ({
  text,
  isSpeaking,
  activeCharIndex,
  className = '',
  activeWordClassName = 'bg-amber-400 text-neutral-950 font-bold px-1.5 py-0.5 rounded shadow-md ring-2 ring-amber-300 transition-all duration-100 scale-105 inline-block mx-0.5',
  pastWordClassName = 'text-neutral-300 opacity-90',
  futureWordClassName = 'text-neutral-100',
}) => {
  // Parse tokens (words and separators) with exact char ranges
  const tokens = useMemo<Token[]>(() => {
    if (!text) return [];
    const result: Token[] = [];
    // Regex splits by word characters vs whitespace/punctuation
    const regex = /(\s+|[^\s\w]+|\w+)/g;
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = regex.exec(text)) !== null) {
      const matchText = match[0];
      const start = match.index;
      const end = start + matchText.length;
      const isWord = /\S/.test(matchText) && !/^[.,!?;:"'()[\]{}<>]+$/.test(matchText);

      result.push({
        id: idx++,
        text: matchText,
        isWord,
        start,
        end,
      });
    }
    return result;
  }, [text]);

  // Find active token index
  const activeTokenIndex = useMemo<number>(() => {
    if (!isSpeaking || activeCharIndex === null || activeCharIndex < 0 || tokens.length === 0) {
      return -1;
    }

    // 1. Exact range match
    const exact = tokens.findIndex(
      (t) => t.isWord && activeCharIndex >= t.start && activeCharIndex < t.end
    );
    if (exact !== -1) return exact;

    // 2. Next closest word after activeCharIndex
    const nextWord = tokens.findIndex((t) => t.isWord && t.start >= activeCharIndex);
    if (nextWord !== -1) return nextWord;

    // 3. Fallback to last word
    for (let i = tokens.length - 1; i >= 0; i--) {
      if (tokens[i].isWord) return i;
    }

    return -1;
  }, [tokens, isSpeaking, activeCharIndex]);

  if (!text) return null;

  if (!isSpeaking || activeTokenIndex === -1) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`${className} inline`} data-testid="highlightable-text-container">
      {tokens.map((token, i) => {
        if (!token.isWord) {
          return <span key={token.id}>{token.text}</span>;
        }

        const isActive = i === activeTokenIndex;
        const isPast = i < activeTokenIndex;

        return (
          <span
            key={token.id}
            data-testid={isActive ? 'active-tts-word-highlight' : undefined}
            className={
              isActive
                ? activeWordClassName
                : isPast
                ? pastWordClassName
                : futureWordClassName
            }
          >
            {token.text}
          </span>
        );
      })}
    </span>
  );
};
