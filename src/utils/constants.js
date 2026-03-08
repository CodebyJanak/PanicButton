export const SUPPORTED_COUNTRIES = new Set([
  "ae","ar","at","au","be","bg","br","ca","ch","cn","co","cu","cz","de","eg",
  "fr","gb","gr","hk","hu","id","ie","il","in","it","jp","kr","lt","lv","ma",
  "mx","my","ng","nl","no","nz","ph","pl","pt","ro","rs","ru","sa","se","sg",
  "si","sk","th","tr","tw","ua","us","ve","za",
]);

export const BREAKING_KEYWORDS = [
  "breaking","emergency","alert","urgent","critical","crisis","disaster",
  "attack","explosion","earthquake","flood","fire","shooting","evacuation",
  "warning","threat","killed","dead","casualties","collapse","crash","war",
];

export const NEWSAPI_BASE = "https://newsapi.org/v2";

export const CATEGORIES = [
  { id:"general",       label:"Top Stories",   icon:"🔥", accent:"#FF0000", accentDim:"rgba(255,0,0,0.12)",     accentBorder:"rgba(255,0,0,0.25)",     description:"Breaking news & top headlines" },
  { id:"business",      label:"Business",      icon:"💼", accent:"#00f5ff", accentDim:"rgba(0,245,255,0.1)",    accentBorder:"rgba(0,245,255,0.22)",   description:"Corporate news & economy"      },
  { id:"technology",    label:"Technology",    icon:"⚡", accent:"#9d4edd", accentDim:"rgba(157,78,221,0.1)",  accentBorder:"rgba(157,78,221,0.22)", description:"Tech, AI & innovation"         },
  { id:"entertainment", label:"Entertainment", icon:"🎬", accent:"#ff006e", accentDim:"rgba(255,0,110,0.1)",   accentBorder:"rgba(255,0,110,0.22)",  description:"Movies, music & culture"       },
  { id:"sports",        label:"Sports",        icon:"🏆", accent:"#00ff88", accentDim:"rgba(0,255,136,0.1)",   accentBorder:"rgba(0,255,136,0.22)",  description:"Live scores & highlights"      },
  { id:"science",       label:"Science",       icon:"🔬", accent:"#38bdf8", accentDim:"rgba(56,189,248,0.1)",  accentBorder:"rgba(56,189,248,0.22)", description:"Discoveries & research"        },
  { id:"health",        label:"Health",        icon:"❤️", accent:"#fb7185", accentDim:"rgba(251,113,133,0.1)", accentBorder:"rgba(251,113,133,0.22)",description:"Medical & wellness news"       },
];

export const EXTRA_CATEGORIES = [
  { id:"stocks",  label:"Markets",   icon:"📈", accent:"#4ade80", accentDim:"rgba(74,222,128,0.1)",  accentBorder:"rgba(74,222,128,0.22)",  description:"Markets & finance",     query:"stocks OR market OR nasdaq OR \"dow jones\" OR trading" },
  { id:"crypto",  label:"Crypto",    icon:"₿",  accent:"#f59e0b", accentDim:"rgba(245,158,11,0.1)",  accentBorder:"rgba(245,158,11,0.22)",  description:"Crypto & blockchain",   query:"bitcoin OR ethereum OR cryptocurrency OR blockchain"    },
  { id:"politics",label:"Politics",  icon:"🏛️", accent:"#e879f9", accentDim:"rgba(232,121,249,0.1)", accentBorder:"rgba(232,121,249,0.22)", description:"Government & policy",   query:"politics OR government OR election OR parliament"       },
  { id:"world",   label:"World",     icon:"🌍", accent:"#22d3ee", accentDim:"rgba(34,211,238,0.1)",  accentBorder:"rgba(34,211,238,0.22)",  description:"International affairs", query:"world news OR international OR global affairs"          },
  { id:"jobs",    label:"Jobs",      icon:"👔", accent:"#fbbf24", accentDim:"rgba(251,191,36,0.1)",  accentBorder:"rgba(251,191,36,0.22)",  description:"Employment & careers",  query:"jobs OR employment OR hiring OR layoffs OR careers"     },
];

export const ALL_CATEGORIES = [...CATEGORIES, ...EXTRA_CATEGORIES];

export const LOCAL_TAB = {
  id:"local", label:"Near You", icon:"📍", accent:"#00f5ff",
  accentDim:"rgba(0,245,255,0.1)", accentBorder:"rgba(0,245,255,0.22)", description:"News near your location",
};

export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='340' viewBox='0 0 600 340'%3E%3Crect width='600' height='340' fill='%230a0a0f'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='60' fill='%23ff000010'%3E%E2%9A%A1%3C/text%3E%3C/svg%3E";

export const BIAS_LABELS = { left:"Left", center:"Center", right:"Right", unknown:"Unrated" };
export const BIAS_COLORS = { left:"#3b82f6", center:"#8888aa", right:"#ef4444", unknown:"#555570" };
