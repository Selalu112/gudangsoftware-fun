<?php if (!defined('ABSPATH')) exit; get_header(); ?>
<section class="hero"><div class="wrap hero-grid"><div>
<p class="eyebrow">✦ GudangSoftware Digital Store</p>
<h1>Software & produk digital untuk <em>bisnis Anda.</em></h1>
<p>Temukan template website, source code aplikasi, plugin, dan solusi digital yang bisa Anda pilih sesuai kebutuhan.</p>
<div class="hero-buttons"><a class="btn" href="<?php echo esc_url(gs_shop_url()); ?>">Jelajahi Produk →</a><a class="btn secondary" href="#kategori">Pilih Kategori</a></div>
<div class="hero-points"><span>Produk digital</span><span>Checkout WooCommerce</span><span>Informasi lisensi</span></div>
</div><div class="visual" aria-hidden="true"><h3>Kategori Pilihan</h3>
<div class="visual-row"><span class="visual-icon">🌐</span><div><b>Template Website</b><small>Website untuk profil dan toko bisnis</small></div></div>
<div class="visual-row"><span class="visual-icon">💻</span><div><b>Script & Aplikasi</b><small>Solusi pengelolaan bisnis</small></div></div>
<div class="visual-row"><span class="visual-icon">🧩</span><div><b>Plugin & Tools</b><small>Alat pendukung kerja sehari-hari</small></div></div></div></div></section>
<section class="section" id="kategori"><div class="wrap">
<div class="section-heading"><div><p class="eyebrow">Kategori</p><h2>Temukan yang Anda butuhkan</h2><p>Jelajahi kategori yang sudah tersedia di toko.</p></div></div>
<div class="categories">
<?php if (taxonomy_exists('product_cat')) {
 $cats=get_terms(array('taxonomy'=>'product_cat','hide_empty'=>true,'number'=>8,'orderby'=>'name'));
 if (!is_wp_error($cats) && count($cats)) {
  foreach($cats as $cat) {
    $link=get_term_link($cat);
    if (is_wp_error($link)) continue;
    echo '<a class="cat-card" href="'.esc_url($link).'"><span class="emoji">📦</span><h3>'.esc_html($cat->name).'</h3><p>'.esc_html((string)$cat->count).' produk →</p></a>';
  }
 } else echo '<div class="empty">Kategori akan muncul ketika produk sudah diterbitkan.</div>';
} else echo '<div class="empty">Aktifkan plugin WooCommerce untuk menampilkan kategori.</div>'; ?>
</div></div></section>
<section class="section white"><div class="wrap">
<div class="section-heading"><div><p class="eyebrow">Katalog Terbaru</p><h2>Produk GudangSoftware</h2><p>Daftar produk terbaru langsung dari WooCommerce.</p></div><a class="text-link" href="<?php echo esc_url(gs_shop_url()); ?>">Lihat semua produk →</a></div>
<?php
if (function_exists('wc_get_products')) {
 $ids=wc_get_products(array('limit'=>8,'status'=>'publish','orderby'=>'date','order'=>'DESC','return'=>'ids'));
 if ($ids) echo do_shortcode('[products limit="8" columns="4" orderby="date" order="DESC"]');
 else echo '<div class="empty">Produk belum diterbitkan. Tambahkan produk asli, harga, foto, informasi lisensi, dan file digital melalui dashboard WooCommerce.</div>';
} else echo '<div class="empty">WooCommerce belum aktif. Katalog dan tombol pembelian akan muncul setelah toko dikonfigurasi.</div>';
?>
</div></section>
<section class="section"><div class="wrap">
<div class="section-heading"><div><p class="eyebrow">Cara Berbelanja</p><h2>Belanja mudah dan terarah</h2></div></div>
<div class="benefits">
<div class="benefit"><span>🔎</span><h3>1. Pilih Produk</h3><p>Baca spesifikasi, kecocokan, dokumentasi, serta ketentuan lisensi sebelum membeli.</p></div>
<div class="benefit"><span>🛒</span><h3>2. Checkout</h3><p>Gunakan keranjang dan metode pembayaran resmi yang sudah disiapkan di WooCommerce.</p></div>
<div class="benefit"><span>📥</span><h3>3. Terima Produk</h3><p>Produk unduhan tersedia setelah pembayaran sah sesuai pengaturan toko.</p></div>
</div></div></section>
<section class="section white"><div class="wrap"><div class="cta"><div><h2>Perlu solusi digital khusus?</h2><p>Hubungi kami untuk membahas pengembangan aplikasi atau website.</p></div><a class="btn" href="<?php echo esc_url(home_url('/contact/')); ?>">Hubungi Kami →</a></div></div></section>
<?php get_footer(); ?>
