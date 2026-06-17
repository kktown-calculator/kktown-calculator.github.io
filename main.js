const BENTO_DATA = {
  "Bento 1": [
    { ingred: "Pack Milk",        qty: 1, weight: 0.2  },
    { ingred: "Pack Rice",        qty: 2, weight: 0.2  },
    { ingred: "Pack Sliced Pork", qty: 2, weight: 0.2  },
    { ingred: "Pack Wood",        qty: 2, weight: 0.2  },
    { ingred: "Sauce",            qty: 1, weight: 0.25 },
  ],
  "Bento 2": [
    { ingred: "Pack Milk",   qty: 1, weight: 0.2  },
    { ingred: "Pack Grape",  qty: 2, weight: 0.2  },
    { ingred: "Pack Papaya", qty: 2, weight: 0.2  },
    { ingred: "Pack Wood",   qty: 2, weight: 0.2  },
    { ingred: "Salt",        qty: 1, weight: 0.1  },
    { ingred: "Sugar",       qty: 3, weight: 0.1  },
  ],
  "Bento 3": [
    { ingred: "Pack Crab",  qty: 1, weight: 0.2  },
    { ingred: "Pack Milk",  qty: 2, weight: 0.2  },
    { ingred: "Pack Rice",  qty: 2, weight: 0.2  },
    { ingred: "Pack Wood",  qty: 2, weight: 0.2  },
    { ingred: "Sauce",      qty: 1, weight: 0.25 },
    { ingred: "Sugar",      qty: 1, weight: 0.1  },
  ],
};

function calcCraftCapacity() {
  const bagWeight = parseFloat(document.getElementById('craftBagWeight').value) || 0;
  const resultEl  = document.getElementById('craft-result');
  const panelsEl  = document.getElementById('craft-bento-panels');

  if (bagWeight <= 0) {
    resultEl.style.display = 'none';
    document.getElementById('craft-howto').style.display = 'block'; // แสดงวิธีใช้ถ้าค่ายังไม่ถูกต้อง
    return;
  }

  panelsEl.innerHTML = '';

  Object.entries(BENTO_DATA).forEach(([name, items]) => {
    const weightPerSet = items.reduce((s, item) => s + item.qty * item.weight, 0);
    const count        = Math.floor(bagWeight / weightPerSet);
    const totalWeight  = weightPerSet * count; // คำนวณน้ำหนักรวมทั้งหมดที่ใช้

    const rows = items.map((item, rowIdx) => {
      const totalQty = item.qty * count; // จำนวนรวมที่ต้องใช้
      const totalW   = (totalQty * item.weight).toFixed(2);
      return `<tr class="${rowIdx % 2 === 0 ? 'row-odd' : 'row-even'}">
        <td>${item.ingred}</td>
        <td>${item.qty}</td>
        <td>${totalQty}</td>
        <td>${totalW}</td>
      </tr>`;
    }).join('');

    panelsEl.insertAdjacentHTML('beforeend', `
      <div class="craft-bento-block">
        <div class="craft-bento-header">
          <span>${name}</span>
          <span class="craft-count-badge">คราฟได้ <b>${count}</b> ชุด</span>
        </div>
        <div class="tbl-wrap" style="margin-bottom:0;">
          <table>
            <thead><tr><th>วัตถุดิบ</th><th>จำนวน/ชุด</th><th>รวม</th><th>น้ำหนัก (kg)</th></tr></thead>
            <tbody>
              ${rows}
              <tr class="total-row">
                <td colspan="3">น้ำหนักรวมทั้งหมด</td>
                <td>${totalWeight.toFixed(2)} kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `);
  });

  resultEl.style.display = 'block';
  document.getElementById('craft-howto').style.display = 'none'; // ซ่อนวิธีใช้เมื่อแสดงผล
}

