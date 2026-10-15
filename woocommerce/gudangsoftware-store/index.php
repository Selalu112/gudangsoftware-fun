<?php if (!defined('ABSPATH')) exit; get_header(); ?>
<div class="wrap content-wrap"><div class="content-panel">
<?php if (have_posts()) { while(have_posts()) { the_post(); ?><article <?php post_class(); ?>><h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1><div><?php the_content(); ?></div></article><?php } the_posts_pagination(); } else { ?><h1>Konten belum tersedia</h1><?php } ?>
</div></div><?php get_footer(); ?>
