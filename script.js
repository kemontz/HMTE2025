let userNama = '';
let userNpm = '';

function showTab(tabName) {
  // Remove active class from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  // Add active to clicked button
  if(tabName === 'voting') document.getElementById('tab-voting-btn').classList.add('active');
  else if(tabName === 'statistik') document.getElementById('tab-statistik-btn').classList.add('active');

  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  // Show selected tab
  if(tabName === 'voting') {
    document.getElementById('tab-voting').style.display = 'block';
  } else if(tabName === 'statistik') {
    document.getElementById('tab-statistik').style.display = 'block';
  }
}

function enableVoting() {
  const nama = document.getElementById('nama').value.trim();
  const npm = document.getElementById('npm').value.trim();

  if (!nama || !npm) {
    alert("Nama dan NPM wajib diisi.");
    return;
  }

  userNama = nama;
  userNpm = npm;

  document.querySelector('.form-group').style.display = 'none';
  document.getElementById('candidates').style.display = 'grid';
}

function vote(name) {
  if (localStorage.getItem('voted')) {
    document.getElementById('status').innerText = "Kamu sudah memilih!";
    return;
  }

  // Simulasi push ke backend (ganti dengan fetch POST ke server asli)
  // Di sini kita simpan vote lokal saja sebagai contoh
  let votes = JSON.parse(localStorage.getItem('votes')) || {};
  votes[name] = (votes[name] || 0) + 1;
  localStorage.setItem('votes', JSON.stringify(votes));

  const voteData = {
    nama: userNama,
    npm: userNpm,
    pilihan: name,
    waktu: new Date().toLocaleString()
  };
  localStorage.setItem('voted', JSON.stringify(voteData));
  document.getElementById('status').innerText = `Kamu memilih ${name}. Terima kasih!`;

  // Setelah voting disable pilihan
  document.getElementById('candidates').style.pointerEvents = 'none';
}

function unlockStat() {
  const pwd = prompt("Masukkan password admin:");
  if (pwd === "admin123") { // Ganti password sesuai keinginan
    showTab('statistik');
    renderChart();
  } else {
    alert("Password salah!");
  }
}

function renderChart() {
  const votes = JSON.parse(localStorage.getItem('votes')) || {};
  const labels = Object.keys(votes);
  const dataVotes = Object.values(votes);

  // Jika belum ada suara, tampilkan pesan kosong
  if(labels.length === 0) {
    alert('Belum ada suara yang masuk.');
    return;
  }

  const totalVotes = dataVotes.reduce((a,b) => a + b, 0);
  const percentages = dataVotes.map(v => ((v / totalVotes) * 100).toFixed(2));

  const ctx = document.getElementById('chart').getContext('2d');
  
  // Hapus chart lama jika ada (Chart.js v3+)
  if(window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: percentages,
        backgroundColor: ['#4f46e5', '#f97316', '#10b981'],
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    }
  });
}

// Inisialisasi tab voting pada load
showTab('voting');
