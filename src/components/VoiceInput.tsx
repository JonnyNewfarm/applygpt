"use client";

import { useRef, useState, useEffect } from "react";
import { FiMic } from "react-icons/fi";

interface VoiceInputProps {
  value: string;
  onTextChangeAction: (newText: string) => void;
}

// Extend the window interface to include speech recognition types
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

function safeReplace(source: string, search: RegExp, replace: string): string {
  return source.replace(search, replace);
}
export function cleanVoiceText(text: string): string {
  let cleaned: string = text.trim();

  cleaned = safeReplace(cleaned, /\bcomma\b/gi, ",");
  cleaned = safeReplace(cleaned, /\bdot\b/gi, ".");
  cleaned = safeReplace(cleaned, /\bperiod\b/gi, ".");
  cleaned = safeReplace(cleaned, /\bquestion mark\b/gi, "?");
  cleaned = safeReplace(cleaned, /\bexclamation mark\b/gi, "!");
  cleaned = safeReplace(cleaned, /\bcolon\b/gi, ":");
  cleaned = safeReplace(cleaned, /\bsemicolon\b/gi, ";");
  cleaned = safeReplace(cleaned, /\bnew line\b/gi, "\n");
  cleaned = safeReplace(cleaned, /\bnext line\b/gi, "\n");

  cleaned = cleaned.replace(/(^\s*\w|[.!?,]\s*\w)/g, (match) => {
    return match.toUpperCase();
  });

  return cleaned;
}

export function appendVoiceText(oldText: string, newText: string) {
  if (!newText.trim()) return oldText;
  const cleaned = cleanVoiceText(newText);
  const needsSpace =
    oldText && !oldText.endsWith("\n") && !oldText.endsWith(" ");
  return oldText + (needsSpace ? " " : "") + cleaned;
}

export default function VoiceInput({
  value,
  onTextChangeAction,
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const latestTextRef = useRef(value);
  useEffect(() => {
    latestTextRef.current = value;
  }, [value]);

  const handleStartRecording = () => {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (event.results[event.results.length - 1].isFinal) {
        const newText = appendVoiceText(latestTextRef.current, transcript);
        latestTextRef.current = newText;
        onTextChangeAction(newText);
      }
    };

    recognition.onend = () => setIsRecording(false);
    recognition.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`px-4 py-2 cursor-pointer rounded-[5px] hover:scale-102 transition-transform ease-in-out font-semibold text-white ${
          isRecording
            ? "bg-red-800"
            : "bg-gradient-to-tr from-[#2c2c2cf2]  via-[#3a3a3a] to-[#2c2c2cd6] text-white"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}{" "}
        <FiMic className="inline ml-2" />
      </button>
    </div>
  );
}
