# GudangSoftware → WooCommerce (15 Oktober 2026)

Tema siap pasang ada pada folder `woocommerce/gudangsoftware-store/`.
Repositori root berisi situs statis 27 alat lama. **Root sengaja tidak dihapus agar website lama tidak rusak sebelum WordPress siap.** Ini proyek migrasi WooCommerce, bukan simulasi toko HTML.

## Cara instal
1. Siapkan hosting WordPress dengan PHP dan database; GitHub Pages **tidak** bisa menjalankan WooCommerce.
2. Instal WordPress dan plugin resmi WooCommerce pada hosting / subdomain staging.
3. ZIP **folder** `gudangsoftware-store` (file `style.css` harus berada langsung di dalam folder ZIP).
4. WordPress → Tampilan → Tema → Tambah Baru → Unggah Tema; aktifkan.
5. WooCommerce → Settings: negara Indonesia, mata uang IDR, alamat, pengaturan pajak sesuai kebutuhan.
6. Buat kategori produk (Template Website, Script Aplikasi, Plugin & Tools, Template Dokumen, Layanan Digital) dan produk yang benar-benar Anda miliki.
7. Untuk produk file ZIP/PDF, centang **Virtual** + **Downloadable** dan unggah file unduhan terlindungi melalui WooCommerce; tetapkan harga, lisensi dan kebijakan dukungan. Jangan bagikan URL file publik di GitHub.
8. Siapkan payment gateway resmi melalui plugin WooCommerce, gunakan sandbox untuk uji transaksi terlebih dahulu.
9. Pastikan Shop, Cart, Checkout, My Account telah dibuat; periksa halaman email dan akses unduhan setelah pembayaran.
10. Buat halaman Kontak (slug `contact`), Ketentuan (slug `terms`) dan atur halaman privasi di Settings → Privacy.
11. Uji lengkap di staging, backup, lalu arahkan domain GudangSoftware ke hosting WordPress. Redirect `privasi.html` dan `ketentuan.html` ke halaman baru dan kirim sitemap WordPress ke Google Search Console.

## Yang sudah ada
- Desain toko responsif (desktop/mobile), beranda, kategori, produk dinamis, menu, cart dan akun.
- WooCommerce resmi menangani produk, harga, pajak, transaksi, checkout dan link unduhan.
- Tanpa script iklan Monetag/service worker/checkout palsu.
- Katalog rencana dalam `woocommerce/katalog-rencana.csv` bukan produk aktif.

## Belum live
- Hosting WordPress, gateway pembayaran, alamat domain baru, file ZIP produk asli, lisensi serial untuk software, dan pengalihan DNS belum dikonfigurasi.
- Tema tidak otomatis membuat serial key; lisensi aktivasi memerlukan plugin/sistem lisensi terpisah.
- Alat HTML lama tetap diarsipkan dan tidak otomatis dijual.
- Hanya jual software milik sendiri atau yang disertai izin distribusi ulang sah.
