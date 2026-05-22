// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import API from '../utils/api';
// import { toast } from 'react-toastify';

// const Quiz = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState(0);

//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }
//     fetchQuestions();
//   }, [id]);

//   const fetchQuestions = async () => {
//     try {
//       const { data } = await API.get(`/quiz/${id}`);
//       setQuestions(data);
//       setAnswers(new Array(data.length).fill(''));
//     } catch (error) {
//       toast.error('Failed to load questions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAnswer = (answer) => {
//     const newAnswers = [...answers];
//     newAnswers[currentQuestion] = answer;
//     setAnswers(newAnswers);
//   };

//   const handleNext = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     if (answers.includes('')) {
//       toast.error('Please answer all questions before submitting');
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const { data } = await API.post(`/quiz/${id}/submit`, { answers });
//       toast.success('Quiz submitted successfully!');
//       navigate(`/quiz/${id}/result`, { state: { result: data } });
//     } catch (error) {
//       toast.error('Failed to submit quiz');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="loading">Loading quiz...</div>;
//   if (questions.length === 0) return (
//     <div className="loading">
//       <h3>No questions available for this topic yet</h3>
//       <button onClick={() => navigate('/dashboard')} className="btn-primary">
//         Back to Dashboard
//       </button>
//     </div>
//   );

//   const question = questions[currentQuestion];

//   return (
//     <div className="quiz-page">
//       <nav className="navbar">
//         <div className="navbar-brand">
//           <img src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" style={{
            
          // }} width={50} alt="Crawford University" />
//           <span>CRU Onboard</span>
//         </div>
//       </nav>

//       <div className="quiz-container">
//         <div className="quiz-progress">
//           <span>Question {currentQuestion + 1} of {questions.length}</span>
//           <div className="progress-bar">
//             <div
//               className="progress-fill"
//               style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
//             ></div>
//           </div>
//         </div>

//         <div className="question-card">
//           <h2>{question.questionText}</h2>
//           <div className="options">
//             {question.options.map((option, index) => (
//               <button
//                 key={index}
//                 className={`option-btn ${answers[currentQuestion] === option ? 'selected' : ''}`}
//                 onClick={() => handleAnswer(option)}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="quiz-actions">
//           <button
//             onClick={handlePrev}
//             disabled={currentQuestion === 0}
//             className="btn-secondary"
//           >
//             ← Previous
//           </button>

//           {currentQuestion === questions.length - 1 ? (
//             <button
//               onClick={handleSubmit}
//               disabled={submitting}
//               className="btn-primary"
//             >
//               {submitting ? 'Submitting...' : 'Submit Quiz'}
//             </button>
//           ) : (
//             <button onClick={handleNext} className="btn-primary">
//               Next →
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Quiz;


import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import Loader, { ButtonLoader } from '../components/Loader';

const QUIZ_DURATION_SECONDS = 15 * 60;