function clearCraft() {
  document.getElementById('craftBagWeight').value = 0;
  document.getElementById('craft-result').style.display = 'none';
  document.getElementById('craft-bento-panels').innerHTML = '';
  document.getElementById('craft-howto').style.display = 'block'; // แสดงวิธีใช้ใหม่
}

function switchTab(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('show'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('show');
  btn.classList.add('active');
}

function calcBento() {
  const amounts = {
    "Bento 1": parseInt(document.getElementById('b1').value) || 0,
    "Bento 2": parseInt(document.getElementById('b2').value) || 0,
    "Bento 3": parseInt(document.getElementById('b3').value) || 0,
  };
  const total = Object.values(amounts).reduce((s, v) => s + v, 0);
  if (total === 0) return;

  
  const totals = {};
  for (const [name, amt] of Object.entries(amounts)) {
    if (!amt) continue;
    for (const item of BENTO_DATA[name]) {
      if (!totals[item.ingred]) totals[item.ingred] = { qty: 0, weight: item.weight };
      totals[item.ingred].qty += item.qty * amt;
    }
  }

  
  const packRows = [], seasonRows = [];
  let totalWeight = 0;
  for (const [ingred, d] of Object.entries(totals)) {
    const isPack = ingred.startsWith('Pack');
    const w = d.qty * d.weight;
    const row = {
      ingred,
      qty:       d.qty,
      rawQty:    isPack ? d.qty * 2 : null,
      rawWeight: isPack ? (d.qty * 2 * 0.2).toFixed(2) : null,
      weight:    w.toFixed(2),
    };
    if (isPack) { totalWeight += w; packRows.push(row); }
    else seasonRows.push(row);
  }

  
  const tbody = document.getElementById('ingred-body');
  tbody.innerHTML = '';
  packRows.forEach((r, i) => {
    tbody.insertAdjacentHTML('beforeend',
      `<tr class="${i % 2 === 0 ? 'row-odd' : 'row-even'}"><td>${r.ingred}</td><td>${r.qty}</td><td>${r.rawQty}</td><td>${r.rawWeight}</td><td>${r.weight}</td></tr>`);
  });
  const totalRawWeight = packRows.reduce((s, r) => s + parseFloat(r.rawWeight), 0);
  tbody.insertAdjacentHTML('beforeend',
    `<tr class="total-row"><td colspan="3">น้ำหนักรวม</td><td>${totalRawWeight.toFixed(2)} kg</td><td>${totalWeight.toFixed(2)} kg</td></tr>`);

  
  const chkWrap = document.getElementById('checklist-wrap');
  chkWrap.innerHTML = '';
  for (const r of packRows) {
    const row = document.createElement('div');
    row.className = 'chk-row';
    row.innerHTML = `
      <input type="checkbox" onchange="this.closest('.chk-row').classList.toggle('done', this.checked)">
      <span class="chk-name">${r.ingred}</span>
      <span class="chk-num">${r.qty} แพ็ค</span>
      <span class="chk-num" style="color:var(--text-soft)">${r.rawQty} ชิ้น</span>`;
    chkWrap.appendChild(row);
  }

  
  const seasonQty  = seasonRows.reduce((s, r) => s + r.qty, 0);
  const costIngred = seasonQty * 10;
  const costCraft  = total * 50;
  const costTotal  = costIngred + costCraft;
  document.getElementById('cost-ingred-qty').textContent = `${seasonQty} ชิ้น × 10 KKD`;
  document.getElementById('cost-ingred-val').textContent = `${costIngred.toLocaleString()} KKD`;
  document.getElementById('cost-craft-qty').textContent  = `${total} ชิ้น × 50 KKD`;
  document.getElementById('cost-craft-val').textContent  = `${costCraft.toLocaleString()} KKD`;
  document.getElementById('cost-total-val').textContent  = `${costTotal.toLocaleString()} KKD`;

  document.getElementById('bento-result').style.display = 'block';
  document.getElementById('bento-howto').style.display = 'none';
}

function clearBento() {
  ['b1', 'b2', 'b3'].forEach(id => document.getElementById(id).value = 0);
  document.getElementById('bento-result').style.display = 'none';
  document.getElementById('bento-howto').style.display = 'block';
}

function calcProcess() {
  const rawQty    = parseInt(document.getElementById('rawQty').value)     || 0;
  const bagWeight = parseFloat(document.getElementById('bagWeight').value) || 0;
  const ratioIn   = parseInt(document.getElementById('ratioIn').value)    || 4;
  const ratioOut  = parseInt(document.getElementById('ratioOut').value)   || 2;
  if (rawQty <= 0 || bagWeight <= 0) return;

  const itemsPerRound = Math.floor(bagWeight / 0.2);
  if (itemsPerRound <= 0) return;
  const setsPerRound  = Math.floor(itemsPerRound / ratioIn);
  const rawPerRound   = setsPerRound * ratioIn;
  const packsPerRound = setsPerRound * ratioOut;
  if (rawPerRound <= 0) return;

  const totalRounds   = Math.ceil(rawQty / rawPerRound);
  const lastRoundRaw  = rawQty - (totalRounds - 1) * rawPerRound;
  const lastRoundPack = Math.floor(lastRoundRaw / ratioIn) * ratioOut;
  const leftover      = lastRoundRaw % ratioIn;
  const totalPacks    = (totalRounds - 1) * packsPerRound + lastRoundPack;

  document.getElementById('p-capacity').textContent    = `${itemsPerRound} ชิ้น`;
  document.getElementById('p-per-round').textContent   = `${rawPerRound} ชิ้น → ${packsPerRound} แพ็ค`;
  document.getElementById('p-rounds').textContent      = `${totalRounds} รอบ`;
  document.getElementById('p-total-packs').textContent = `${totalPacks} แพ็ค`;

  const tbody = document.getElementById('rounds-body');
  tbody.innerHTML = '';
  for (let i = 1; i <= totalRounds; i++) {
    const isLast = i === totalRounds;
    const raw  = isLast ? lastRoundRaw  : rawPerRound;
    const pack = isLast ? lastRoundPack : packsPerRound;
    tbody.insertAdjacentHTML('beforeend',
      `<tr class="${(i - 1) % 2 === 0 ? 'row-odd' : 'row-even'} round-row">
        <td>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" style="width:16px;height:16px;accent-color:var(--accent);flex-shrink:0;"
              onchange="this.closest('tr').classList.toggle('done-row', this.checked)">
            รอบที่ ${i}
          </label>
        </td>
        <td>${raw} ชิ้น</td>
        <td>${pack} แพ็ค</td>
      </tr>`);
  }
  tbody.insertAdjacentHTML('beforeend',
    `<tr class="total-row"><td>รวม</td><td>${rawQty} ชิ้น</td><td>${totalPacks} แพ็ค</td></tr>`);

  const warnEl = document.getElementById('proc-warn');
  warnEl.innerHTML = leftover > 0
    ? `<div class="warn">⚠️ ของดิบเหลือ <b>${leftover} ชิ้น</b> ในรอบสุดท้าย (ต้องการ ${ratioIn} ชิ้นต่อการแปรรูป 1 ครั้ง)</div>`
    : '';

  document.getElementById('proc-result').style.display = 'block';
  document.getElementById('process-howto').style.display = 'none';
}

function clearProcess() {
  document.getElementById('rawQty').value    = 0;
  document.getElementById('bagWeight').value = 0;
  document.getElementById('ratioIn').value   = 4;
  document.getElementById('ratioOut').value  = 2;
  document.getElementById('proc-result').style.display = 'none';
  document.getElementById('process-howto').style.display = 'block';
}

(function () {
  const btn   = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    btn.textContent = '☀️ Light';
  }
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const light = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', light ? 'light' : 'dark');
    btn.textContent = light ? '☀️ Light' : '🌙 Dark';
  });
})();