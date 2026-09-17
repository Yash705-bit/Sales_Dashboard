// widget->filename mapping based on user's list
const widgetMapping = {
  1: "04.Travel NA Bookings.xlsx",
  2: "06.Travel NA Bookings Current Month.xlsx",
  3: "05. Travel NA Pipeline Deals.xlsx",
  4: "Travel NA Client Connect-Current Month.xlsx",
  5: "Travel NA Meeting Data Monthly.xlsx",
  6: "Travel NA Open Deals.xlsx",
  7: "04.Travel NA BE FY27_Finance.xlsx",
  8: "KPI_Report_Travel NA.xlsx",
  9: "Travel NA_Action Tracker.xlsx"
};

async function loadMapping(){
  try{
    const res = await fetch('./extracted_columns.json');
    if(!res.ok) throw new Error('Failed to load mapping JSON');
    const mapping = await res.json();
    for(let i=1;i<=9;i++){
      const el = document.querySelector('#widget-'+i+' .content');
      const fname = widgetMapping[i];
      if(!fname){ el.innerText = 'No file mapped'; continue; }
      if(!mapping[fname]){
        el.innerHTML = `<div><strong>${fname}</strong><div class="muted">(no extracted sheets found)</div></div>`;
        continue;
      }
      // take first sheet and show its column headers if present
      const sheets = mapping[fname];
      const firstSheet = Object.keys(sheets)[0];
      const cols = sheets[firstSheet] || [];
      let html = `<div><strong>${fname}</strong><div style="font-size:12px;color:#444;margin:6px 0">Sheet: ${firstSheet}</div>`;
      if(cols.length===0) html += `<div class="muted">No columns found (or sheet empty)</div>`;
      else{
        html += '<ul>' + cols.map(c=>`<li>${escapeHtml(c)}</li>`).join('') + '</ul>';
      }
      html += '</div>';
      el.innerHTML = html;
    }
  }catch(err){
    console.error(err);
    document.querySelectorAll('.content').forEach(c=>c.innerText='Error loading mapping');
  }
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

loadMapping();
