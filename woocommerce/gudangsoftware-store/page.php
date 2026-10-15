<?php if (!defined('ABSPATH')) exit; get_header(); ?>
<div class="wrap content-wrap"><div class="content-panel">
<?php while(have_posts()) { the_post(); ?><article <?php post_class(); ?>><h1><?php the_title(); ?></h1><div><?php the_content(); wp_link_pages(); ?></div></article><?php } ?>
</div></div><?php get_footer(); ?>
