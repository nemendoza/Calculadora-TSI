/* ─────────────────────────────────────────────
   DATOS DE EJEMPLO
───────────────────────────────────────────── */
const EXAMPLES = {
  means:`0.0449,0.1733,0.5746,0.049,0.8406,0.8349,0.92,0.2564,
0.6015,0.6694,0.3972,0.7025,0.1055,0.1247,0.1977,0.0125,
0.63,0.2531,0.8297,0.6483,0.6972,0.9582,0.9085,0.8524,
0.5514,0.0316,0.3587,0.7041,0.5915,0.2523,0.2545,0.3044,
0.0207,0.1067,0.3857,0.1746,0.3362,0.1589,0.3727,0.4145`,
  chisq:`0.347,0.832,0.966,0.472,0.797,0.101,0.696,0.966,0.404,0.603,
0.993,0.371,0.729,0.067,0.189,0.977,0.843,0.562,0.549,0.992,
0.674,0.628,0.055,0.494,0.494,0.235,0.178,0.775,0.797,0.252,
0.426,0.054,0.022,0.742,0.674,0.898,0.641,0.674,0.821,0.19,
0.46,0.224,0.99,0.786,0.393,0.461,0.011,0.977,0.246,0.881,
0.189,0.753,0.73,0.797,0.292,0.876,0.707,0.562,0.562,0.821,
0.112,0.191,0.584,0.347,0.426,0.057,0.819,0.303,0.404,0.64,
0.37,0.314,0.731,0.742,0.213,0.472,0.641,0.944,0.28,0.663,
0.909,0.764,0.999,0.303,0.718,0.933,0.056,0.415,0.819,0.444,
0.178,0.516,0.437,0.393,0.268,0.123,0.945,0.527,0.459,0.652`,
  ks:`0.97,0.11,0.65,0.26,0.98,0.03,0.13,0.89,0.21,0.69`,
  runs:`0.34,0.83,0.96,0.47,0.79,0.99,0.37,0.72,0.06,0.18,
0.67,0.62,0.05,0.49,0.59,0.42,0.05,0.02,0.74,0.67,
0.46,0.22,0.99,0.78,0.39,0.18,0.75,0.73,0.79,0.29,
0.11,0.19,0.58,0.34,0.42,0.37,0.31,0.73,0.74,0.21`,
  runsmean:`0.809,0.042,0.432,0.538,0.225,0.88,0.688,0.772,0.036,0.854,
0.397,0.268,0.821,0.897,0.07,0.721,0.087,0.35,0.779,0.482,
0.136,0.855,0.453,0.197,0.444,0.799,0.809,0.691,0.545,0.857,
0.692,0.055,0.348,0.373,0.436,0.29,0.015,0.834,0.599,0.724,
0.564,0.709,0.946,0.754,0.677,0.128,0.012,0.498,0.6,0.913`,
  poker:`0.06141,0.72484,0.94107,0.56766,0.14411,0.87648,
0.81792,0.48999,0.18590,0.06060,0.11223,0.64794,
0.52953,0.50502,0.30444,0.70688,0.25357,0.31555,
0.04127,0.67347,0.28103,0.99367,0.44598,0.73997,
0.27813,0.62182,0.82578,0.85923,0.51483,0.09099`
};

