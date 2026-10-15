<?php
if (!defined('ABSPATH')) exit;
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', array('search-form', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('custom-logo');
    add_theme_support('woocommerce', array('product_grid' => array('default_rows' => 3, 'min_rows' => 1, 'max_rows' => 6, 'default_columns' => 4, 'min_columns' => 1, 'max_columns' => 4)));
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    register_nav_menus(array('primary' => 'Menu Utama'));
});
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('gs-store', get_stylesheet_uri(), array(), wp_get_theme()->get('Version'));
    wp_enqueue_script('gs-store-js', get_template_directory_uri() . '/assets/store.js', array(), wp_get_theme()->get('Version'), true);
});
function gs_shop_url() {
    $id = function_exists('wc_get_page_id') ? wc_get_page_id('shop') : 0;
    return $id > 0 ? get_permalink($id) : home_url('/shop/');
}
function gs_cart_url() { return function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/'); }
function gs_account_url() { return function_exists('wc_get_page_permalink') ? wc_get_page_permalink('myaccount') : home_url('/'); }
function gs_cart_count() { return function_exists('WC') && WC()->cart ? WC()->cart->get_cart_contents_count() : 0; }
add_filter('woocommerce_add_to_cart_fragments', function ($fragments) {
    $fragments['.cart-count'] = '<span class="cart-count">' . esc_html((string)gs_cart_count()) . '</span>';
    return $fragments;
});
