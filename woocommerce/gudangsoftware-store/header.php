<?php if (!defined('ABSPATH')) exit; ?>
<!doctype html><html <?php language_attributes(); ?>><head>
<meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?></head><body <?php body_class(); ?>><?php wp_body_open(); ?>
<a class="skip-link" href="#main-content">Lewati ke konten</a>
<div class="topbar">GudangSoftware — Solusi digital untuk pekerjaan dan bisnis</div>
<header class="site-header"><div class="wrap headrow">
<a class="brand" href="<?php echo esc_url(home_url('/')); ?>"><span class="brand-mark">G</span><span>Gudang<strong>Software</strong></span></a>
<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-primary">☰ Menu</button>
<nav class="nav" id="nav-primary" aria-label="Navigasi utama">
<?php if (has_nav_menu('primary')) {
    wp_nav_menu(array('theme_location'=>'primary','container'=>false,'depth'=>2));
} else { ?>
<ul><li><a href="<?php echo esc_url(home_url('/')); ?>">Beranda</a></li><li><a href="<?php echo esc_url(gs_shop_url()); ?>">Semua Produk</a></li><li><a href="<?php echo esc_url(home_url('/contact/')); ?>">Kontak</a></li></ul>
<?php } ?></nav>
<div class="actions">
<?php if (class_exists('WooCommerce')) { ?>
<a class="account" href="<?php echo esc_url(gs_account_url()); ?>">Akun</a>
<a class="cart" href="<?php echo esc_url(gs_cart_url()); ?>">🛒 <span class="cart-count"><?php echo esc_html((string)gs_cart_count()); ?></span></a>
<?php } else { ?><a class="btn" href="<?php echo esc_url(gs_shop_url()); ?>">Katalog</a><?php } ?>
</div></div></header><main class="main-content" id="main-content">
