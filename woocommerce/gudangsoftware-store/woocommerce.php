<?php if (!defined('ABSPATH')) exit; get_header(); ?>
<div class="wrap content-wrap"><div class="content-panel">
<?php if (function_exists('woocommerce_content')) woocommerce_content(); else echo '<p>WooCommerce belum aktif.</p>'; ?>
</div></div><?php get_footer(); ?>
