export async function requestPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  return await Notification.requestPermission();
}

export function sendBreakingAlert(article) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const n = new Notification('🚨 PANIC BUTTON — Breaking News', {
      body: (article.title || 'Breaking story detected').substring(0, 120),
      icon: '/favicon.ico',
      tag: 'breaking-' + Date.now(),
    });
    n.onclick = () => { window.focus(); if (article.url) window.open(article.url, '_blank'); n.close(); };
    setTimeout(() => n.close(), 8000);
  } catch (e) {}
}

export function playAlertSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const play = (freq, start, dur) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'square'; o.frequency.setValueAtTime(freq, ctx.currentTime + start);
      g.gain.setValueAtTime(0, ctx.currentTime + start);
      g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.05);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
      o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.1);
    };
    play(880, 0, 0.15); play(660, 0.2, 0.15); play(880, 0.4, 0.3);
  } catch (e) {}
}
