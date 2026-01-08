// Dashboard client behaviors: chart and calendar

async function fetchWeekly() {
  const res = await fetch('/api/dashboard/chart/weekly');
  return res.json();
}

async function renderChart() {
  const data = await fetchWeekly();
  const labels = data.map(d => d.date);
  const consultations = data.map(d => d.consultations);
  const ctx = document.getElementById('weeklyChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Consultas', data: consultations, borderColor: '#e63946', backgroundColor: 'rgba(230,57,70,0.08)', tension:0.3 }
      ]
    }
  });
}

async function initCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: '/api/dashboard/calendar-events'
  });
  calendar.render();
}

window.addEventListener('DOMContentLoaded', () => {
  renderChart();
  initCalendar();
});