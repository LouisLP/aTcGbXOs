import { useState } from "react";

interface CommentFormProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

export const CommentForm = ({
  onSubmit,
  placeholder = "Write a comment...",
  buttonText = "Add Comment",
  className = "",
}: CommentFormProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={3}
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {buttonText}
      </button>
    </form>
  );
};
