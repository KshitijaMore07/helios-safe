import React, { useState, useEffect } from 'react';
import { analyzeTemperature, checkEmergency } from './services/api';
import './App.css';

const dangerConfig = {
  SAFE: { color: '#00E676', bg: 'rgba(0,230,118,0.08)', label: 'SAFE', emoji: '✅' },
  CAUTION: { color: '#FFCA28', bg: 'rgba(255,202,40,0.08)', label: 'CAUTION', emoji: '⚠️' },
  EXTREME_CAUTION: { color: '#FF9800', bg: 'rgba(255,152,0,0.08)', label: 'EXTREME CAUTION', emoji: '🟠' },
  DANGER: { color: '#FF5722', bg: 'rgba(255,87,34,0.08)', label: 'DANGER', emoji: '🔴' },
  EXTREME_DANGER: { color: '#FF2D2D', bg: 'rgba(255,45,45,0.1)', label: 'EXTREME DANGER', emoji: '🚨' },
};

function calcFeelsLike(temp, humidity) {
  const tempF = (temp * 9.0 / 5.0) + 32;
  if (tempF < 80) return temp;
  const hi = -42.379 + 2.04901523 * tempF + 10.14333127 * humidity
    - 0.22475541 * tempF * humidity - 0.00683783 * tempF * tempF
    - 0.05481717 * humidity * humidity + 0.00122874 * tempF * tempF * humidity
    + 0.00085282 * tempF * humidity * humidity
    - 0.00000199 * tempF * tempF * humidity * humidity;
  return Math.round(((hi - 32) * 5.0 / 9.0) * 10) / 10;
}

