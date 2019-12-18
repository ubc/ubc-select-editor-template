<?php

namespace UBC\SelectEditorTemplate;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_editor_assets' );
add_action( 'rest_insert_post', __NAMESPACE__ . '\\rest_save_editor_template', 10, 2 );

/**
 * Enqueue script and style assets used in the editor.
 *
 * @since 1.0.0
 */
function enqueue_editor_assets() { // phpcs:ignore
	wp_register_script(
		'select-editor-template',
		plugins_url( '/build/index.js', dirname( __FILE__ ) ),
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			'wp-editor',
			'wp-plugins',
			'wp-edit-post',
		),
		filemtime( plugin_dir_path( __DIR__ ) . 'build/index.js' ),
		true
	);

	// Provide a `SelectEditorTemplate` object containing a previously saved
	// template key if found.
	if ( is_admin() && 'post' === get_current_screen()->id ) {
		$post     = get_post();
		$template = get_post_meta( $post->ID, 'select_editor_template', true );

		if ( $template ) {
			wp_localize_script( 'select-editor-template', 'SelectEditorTemplate', array( 'template' => esc_js( $template ) ) );
		}
	}
	wp_enqueue_script( 'select-editor-template' );

	wp_enqueue_style( 'select_template-panel', plugins_url( 'build/editor.css', dirname( __FILE__ ) ) );
}

/**
 * Save the EditorTemplate parameter in post meta if found as
 * part of a REST API request to insert/update a post.
 *
 * @param \WP_Post    $post    The current post object.
 * @param \WP_Request $request The current REST API request.
 */
function rest_save_editor_template( $post, $request ) {
	if ( 'post' === $post->post_type && $request->get_param( 'EditorTemplate' ) ) {
		$template = $request->get_param( 'EditorTemplate' );
		update_post_meta( $post->ID, 'select_editor_template', sanitize_key( $template ) );
	}
}
