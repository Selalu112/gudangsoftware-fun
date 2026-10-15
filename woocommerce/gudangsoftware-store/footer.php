<?php if (!defined('ABSPATH')) exit; ?></main>
<footer class="site-footer"><div class="wrap">
<div class="footer-grid"><div><a href="<?php echo esc_url(home_url('/')); ?>" class="brand"><span class="brand-mark">G</span> Gudang<strong>Software</strong></a><p>Produk digital, template, dan aplikasi siap pakai. Periksa deskripsi, kompatibilitas dan lisensi setiap produk sebelum membeli.</p></div>
<div class="footer-links"><h3>Belanja</h3><a href="<?php echo esc_url(gs_shop_url()); ?>">Katalog Produk</a>
<?php if (class_exists('WooCommerce')) { ?><a href="<?php echo esc_url(gs_account_url()); ?>">Akun Saya</a><a href="<?php echo esc_url(gs_cart_url()); ?>">Keranjang</a><?php } ?></div>
<div class="footer-links"><h3>Informasi</h3><?php if (get_privacy_policy_url()) { ?><a href="<?php echo esc_url(get_privacy_policy_url()); ?>">Kebijakan Privasi</a><?php } ?><a href="<?php echo esc_url(home_url('/terms/')); ?>">Ketentuan</a><a href="<?php echo esc_url(home_url('/contact/')); ?>">Kontak</a></div></div>
<div class="copyright">© <?php echo esc_html(gmdate('Y')); ?> <?php bloginfo('name'); ?>. Hak cipta dilindungi.</div></div></footer><?php wp_footer(); ?></body></html>
