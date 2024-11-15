interface SuggestedQuestionProps {
  question: string;
  onClick: (question: string) => void;
}

export const SuggestedQuestions = ({ question, onClick }: SuggestedQuestionProps) => {
  return (
    <button
      onClick={() => onClick(question)}
      className="px-4 py-2 text-sm text-ipn-primary bg-white rounded-full border border-gray-200 
                 hover:bg-gray-50 transition-colors duration-300 shadow-sm animate-fade-in"
    >
      {question}
    </button>
  );
};