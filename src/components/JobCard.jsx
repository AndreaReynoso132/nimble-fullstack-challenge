import { useState } from 'react';

export function JobCard({ job, candidate, setStatus, baseUrl }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = repoUrl.toLowerCase().includes('github.com/');

const handleApply = async () => {
  if (!isValid) return;
  
  let sanitizedUrl = repoUrl.trim().replace(/[ ,]+$/, "");
  if (!sanitizedUrl.startsWith('https://')) {
    sanitizedUrl = sanitizedUrl.startsWith('http://') 
      ? sanitizedUrl.replace('http://', 'https://') 
      : 'https://' + sanitizedUrl;
  }

  setSubmitting(true);
  setStatus({ message: '', type: '' });

  try {
    const payload = {
      uuid: String(candidate.uuid),
      jobId: String(job.id),             
      candidateId: String(candidate.candidateId), 
      applicationId: String(candidate.applicationId), 
      repoUrl: sanitizedUrl
    };

    console.log('Enviando:', payload);  

    const res = await fetch(`${baseUrl}/api/candidate/apply-to-job`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok && data.ok) {
      setStatus({ 
        message: `¡Éxito! Postulación enviada para ${job.title}`, 
        type: 'success' 
      });
      setRepoUrl('');
    } else {
      setStatus({ 
        message: data.message || 'Error al enviar postulación', 
        type: 'error' 
      });
    }
  } catch {
    setStatus({ message: 'Error de red', type: 'error' });
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="relative group overflow-hidden bg-[#121212] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-[#181818] hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
      
      <div className="relative flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
            {job.title}
          </h3>
          <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-1 rounded">
            ID_{job.id}
          </span>
        </div>
        
        <div className="space-y-4 mt-auto">
          <input 
            type="text" 
            placeholder="github.com/tu-usuario/repo" 
            value={repoUrl}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-blue-100 placeholder:text-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <button 
            onClick={handleApply}
            disabled={submitting || !isValid}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-blue-600 hover:text-white disabled:bg-white/5 disabled:text-white/20 transition-all duration-300 active:scale-[0.98] shadow-lg"
          >
            {submitting ? 'PROCESANDO...' : 'APLICAR AHORA'}
          </button>
        </div>
      </div>
    </div>
  );
}