/* ─────────────────────────────────────────────
   NAV & UTILS
───────────────────────────────────────────── */
function show(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

function loadEx(id, data) {
  document.getElementById(id).value = data;
}

function parseNums(id) {
  return document.getElementById(id).value
    .split(/[\s,\n]+/)
    .map(Number)
    .filter(x => !isNaN(x) && String(x).trim() !== '');
}

function fr(n, d = 4) {
  return Number(n).toFixed(d);
}

function genTable(headers, rows) {
  const ths = headers.map(h => `<th>${h}</th>`).join('');
  const trs = rows.map(r =>
    `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`
  ).join('');

  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${ths}</tr></thead>
        <tbody>${trs}</tbody>
      </table>
    </div>
  `;
}

function genResult(headerTxt, metricsArr, extraHTML, pass, passMsg, failMsg, purpleDot=false) {
  const mHtml = `
    <div class="metrics-grid">
      ${metricsArr.map(([l,v])=>`
        <div class="metric">
          <div class="metric-label">${l}</div>
          <div class="metric-val">${v}</div>
        </div>
      `).join('')}
    </div>
  `;

  return `
    <div class="results">
      <div class="results-header ${purpleDot ? 'purple-dot' : ''}">
        ${headerTxt}
      </div>

      ${mHtml}
      ${extraHTML}

      <div class="verdict ${pass ? 'pass':'fail'}">
        <span class="verdict-icon">${pass ? '✓':'✗'}</span>
        ${pass ? passMsg : failMsg}
      </div>
    </div>
  `;
}

/* ─────────────────────────────────────────────
   HELPERS GENERADORES
───────────────────────────────────────────── */
function extraerCentro(y_str, D) {
  let diff = y_str.length - D;

  if (diff < 0) {
    y_str = y_str.padStart(D, '0');
    diff = 0;
  }

  if (diff % 2 !== 0) {
    y_str = "0" + y_str;
    diff++;
  }

  return y_str.substring(diff / 2, diff / 2 + D);
}

function fmtR(num) {
  let s = num.toString();
  let p = s.indexOf('.');

  if (p === -1) return s + ".0000";

  return s.substring(0, p + 1) +
         (s.substring(p + 1) + "0000").substring(0, 4);
}

/* ─────────────────────────────────────────────
   GENERADORES
───────────────────────────────────────────── */
function generarCuadradosMedios() {
  const x0 = document.getElementById('cm_x0').value;
  const n = parseInt(document.getElementById('cm_n').value);

  const err = document.getElementById('cm_error');
  const out = document.getElementById('cm_result');

  err.innerHTML = '';
  out.innerHTML = '';

  if (x0.length <= 3) {
    err.innerHTML = 'La semilla necesita más de 3 dígitos.';
    return;
  }

  const D = x0.length;
  let cur = x0;
  const rows = [];

  for (let i = 0; i < n; i++) {
    const y = BigInt(cur) * BigInt(cur);
    const y_str = y.toString();

    const next = extraerCentro(y_str, D);

    rows.push([
      i + 1,
      y_str,
      next,
      '0.' + next
    ]);

    cur = next;
  }

  out.innerHTML = `
    <div class="results">
      <div class="results-header purple-dot">
        n = ${n} números generados · D = ${D}
      </div>

      ${genTable(
        ['i','Yᵢ = Xᵢ²','Xᵢ₊₁','rᵢ'],
        rows
      )}
    </div>
  `;
}

function generarProductosMedios() {
  const x0 = document.getElementById('pm_x0').value;
  const x1 = document.getElementById('pm_x1').value;
  const n = parseInt(document.getElementById('pm_n').value);

  const err = document.getElementById('pm_error');
  const out = document.getElementById('pm_result');

  err.innerHTML = '';
  out.innerHTML = '';

  if (
    x0.length <= 3 ||
    x1.length <= 3 ||
    x0.length !== x1.length
  ) {
    err.innerHTML = 'Semillas inválidas o de distinta longitud.';
    return;
  }

  const D = x0.length;

  let prev = x0;
  let cur = x1;

  const rows = [];

  for (let i = 0; i < n; i++) {
    const y = BigInt(prev) * BigInt(cur);
    const y_str = y.toString();

    const next = extraerCentro(y_str, D);

    rows.push([
      i + 1,
      y_str,
      next,
      '0.' + next
    ]);

    prev = cur;
    cur = next;
  }

  out.innerHTML = `
    <div class="results">
      <div class="results-header purple-dot">
        n = ${n} números generados · D = ${D}
      </div>

      ${genTable(
        ['i','Yᵢ = Xᵢ·Xᵢ₋₁','Xᵢ₊₂','rᵢ'],
        rows
      )}
    </div>
  `;
}

function generarMultiplicadorConstante() {
  const x0 = document.getElementById('mc_x0').value;
  const a = document.getElementById('mc_a').value;
  const n = parseInt(document.getElementById('mc_n').value);

  const err = document.getElementById('mc_error');
  const out = document.getElementById('mc_result');

  err.innerHTML = '';
  out.innerHTML = '';

  if (x0.length <= 3 || a.length <= 3) {
    err.innerHTML = 'Semilla y constante requieren más de 3 dígitos.';
    return;
  }

  const D = x0.length;

  let cur = x0;
  const rows = [];

  for (let i = 0; i < n; i++) {
    const y = BigInt(a) * BigInt(cur);
    const y_str = y.toString();

    const next = extraerCentro(y_str, D);

    rows.push([
      i + 1,
      y_str,
      next,
      '0.' + next
    ]);

    cur = next;
  }

  out.innerHTML = `
    <div class="results">
      <div class="results-header purple-dot">
        n = ${n} · a = ${a} · D = ${D}
      </div>

      ${genTable(
        ['i','Yᵢ = a·Xᵢ','Xᵢ₊₁','rᵢ'],
        rows
      )}
    </div>
  `;
}

/* ─────────────────────────────────────────────
   CONGRUENCIAL LINEAL
───────────────────────────────────────────── */
function generarLineal() {
  const x0 = BigInt(document.getElementById('cl_x0').value || 0);
  const a = BigInt(document.getElementById('cl_a').value || 0);
  const c = BigInt(document.getElementById('cl_c').value || 0);
  const m = BigInt(document.getElementById('cl_m').value || 1);
  const n = parseInt(document.getElementById('cl_n').value || 5);

  const err = document.getElementById('cl_error');
  const out = document.getElementById('cl_result');

  err.innerHTML = '';
  out.innerHTML = '';

  const rows = [];
  let xi = x0;

  for (let i = 1; i <= n; i++) {
    const res = (a * xi) + c;
    const next = res % m;

    const ri = Number(next) / (Number(m) - 1);

    rows.push([
      i,
      String(xi),
      String(res),
      String(next),
      fmtR(ri)
    ]);

    xi = next;
  }

  out.innerHTML = `
    <div class="results">
      <div class="results-header purple-dot">
        n = ${n} · a = ${a} · c = ${c} · m = ${m}
      </div>

      ${genTable(
        ['i','Xᵢ','aXᵢ + c','Xᵢ₊₁ mod m','rᵢ'],
        rows
      )}
    </div>
  `;
}

/* ─────────────────────────────────────────────
   CONGRUENCIAL MULTIPLICATIVO
───────────────────────────────────────────── */
function generarMultiplicativo() {
  const x0 = BigInt(document.getElementById('cmu_x0').value || 0);
  const a = BigInt(document.getElementById('cmu_a').value || 0);
  const m = BigInt(document.getElementById('cmu_m').value || 1);
  const n = parseInt(document.getElementById('cmu_n').value || 5);

  const err = document.getElementById('cmu_error');
  const out = document.getElementById('cmu_result');

  err.innerHTML = '';
  out.innerHTML = '';

  const rows = [];
  let xi = x0;

  for (let i = 1; i <= n; i++) {
    const res = a * xi;
    const next = res % m;

    const ri = Number(next) / (Number(m) - 1);

    rows.push([
      i,
      String(xi),
      String(res),
      String(next),
      fmtR(ri)
    ]);

    xi = next;
  }

  out.innerHTML = `
    <div class="results">
      <div class="results-header purple-dot">
        n = ${n} · a = ${a} · m = ${m}
      </div>

      ${genTable(
        ['i','Xᵢ','aXᵢ','Xᵢ₊₁ mod m','rᵢ'],
        rows
      )}
    </div>
  `;
}

/* ─────────────────────────────────────────────
   CONGRUENCIAL ADITIVO
───────────────────────────────────────────── */
function generarAditivo() {
  const seqStr = document.getElementById('ca_secuencia').value;

  const m = BigInt(document.getElementById('ca_m').value || 1);

  const cant = parseInt(
    document.getElementById('ca_n').value || 5
  );

  const err = document.getElementById('ca_error');
  const out = document.getElementById('ca_result');

  err.innerHTML = '';
  out.innerHTML = '';

  let seq = seqStr
    .split(',')
    .map(s => BigInt(s.trim()));

  if (seq.length < 2) {
    err.innerHTML = 'Ingresa al menos 2 semillas.';
    return;
  }

  const np = seq.length;
  const rows = [];

  for (let i = 1; i <= cant; i++) {
    const last = seq[seq.length - 1];
    const first = seq[seq.length - np];

    const suma = last + first;
    const next = suma % m;

    const ri = Number(next) / (Number(m) - 1);

    rows.push([
      seq.length + 1,
      String(last),
      String(first),
      String(suma),
      String(next),
      fmtR(ri)
    ]);

    seq.push(next);
  }

  out.innerHTML = `
    <div class="results">
      <div class="results-header purple-dot">
        n = ${cant} · m = ${m}
      </div>

      ${genTable(
        ['i','Xᵢ₋₁','Xᵢ₋ₙ','Suma','Xᵢ mod m','rᵢ'],
        rows
      )}
    </div>
  `;
}

/* ─────────────────────────────────────────────
   CONGRUENCIAL CUADRÁTICO
───────────────────────────────────────────── */
function generarNoLineal() {
  const x0 = BigInt(document.getElementById('cnl_x0').value || 0);
  const a = BigInt(document.getElementById('cnl_a').value || 0);
  const b = BigInt(document.getElementById('cnl_b').value || 0);
  const c = BigInt(document.getElementById('cnl_c').value || 0);
  const m = BigInt(document.getElementById('cnl_m').value || 1);

  const n = parseInt(
    document.getElementById('cnl_n').value || 5
  );

  const err = document.getElementById('cnl_error');
  const out = document.getElementById('cnl_result');

  err.innerHTML = '';
  out.innerHTML = '';

  const rows = [];
  let xi = x0;

  for (let i = 1; i <= n; i++) {
    const res = (a * xi * xi) + (b * xi) + c;
    const next = res % m;

    const ri = Number(next) / (Number(m) - 1);

    rows.push([
      i,
      String(xi),
      String(res),
      String(next),
      fmtR(ri)
    ]);

    xi = next;
  }

  out.innerHTML = `
    <div class="results">
      <div class="results-header purple-dot">
        n = ${n} · a = ${a} · b = ${b} · c = ${c} · m = ${m}
      </div>

      ${genTable(
        ['i','Xᵢ','aXᵢ²+bXᵢ+c','Xᵢ₊₁ mod m','rᵢ'],
        rows
      )}
    </div>
  `;
}

/* ─────────────────────────────────────────────
   BLUM BLUM SHUB
───────────────────────────────────────────── */
function generarBlum() {
  const x0 = BigInt(document.getElementById('bbs_x0').value || 0);
  const m = BigInt(document.getElementById('bbs_m').value || 1);

  const n = parseInt(
    document.getElementById('bbs_n').value || 5
  );

  const err = document.getElementById('bbs_error');
  const out = document.getElementById('bbs_result');

  err.innerHTML = '';
  out.innerHTML = '';

  const rows = [];
  let xi = x0;

  for (let i = 1; i <= n; i++) {
    const res = xi * xi;
    const next = res % m;

    const ri = Number(next) / (Number(m) - 1);

    rows.push([
      i,
      String(xi),
      String(res),
      String(next),
      fmtR(ri)
    ]);

    xi = next;
  }

  out.innerHTML = `
    <div class="results">
      <div class="results-header purple-dot">
        n = ${n} · m = ${m}
      </div>

      ${genTable(
        ['i','Xᵢ','Xᵢ²','Xᵢ₊₁ mod m','rᵢ'],
        rows
      )}
    </div>
  `;
}

/* ─────────────────────────────────────────────
   UTILIDADES ESTADÍSTICAS
───────────────────────────────────────────── */
function zNorm(p) {
  const a = [2.515517,0.802853,0.010328];
  const b = [1.432788,0.189269,0.001308];

  const t = Math.sqrt(
    -2 * Math.log(p < 0.5 ? p : 1 - p)
  );

  const num = a[0] + a[1]*t + a[2]*t*t;
  const den = 1 + b[0]*t + b[1]*t*t + b[2]*t*t*t;

  return p < 0.5
    ? -(t - num/den)
    : (t - num/den);
}

function chiCrit(alpha, df) {
  const z = zNorm(1 - alpha);

  return df * Math.pow(
    1 - 2/(9*df) + z*Math.sqrt(2/(9*df)),
    3
  );
}

function countRuns(S) {
  let c = 1;

  for (let i = 1; i < S.length; i++) {
    if (S[i] !== S[i - 1]) c++;
  }

  return c;
}

function seqHTML(S, lbl) {
  return `
    <div class="seq-display">
      <div class="seq-label">${lbl}</div>

      <div class="seq-bits">
        ${S.map(b => `
          <div class="bit bit-${b}">
            ${b}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}