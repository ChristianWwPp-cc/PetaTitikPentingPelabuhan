// Data yang DIBUAT oleh Python (Salin dari lokasi_data.json ke sini)
const lokasiData = [
    // Struktur data: { "id": 1, "nama": "Depot BBM Fiktif - (1)", "lat": -6.879, "lon": 112.435, "kategori": "Perbekalan" }
    // Isi array ini dengan data hasil generate Python kamu!
];


// Variabel Global
let map;
let markerLayer = L.layerGroup(); // Layer untuk menampung semua marker
let selectedMarkers = []; // Array untuk menyimpan marker yang dipilih untuk hitung jarak


// --- FUNGSI 1: INISIALISASI PETA ---
function initMap() {
    // Koordinat pusat peta (Lamongan fiktif)
    const latPusat = -6.8797;
    const lonPusat = 112.4278;

    // Inisialisasi peta Leaflet
    map = L.map('map').setView([latPusat, lonPusat], 14); // Angka 14 adalah tingkat zoom

    // Tambahkan layer peta (Tile Layer dari OpenStreetMap)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | Proyek SMK Maritim'
    }).addTo(map);

    // Tambahkan layer marker ke peta
    markerLayer.addTo(map);

    // Tampilkan semua marker saat inisialisasi
    displayMarkers(lokasiData);
}

// --- FUNGSI 2: MENAMPILKAN MARKER BERDASARKAN FILTER ---
function displayMarkers(data) {
    markerLayer.clearLayers(); // Hapus marker yang ada
    const listHtml = document.getElementById('hasil-pencarian');
    listHtml.innerHTML = ''; // Kosongkan list HTML

    data.forEach(lokasi => {
        // 1. Buat Marker di Peta
        const marker = L.marker([lokasi.lat, lokasi.lon]);
        marker.bindPopup(`<b>${lokasi.nama}</b><br>${lokasi.kategori}`);
        
        // Tambahkan event click untuk menghitung jarak
        marker.on('click', function(e) {
            handleMarkerClick(lokasi);
        });

        markerLayer.addLayer(marker);

        // 2. Tampilkan di List Sidebar
        listHtml.innerHTML += `
            <p class="list-item" data-lat="${lokasi.lat}" data-lon="${lokasi.lon}">
                <strong>${lokasi.nama}</strong> <br> [${lokasi.kategori}]
            </p>
        `;
    });
}

// --- FUNGSI 3: FILTER MARKER ---
function filterMarkers(kategori) {
    if (kategori === "Semua") {
        displayMarkers(lokasiData);
        return;
    }
    
    const filteredData = lokasiData.filter(lokasi => lokasi.kategori === kategori);
    displayMarkers(filteredData);
}

// --- FUNGSI 4: LOGIKA KALKULATOR JARAK (KRITIS!) ---
function handleMarkerClick(lokasi) {
    // Batasi hanya 2 marker yang bisa dipilih
    if (selectedMarkers.length < 2 && !selectedMarkers.some(m => m.id === lokasi.id)) {
        selectedMarkers.push(lokasi);
        alert(`Lokasi ${selectedMarkers.length}: ${lokasi.nama} terpilih.`);
    }

    // Jika sudah 2 marker terpilih, hitung jarak
    if (selectedMarkers.length === 2) {
        const p1 = selectedMarkers[0];
        const p2 = selectedMarkers[1];
        
        // *** BAGIAN KRITIS: RUMUS HAERSINE SEDERHANA ***
        // Gunakan rumus sederhana JS untuk mendapatkan jarak antar dua koordinat
        const R = 6371; // Radius bumi dalam km
        const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
        const dLon = (p2.lon - p1.lon) * (Math.PI / 180);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(p1.lat * (Math.PI / 180)) * Math.cos(p2.lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const jarakKm = R * c; // Hasil dalam kilometer

        document.getElementById('jarak-output').innerHTML = `
            Jarak antara **${p1.nama}** dan **${p2.nama}**: **${jarakKm.toFixed(2)} km**
        `;
        
        // Reset pilihan setelah perhitungan
        selectedMarkers = [];
    }
}


// --- EKSEKUSI UTAMA ---
document.addEventListener('DOMContentLoaded', initMap);
