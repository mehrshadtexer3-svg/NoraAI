import React, { useState } from 'react';
import { generateTradingQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Trophy, CheckCircle, XCircle, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

const TOPICS = ["Technical Analysis", "Risk Management", "Candlestick Patterns", "Market Psychology", "Indicators"];

const QuizMode: React.FC = () => {
  const [state, setState] = useState<'SETUP' | 'LOADING' | 'QUIZ' | 'RESULTS'>('SETUP');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); // stores index of selected answer
  const [score, setScore] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Pro'>('Beginner');

  const startQuiz = async () => {
    setState('LOADING');
    const q = await generateTradingQuiz(selectedTopic, difficulty);
    if (q && q.length > 0) {
      setQuestions(q);
      setAnswers(new Array(q.length).fill(-1));
      setCurrentQuestionIndex(0);
      setScore(0);
      setState('QUIZ');
    } else {
      // Handle error gracefully-ish
      setState('SETUP');
      alert("Failed to generate quiz. Please check API connection.");
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let s = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) s++;
    });
    setScore(s);
    setState('RESULTS');
  };

  const reset = () => {
    setState('SETUP');
  };

  if (state === 'SETUP') {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Training Zone</h2>
            <p className="text-slate-400">Test your market knowledge against our AI.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Topic</label>
              <div className="grid grid-cols-2 gap-2">
                {TOPICS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTopic(t)}
                    className={`p-3 rounded-lg text-sm border transition-colors ${
                      selectedTopic === t 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
              <div className="flex gap-4">
                {(['Beginner', 'Pro'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 p-3 rounded-lg text-sm border font-bold transition-colors ${
                      difficulty === d 
                      ? 'bg-emerald-600 border-emerald-500 text-white' 
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {d} Trader
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95"
            >
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'LOADING') {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-xl text-slate-300 font-medium">AI is generating your exam...</p>
      </div>
    );
  }

  if (state === 'RESULTS') {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400 mb-4">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <p className="text-slate-400">You scored {score} out of {questions.length}</p>
          <button onClick={reset} className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
            Try Another
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex gap-3 mb-3">
                {answers[idx] === q.correctAnswerIndex ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-white">{q.question}</h3>
                  <p className="text-sm text-slate-400 mt-1">{q.explanation}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 pl-9">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className={`text-sm p-2 rounded ${
                    optIdx === q.correctAnswerIndex ? 'bg-green-500/20 text-green-300' :
                    (answers[idx] === optIdx && answers[idx] !== q.correctAnswerIndex) ? 'bg-red-500/20 text-red-300' : 'text-slate-500'
                  }`}>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const hasAnsweredCurrent = answers[currentQuestionIndex] !== -1;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <span className="text-slate-400 font-mono text-sm">Question {currentQuestionIndex + 1}/{questions.length}</span>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
          {difficulty} Level
        </span>
      </div>

      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-lg min-h-[400px] flex flex-col">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-8">{currentQ.question}</h3>

        <div className="space-y-3 flex-1">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={hasAnsweredCurrent}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                answers[currentQuestionIndex] === idx
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700'
              } ${hasAnsweredCurrent && idx !== answers[currentQuestionIndex] ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs mr-3 opacity-70">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </div>
            </button>
          ))}
        </div>

        {hasAnsweredCurrent && (
          <div className="mt-8 pt-6 border-t border-slate-700 animate-fade-in">
             <div className="flex justify-end">
                <button 
                  onClick={nextQuestion}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <ChevronRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
