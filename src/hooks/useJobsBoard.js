import { useState, useEffect, useMemo } from 'react';

export function useJobsBoard(email, baseUrl) {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candRes, jobsRes] = await Promise.all([
          fetch(`${baseUrl}/api/candidate/get-by-email?email=${email}`),
          fetch(`${baseUrl}/api/jobs/get-list`)
        ]);

        if (!candRes.ok || !jobsRes.ok) throw new Error('Error en la respuesta del servidor');

        const candData = await candRes.json();
        const jobsData = await jobsRes.json();

        setCandidate(candData);
        setJobs(jobsData);
      } catch {
        setStatus({ message: 'Conexión fallida con la API', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (email && baseUrl) {
      fetchData();
    }
  }, [email, baseUrl]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  return {
    candidate,
    loading,
    filteredJobs,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    status,
    setStatus
  };
}