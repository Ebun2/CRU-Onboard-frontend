import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';

const QuizResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const result = state?.result;

  if (!result) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="result-page">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" style={{
            
          }} width={50} alt="Crawford University" />
          <span>CRU Onboard</span>
        </div>
      </nav>

      <div className="result-container">
        <div className={`result-card ${result.passed ? 'passed' : 'failed'}`}>
          <div className="result-icon">
            {result.passed ? '🎉' : '📚'}
          </div>
          <h1>{result.passed ? 'Congratulations!' : 'You Did Not Pass'}</h1>
          <p className="result-message">
            {result.passed
              ? 'You have successfully passed this quiz!'
              : `You need at least 90% to pass. Please review the topic and retake the quiz.`}
          </p>

          <div className="result-stats">
            <div className="stat">
              <span className="stat-value">{result.score}</span>
              <span className="stat-label">Correct Answers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{result.totalQuestions}</span>
              <span className="stat-label">Total Questions</span>
            </div>
            <div className="stat">
              <span className="stat-value">{result.percentage}%</span>
              <span className="stat-label">Your Score</span>
            </div>
          </div>

          <div className="result-actions">
            <Link to="/dashboard" className="btn-primary">
              Back to Dashboard
            </Link>
            {!result.passed && (
              <>
                <Link to={`/topics/${id}`} className="btn-secondary">
                  Review Topic
                </Link>
                <Link to={`/quiz/${id}`} className="btn-secondary">
                  Retake Quiz
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;