const Quiz = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const timerRef = useRef(null);
  const answersRef = useRef([]);
  const submittingRef = useRef(false);

  const userId = user?._id || user?.id;
  const storageKey = userId ? `cru-quiz-session:${userId}:${id}` : null;

  const getSavedSession = useCallback(() => {
    if (!storageKey) return null;
    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch {
      localStorage.removeItem(storageKey);
      return null;
    }
  }, [storageKey]);

  const getTimeLeftFromSession = useCallback((session) => {
    if (!session?.startedAt) return QUIZ_DURATION_SECONDS;
    const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
    return Math.max(QUIZ_DURATION_SECONDS - elapsed, 0);
  }, []);

  const fetchQuestions = useCallback(async () => {
    try {
      const { data } = await API.get(`/quiz/${id}`);
      const savedSession = getSavedSession();
      const savedAnswers = Array.isArray(savedSession?.answers) && savedSession.answers.length === data.length
        ? savedSession.answers
        : new Array(data.length).fill('');
      const savedQuestion = Number.isInteger(savedSession?.currentQuestion)
        ? Math.min(Math.max(savedSession.currentQuestion, 0), Math.max(data.length - 1, 0))
        : 0;
      const startedAt = savedSession?.startedAt || Date.now();
      const restoredSession = {
        startedAt,
        answers: savedAnswers,
        currentQuestion: savedQuestion,
        updatedAt: Date.now()
      };

      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(restoredSession));
      }

      setQuestions(data);
      setAnswers(savedAnswers);
      setCurrentQuestion(savedQuestion);
      setTimeLeft(getTimeLeftFromSession(restoredSession));
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [id, storageKey, getSavedSession, getTimeLeftFromSession]);

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    const currentAnswers = answersRef.current;

    if (!autoSubmit && currentAnswers.includes('')) {
      toast.error('Please answer all questions before submitting');
      return;
    }
    clearInterval(timerRef.current);
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const finalAnswers = currentAnswers.map(a => a === '' ? 'No Answer' : a);
      const { data } = await API.post(`/quiz/${id}/submit`, { answers: finalAnswers });
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
      toast.success(autoSubmit ? 'Time is up! Your quiz has been scored.' : 'Quiz submitted successfully!');
      navigate(`/quiz/${id}/result`, {
        state: {
          result: {
            ...data,
            timedOut: autoSubmit
          }
        }
      });
    } catch {
      toast.error('Failed to submit quiz');
      submittingRef.current = false;
    } finally {
      if (!submittingRef.current) {
        setSubmitting(false);
      }
    }
  }, [id, navigate, storageKey]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchQuestions();
  }, [user, navigate, fetchQuestions]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (!storageKey || questions.length === 0 || submitting) return;
    const savedSession = getSavedSession();
    const session = savedSession?.startedAt ? savedSession : {
      startedAt: Date.now(),
      answers,
      currentQuestion
    };

    localStorage.setItem(storageKey, JSON.stringify({
      ...session,
      answers,
      currentQuestion,
      updatedAt: Date.now()
    }));
  }, [answers, currentQuestion, questions.length, storageKey, submitting, getSavedSession]);

  useEffect(() => {
    if (!storageKey || questions.length === 0) return;

    const tick = () => {
      const session = getSavedSession();
      const nextTimeLeft = getTimeLeftFromSession(session);
      setTimeLeft(nextTimeLeft);

      if (nextTimeLeft <= 0 && !submittingRef.current) {
        clearInterval(timerRef.current);
        toast.warning('Time is up! Quiz is being submitted automatically.');
        handleSubmit(true);
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [questions.length, storageKey, getSavedSession, getTimeLeftFromSession, handleSubmit]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 10 * 60) return '#27ae60';
    if (timeLeft > 5 * 60) return '#f39c12';
    return '#e74c3c';
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    answersRef.current = newAnswers;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) return <Loader message="Preparing your quiz..." />;
  if (questions.length === 0) return (
    <div className="loading">
      <h3>No questions available for this topic yet</h3>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">
        Back to Dashboard
      </button>
    </div>
  );

  const question = questions[currentQuestion];
  const answeredCount = answers.filter(a => a !== '').length;

  return (
    <div className="quiz-page">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" style={{
            
          }} width={50} alt="Crawford University" />
          <span>CRU Onboard</span>
        </div>
        <div style={{
          background: getTimerColor(),
          color: 'white',
          padding: '5px 15px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '17px',
          fontFamily: 'monospace'
        }}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </nav>

      <div className="quiz-container">
        <div className="quiz-progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span style={{ color: '#27ae60' }}>{answeredCount}/{questions.length} answered</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question navigator */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px',
          marginBottom: '20px', background: 'white',
          padding: '15px', borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              style={{
                width: '36px', height: '36px',
                borderRadius: '50%', border: 'none',
                cursor: 'pointer', fontWeight: 'bold',
                fontSize: '13px',
                background: answers[index] !== ''
                  ? '#1a3a5c'
                  : index === currentQuestion
                    ? '#2e86de'
                    : '#f0f0f0',
                color: answers[index] !== '' || index === currentQuestion ? 'white' : '#333'
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="question-card">
          <h2>{question.questionText}</h2>
          <div className="options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${answers[currentQuestion] === option ? 'selected' : ''}`}
                onClick={() => handleAnswer(option)}
              >
                <span style={{
                  display: 'inline-block', width: '24px', height: '24px',
                  borderRadius: '50%', background: answers[currentQuestion] === option ? 'rgba(255,255,255,0.3)' : '#e0e0e0',
                  textAlign: 'center', lineHeight: '24px', marginRight: '10px',
                  fontSize: '12px', fontWeight: 'bold'
                }}>
                  {['A', 'B', 'C', 'D'][index]}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-actions">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="btn-secondary"
          >
            ← Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? <ButtonLoader label="Submitting..." /> : 'Submit Quiz'}
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary">
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
