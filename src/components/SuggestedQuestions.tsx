interface SuggestedQuestionProps {
  question: string;
  onClick: (question: string) => void;
}

export const SuggestedQuestions = ({ question, onClick }: SuggestedQuestionProps) => {
  return (
    <button
      onClick={() => onClick(question)}
      className="px-4 py-2 text-sm text-ipn-primary dark:text-white bg-white dark:bg-gray-700 
                 rounded-full border border-gray-200 dark:border-gray-600 
                 hover:bg-gray-50 dark:hover:bg-gray-600 
                 transition-all duration-300 shadow-sm animate-fade-in"
    >
      {question}
    </button>
  );
};