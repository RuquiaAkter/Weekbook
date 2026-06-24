let data = JSON.parse(localStorage.getItem('daybookData')) || {
  prayers: Array(7).fill(0).map(() => ({fajr:false, dhuhr:false, asr:false, maghrib:false, isha:false})),
  study: Array(7).fill(false),
  exercise: Array(7).fill(false),
  meditation: Array(7).fill(false),
  morningSkin: Array(7).fill(false),
  nightSkin: Array(7).fill(false),
  diet: Array(7).fill(false),
  chores: false
};

function calc() {
  let s = 0;
  
  // 1. Prayers: 35pts (1 pt per prayer * 5 prayers/day)
  data.prayers.forEach(d => Object.values(d).forEach(v => { if(v) s += 1; }));
  
  // 2. Study: 35pts (5 pts/day)
  data.study.forEach(v => { if(v) s += 5; });
  
  // 3. Exercise: 8pts cap (2 pts/day)
  let exCount = 0;
  data.exercise.forEach(v => { if(v) exCount++; });
  s += Math.min(exCount * 2, 8); 
  
  // 4. Habits: 22pts total
  data.meditation.forEach(v => { if(v) s += 1; });      // 7 pts
  data.morningSkin.forEach(v => { if(v) s += 0.5; });   // 3.5 pts
  data.nightSkin.forEach(v => { if(v) s += 0.5; });     // 3.5 pts
  data.diet.forEach(v => { if(v) s += 1; });            // 7 pts
  if(data.chores) s += 1;                               // 1 pt
  
  return Math.min(Math.round(s), 100);
}

function save() { localStorage.setItem('daybookData', JSON.stringify(data)); render(); }

function render() {
  const c = document.getElementById('checklist-container');
  const d = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  c.innerHTML = `
    <details open><summary>🌅 Prayers (35pts)</summary>${data.prayers.map((p,i)=>`<div class="task-row">${d[i]}: ${Object.keys(p).map(k=>`<input type="checkbox" ${p[k]?"checked":""} onchange="data.prayers[${i}].${k}=!data.prayers[${i}].${k}; save()"> ${k}`).join(' ')}</div>`).join('')}</details>
    <details><summary>📚 ARE Study (35pts)</summary>${data.study.map((v,i)=>`<div class="task-row"><input type="checkbox" ${v?"checked":""} onchange="data.study[${i}]=!data.study[${i}]; save()"> ${d[i]} ARE Study</div>`).join('')}</details>
    <details><summary>💪 Exercise (8pts max)</summary>${data.exercise.map((v,i)=>`<div class="task-row"><input type="checkbox" ${v?"checked":""} onchange="data.exercise[${i}]=!data.exercise[${i}]; save()"> ${d[i]} Exercise</div>`).join('')}</details>
    <details><summary>🧘 Meditation (7pts)</summary>${data.meditation.map((v,i)=>`<div class="task-row"><input type="checkbox" ${v?"checked":""} onchange="data.meditation[${i}]=!data.meditation[${i}]; save()"> ${d[i]} Meditation</div>`).join('')}</details>
    <details><summary>🧼 Skincare (7pts)</summary>${data.morningSkin.map((v,i)=>`<div class="task-row">${d[i]}: <input type="checkbox" ${v?"checked":""} onchange="data.morningSkin[${i}]=!data.morningSkin[${i}]; save()"> Morning <input type="checkbox" ${data.nightSkin[i]?"checked":""} onchange="data.nightSkin[${i}]=!data.nightSkin[${i}]; save()"> Night</div>`).join('')}</details>
    <details><summary>🚫 Diet (Sugar Cut) (7pts)</summary>${data.diet.map((v,i)=>`<div class="task-row"><input type="checkbox" ${v?"checked":""} onchange="data.diet[${i}]=!data.diet[${i}]; save()"> ${d[i]} Diet</div>`).join('')}</details>
    <details><summary>🧹 Chores (Clean/Laundry/Cook) (1pt)</summary><div class="task-row"><input type="checkbox" ${data.chores?"checked":""} onchange="data.chores=!data.chores; save()"> Weekly Chores</div></details>`;
  document.getElementById('score-board').innerText = `Score: ${calc()}/100`;
}
render();
