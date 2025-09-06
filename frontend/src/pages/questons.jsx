import React from 'react';
import { useLocation, NavLink, useParams } from 'react-router-dom';
import './questionPage.css';

const QuestionsPage = () => {
  const location = useLocation();
  const { id, noteId } = useParams();
  const geminiResponse = location.state?.geminiResponse || [];

  return (
    <div className="questionsContainer">
      <h1>Generated Questions & Answers</h1>
      {geminiResponse.length === 0 ? (
        <p>No questions generated yet.</p>
      ) : (
        geminiResponse.map((item, index) => (
          <div key={index} className="questionItem">
            <h3>Q: {item.question}</h3>
            <p>A: {item.answer}</p>
          </div>
        ))
      )}
      <NavLink to={`/${id}/${noteId}/dashboard/notebody`} className="backBtn">
        ← Back to Notes
      </NavLink>
    </div>
  );
};

export default QuestionsPage;
