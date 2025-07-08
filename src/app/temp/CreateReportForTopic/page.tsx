'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CreateReportForTopic() {
  const [topicId, setTopicId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!topicId.trim()) {
      setError('Please enter a topic ID');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await axios.post(`/api/ai/report/topic/cohere/${topicId}`);
      setResult(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Generate Topic Report (Test)</h2>
      <input
        type="text"
        className="w-full p-2 border rounded mb-2"
        placeholder="Enter topicId"
        value={topicId}
        onChange={(e) => setTopicId(e.target.value)}
      />
      <button
        onClick={handleGenerateReport}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Report'}
      </button>

      {result && (
        <pre className="mt-4 bg-gray-100 p-2 rounded text-sm overflow-auto">
          {result}
        </pre>
      )}

      {error && (
        <p className="text-red-600 mt-2 text-sm">{error}</p>
      )}
    </div>
  );
}
