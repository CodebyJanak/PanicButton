import React from 'react';
import { useAppStore } from '../store/appStore';
import { requestPermission } from '../services/notificationService';

export default function SettingsPanel({ isOpen, onClose, onClearApiKey }) {
  const { state, dispatch } = useAppStore();
  const prefs = state.preferences;
  const setPref = (key, value) => dispatch({ type:'PREF_SET', key, value });

  const handleNotifications = async () => {
    const perm = await requestPermission();
    if (perm==='granted') { setPref('notificationsEnabled', true); }
    else { setPref('notificationsEnabled', false); alert('Enable notifications in browser settings.'); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-end pt-16"
      style={{ background:'rgba(3,3,8,0.6)', backdropFilter:'blur(8px)' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="panel-slide h-full flex flex-col overflow-y-auto no-scrollbar" style={{ width:'340px', background:'var(--deep)', borderLeft:'1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-4 sticky top-0" style={{ background:'var(--deep)', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'18px', letterSpacing:'0.1em', color:'var(--text-1)' }}>⚙ SETTINGS</span>
          <button onClick={onClose} style={{ color:'var(--text-3)', background:'none', border:'none', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-5">
          <Grp label="Display Theme">
            {[['void','Void (Default)'],['oled','OLED Black'],['light','Light Mode']].map(([v,l])=>(
              <Toggle key={v} label={l} active={prefs.theme===v} onClick={()=>setPref('theme',v)} radio />
            ))}
          </Grp>

          <Grp label="Card Density">
            {[['comfortable','Comfortable'],['compact','Compact'],['headline','Headlines Only'],['newspaper','Newspaper']].map(([v,l])=>(
              <Toggle key={v} label={l} active={prefs.density===v} onClick={()=>setPref('density',v)} radio />
            ))}
          </Grp>

          <Grp label="Auto Refresh">
            <Toggle label="Enable auto-refresh" active={prefs.autoRefresh} onClick={()=>setPref('autoRefresh',!prefs.autoRefresh)} />
            {prefs.autoRefresh && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background:'rgba(255,255,255,0.03)' }}>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-2)' }}>Interval</span>
                <select value={prefs.refreshInterval} onChange={e=>setPref('refreshInterval',Number(e.target.value))}
                  style={{ background:'rgba(255,255,255,0.06)', color:'var(--text-1)', border:'1px solid var(--border)', borderRadius:'4px', padding:'4px 8px', fontFamily:'var(--font-mono)', fontSize:'10px', cursor:'pointer' }}>
                  <option value={60}>1 min</option>
                  <option value={180}>3 min</option>
                  <option value={300}>5 min</option>
                  <option value={600}>10 min</option>
                  <option value={1800}>30 min</option>
                </select>
              </div>
            )}
          </Grp>

          <Grp label="AI Features">
            <Toggle label="Auto Daily Briefing on load" sublabel="Show briefing when app opens" active={prefs.showBriefingOnLoad} onClick={()=>setPref('showBriefingOnLoad',!prefs.showBriefingOnLoad)} />
          </Grp>

          <Grp label="Alerts & Notifications">
            <Toggle label="Push notifications" sublabel={prefs.notificationsEnabled?'Active':'Get alerted on breaking stories'}
              active={prefs.notificationsEnabled}
              onClick={prefs.notificationsEnabled?()=>setPref('notificationsEnabled',false):handleNotifications} />
          </Grp>

          <Grp label="News Language">
            {[['en','English'],['de','Deutsch'],['fr','Français'],['es','Español'],['ar','العربية']].map(([c,n])=>(
              <Toggle key={c} label={n} active={prefs.language===c} onClick={()=>setPref('language',c)} radio />
            ))}
          </Grp>

          <Grp label="Data & Privacy">
            <button onClick={()=>dispatch({type:'HISTORY_CLEAR'})}
              className="w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:opacity-80"
              style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-2)', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)' }}>
              🗑 Clear reading history
            </button>
            <button onClick={()=>dispatch({type:'ALERT_CLEAR'})}
              className="w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:opacity-80"
              style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-2)', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)' }}>
              🔔 Clear all keyword alerts
            </button>
            <button onClick={()=>{if(window.confirm('Remove API key?')) onClearApiKey();}}
              className="w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:opacity-80"
              style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--red)', background:'rgba(255,0,0,0.04)', border:'1px solid rgba(255,0,0,0.12)' }}>
              🔑 Remove NewsAPI key
            </button>
          </Grp>

          <div className="text-center pt-2" style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)', lineHeight:1.8 }}>
            PANIC BUTTON v3.0<br />React + NewsAPI + Claude AI
          </div>
        </div>
      </div>
    </div>
  );
}

function Grp({ label, children }) {
  return (
    <div>
      <div className="mb-2" style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--text-3)' }}>{label}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
function Toggle({ label, sublabel, active, onClick, radio }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150"
      style={{ background:active?'rgba(255,0,0,0.06)':'rgba(255,255,255,0.02)', border:'1px solid '+(active?'rgba(255,0,0,0.15)':'var(--border)') }}
      onClick={onClick}>
      <div>
        <div style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:active?'var(--text-1)':'var(--text-2)' }}>{label}</div>
        {sublabel && <div style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)', marginTop:'2px' }}>{sublabel}</div>}
      </div>
      {radio
        ? <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ border:'1.5px solid '+(active?'var(--red)':'rgba(255,255,255,0.15)') }}>
            {active && <div className="w-2 h-2 rounded-full" style={{ background:'var(--red)' }} />}
          </div>
        : <div className="relative rounded-full transition-all duration-200" style={{ width:'32px', height:'18px', background:active?'var(--red)':'rgba(255,255,255,0.1)' }}>
            <div className="absolute top-0.5 rounded-full transition-all duration-200" style={{ width:'14px', height:'14px', background:'white', left:active?'15px':'2px' }} />
          </div>
      }
    </div>
  );
}
