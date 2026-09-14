import React, { useMemo } from 'react';
import { isRtl } from '../utils/rtlUtils';

interface HighlightableTextProps {
  text: string;
  isSpeaking: boolean;
  activeCharIndex: number | null;
  className?: string;
  activeWordClassName?: string;
  pastWordClassName?: string;
  futureWordClassName?: string;
  dir?: 'rtl' | 'ltr' | 'auto';
  lang?: string;
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
  dir,
  lang,
}) => {
  const effectiveDir = dir || (isRtl(lang, text) ? 'rtl' : 'ltr');

  // Parse tokens (words and separators) with exact char ranges across Unicode scripts
  const tokens = useMemo<Token[]>(() => {
    if (!text) return [];
    const result: Token[] = [];
    // Unicode regex splits letters/numbers vs whitespace vs punctuation
    const regex = /(\s+|[^\s\p{L}\p{N}]+|[\p{L}\p{N}]+)/gu;
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = regex.exec(text)) !== null) {
      const matchText = match[0];
      const start = match.index;
      const end = start + matchText.length;
      const isWord = /\S/.test(matchText) && !/^[.,!?;:"'()[\]{}<>«»„“—–]+$/.test(matchText);

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

    // 1. Exact range match inside a word token
    const exact = tokens.findIndex(
      (t) => t.isWord && activeCharIndex >= t.start && activeCharIndex < t.end
    );
    if (exact !== -1) return exact;

    // 2. If charIndex is at whitespace/punctuation after a word, highlight the latest word that has started
    let latestWordIdx = -1;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].isWord && tokens[i].start <= activeCharIndex) {
        latestWordIdx = i;
      }
    }
    if (latestWordIdx !== -1) return latestWordIdx;

    // 3. If charIndex is before the first word, return the first word
    const firstWord = tokens.findIndex((t) => t.isWord);
    return firstWord !== -1 ? firstWord : -1;
  }, [tokens, isSpeaking, activeCharIndex]);

  if (!text) return null;

  if (!isSpeaking || activeTokenIndex === -1) {
    return (
      <span dir={effectiveDir} className={className}>
        {text}
      </span>
    );
  }

  return (
    <span
      dir={effectiveDir}
      className={`${className} inline`}
      data-testid="highlightable-text-container"
    >
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
