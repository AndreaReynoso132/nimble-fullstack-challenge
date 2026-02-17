import { useJobsBoard } from './hooks/useJobsBoard';
import { JobCard } from './components/JobCard'; 

const MY_EMAIL = 'andreareynoso1003@gmail.com';
const BASE_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net';

function App() {
  const { 
    candidate, loading, filteredJobs, 
    setSearchTerm, currentPage, setCurrentPage, status, setStatus 
  } = useJobsBoard(MY_EMAIL, BASE_URL);

  const jobsPerPage = 6;
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-16 px-6 font-sans text-white/90 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">
              Nimble<span className="text-blue-500">_</span>Gravity
            </h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-[0.3em]">Technical Challenge 2026</p>
          </div>
          
          {candidate && (
            <div className="flex items-center gap-4 bg-[#1a1a1a] border border-white/5 p-3 pr-8 rounded-2xl backdrop-blur-xl shadow-2xl">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-12 h-12 bg-black rounded-full flex items-center justify-center border border-white/10">
                  <span className="text-xl font-black text-white">{candidate.firstName[0]}</span>
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#1a1a1a] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="h-1 w-1 rounded-full bg-white/20"></span>
                  <span className="text-[10px] font-mono text-white/30">ID_{candidate.candidateId.toString().slice(-4)}</span>
                </div>
                <p className="font-bold text-white text-lg tracking-tight leading-tight">
                  {candidate.firstName} {candidate.lastName}
                </p>
              </div>
            </div>
          )}
        </header>

        <div className="mb-12">
          <input 
            type="text"
            placeholder="BUSCAR POSICIÓN..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all font-medium text-lg placeholder:text-white/20 shadow-2xl"
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {status.message && (
          <div className={`fixed bottom-8 right-8 z-50 p-5 rounded-2xl font-bold backdrop-blur-xl border shadow-2xl animate-in slide-in-from-right-10 ${
            status.type === 'success' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400'
          }`}>
            {status.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             [...Array(6)].map((_, i) => (
              <div key={i} className="h-60 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
            ))
          ) : (
            currentJobs.map(job => (
              <JobCard key={job.id} job={job} candidate={candidate} setStatus={setStatus} baseUrl={BASE_URL} />
            ))
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-4">
            <button onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo(0,0); }} disabled={currentPage === 1} className="px-6 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white disabled:opacity-10 transition-all">← Prev</button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo(0,0); }} className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.6)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>{i + 1}</button>
              ))}
            </div>
            <button onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); window.scrollTo(0,0); }} disabled={currentPage === totalPages} className="px-6 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white disabled:opacity-10 transition-all">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;