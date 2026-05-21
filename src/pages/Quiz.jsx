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


import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';

const Quiz = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const timerRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchQuestions();
  }, [id]);

  useEffect(() => {
    if (questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            toast.warning('Time is up! Quiz is being submitted automatically.');
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [questions]);

  const fetchQuestions = async () => {
    try {
      const { data } = await API.get(`/quiz/${id}`);
      setQuestions(data);
      setAnswers(new Array(data.length).fill(''));
    } catch (error) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && answers.includes('')) {
      toast.error('Please answer all questions before submitting');
      return;
    }
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const finalAnswers = answers.map(a => a === '' ? 'No Answer' : a);
      const { data } = await API.post(`/quiz/${id}/submit`, { answers: finalAnswers });
      toast.success('Quiz submitted successfully!');
      navigate(`/quiz/${id}/result`, { state: { result: data } });
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading quiz...</div>;
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
              {submitting ? 'Submitting...' : 'Submit Quiz'}
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