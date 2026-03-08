import React, { useState, useEffect } from 'react';

const COUNTRY_NAMES = {
  "United States":"US","United Kingdom":"GB","Germany":"DE","France":"FR","India":"IN",
  "China":"CN","Japan":"JP","Brazil":"BR","Australia":"AU","Canada":"CA","Russia":"RU",
  "South Korea":"KR","Italy":"IT","Spain":"ES","Mexico":"MX","Indonesia":"ID","Netherlands":"NL",
  "Saudi Arabia":"SA","Turkey":"TR","Argentina":"AR","Poland":"PL","Sweden":"SE","Norway":"NO",
  "South Africa":"ZA","Nigeria":"NG","Egypt":"EG","Israel":"IL","Ukraine":"UA","Pakistan":"PK",
  "Thailand":"TH","Malaysia":"MY","Philippines":"PH","Singapore":"SG","Hong Kong":"HK",
};

const REGIONS = [
  { code:'US', x:60,  y:120, w:110, h:60,  label:'USA'        },
  { code:'CA', x:60,  y:60,  w:110, h:55,  label:'Canada'     },
  { code:'MX', x:70,  y:185, w:60,  h:40,  label:'Mexico'     },
  { code:'BR', x:130, y:190, w:80,  h:80,  label:'Brazil'     },
  { code:'AR', x:120, y:270, w:60,  h:60,  label:'Argentina'  },
  { code:'GB', x:300, y:90,  w:25,  h:20,  label:'UK'         },
  { code:'FR', x:310, y:110, w:30,  h:25,  label:'France'     },
  { code:'DE', x:330, y:95,  w:30,  h:25,  label:'Germany'    },
  { code:'IT', x:330, y:120, w:22,  h:35,  label:'Italy'      },
  { code:'ES', x:295, y:115, w:35,  h:28,  label:'Spain'      },
  { code:'RU', x:370, y:60,  w:140, h:70,  label:'Russia'     },
  { code:'UA', x:360, y:105, w:40,  h:22,  label:'Ukraine'    },
  { code:'TR', x:365, y:120, w:45,  h:22,  label:'Turkey'     },
  { code:'SA', x:370, y:150, w:45,  h:40,  label:'Saudi'      },
  { code:'EG', x:345, y:148, w:30,  h:28,  label:'Egypt'      },
  { code:'NG', x:320, y:175, w:28,  h:25,  label:'Nigeria'    },
  { code:'ZA', x:335, y:240, w:35,  h:35,  label:'S.Africa'   },
  { code:'IN', x:450, y:145, w:55,  h:65,  label:'India'      },
  { code:'PK', x:435, y:135, w:30,  h:30,  label:'Pakistan'   },
  { code:'CN', x:490, y:100, w:90,  h:70,  label:'China'      },
  { code:'JP', x:590, y:110, w:28,  h:40,  label:'Japan'      },
  { code:'KR', x:570, y:120, w:22,  h:25,  label:'Korea'      },
  { code:'ID', x:510, y:195, w:80,  h:30,  label:'Indonesia'  },
  { code:'AU', x:525, y:240, w:95,  h:70,  label:'Australia'  },
  { code:'TH', x:500, y:170, w:28,  h:32,  label:'Thailand'   },
  { code:'MY', x:500, y:190, w:30,  h:20,  label:'Malaysia'   },
  { code:'PH', x:560, y:170, w:25,  h:35,  label:'Philippines'},
  { code:'SE', x:333, y:60,  w:22,  h:35,  label:'Sweden'     },
  { code:'NO', x:318, y:55,  w:22,  h:40,  label:'Norway'     },
  { code:'NL', x:320, y:92,  w:16,  h:14,  label:'Netherlands'},
  { code:'PL', x:348, y:90,  w:28,  h:22,  label:'Poland'     },
  { code:'IL', x:358, y:142, w:14,  h:16,  label:'Israel'     },
  { code:'SG', x:518, y:200, w:12,  h:10,  label:'Singapore'  },
  { code:'HK', x:560, y:150, w:14,  h:12,  label:'HK'         },
];

