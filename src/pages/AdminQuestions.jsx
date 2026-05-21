// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import API from '../utils/api';
// import { toast } from 'react-toastify';
// import AdminSidebar from '../components/AdminSidebar';
// import '../styles/admin-dashboard.css';

// const AdminQuestions = () => {
//   const { admin } = useAuth();
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [topics, setTopics] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [selectedTopic, setSelectedTopic] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     topicId: '',
//     questionText: '',
//     options: ['', '', '', ''],
//     correctAnswer: '',
//     order: ''
//   });

//   useEffect(() => {
//     if (!admin) {
//       navigate('/admin/login');
//       return;
//     }
//     fetchTopics();
//   }, [admin]);

//   const fetchTopics = async () => {
//     try {
//       const { data } = await API.get('/topics/admin/all');
//       setTopics(data);
//     } catch (error) {
//       toast.error('Failed to load topics');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchQuestions = async (topicId) => {
//     try {
//       const { data } = await API.get(`/quiz/${topicId}`);
//       setQuestions(data);
//     } catch (error) {
//       toast.error('Failed to load questions');
//     }
//   };

//   const handleTopicChange = (e) => {
//     const topicId = e.target.value;
//     setSelectedTopic(topicId);
//     setFormData({ ...formData, topicId });
//     if (topicId) fetchQuestions(topicId);
//     else setQuestions([]);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleOptionChange = (index, value) => {
//     const newOptions = [...formData.options];
//     newOptions[index] = value;
//     setFormData({ ...formData, options: newOptions });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.topicId) {
//       toast.error('Please select a topic first');
//       return;
//     }
//     if (!formData.correctAnswer) {
//       toast.error('Please select the correct answer');
//       return;
//     }
//     if (formData.options.some(opt => opt === '')) {
//       toast.error('Please fill in all 4 options');
//       return;
//     }
//     try {
//       await API.post('/quiz/questions/add', formData);
//       toast.success('Question added successfully!');
//       setShowForm(false);
//       setFormData({
//         topicId: selectedTopic,
//         questionText: '',
//         options: ['', '', '', ''],
//         correctAnswer: '',
//         order: ''
//       });
//       fetchQuestions(selectedTopic);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to add question');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this question?')) return;
//     try {
//       await API.delete(`/quiz/questions/${id}`);
//       toast.success('Question deleted!');
//       fetchQuestions(selectedTopic);
//     } catch (error) {
//       toast.error('Failed to delete question');
//     }
//   };

//   return (
//     <div className="admin-page">
//       <nav className="navbar admin-navbar">
//         <div className="navbar-brand">
//           <img src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" style={{
            
          // }} width={50} alt="Crawford University" />
//           <span>Admin Panel</span>
//         </div>
//         <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
//       </nav>

//       <div className="admin-content">
//         <div className="admin-page-header">
//           <h1>Manage Quiz Questions</h1>
//           <button
//             className="btn-primary"
//             style={{ width: 'auto', padding: '10px 20px' }}
//             onClick={() => setShowForm(!showForm)}
//           >
//             {showForm ? 'Cancel' : '+ Add New Question'}
//           </button>
//         </div>

//         <div className="form-group" style={{ maxWidth: '400px', marginBottom: '30px' }}>
//           <label>Select Topic to manage questions</label>
//           <select value={selectedTopic} onChange={handleTopicChange}>
//             <option value="">-- Select a Topic --</option>
//             {topics.map(topic => (
//               <option key={topic._id} value={topic._id}>
//                 {topic.title} ({topic.category})
//               </option>
//             ))}
//           </select>
//         </div>

//         {showForm && (
//           <div className="topic-form">
//             <h2>Add New Question</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label>Question</label>
//                 <textarea
//                   name="questionText"
//                   value={formData.questionText}
//                   onChange={handleChange}
//                   placeholder="Type your question here"
//                   rows="3"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Option A</label>
//                 <input
//                   type="text"
//                   value={formData.options[0]}
//                   onChange={(e) => handleOptionChange(0, e.target.value)}
//                   placeholder="Option A"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Option B</label>
//                 <input
//                   type="text"
//                   value={formData.options[1]}
//                   onChange={(e) => handleOptionChange(1, e.target.value)}
//                   placeholder="Option B"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Option C</label>
//                 <input
//                   type="text"
//                   value={formData.options[2]}
//                   onChange={(e) => handleOptionChange(2, e.target.value)}
//                   placeholder="Option C"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Option D</label>
//                 <input
//                   type="text"
//                   value={formData.options[3]}
//                   onChange={(e) => handleOptionChange(3, e.target.value)}
//                   placeholder="Option D"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Correct Answer</label>
//                 <select
//                   name="correctAnswer"
//                   value={formData.correctAnswer}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">-- Select Correct Answer --</option>
//                   {formData.options.map((opt, index) => (
//                     opt && <option key={index} value={opt}>{opt}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Question Order</label>
//                 <input
//                   type="number"
//                   name="order"
//                   value={formData.order}
//                   onChange={handleChange}
//                   placeholder="e.g. 1, 2, 3"
//                   required
//                 />
//               </div>

