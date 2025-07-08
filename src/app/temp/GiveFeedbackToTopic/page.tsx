'use client';

import { useState } from 'react';
import axios from 'axios';

export default function GiveFeedbackToTopic() {
  const [topicId, setTopicId] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmitFeedback = async () => {
    if (!topicId || !note) {
      setMessage('❌ Please enter both topic ID and feedback note.');
      return;
    }

    try {
      const res = await axios.post(`/api/topic/${topicId}`, {
        note,
      });

      if (res.data.success) {
        setMessage('✅ Feedback submitted successfully!');
        setNote('');
      } else {
        setMessage(`❌ ${res.data.message || 'Something went wrong.'}`);
      }
    } catch (error: any) {
      console.error(error);
      setMessage(`❌ ${error?.response?.data?.message || 'Error occurred.'}`);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Submit Feedback to a Topic</h2>

      <input
        type="text"
        placeholder="Enter topic ID"
        value={topicId}
        onChange={(e) => setTopicId(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Write your feedback..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 border rounded"
        rows={4}
      />

      <button
        onClick={handleSubmitFeedback}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Submit Feedback
      </button>

      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}
