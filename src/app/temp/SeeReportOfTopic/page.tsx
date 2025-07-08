'use client';

import { useState } from 'react';
import axios from 'axios';

export default function SeeReportOfTopic() {
  const [topicId, setTopicId] = useState('');
  const [report, setReport] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    setReport(null);
    try {
      const res = await axios.get(`/api/ai/report/topic/${topicId}`);
      setReport(res.data.data); // assuming ApiResponse has `.data`
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Test Topic Report Fetcher</h1>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter Topic ID"
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          className="flex-1 p-2 border rounded-md bg-white text-black"
        />
        <button
          onClick={fetchReport}
          disabled={loading || !topicId}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Report'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {report && (
        <div className="space-y-2">
          <div><strong>Topic ID:</strong> {report.topicId}</div>
          <div><strong>Report ID:</strong> {report._id}</div>
          <div><strong>Rating:</strong> {report.rating}/10</div>
          <div><strong>Positive Feedbacks:</strong> {report.nPositive}</div>
          <div><strong>Negative Feedbacks:</strong> {report.nNegative}</div>
          <div>
            <strong>Suggested Improvements:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              {report.improvements.map((improvement: string, idx: number) => (
                <li key={idx}>{improvement}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
