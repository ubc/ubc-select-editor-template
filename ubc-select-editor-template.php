<?php
/**
 * UBC Select Editor Template
 *
 * @package     PluginPackage
 * @author      Richard Tape
 * @copyright   2019 Richard Tape
 * @license     GPL-2.0+
 *
 * @wordpress-plugin
 * Plugin Name: UBC Select Editor Template
 * Plugin URI:  https://ctlt.ubc.ca/
 * Description: Choose from pre-defined block templates
 * Version:     0.1.0
 * Author:      Rich Tape
 * Author URI:  https://blogs.ubc.ca/richardtape
 * Text Domain: ubc-select-editor-template
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * Based firmly on the work done by Jeremy Felt at Happy Prime
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once plugin_dir_path( __FILE__ ) . 'includes/ubc-select-editor-template.php';
