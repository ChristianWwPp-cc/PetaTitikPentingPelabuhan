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
    print("Salin data dari file JSON ini ke array di script.js!")
