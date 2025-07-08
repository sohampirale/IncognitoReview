'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CreateTopic() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateTopic = async () => {
    try {
      const res = await axios.post('/api/topic', { title });

      if (res.data.success) {
        setMessage('✅ Topic created successfully!');
        setTitle('');
      } else {
        setMessage(`❌ ${res.data.message || 'Something went wrong.'}`);
      }
    } catch (error: any) {
      setMessage(`❌ ${error?.response?.data?.message || 'Error occurred.'}`);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Create a Topic</h2>
      <input
        type="text"
        placeholder="Enter topic title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleCreateTopic}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Create
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}
