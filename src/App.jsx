import React, { useEffect, useState } from 'react';
import { api } from './api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  LayoutDashboard, UserCheck, GraduationCap, Calendar, Settings, 
  Search, Bell, FileText, TrendingUp, AlertCircle, CheckCircle2, RefreshCw, Eye, ShieldAlert, Zap 
} from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [atRisk, setAtRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedStudentReport, setSelectedStudentReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const syncEcosystemMetrics = async () => {
    try {
      const [allStudents, topData, riskData] = await Promise.all([
        api.getStudents(),
        api.getTopPerformers(),
        api.getAtRiskStudents()
      ]);
      setStudents(allStudents || []);
      setTopPerformers(topData || []);
      setAtRisk(riskData || []);
    } catch (err) {
      console.error("Ecosystem data coupling failed: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncEcosystemMetrics();
  }, []);

  const handleCompileReport = async (studentId) => {
    try {
      const report = await api.getStudentReport(studentId);
      if (report) {
        setSelectedStudentReport({
          name: report.full_name || report.name,
          department: report.department,
          gpa: report.cgpa || report.gpa,
          risk_score: report.risk_score || (report.cgpa < 3.0 ? 80 : 25)
        });
      } else {
        // Safe UI mapping fallback if direct reporting engine endpoint is empty
        const fallbackStudent = students.find(s => s.id === studentId);
        if (fallbackStudent) {
          setSelectedStudentReport({
            name: fallbackStudent.name,
            department: fallbackStudent.department,
            gpa: fallbackStudent.gpa,
            risk_score: fallbackStudent.gpa < 3.0 ? 85 : 15
          });
        }
      }
    } catch (err) {
      console.error("Report extraction failed:", err);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const timelineTrend = [
    { name: 'Sep', Current: 3.2, Previous: 3.0 },
    { name: 'Oct', Current: 3.5, Previous: 3.1 },
    { name: 'Nov', Current: 3.3, Previous: 3.4 },
    { name: 'Dec', Current: 3.4, Previous: 3.2 },
    { name: 'Jan', Current: 3.6, Previous: 3.3 },
    { name: 'Feb', Current: 3.84, Previous: 3.4 },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0d14]">
        <div className="text-[#3b82f6] text-xs font-bold tracking-widest animate-pulse uppercase">
          Mapping Layered Python Modules...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0b0d14] text-slate-200 antialiased">
      
      {/* ── LEFT SIDEBAR PANEL ── */}
      <aside className="w-64 bg-[#111420] border-r border-[#1e2330] flex flex-col justify-between p-5 hidden md:flex shrink-0">
        <div>
          <div className="flex items-center gap-2.5 px-2 py-3 mb-8">
            <div className="bg-[#2563eb] text-white p-2 rounded-lg shadow-lg shadow-blue-500/10">
              <GraduationCap size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">EduAnalytics</h2>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { name: 'Overview', icon: <LayoutDashboard size={18} /> },
              { name: 'Individual Progress', icon: <UserCheck size={18} /> },
              { name: 'Subject Performance', icon: <GraduationCap size={18} /> },
              { name: 'Attendance', icon: <Calendar size={18} /> },
              { name: 'Settings', icon: <Settings size={18} /> },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === item.name
                    ? 'bg-[#1d4ed8] text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-[#161a2b] hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={syncEcosystemMetrics}
          className="w-full bg-[#1e2538] hover:bg-[#252e47] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all border border-[#2b3550] flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} /> Sync DB Roster
        </button>
      </aside>

      {/* ── MAIN WORKSPACE MATRIX ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP HEADER */}
        <header className="h-16 border-b border-[#1e2330] bg-[#111420]/50 backdrop-blur-md px-6 flex items-center justify-between gap-4 shrink-0 sticky top-0 z-10">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search synchronized relational tables..." 
              className="w-full bg-[#151926] border border-[#22293d] rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pl-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="Profile" 
                className="w-8 h-8 rounded-xl object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-tight">Sarah Jenkins</p>
                <p className="text-[10px] text-slate-500 font-medium">Chief Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE COMPONENT VIEW CONTROLLER */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* TAB 1: OVERVIEW PAGE */}
          {activeTab === 'Overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl relative overflow-hidden">
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-[11px] font-bold tracking-wider uppercase">Average GPA</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <TrendingUp size={10} /> +0.15
                    </span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">3.84</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">System Classification Mode</p>
                </div>

                <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl">
                  <div className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">Active Dataset Count</div>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">{students.length}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Records loaded from repository</p>
                </div>

                <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl">
                  <div className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">High Performers Tier</div>
                  <h3 className="text-3xl font-extrabold text-blue-400 tracking-tight mt-3">{topPerformers.length}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Evaluated via top-performers.py</p>
                </div>

                <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl">
                  <div className="text-rose-400 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <AlertCircle size={12} /> Risk Calculator Alerts
                  </div>
                  <h3 className="text-3xl font-extrabold text-rose-500 tracking-tight mt-3">{atRisk.length}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Flagged via at-risk.py</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl lg:col-span-2">
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-white">Academic Progression Profile</h4>
                    <p className="text-[11px] text-slate-500">Aggregated tracking distribution history</p>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#161b2c" vertical={false} />
                        <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                        <YAxis stroke="#475569" fontSize={11} domain={[2.5, 4.0]} />
                        <Tooltip contentStyle={{ backgroundColor: '#151926', borderColor: '#22293d', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="Current" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCurrent)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-rose-400 tracking-wider uppercase mb-4 flex items-center gap-1.5">
                      <AlertCircle size={14} /> Risk Watchlist Live Stream
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {atRisk.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-xs">No students flagged inside target limits.</div>
                      ) : (
                        atRisk.map((student, idx) => (
                          <div key={idx} className="p-3 bg-[#151926] border border-rose-500/10 rounded-xl flex items-center justify-between">
                            <div>
                              <h5 className="text-xs font-bold text-slate-200">{student.name}</h5>
                              <p className="text-[10px] text-slate-500 mt-0.5">{student.department || 'CSE'}</p>
                            </div>
                            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                              GPA: {student.gpa?.toFixed(2)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#1e2330] text-[11px] text-slate-500">
                    Live connection via database repository.
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: SEPARATE INDIVIDUAL PROGRESS PAGE */}
          {activeTab === 'Individual Progress' && (
            <div className="bg-[#111420] border border-[#1e2330] rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[#1e2330]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Student Profile Catalog Engine</h3>
                <p className="text-xs text-slate-500 mt-1">Compile deep analytical diagnostic layers for any active data record row.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1e2330] text-[11px] text-slate-500 uppercase tracking-wider bg-[#151926]/40">
                      <th className="p-4 pl-6">Student Identity</th>
                      <th className="p-4">Department Track</th>
                      <th className="p-4 text-right pr-6">Action Diagnostic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2330] text-xs">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-8 text-center text-slate-500">No matching student profiles found.</td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-[#151926]/30 transition-colors">
                          <td className="p-4 pl-6 font-bold text-white">{student.name}</td>
                          <td className="p-4 text-slate-400">{student.department || 'General Track'}</td>
                          <td className="p-4 text-right pr-6">
                            <button 
                              onClick={() => handleCompileReport(student.id)}
                              className="inline-flex items-center gap-1.5 text-[11px] bg-[#1e2538] hover:bg-blue-600 font-bold px-3 py-1.5 rounded-xl border border-[#2d3752] text-white transition-all shadow"
                            >
                              <Eye size={12}/> Compile Report
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SEPARATE SUBJECT PERFORMANCE PAGE */}
          {activeTab === 'Subject Performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-[#111420] border border-[#1e2330] p-6 rounded-2xl lg:col-span-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Performance Classification Matrix</h3>
                <p className="text-xs text-slate-500 mb-6">Visual metric tracking distributed from `app/analytics/top-performers.py` pipelines.</p>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topPerformers.length ? topPerformers : [{ name: 'Empty Set', gpa: 0 }]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#161b2c" vertical={false} />
                      <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                      <YAxis stroke="#475569" fontSize={11} domain={[0, 4.0]} />
                      <Tooltip contentStyle={{ backgroundColor: '#151926', borderColor: '#22293d' }} />
                      <Bar dataKey="gpa" fill="#2563eb" radius={[6, 6, 0, 0]} name="Academic Score Index (GPA)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">High Performance Registry</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {topPerformers.map((student, idx) => (
                      <div key={idx} className="p-3 bg-[#151926] border border-blue-500/10 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{student.name}</span>
                        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded">
                          {student.gpa?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEPARATE ATTENDANCE & RISK PARAMETERS PAGE */}
          {activeTab === 'Attendance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShieldAlert size={16} /> Risk Calculator Tracker (`at_risk.py`)
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {atRisk.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No structural safety limits flagged.</p>
                  ) : (
                    atRisk.map((student, idx) => (
                      <div key={idx} className="p-3 bg-rose-950/10 border border-rose-500/20 rounded-xl flex justify-between items-center">
                        <div>
                          <h5 className="text-xs font-bold text-slate-200">{student.name}</h5>
                          <p className="text-[10px] text-slate-500">{student.department || 'General Branch'}</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Critical Attention</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap size={16} /> Engagement & Attendance Vector Indexes (`engagement.py`)
                </h4>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {students.map((student, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{student.name}</span>
                        <span className="text-emerald-400 font-mono font-bold">{student.attendance || 85}%</span>
                      </div>
                      <div className="w-full bg-[#1e2538] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${student.attendance || 85}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS PAGE */}
          {activeTab === 'Settings' && (
            <div className="bg-[#111420] border border-[#1e2330] p-6 rounded-2xl max-w-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Workspace Architecture Parameters</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">Core cross-origin routing clusters linked directly into your Neon cloud infrastructure instances.</p>
              <div className="p-4 bg-[#151926] rounded-xl font-mono text-[11px] text-blue-400 space-y-1 border border-[#22293d]">
                <p>── Connection Layer: Active</p>
                <p>── Module Handshake Engine: Verified</p>
                <p>── Target Store Synchronizer: Neon PostgreSQL Cloud</p>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── MODAL DRAWER OVERLAY ── */}
      {selectedStudentReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111420] border border-[#22293d] p-6 rounded-3xl max-w-md w-full shadow-2xl relative">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <FileText size={18} />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Compiled Profile Diagnostic</h3>
            </div>
            
            <div className="bg-[#151926] p-4 rounded-xl space-y-2.5 border border-[#1e2330] font-mono text-xs mt-4 text-slate-300">
              <p><span className="text-slate-500">Profile Name :</span> <span className="text-white font-bold">{selectedStudentReport.name}</span></p>
              <p><span className="text-slate-500">Department   :</span> {selectedStudentReport.department || 'General track'}</p>
              <p><span className="text-slate-500">Assigned GPA :</span> <span className="text-blue-400 font-bold">{selectedStudentReport.gpa?.toFixed(2)}</span></p>
              <p><span className="text-slate-500">Risk Matrix  :</span> <span className={selectedStudentReport.risk_score > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{selectedStudentReport.risk_score}% Severity</span></p>
            </div>

            <button 
              onClick={() => setSelectedStudentReport(null)}
              className="w-full mt-6 bg-[#1e2538] hover:bg-rose-600 border border-[#2d3752] text-white text-xs font-bold py-3 rounded-xl transition-all"
            >
              Dismiss Diagnostic Layer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
