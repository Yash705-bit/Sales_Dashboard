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

// Store uploaded file paths for each widget
const widgetFilePaths = {};

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    
    // Update button states
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update tab content visibility
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
  });
});

// File input change handler
document.querySelectorAll('.file-input').forEach(input => {
  input.addEventListener('change', handleFileUpload);
});

// Make widget content clickable to open source file
document.querySelectorAll('.widget').forEach(widget => {
  const widgetId = widget.id.replace('widget-', '');
  widget.addEventListener('click', () => {
    if(widgetFilePaths[widgetId]){
      window.open(widgetFilePaths[widgetId], '_blank');
    }
  });
  widget.style.cursor = 'pointer';
});

async function handleFileUpload(e){
  const file = e.target.files[0];
  if(!file) return;
  
  const widgetId = e.target.dataset.widget;
  const widget = document.querySelector(`#widget-${widgetId}`);
  const contentDiv = widget.querySelector('.content');
  
  contentDiv.innerHTML = '<div class="row-info">Uploading and parsing...</div>';
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('widget_id', widgetId);
  
  try {
    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if(!res.ok){
      const err = await res.json();
      contentDiv.innerHTML = `<div class="error">Error: ${escapeHtml(err.error)}</div>`;
      return;
    }
    
    const result = await res.json();
    
    // Store download URL for widget click handler
    if(result.file_download_url){
      widgetFilePaths[widgetId] = result.file_download_url;
      console.log(`Widget ${widgetId} download URL:`, result.file_download_url);
    }
    
    // Special rendering for Widget 1
    if(widgetId === '1'){
      renderWidget1(contentDiv, result, widgetId);
    } else {
      renderWidgetData(contentDiv, result, widgetId);
    }
  } catch(err){
    contentDiv.innerHTML = `<div class="error">Error: ${escapeHtml(err.message)}</div>`;
  }
}

function renderWidget1(contentDiv, result, widgetId){
  if(!result.data || Object.keys(result.data).length === 0){
    contentDiv.innerHTML = '<div class="error">No data found in file</div>';
    return;
  }
  
  // Get first sheet
  const sheets = result.data;
  const firstSheet = Object.keys(sheets)[0];
  const sheetData = sheets[firstSheet];
  
  if(sheetData.error || !sheetData.columns || sheetData.columns.length === 0){
    contentDiv.innerHTML = '<div class="error">No valid data in sheet</div>';
    return;
  }
  
  // Find key columns
  const ownerCol = sheetData.columns.findIndex(c => String(c).toLowerCase().includes('opportunity') || String(c).toLowerCase().includes('owner'));
  const qtrCol = sheetData.columns.findIndex(c => String(c).toLowerCase().includes('closing') || String(c).toLowerCase().includes('qtr'));
  const tcvCol = sheetData.columns.findIndex(c => String(c).toLowerCase().includes('tcv'));
  const acvCol = sheetData.columns.findIndex(c => String(c).toLowerCase().includes('acv'));
  
  if(ownerCol === -1){
    renderWidgetData(contentDiv, result, widgetId);
    return;
  }
  
  // Group data by owner
  const grouped = {};
  sheetData.rows.forEach(row => {
    const owner = String(row[ownerCol] || '').trim();
    if(!owner || owner.toLowerCase() === 'subtotal') return;
    
    if(!grouped[owner]) grouped[owner] = [];
    grouped[owner].push(row);
  });
  
  // Render hierarchical table
  let html = `<div class="widget1-header">
    <span class="title">${escapeHtml(firstSheet)}</span>
    <span class="icons">🔄 ⛶</span>
  </div>
  <table class="widget1-table">
    <thead><tr>
      <th>${escapeHtml(sheetData.columns[ownerCol] || 'Owner')}</th>
      <th>${qtrCol >= 0 ? escapeHtml(sheetData.columns[qtrCol]) : 'Qtr'}</th>
      <th>${tcvCol >= 0 ? escapeHtml(sheetData.columns[tcvCol]) : 'TCV'}</th>
      <th>${acvCol >= 0 ? escapeHtml(sheetData.columns[acvCol]) : 'ACV'}</th>
    </tr></thead>
    <tbody>`;
  
  for(const [owner, rows] of Object.entries(grouped)){
    html += `<tr class="owner-row"><td class="owner-name">${escapeHtml(owner)}</td><td></td><td></td><td></td></tr>`;
    
    let tcvSum = 0, acvSum = 0;
    rows.slice(0, 10).forEach(row => {
      const qtr = qtrCol >= 0 ? row[qtrCol] : '';
      const tcv = tcvCol >= 0 ? parseFloat(row[tcvCol]) || 0 : 0;
      const acv = acvCol >= 0 ? parseFloat(row[acvCol]) || 0 : 0;
      tcvSum += tcv;
      acvSum += acv;
      
      html += `<tr class="data-row">
        <td></td>
        <td>${escapeHtml(String(qtr))}</td>
        <td class="number">${tcv.toFixed(2)}</td>
        <td class="number">${acv.toFixed(2)}</td>
      </tr>`;
    });
    
    html += `<tr class="subtotal-row">
      <td></td>
      <td>Subtotal</td>
      <td class="number">${tcvSum.toFixed(2)}</td>
      <td class="number">${acvSum.toFixed(2)}</td>
    </tr>`;
  }
  
  const filePath = widgetFilePaths[widgetId];
  const openFileBtn = filePath ? `<button class="open-file-btn" onclick="window.open('${filePath}', '_blank'); event.stopPropagation();">📄 Open File</button>` : '';
  
  html += `</tbody></table>
  <div class="widget1-footer">
    ${openFileBtn}
    <span class="footer-text">View Report (${escapeHtml(result.filename.slice(0, 20))}) | As of ${new Date().toLocaleString()}</span>
  </div>`;
  
  contentDiv.innerHTML = html;
}

