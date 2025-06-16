
---

````markdown
# 📘 Manajemen Capstone – GitHub Workflow
---

## 📁 Struktur Branch

| Branch         | Fungsi                                                                      |
|----------------|-----------------------------------------------------------------------------|
| `main`         | Berisi kode paling stabil, siap rilis atau digunakan saat presentasi        |
| `dev`          | Tempat gabungan semua fitur yang sedang dikerjakan                          |
| `feature/*`    | Branch masing-masing mahasiswa sesuai fitur yang dikerjakan                 |

Contoh nama branch fitur:
- `feature/login`
- `feature/dashboard`
- `feature/grafik-laporan`

---

## 🔁 Alur Kerja Git & Perintah

### 1. 🔄 Update Kode Terbaru dari `dev`
Agar tidak ketinggalan update dari teman:
```bash
git checkout dev
git pull origin dev
````

### 2. 🌱 Buat Branch Baru untuk Fitur

Pisahkan pekerjaanmu agar rapi dan aman:

```bash
git checkout -b feature/nama-fitur
# Contoh:
git checkout -b feature/login
```

### 3. 👨‍💻 Kerjakan Kode, Simpan, dan Commit

Setelah selesai:

```bash
git add .
git commit -m "menambahkan fitur login"
```

### 4. ☁️ Upload (Push) ke GitHub

Kirim branch kamu ke GitHub:

```bash
git push origin feature/login
```

### 5. 🔀 Merge ke `dev` Jika Sudah Selesai & Dites

Jika fitur sudah berjalan baik:

```bash
git checkout dev
git pull origin dev
git merge feature/login
git push origin dev
```

### 6. 🚀 Merge `dev` ke `main` Jika Semua Fitur Stabil

Jika semua fitur sudah stabil dan tidak error:

```bash
git checkout main
git pull origin main
git merge dev
git push origin main
```

---

## 🧪 Testing Manual

* Jalankan proyek di lokal sebelum merge.
* Pastikan tidak ada error setelah digabung ke `dev`.
* Jangan merge ke `main` jika masih ada bug besar.

---

## 🛠️ Tips Kolaborasi

* Selalu `pull` dari `dev` sebelum mulai mengerjakan .
* Jangan langsung mengedit `main`.
* Gunakan `feature/nama-fitur` untuk semua pengembangan.

---
