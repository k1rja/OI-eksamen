function toISODateParts(s) {
    if (!s) return null;
    const parts = String(s).split('-');
    if (parts.length !== 3) return null;
  
    if (parts[0].length === 4) {
      const [y, m, d] = parts;
      return { y: Number(y), m: Number(m), d: Number(d) };
    }
    const [d, m, y] = parts;
    return { y: Number(y), m: Number(m), d: Number(d) };
  }
  
  export function eventStartMs(ev) {
    const p = toISODateParts(ev?.date);
    if (!p) return Number.MAX_SAFE_INTEGER;
    const t = ev?.start || '00:00';
    const [hh = '00', mm = '00'] = String(t).split(':');
    return new Date(p.y, p.m - 1, p.d, Number(hh), Number(mm), 0, 0).getTime();
  }
  
  export function dateKey(evOrDateStr) {
    const s = typeof evOrDateStr === 'string' ? evOrDateStr : evOrDateStr?.date;
    const p = toISODateParts(s);
    if (!p) return 'uden-dato';
    const d = new Date(p.y, p.m - 1, p.d);
    return d.toISOString().slice(0, 10);
  }
  
  export function weekdayDa(dateStr) {
    const p = toISODateParts(dateStr);
    if (!p) return 'Uden dato';
    const d = new Date(p.y, p.m - 1, p.d);
    return new Intl.DateTimeFormat('da-DK', { weekday: 'long' }).format(d);
  }
  
  export function formatDateDa(dateStr) {
    const p = toISODateParts(dateStr);
    if (!p) return '';
    const dd = String(p.d).padStart(2, '0');
    const mm = String(p.m).padStart(2, '0');
    return `${dd}-${mm}-${p.y}`;
  }