# Life Dashboard

Aplikasi dashboard produktivitas pribadi berbasis web yang berjalan langsung di browser — tanpa instalasi, tanpa server, tanpa framework.

---

## Fitur

| Widget | Fungsi |
|--------|--------|
| **Greeting** | Menampilkan waktu, tanggal, dan sapaan berdasarkan nama yang kamu masukkan |
| **Focus Timer** | Timer Pomodoro 25 menit dengan tombol Start / Stop / Reset |
| **Tasks** | Daftar tugas dengan tambah, selesaikan, hapus, dan urutkan |
| **Quick Links** | Simpan dan buka link favorit dengan sekali klik |

Semua data tersimpan otomatis ke **Local Storage** browser — tidak hilang meski halaman ditutup atau di-refresh.

---

## Cara Menjalankan

### Cara 1 — Double-click (paling mudah)

1. Buka **File Explorer**
2. Masuk ke folder project ini
3. **Double-click** file `index.html`
4. Browser akan otomatis membuka Life Dashboard

### Cara 2 — Klik kanan

1. Klik kanan pada file `index.html`
2. Pilih **"Open with"** → pilih browser (Chrome, Edge, Firefox, dll.)
3. Dashboard terbuka di browser

### Cara 3 — Drag and Drop

1. Buka browser (Chrome / Edge / Firefox)
2. Seret (drag) file `index.html` ke jendela browser
3. Dashboard langsung terbuka

> **Catatan:** Tidak perlu koneksi internet. Tidak perlu install apapun. Cukup buka file-nya.

---

## Struktur Folder

```
life-dashboard/
├── index.html        # File utama — buka ini di browser
├── css/
│   └── styles.css    # Tampilan dan tema (light/dark mode)
├── js/
│   └── app.js        # Semua logika aplikasi
└── README.md         # Dokumentasi ini
```

---

## Cara Pakai Tiap Fitur

### Greeting
- Ketik namamu di kolom input → tekan Enter
- Nama dan sapaan tersimpan otomatis

### Focus Timer
- Klik **Start** untuk mulai timer 25 menit
- Klik **Stop** untuk menjeda
- Klik **Reset** untuk kembali ke 25:00
- Browser akan memberi notifikasi saat timer selesai

### Tasks
- Ketik tugas di kolom input → klik **Add** atau tekan Enter
- Klik teks tugas untuk menandai selesai ✅
- Klik ikon 🗑️ untuk menghapus tugas
- Gunakan dropdown **Sort by** untuk mengatur urutan tampilan

### Quick Links
- Isi **Label** (nama link) dan **URL** → klik **Add**
- Klik tombol link untuk membukanya di tab baru
- Klik ikon ✕ untuk menghapus link

### Light / Dark Mode
- Klik tombol 🌙 / ☀️ di pojok kanan atas untuk ganti tema
- Pilihan tema tersimpan otomatis

---

## Data & Local Storage

Semua data disimpan di browser secara otomatis menggunakan Local Storage dengan prefix `tld_`:

| Key | Isi |
|-----|-----|
| `tld_userName` | Nama pengguna |
| `tld_tasks` | Daftar tugas |
| `tld_links` | Daftar quick links |
| `tld_sortOrder` | Preferensi urutan tugas |
| `tld_theme` | Tema (light/dark) |

**Cara cek data tersimpan:**
1. Buka DevTools → tekan `F12`
2. Pilih tab **Application**
3. Di sidebar kiri, klik **Local Storage** → pilih alamat file
4. Semua key `tld_*` akan terlihat di sana

**Catatan:** Data akan hilang jika kamu menghapus cache/data browser, atau menggunakan mode Incognito.

---

## Kompatibilitas Browser

| Browser | Status |
|---------|--------|
| Google Chrome | ✅ Didukung penuh |
| Microsoft Edge | ✅ Didukung penuh |
| Mozilla Firefox | ✅ Didukung penuh |
| Safari | ✅ Didukung penuh |

Direkomendasikan menggunakan versi browser terbaru.