//               <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 30px' }}>
//                 Add Question
//               </button>
//             </form>
//           </div>
//         )}

//         {selectedTopic && (
//           <div>
//             <h2 style={{ marginBottom: '15px', color: '#1a3a5c' }}>
//               Questions ({questions.length})
//             </h2>
//             {questions.length === 0 ? (
//               <div className="empty-state">
//                 <h3>No questions yet for this topic</h3>
//                 <p>Click "Add New Question" to add your first question</p>
//               </div>
//             ) : (
//               <div className="topics-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>Question</th>
//                       <th>Options</th>
//                       <th>Correct Answer</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {questions.map((q, index) => (
//                       <tr key={q._id}>
//                         <td>{index + 1}</td>
//                         <td>{q.questionText}</td>
//                         <td>{q.options.join(', ')}</td>
//                         <td style={{ color: '#27ae60', fontWeight: 'bold' }}>{q.correctAnswer}</td>
//                         <td>
//                           <button
//                             onClick={() => handleDelete(q._id)}
//                             className="btn-delete"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminQuestions;



import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
const AdminQuestions = () => {
  
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [formData, setFormData] = useState({
    topicId: '',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    order: ''
  });

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchTopics();
  }, [admin]);

  const fetchTopics = async () => {
    try {
      const { data } = await API.get('/topics/admin/all');
      setTopics(data);
    } catch (error) {
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (topicId) => {
    try {
      const { data } = await API.get(`/quiz/${topicId}`);
      setQuestions(data);
    } catch (error) {
      toast.error('Failed to load questions');
    }
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    setSelectedTopic(topicId);
    setFormData({ ...formData, topicId });
    if (topicId) fetchQuestions(topicId);
    else setQuestions([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.topicId) {
      toast.error('Please select a topic first');
      return;
    }
    if (!formData.correctAnswer) {
      toast.error('Please select the correct answer');
      return;
    }
    if (formData.options.some(opt => opt === '')) {
      toast.error('Please fill in all 4 options');
      return;
    }
    try {
      await API.post('/quiz/questions/add', formData);
      toast.success('Question added successfully!');
      setShowForm(false);
      setFormData({
        topicId: selectedTopic,
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        order: ''
      });
      fetchQuestions(selectedTopic);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add question');
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedTopic) {
      toast.error('Please select a topic first');
      return;
    }
    if (!bulkText.trim()) {
      toast.error('Please paste your questions first');
      return;
    }

    setBulkLoading(true);
    try {
      const lines = bulkText.trim().split('\n').filter(l => l.trim() !== '');
      const parsedQuestions = [];
      let i = 0;
      let order = questions.length + 1;

      while (i < lines.length) {
        const questionText = lines[i]?.trim();
        if (!questionText) { i++; continue; }

        const optionA = lines[i + 1]?.trim();
        const optionB = lines[i + 2]?.trim();
        const optionC = lines[i + 3]?.trim();
        const optionD = lines[i + 4]?.trim();
        const correctLine = lines[i + 5]?.trim();

        if (!optionA || !optionB || !optionC || !optionD || !correctLine) {
          i++;
          continue;
        }

        const correctAnswer = correctLine.replace(/^(Answer|Correct|ANSWER|CORRECT):\s*/i, '').trim();

        parsedQuestions.push({
          topicId: selectedTopic,
          questionText,
          options: [optionA, optionB, optionC, optionD],
          correctAnswer,
          order: order++
        });

        i += 6;
      }

      if (parsedQuestions.length === 0) {
        toast.error('No valid questions found. Please check the format.');
        setBulkLoading(false);
        return;
      }

      // Add questions one by one
      for (const q of parsedQuestions) {
        await API.post('/quiz/questions/add', q);
      }

      toast.success(`${parsedQuestions.length} questions uploaded successfully!`);
      setBulkText('');
      setShowBulk(false);
      fetchQuestions(selectedTopic);
    } catch (error) {
      toast.error('Failed to upload questions');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await API.delete(`/quiz/questions/${id}`);
      toast.success('Question deleted!');
      fetchQuestions(selectedTopic);
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      
      <div className="admin-dashboard-main">
        <nav className="navbar admin-navbar">
          <div className="navbar-left">
           
            <div className="navbar-brand">
              <img src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" style={{
                
              }} width={50} alt="Crawford University" />
              <span>Admin Panel</span>
            </div>
          </div>
          <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
        </nav>

        <div className="admin-content">
        <div className="admin-page-header">
          <h1>Manage Quiz Questions</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-secondary"
              style={{ width: 'auto', padding: '10px 20px' }}
              onClick={() => { setShowBulk(!showBulk); setShowForm(false); }}
            >
              {showBulk ? 'Cancel' : '📋 Bulk Upload'}
            </button>
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '10px 20px' }}
              onClick={() => { setShowForm(!showForm); setShowBulk(false); }}
            >
              {showForm ? 'Cancel' : '+ Add Question'}
            </button>
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: '400px', marginBottom: '30px' }}>
          <label>Select Topic to manage questions</label>
          <select value={selectedTopic} onChange={handleTopicChange}>
            <option value="">-- Select a Topic --</option>
            {topics.map(topic => (
              <option key={topic._id} value={topic._id}>
                {topic.title} ({topic.category})
              </option>
            ))}
          </select>
        </div>

        {/* BULK UPLOAD SECTION */}
        {showBulk && (
          <div className="topic-form">
            <h2>📋 Bulk Upload Questions</h2>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              Paste your questions in this format — each question takes 6 lines:
            </p>
            <div style={{
              background: '#f5f6fa', padding: '15px',
              borderRadius: '8px', marginBottom: '20px',
              fontFamily: 'monospace', fontSize: '13px',
              lineHeight: '1.8', color: '#444'
            }}>
              <strong>Format:</strong><br />
              What is the question?<br />
              Option A text<br />
              Option B text<br />
              Option C text<br />
              Option D text<br />
              Answer: Option A text<br />
              <br />
              What is the next question?<br />
              Option A text<br />
              ...and so on
            </div>
            <div className="form-group">
              <label>Paste your questions here</label>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`What is the name of Crawford University's location?\nLagos\nIgbesa\nAbuja\nIbadan\nAnswer: Igbesa\n\nWhat does SRC stand for?\nStudent Recreation Council\nStudent Representative Council\nStudent Regulatory Committee\nStudent Resource Center\nAnswer: Student Representative Council`}
                rows="15"
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />
            </div>
            <button
              onClick={handleBulkUpload}
              className="btn-primary"
              style={{ width: 'auto', padding: '12px 30px' }}
              disabled={bulkLoading}
            >
              {bulkLoading ? 'Uploading...' : '📋 Upload All Questions'}
            </button>
          </div>
        )}

        {/* SINGLE QUESTION FORM */}
        {showForm && (
          <div className="topic-form">
            <h2>Add New Question</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Question</label>
                <textarea
                  name="questionText"
                  value={formData.questionText}
                  onChange={handleChange}
                  placeholder="Type your question here"
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Option A</label>
                <input type="text" value={formData.options[0]}
                  onChange={(e) => handleOptionChange(0, e.target.value)}
                  placeholder="Option A" required />
              </div>
              <div className="form-group">
                <label>Option B</label>
                <input type="text" value={formData.options[1]}
                  onChange={(e) => handleOptionChange(1, e.target.value)}
                  placeholder="Option B" required />
              </div>
              <div className="form-group">
                <label>Option C</label>
                <input type="text" value={formData.options[2]}
                  onChange={(e) => handleOptionChange(2, e.target.value)}
                  placeholder="Option C" required />
              </div>
              <div className="form-group">
                <label>Option D</label>
                <input type="text" value={formData.options[3]}
                  onChange={(e) => handleOptionChange(3, e.target.value)}
                  placeholder="Option D" required />
              </div>
              <div className="form-group">
                <label>Correct Answer</label>
                <select name="correctAnswer" value={formData.correctAnswer}
                  onChange={handleChange} required>
                  <option value="">-- Select Correct Answer --</option>
                  {formData.options.map((opt, index) => (
                    opt && <option key={index} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Question Order</label>
                <input type="number" name="order" value={formData.order}
                  onChange={handleChange} placeholder="e.g. 1, 2, 3" required />
              </div>
              <button type="submit" className="btn-primary"
                style={{ width: 'auto', padding: '12px 30px' }}>
                Add Question
              </button>
            </form>
          </div>
        )}

        {/* QUESTIONS LIST */}
        {selectedTopic && (
          <div>
            <h2 style={{ marginBottom: '15px', color: '#1a3a5c' }}>
              Questions ({questions.length})
            </h2>
            {questions.length === 0 ? (
              <div className="empty-state">
                <h3>No questions yet for this topic</h3>
                <p>Click "Add Question" or "Bulk Upload" to add questions</p>
              </div>
            ) : (
              <div className="topics-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Question</th>
                      <th>Options</th>
                      <th>Correct Answer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, index) => (
                      <tr key={q._id}>
                        <td>{index + 1}</td>
                        <td>{q.questionText}</td>
                        <td style={{ fontSize: '12px' }}>{q.options.join(' | ')}</td>
                        <td style={{ color: '#27ae60', fontWeight: 'bold' }}>{q.correctAnswer}</td>
                        <td>
                          <button onClick={() => handleDelete(q._id)} className="btn-delete">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default AdminQuestions;