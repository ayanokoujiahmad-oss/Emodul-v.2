type ChoiceOption = {
  id?: string;
  isCorrect?: boolean;
};

type MultipleChoiceQuestion = {
  id: string;
  type: string;
  options?: ChoiceOption[];
  correctAnswer?: string;
};

export type MultipleChoiceScore = {
  score: number;
  correct: number;
  total: number;
};

export function resolveSelectedOptionIndex(
  answer: unknown,
  options: ChoiceOption[] = [],
): number | null {
  if (typeof answer === 'number' && Number.isFinite(answer)) {
    return answer >= 0 && answer < options.length ? answer : null;
  }

  if (typeof answer !== 'string') return null;
  const numericAnswer = Number(answer);
  if (Number.isInteger(numericAnswer) && numericAnswer >= 0 && numericAnswer < options.length) {
    return numericAnswer;
  }

  const optionIndex = options.findIndex((option) => option.id === answer);
  return optionIndex >= 0 ? optionIndex : null;
}

export function isMultipleChoiceAnswerCorrect(
  question: MultipleChoiceQuestion,
  answer: unknown,
): boolean {
  const options = question.options || [];
  const selectedIndex = resolveSelectedOptionIndex(answer, options);

  if (selectedIndex !== null) {
    const selectedOption = options[selectedIndex];
    return Boolean(
      selectedOption?.isCorrect ||
        (question.correctAnswer && selectedOption?.id === question.correctAnswer),
    );
  }

  if (typeof answer === 'string') {
    const correctOption = options.find((option) => (
      option.isCorrect || option.id === question.correctAnswer
    ));
    return Boolean(correctOption?.id && answer === correctOption.id);
  }

  return false;
}

export function calculateMultipleChoiceScore(
  questions: MultipleChoiceQuestion[] = [],
  answers: Record<string, unknown> = {},
): MultipleChoiceScore {
  const mcQuestions = questions.filter((question) => question.type === 'mc');
  if (mcQuestions.length === 0) {
    return { score: 100, correct: 0, total: 0 };
  }

  const correct = mcQuestions.reduce((total, question) => (
    total + (isMultipleChoiceAnswerCorrect(question, answers[question.id]) ? 1 : 0)
  ), 0);

  return {
    score: Math.round((correct / mcQuestions.length) * 100),
    correct,
    total: mcQuestions.length,
  };
}

export function calculateTopicFinalScore(scores: {
  quizScore: number;
  simulationScore: number;
  activitiesScore?: number;
}): number {
  const parts = [scores.quizScore, scores.simulationScore];
  if ((scores.activitiesScore || 0) > 0) {
    parts.push(scores.activitiesScore || 0);
  }
  return Math.round(parts.reduce((sum, score) => sum + score, 0) / parts.length);
}
