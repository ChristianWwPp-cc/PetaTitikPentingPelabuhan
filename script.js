// Data yang DIBUAT oleh Python (Salin dari lokasi_data.json ke sini)
const lokasiData = [
    # coordinate_generator.py

import json
import random

# Pusat koordinat fiktif (Contoh area Pelabuhan Lamongan)
LAT_CENTER = -6.8797
LON_CENTER = 112.4278

# --- FUNGSI PYTHON (MODULAR) UNTUK MEMBUAT DATA LOKASI ---
def generate_point_of_interest(num_points=20):
    """
    Menghasilkan array (List) berisi data lokasi fiktif secara efisien
    menggunakan loop dan logika random.
    """
    
    list_lokasi = []
    
    # Daftar kategori dan nama fiktif
    kategori_list = ["Perbekalan", "Layanan Kapal", "Area Larangan"]
    nama_list = ["Depot BBM Fiktif", "Warung Nelayan Jaya", "Dermaga 03", 
                 "Kantor Syahbandar Fiktif", "Area Konservasi", "Bengkel Las Kapal"]

    for i in range(num_points):
        # Generate koordinat fiktif di sekitar pusat
        lat = LAT_CENTER + random.uniform(-0.01, 0.01) 
        lon = LON_CENTER + random.uniform(-0.02, 0.02)
        
        # Pilih kategori dan nama secara acak
        kategori = random.choice(kategori_list)
        nama = random.choice(nama_list) + f" - ({i+1})"
        
        data_point = {
            "id": i + 1,
            "nama": nama,
            "lat": round(lat, 5),
            "lon": round(lon, 5),
            "kategori": kategori
        }
        list_lokasi.append(data_point)
        
    return list_lokasi

# --- EKSEKUSI DAN EXPORT DATA ---
if __name__ == "__main__":
    data_final = generate_point_of_interest(20) # Buat 20 titik
    
    # Ekspor ke file JSON agar mudah di-copy ke JavaScript
    with open('lokasi_data.json', 'w') as f:
        json.dump(data_final, f, indent=4)
        
    print(f"Data {len(data_final)} titik lokasi berhasil dibuat di 'lokasi_data.json'.")
    print 
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
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | Proyek SMKN Maritim'
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