function renderWidgetData(contentDiv, result, widgetId){
  if(!result.data || Object.keys(result.data).length === 0){
    contentDiv.innerHTML = '<div class="error">No data found in file</div>';
    return;
  }
  
  const filePath = widgetFilePaths[widgetId];
  const openFileBtn = filePath ? `<button class="open-file-btn" onclick="window.open('${filePath}', '_blank'); event.stopPropagation();">📄 Open File</button>` : '';
  
  let html = `<div class="widget-header">
    <strong>${escapeHtml(result.filename)}</strong>
    ${openFileBtn}
    <div class="row-info">${result.sheets.length} sheet(s)</div>
  </div>`;
  
  // Show first sheet with data
  for(const [sheetName, sheetData] of Object.entries(result.data)){
    if(sheetData.error){
      html += `<div class="sheet-name error">${escapeHtml(sheetName)}: ${escapeHtml(sheetData.error)}</div>`;
      continue;
    }
    
    html += `<div class="sheet-name">${escapeHtml(sheetName)}</div>`;
    html += `<div class="row-info">Rows: ${sheetData.row_count}</div>`;
    
    if(!sheetData.columns || sheetData.columns.length === 0){
      html += '<div class="row-info">No columns found</div>';
      continue;
    }
    
    if(!sheetData.rows || sheetData.rows.length === 0){
      html += '<div class="row-info">No data rows</div>';
      continue;
    }
    
    // Create table
    html += '<table><thead><tr>';
    sheetData.columns.slice(0, 5).forEach(col => {
      html += `<th>${escapeHtml(String(col).slice(0, 20))}</th>`;
    });
    if(sheetData.columns.length > 5) html += '<th>...</th>';
    html += '</tr></thead><tbody>';
    
    sheetData.rows.forEach(row => {
      html += '<tr>';
      row.slice(0, 5).forEach(cell => {
        html += `<td>${escapeHtml(String(cell).slice(0, 25))}</td>`;
      });
      if(row.length > 5) html += '<td>...</td>';
      html += '</tr>';
    });
    
    html += '</tbody></table>';
    break; // Show only first sheet for now
  }
  
  contentDiv.innerHTML = html;
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