function getDangerLevel(feelsLike) {
  if (feelsLike < 27) return 'SAFE';
  if (feelsLike < 32) return 'CAUTION';
  if (feelsLike < 41) return 'EXTREME_CAUTION';
  if (feelsLike < 54) return 'DANGER';
  return 'EXTREME_DANGER';
}

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [temperature, setTemperature] = useState(38);
  const [humidity, setHumidity] = useState(55);
  const [location, setLocation] = useState('My Location');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [emergencyResult, setEmergencyResult] = useState(null);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeTemperature(temperature, humidity, location);
      setResult(data);
      setHistory(h => [{ ...data, time: new Date().toLocaleTimeString() }, ...h.slice(0, 4)]);
    } catch (e) {
      const feelsLike = calcFeelsLike(temperature, humidity);
      const dl = getDangerLevel(feelsLike);
      const demo = {
        temperature, humidity, feelsLike, location, dangerLevel: dl,
        canGoOut: dl !== 'EXTREME_DANGER',
        warningMessage: dl === 'SAFE' ? '✅ Safe to go outside!' : dl === 'CAUTION' ? '⚠️ Use caution outdoors' : dl === 'EXTREME_CAUTION' ? '🟠 Limit outdoor exposure' : dl === 'DANGER' ? '🔴 Avoid going outside' : '🚨 EXTREME DANGER — Stay indoors!',
        precautions: ['Drink 2-3 litres of water daily', 'Wear light loose clothing', 'Avoid outdoor activity 12PM–4PM', 'Use sunscreen SPF 30+', 'Carry ORS packets'],
      };
      setResult(demo);
      setHistory(h => [{ ...demo, time: new Date().toLocaleTimeString() }, ...h.slice(0, 4)]);
    }
    setLoading(false);
  };

  const handleEmergency = async () => {
    if (!destination || !reason) return;
    setEmergencyLoading(true);
    try {
      const data = await checkEmergency(destination, reason, temperature, humidity);
      setEmergencyResult(data);
    } catch (e) {
      const feelsLike = calcFeelsLike(temperature, humidity);
      const dl = getDangerLevel(feelsLike);
      setEmergencyResult({
        canProceed: true, destination, reason, currentTemperature: temperature, feelsLike, dangerLevel: dl,
        urgencyLevel: reason.toLowerCase().includes('hospital') ? 'CRITICAL' : 'HIGH',
        estimatedRisk: dl === 'SAFE' ? 'LOW' : dl === 'CAUTION' ? 'MODERATE' : 'HIGH',
        recommendedTimeWindow: 'Evening is safer after 5PM',
        precautions: ['🚗 Use air-conditioned transport','💧 Carry 1.5L water','🧴 Apply sunscreen SPF 50+','👕 Wear light cotton clothing','🧊 Carry ice packs','📱 Keep phone charged','🏥 Note nearest hospital on route','🧃 Carry ORS packets','⚠️ Take breaks in shade every 15 mins'],
      });
    }
    setEmergencyLoading(false);
  };

  const cfg = result ? (dangerConfig[result.dangerLevel] || dangerConfig.SAFE) : null;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-sun">☀</div>
            <div><div className="logo-title">HELIOS SAFE</div><div className="logo-sub">Heat Safety System</div></div>
          </div>
          <div className="header-time">🕐 {time.toLocaleTimeString()}</div>
        </div>
      </header>

      <nav className="tabs">
        {[{id:'dashboard',label:'🌡️ Dashboard'},{id:'emergency',label:'🚨 Emergency'},{id:'history',label:'📊 History'}].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </nav>

      <main className="main">

        {tab === 'dashboard' && (
          <div className="fade-in">
            <div className="section-title">Current Conditions</div>
            <div className="card">
              <div className="input-row">
                <div className="input-group">
                  <label>🌡️ Temperature (°C)</label>
                  <div className="slider-wrap">
                    <input type="range" min="10" max="60" value={temperature} onChange={e => setTemperature(Number(e.target.value))} />
                    <div className="slider-val" style={{color: temperature > 42 ? '#FF2D2D' : temperature > 35 ? '#FF9800' : '#00E676'}}>{temperature}°C</div>
                  </div>
                </div>
                <div className="input-group">
                  <label>💧 Humidity (%)</label>
                  <div className="slider-wrap">
                    <input type="range" min="10" max="100" value={humidity} onChange={e => setHumidity(Number(e.target.value))} />
                    <div className="slider-val" style={{color:'#64B5F6'}}>{humidity}%</div>
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label>📍 Location</label>
                <input type="text" className="text-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter your location..." />
              </div>
              <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
                {loading ? '⏳ Analyzing...' : '☀️ Analyze Heat Safety'}
              </button>
            </div>

            {result && (
              <div className="fade-in">
                <div className="big-result" style={{background: cfg.bg, border: `1px solid ${cfg.color}40`}}>
                  <div className="big-temp-display" style={{color: cfg.color}}>{result.temperature}°C</div>
                  <div className="feels-like-text">Feels like {result.feelsLike}°C</div>
                  <div className="danger-badge" style={{background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}60`}}>
                    {cfg.emoji} {cfg.label}
                  </div>
                  <div className="warning-msg">{result.warningMessage}</div>
                  <div className="go-out-msg" style={{color: result.canGoOut ? '#00E676' : '#FF2D2D', fontWeight: 700, marginTop: '0.5rem'}}>
                    {result.canGoOut ? '✅ OK to go outside with precautions' : '🚫 DO NOT go outside'}
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-val" style={{color:'#FF9800'}}>{result.temperature}°C</div><div className="stat-label">Actual</div></div>
                  <div className="stat-card"><div className="stat-val" style={{color: cfg.color}}>{result.feelsLike}°C</div><div className="stat-label">Feels Like</div></div>
                  <div className="stat-card"><div className="stat-val" style={{color:'#64B5F6'}}>{result.humidity}%</div><div className="stat-label">Humidity</div></div>
                  <div className="stat-card"><div className="stat-val" style={{color: cfg.color, fontSize:'0.8rem'}}>{cfg.label}</div><div className="stat-label">Risk</div></div>
                </div>

                <div className="precautions-box">
                  <div className="precautions-title">🛡️ Safety Precautions</div>
                  {result.precautions.map((p, i) => <div key={i} className="precaution-item">{p}</div>)}
                </div>
              </div>
            )}

            {!result && <div className="empty-state"><div style={{fontSize:'4rem'}}>☀️</div><div className="empty-text">Set temperature & humidity<br/>then tap Analyze</div></div>}
          </div>
        )}

        {tab === 'emergency' && (
          <div className="fade-in">
            <div className="section-title">🚨 Emergency Trip Planner</div>
            <div className="emergency-info">When you MUST go out in extreme heat — get your safety plan</div>
            <div className="card">
              <div className="input-group">
                <label>📍 Where do you need to go?</label>
                <input type="text" className="text-input" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. City Hospital, Pharmacy..." />
              </div>
              <div className="input-group">
                <label>⚠️ Reason</label>
                <select className="text-input" value={reason} onChange={e => setReason(e.target.value)}>
                  <option value="">-- Select reason --</option>
                  <option value="Hospital - Medical Emergency">🏥 Hospital - Medical Emergency</option>
                  <option value="Doctor Appointment">👨‍⚕️ Doctor Appointment</option>
                  <option value="Pharmacy - Medicine">💊 Pharmacy - Medicine</option>
                  <option value="Accident Scene">🚑 Accident Response</option>
                  <option value="Family Emergency">👨‍👩‍👧 Family Emergency</option>
                  <option value="Other Urgent Matter">❗ Other Urgent Matter</option>
                </select>
              </div>
              <div className="temp-reminder">🌡️ Using: <strong>{temperature}°C</strong> / 💧 <strong>{humidity}%</strong>
                <button className="small-btn" onClick={() => setTab('dashboard')}>Change →</button>
              </div>
              <button className="analyze-btn emergency" onClick={handleEmergency} disabled={emergencyLoading || !destination || !reason}>
                {emergencyLoading ? '⏳ Generating Plan...' : '🚨 Get Emergency Plan'}
              </button>
            </div>

            {emergencyResult && (
              <div className="fade-in">
                <div className="emergency-header">
                  <div style={{color: emergencyResult.urgencyLevel === 'CRITICAL' ? '#FF2D2D' : '#FF9800', fontWeight: 700, fontSize: '1.2rem'}}>
                    {emergencyResult.urgencyLevel === 'CRITICAL' ? '🚨' : '⚠️'} {emergencyResult.urgencyLevel} URGENCY
                  </div>
                  <div style={{fontSize:'1rem', marginTop:'0.25rem'}}>→ {emergencyResult.destination}</div>
                </div>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-val" style={{color:'#FF9800'}}>{emergencyResult.currentTemperature}°C</div><div className="stat-label">Temp</div></div>
                  <div className="stat-card"><div className="stat-val" style={{color:'#FF5722'}}>{emergencyResult.feelsLike}°C</div><div className="stat-label">Feels Like</div></div>
                  <div className="stat-card"><div className="stat-val" style={{color: emergencyResult.estimatedRisk === 'LOW' ? '#00E676' : '#FF2D2D', fontSize:'0.8rem'}}>{emergencyResult.estimatedRisk}</div><div className="stat-label">Risk</div></div>
                  <div className="stat-card"><div className="stat-val" style={{color:'#00E676', fontSize:'0.75rem'}}>✅ Proceed</div><div className="stat-label">Decision</div></div>
                </div>
                <div className="time-window">🕐 {emergencyResult.recommendedTimeWindow}</div>
                <div className="precautions-box">
                  <div className="precautions-title">🛡️ Required Precautions</div>
                  {emergencyResult.precautions.map((p, i) => <div key={i} className="precaution-item">{p}</div>)}
                </div>
                <div className="emergency-numbers">
                  <div className="en-title">📞 Emergency Numbers</div>
                  <div className="en-grid">
                    <div className="en-item"><span className="en-num">108</span><span>Ambulance</span></div>
                    <div className="en-item"><span className="en-num">101</span><span>Fire</span></div>
                    <div className="en-item"><span className="en-num">100</span><span>Police</span></div>
                    <div className="en-item"><span className="en-num">102</span><span>Women</span></div>
                  </div>
                </div>
              </div>
            )}
            {!emergencyResult && <div className="empty-state"><div style={{fontSize:'3rem'}}>🏥</div><div className="empty-text">Fill destination & reason<br/>to get your emergency plan</div></div>}
          </div>
        )}

        {tab === 'history' && (
          <div className="fade-in">
            <div className="section-title">📊 Recent Readings</div>
            {history.length === 0
              ? <div className="empty-state"><div style={{fontSize:'3rem'}}>📈</div><div className="empty-text">No readings yet.<br/>Analyze temperature first.</div></div>
              : <div className="history-list">
                  {history.map((h, i) => {
                    const hcfg = dangerConfig[h.dangerLevel] || dangerConfig.SAFE;
                    return (
                      <div key={i} className="history-item" style={{borderLeft:`3px solid ${hcfg.color}`}}>
                        <div className="hi-top">
                          <span className="hi-temp" style={{color: hcfg.color}}>{h.temperature}°C</span>
                          <span className="hi-badge" style={{background: hcfg.bg, color: hcfg.color}}>{hcfg.emoji} {hcfg.label}</span>
                        </div>
                        <div className="hi-bottom">
                          <span>💧 {h.humidity}%</span><span>🌡️ Feels {h.feelsLike}°C</span><span>📍 {h.location}</span><span>🕐 {h.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
            }
            <div className="heat-guide">
              <div className="hg-title">🌡️ Heat Index Guide</div>
              {[
                {label:'✅ SAFE', color:'#00E676', desc:'Below 27°C — Safe for all activities'},
                {label:'⚠️ CAUTION', color:'#FFCA28', desc:'27–32°C — Fatigue with prolonged exposure'},
                {label:'🟠 EXTREME CAUTION', color:'#FF9800', desc:'32–41°C — Heat cramps possible'},
                {label:'🔴 DANGER', color:'#FF5722', desc:'41–54°C — Heatstroke likely'},
                {label:'🚨 EXTREME DANGER', color:'#FF2D2D', desc:'Above 54°C — Stay indoors immediately!'},
              ].map((g, i) => (
                <div key={i} className="hg-row" style={{borderLeft:`3px solid ${g.color}`}}>
                  <div style={{color: g.color, fontWeight:600, fontSize:'0.8rem'}}>{g.label}</div>
                  <div style={{color:'#888', fontSize:'0.75rem'}}>{g.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