export default function WorldHeatmap({ articles }) {
  const [tooltip, setTooltip]       = useState(null);
  const [countryData, setCountryData] = useState({});
  const articleCount = articles ? articles.length : 0;

  useEffect(() => {
    if (!articles || articles.length === 0) return;
    const counts = {};
    articles.forEach(a => {
      const text = ((a.title || '') + ' ' + (a.description || '')).toLowerCase();
      Object.entries(COUNTRY_NAMES).forEach(([name, code]) => {
        if (text.includes(name.toLowerCase())) counts[code] = (counts[code] || 0) + 1;
      });
    });
    setCountryData(counts);
  }, [articleCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const maxCount = Math.max(...Object.values(countryData), 1);

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-3">
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555570' }}>
          🌍 News Heatmap by Region
        </div>
        <div className="flex items-center gap-2">
          {[0.15, 0.35, 0.6, 0.85, 1].map((o, i) => (
            <div key={i} className="w-3 h-2 rounded-sm" style={{ background: `rgba(255,0,0,${o})` }} />
          ))}
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '7px', color: '#555570' }}>LOW→HIGH</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg" style={{ background: '#08080f' }}>
        <svg viewBox="0 0 700 340" className="w-full" style={{ display: 'block' }}>
          <rect width="700" height="340" fill="#0a0a18" rx="8" />
          {[0,1,2,3,4].map(i => <line key={'h'+i} x1="0" y1={68*i} x2="700" y2={68*i} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />)}
          {[0,1,2,3,4,5,6].map(i => <line key={'v'+i} x1={100*i} y1="0" x2={100*i} y2="340" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />)}

          {REGIONS.map(r => {
            const count = countryData[r.code] || 0;
            const intensity = count / maxCount;
            const fill = count > 0
              ? `rgba(255,${Math.round((1-intensity)*30)},${Math.round((1-intensity)*20)},${0.15 + intensity * 0.75})`
              : 'rgba(255,255,255,0.04)';
            const stroke = count > 0 ? `rgba(255,0,0,${0.3 + intensity * 0.6})` : 'rgba(255,255,255,0.07)';
            return (
              <g key={r.code + r.x}
                onMouseEnter={() => setTooltip({ ...r, count })}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: count > 0 ? 'pointer' : 'default' }}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="3"
                  fill={fill} stroke={stroke} strokeWidth={count > 0 ? 1.5 : 1}
                  style={{ transition: 'all 0.4s ease',
                    filter: count > 0 ? `drop-shadow(0 0 ${4+intensity*6}px rgba(255,0,0,${0.3+intensity*0.4}))` : 'none' }} />
                {r.w > 30 && (
                  <text x={r.x + r.w/2} y={r.y + r.h/2 + 3} textAnchor="middle"
                    style={{ fontFamily:'monospace', fontSize: r.w > 60 ? '8px' : '6px',
                      fill: count > 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', pointerEvents:'none' }}>
                    {r.label}
                  </text>
                )}
                {count > 0 && (
                  <text x={r.x + r.w/2} y={r.y + r.h - 4} textAnchor="middle"
                    style={{ fontFamily:'monospace', fontSize:'6px', fill:'rgba(255,200,200,0.9)', pointerEvents:'none' }}>
                    {count}
                  </text>
                )}
              </g>
            );
          })}

          {tooltip && tooltip.count > 0 && (
            <g>
              <rect x={Math.min(tooltip.x - 30, 620)} y={tooltip.y - 28} width="70" height="22" rx="4"
                fill="#0a0a0f" stroke="rgba(255,0,0,0.4)" strokeWidth="1" />
              <text x={Math.min(tooltip.x - 30, 620) + 35} y={tooltip.y - 12} textAnchor="middle"
                style={{ fontFamily:'monospace', fontSize:'8px', fill:'#FF0000', fontWeight:'bold' }}>
                {tooltip.label}: {tooltip.count}
              </text>
            </g>
          )}
        </svg>
      </div>

      {Object.keys(countryData).length === 0 && (
        <p className="text-center mt-2" style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#555570' }}>
          Load news to see geographic coverage
        </p>
      )}
    </div>
  );
}
