
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Cpu, 
  Database, 
  Wifi, 
  RefreshCw, 
  Shield, 
  Terminal,
  Play,
  Zap,
  HardDrive
} from 'lucide-react';
import { analyzeErrorLog } from '../services/geminiService';

interface SystemCheck {
  id: string;
  name: string;
  status: 'pending' | 'healthy' | 'warning' | 'critical';
  message: string;
  icon: React.ElementType;
}

const DiagnosticsPanel = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [overallHealth, setOverallHealth] = useState(100);
  const [checks, setChecks] = useState<SystemCheck[]>([
    { id: 'api', name: 'API Latency', status: 'healthy', message: '45ms response time', icon: Wifi },
    { id: 'db', name: 'Database Integrity', status: 'healthy', message: 'No corruption detected', icon: Database },
    { id: 'cache', name: 'Local Cache', status: 'healthy', message: 'Storage within limits', icon: HardDrive },
    { id: 'security', name: 'SSL/Encryption', status: 'healthy', message: 'AES-256 Active', icon: Shield },
    { id: 'render', name: 'Render Performance', status: 'healthy', message: '60 FPS', icon: Cpu },
  ]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['> System initialized.']);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isFixing, setIsFixing] = useState(false);

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev.slice(-4), `> ${msg}`]);
  };

  const runFullScan = async () => {
    setIsScanning(true);
    setAiAnalysis('');
    setOverallHealth(100);
    addLog('Starting full system diagnostic scan...');

    // Simulate scanning process
    const newChecks = [...checks];
    
    for (let i = 0; i < newChecks.length; i++) {
        await new Promise(r => setTimeout(r, 600)); // Delay for effect
        
        // Simulate a random "issue" for demonstration
        if (Math.random() > 0.7) {
            newChecks[i].status = 'warning';
            newChecks[i].message = 'High latency detected';
            setOverallHealth(prev => prev - 15);
            addLog(`WARNING: Issue detected in ${newChecks[i].name}`);
        } else {
            newChecks[i].status = 'healthy';
            newChecks[i].message = 'Operational';
            addLog(`CHECK: ${newChecks[i].name} passed.`);
        }
        setChecks([...newChecks]);
    }

    setIsScanning(false);
    addLog('Scan complete.');

    // If there are issues, trigger AI analysis
    const issues = newChecks.filter(c => c.status !== 'healthy');
    if (issues.length > 0) {
        addLog('Requesting AI Analysis for detected faults...');
        try {
            const prompt = `System Diagnostic Report: Found issues in ${issues.map(i => i.name).join(', ')}. Suggest a technical fix summary in 1 sentence.`;
            const analysis = await analyzeErrorLog(prompt);
            setAiAnalysis(analysis);
        } catch (e) {
            setAiAnalysis("AI unavailable. Recommended Action: Clear Cache and Restart.");
        }
    }
  };

  const runAutoFix = async () => {
    setIsFixing(true);
    addLog('Initiating Auto-Repair Sequence...');
    
    await new Promise(r => setTimeout(r, 1500));
    
    // Reset all checks to healthy
    const fixedChecks = checks.map(c => ({
        ...c,
        status: 'healthy' as const,
        message: 'Fixed & Optimized'
    }));
    
    setChecks(fixedChecks);
    setOverallHealth(100);
    setAiAnalysis('');
    setIsFixing(false);
    addLog('SUCCESS: All systems repaired and optimized.');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-brand-navy dark:text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-brand-lime" />
                System Diagnostics
            </h2>
            <p className="text-sm text-gray-500">Automated problem detection and self-healing engine.</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={runFullScan}
                disabled={isScanning || isFixing}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-brand-navy dark:text-white font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50"
             >
                {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Run Scan
             </button>
             <button 
                onClick={runAutoFix}
                disabled={isScanning || isFixing || overallHealth === 100}
                className="px-4 py-2 bg-brand-navy text-white font-bold rounded-lg hover:bg-brand-navy/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-navy/20"
             >
                <Zap className="w-4 h-4" />
                Auto-Fix All
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Score Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-lime/10 to-transparent pointer-events-none"></div>
             <div className="relative z-10 text-center">
                 <div className="text-6xl font-black text-brand-navy dark:text-white mb-2 transition-all duration-500">
                     {overallHealth}%
                 </div>
                 <div className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${
                     overallHealth > 80 ? 'bg-green-100 text-green-700' : 
                     overallHealth > 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                 }`}>
                     SYSTEM HEALTH
                 </div>
             </div>
             {/* Circular Progress (Visual only) */}
             <svg className="absolute w-full h-full opacity-10 pointer-events-none transform -rotate-90">
                <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="20" fill="none" className="text-gray-200" />
                <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="20" fill="none" className="text-brand-lime" strokeDasharray="251" strokeDashoffset={251 - (251 * overallHealth) / 100} />
             </svg>
          </div>

          {/* Console / Log */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-4 font-mono text-sm text-green-400 flex flex-col relative overflow-hidden">
             <div className="absolute top-2 right-4 text-xs text-gray-500 flex items-center gap-1">
                 <Terminal className="w-3 h-3" /> TERMINAL
             </div>
             <div className="flex-1 space-y-1 mt-4">
                 {consoleLogs.map((log, i) => (
                     <div key={i} className="animate-fade-in">{log}</div>
                 ))}
                 {(isScanning || isFixing) && <div className="animate-pulse">_</div>}
             </div>
          </div>
      </div>

      {/* AI Analysis Result */}
      {aiAnalysis && (
          <div className="bg-brand-navy/5 dark:bg-brand-lime/10 border border-brand-navy/10 dark:border-brand-lime/20 rounded-xl p-4 flex gap-4 items-start animate-fade-in">
              <div className="p-2 bg-brand-navy dark:bg-brand-lime rounded-lg shrink-0">
                  <Zap className="w-5 h-5 text-white dark:text-brand-navy" />
              </div>
              <div>
                  <h4 className="font-bold text-brand-navy dark:text-white mb-1">AI Solution Suggested</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{aiAnalysis}</p>
              </div>
          </div>
      )}

      {/* Detailed Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checks.map(check => (
              <div key={check.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 flex items-center justify-between group hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${check.status === 'healthy' ? 'bg-gray-100 dark:bg-slate-800 text-gray-500' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                          <check.icon className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{check.name}</h4>
                          <p className={`text-xs ${check.status === 'healthy' ? 'text-green-600' : 'text-red-500 font-bold'}`}>
                              {check.message}
                          </p>
                      </div>
                  </div>
                  <div>
                      {check.status === 'healthy' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                          <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
                      )}
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default DiagnosticsPanel;
