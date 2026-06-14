# Mazaal AI - Multi-Agent Crypto Terminal & Contract Finder

Selamat datang di **Mazaal AI**, aplikasi web interaktif canggih yang dirancang sebagai replika platform analitis terkemuka dengan perpaduan teknologi Multi-Agent AI dan integrasi data on-chain terdesentralisasi secara real-time.

Aplikasi ini ditujukan bagi para investor, trader, dan penggiat Web3 yang membutuhkan visualisasi pasar yang cepat, presisi, serta analisis instan dari asisten kecerdasan buatan cerdas untuk berbagai aset kripto.

---

## 🚀 Fitur Unggulan

### 1. **Pencarian Alamat Kontrak Terdesentralisasi (DexScreener API)**
- **Cari Token Kustom:** Cari koin apa saja dari berbagai jaringan blockchain (Solana, Ethereum, Base, Optimism, dll) secara instan melalui input pencarian di tab **"Cari Alamat Kontrak"**.
- **Salin Alamat Kontrak Satu-Klik:** Menyediakan fungsi salin (copy) alamat smart contract koin secara aman untuk menghindari salah input atau terkena perangkap scam.
- **Trending & Boosted Profiles:** Integrasi langsung dengan endpoint profil harian terpanas dari DexScreener untuk memantau token yang sedang naik daun.

### 2. **Opsi Interaktif "Tanya AI Analisis?"**
- Setelah mencari koin pilihan di DexScreener, Anda diberikan opsi tombol **"Tanya AI Analisis?"**.
- Tombol ini akan otomatis memuat identitas token kustom tersebut (Nama, Simbol, Harga Terkini, Alamat Kontrak, Volume harian, dan Chain ID) ke dalam sistem kecerdasan buatan Mazaal.
- AI akan langsung merancang riset kustom multi-agen berdasarkan metrik rill harian tanpa mengarang data (anti-halusinasi).

### 3. **Indeks Harga Live Terpercaya (CoinGecko Feed)**
- Ticker feed interaktif di bilah sisi kiri yang terus diperbarui secara dinamis per hari untuk koin-koin papan atas seperti Bitcoin, Ethereum, Solana, Near, Ripple, dan Dogecoin.

### 4. **Orkestrasi Multi-Agent AI Terdistribusi**
Mazaal mengemulasikan kolaborasi fungsional yang solid antara tiga agen pintar:
*   🛰️ **Market Scout Agent:** Agen yang bertugas menelusuri data on-chain, harga pasar, volume harian, dan metrik momentum relatif (RSI).
*   ⚠️ **Risk Analyst Agent:** Agen penilai kerentanan kolam likuiditas on-chain, penilai tingkat volatilitas harga, dan penentu batas support/resistance kritis.
*   👑 **Chief Advisor Agent:** Agen perumus taktis yang memformulasikan kesimpulan eksekusi final, target beli ideal (*Entry limit*), sasaran keuntungan (*Take Profit*), serta pengaturan *Stop Loss* yang presisi.

### 5. **Asisten Pintar Bebas Halusinasi (Asisten AI Mazaal)**
- Chatbot asisten bantuan pelanggan bawaan di sudut kanan bawah yang diprogram untuk menjawab pertanyaan seputar platform Mazaal.
- **Akurasi Real-Time Per Hari:** Asisten AI ini dilengkapi data kontekstual harga harian yang ditarik langsung dari API CoinGecko dan DexScreener saat Anda mulai mengobrol, menjamin jawaban sepenuhnya akurat, faktual, dan kontekstual.

---

## 🛠️ Stack Teknologi

Sistem web tangguh ini dibangun secara modern menggunakan kombinasi stack full-stack:
*   **Frontend SPA:** React 18, TypeScript, dan bundler super cepat Vite.
*   **Styling & UI:** Tailwind CSS untuk tampilan modern bergaya minimalis kontras tinggi, didukung perpustakaan animasi `motion` (Framer) dan kumpulan ikon presisi dari `lucide-react`.
*   **Backend Proxy Server:** Server Express Node.js yang aman untuk menangani panggilan API di sisi server demi menjaga kerahasiaan kunci akses dan menghindari hambatan CORS peramban.
*   **AI SDK:** Integrasi dengan Google Gemini Pro & Flash (menggunakan `@google/genai` TypeScript SDK resmi) serta API pipeline multi-agen Groq LLaMA 3.3.

---

## 📦 Menjalankan Aplikasi Secara Lokal

1.  **Clone Repositori dan Masuk ke Direktori Proyek:**
    ```bash
    git clone <url-repositori-anda>
    cd mazaal-ai-terminal
    ```

2.  **Instal Seluruh Dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasikan Environment Variables (`.env`):**
    Buat file `.env` di direktori utama dan isi kredensial berikut (lihat pola contoh di `.env.example`):
    ```env
    GEMINI_API_KEY=Kunci_API_Gemini_Anda
    GROQ_API_KEY=Kunci_API_Groq_Anda
    ```

4.  **Jalankan Server Pengembangan (Dev Mode):**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan secara otomatis di port `3000` (http://localhost:3000).

5.  **Build untuk Tahap Produksi:**
    ```bash
    npm run build
    npm start
    ```

---

*Dikembangkan dengan penuh dedikasi sebagai platform simulasi analisis pasar kripto on-chain terbaik demi keputusan finansial modern yang lebih cerdas.*
