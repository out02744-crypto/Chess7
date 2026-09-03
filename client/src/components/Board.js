const icons = {
  w: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' },
  b: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' }
};

function parseFen(fen) {
  const rows = fen.split(' ')[0].split('/');
  const out = [];
  for (let r = 0; r < 8; r++) {
    let f = 0;
    for (const c of rows[r]) {
      if (/\d/.test(c)) { f += +c; continue; }
      out.push({ r, f, color: c === c.toUpperCase() ? 'w' : 'b', type: c.toLowerCase() });
      f++;
    }
  }
  return out;
}

// selected: currently selected square ("e4") or null
// legal: array of squares the selected piece can legally move to
export function Board({ fen, flipped = false, last = [], selected = null, legal = [] }) {
  const pieces = parseFen(fen);
  let html = '';
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const rr = flipped ? 7 - r : r;
      const ff = flipped ? 7 - f : f;
      const piece = pieces.find(x => x.r === rr && x.f === ff);
      const sq = String.fromCharCode(97 + ff) + (8 - rr);
      const classes = ['sq', (r + f) % 2 ? 'dark' : 'light'];
      if (last.includes(sq)) classes.push('last');
      if (selected === sq) classes.push('sel'); // matches the .sq.sel rule already in app.css
      const isLegalTarget = legal.includes(sq);
      if (isLegalTarget) classes.push(piece ? 'capture-target' : 'move-target');
      html += `<div class="${classes.join(' ')}" data-sq="${sq}">` +
        (piece ? `<span class="piece">${icons[piece.color][piece.type]}</span>` : '') +
        (isLegalTarget ? '<span class="dot"></span>' : '') +
        `</div>`;
    }
  }
  return `<div class="board" id="board">${html}</div>`;
}
