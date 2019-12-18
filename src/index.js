import { synchronizeBlocksWithTemplate } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { select, subscribe, dispatch, withSelect } from '@wordpress/data';
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import { Fragment } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';

import find from 'lodash/find';

// Provide a default, empty template to ensure at least one option.
const globalTemplates = [
	{
		id: 'default',
		text: 'Default',
		template: [],
		templateLock: false,
	},
];

// Track the previous template to allow for a revert if necessary.
let previousTemplateKey = '';

// Provide a default value if a key has not been stored.
window.SelectEditorTemplate = ( typeof window.SelectEditorTemplate === 'undefined' ) ? { template: '' } : window.SelectEditorTemplate;

// Track the current template. This can be preloaded via the post's post meta
// and provided in the global SelectEditorTemplate object.
let currentTemplateKey  = window.SelectEditorTemplate.template === '' ? 'default' : window.SelectEditorTemplate.template;

// Provide a list of available templates.
// Applies a filter so that the available templates can be extended as required.
const getTemplates = function() {
	return applyFilters( 'selectEditorTemplate.getTemplates', globalTemplates );
}

// Change the block template used in the editor.
// Note: This currently replaces *all* blocks and does not save content.
const changeTemplate = function() {
	const { updateEditorSettings } = dispatch( 'core/editor' );
	const { resetBlocks } = dispatch( 'core/block-editor' );

	// Look for a template matching the given template key.
	const newTemplate = find( getTemplates(), ( template ) => template.id === currentTemplateKey );

	// If a valid template exists, reset the existing editor.
	if ( newTemplate ) {
		resetBlocks( synchronizeBlocksWithTemplate( [], newTemplate.template ) );
		const templateLock = newTemplate.templateLock;
		updateEditorSettings( { templateLock } );
	} else {
		// No template matching that key exists; revert.
		currentTemplateKey = previousTemplateKey;
	}
}

// Subscribe callback for the editor. Determines whether the EditorTemplate
// attribute has been modified and initiates a template change if so.
const watchTemplate = function() {
	let newTemplateKey = select( 'core/editor' ).getEditedPostAttribute( 'EditorTemplate' );

	if ( newTemplateKey !== undefined && newTemplateKey !== currentTemplateKey ) {
		previousTemplateKey = currentTemplateKey;
		currentTemplateKey = newTemplateKey;

		changeTemplate();
	}
}

// Dispatch the template attribute for storage when modified.
const onUpdatePostTemplate = function( template ) {
	dispatch( 'core/editor' ).editPost( { EditorTemplate: template } );
};

// Provide the editor template selector control.
function selectEditorTemplate () {
	const selectorId = 'editor-template-selector';

	// https://developer.wordpress.org/block-editor/components/dropdown-menu/

	return (
		<Fragment>
			<div className="editor-post-select-editor-template__content">
				<label htmlFor={ selectorId }>{ __( 'Content Template' ) }</label>
				<SelectControl
					value={ currentTemplateKey }
					onChange={ ( template ) => onUpdatePostTemplate( template ) }
					id={ selectorId }
					options={ getTemplates().map( ( template ) => ( {
						label: template.text,
						value: template.id,
					} ) ) }
				/>
			</div>
		</Fragment>
	);
}

// Register SelectTemplate as a useable component.
const SelectEditorTemplateControl = withSelect( ( select ) => {
	const selectedTemplateKey = select( 'core/editor' ).getEditedPostAttribute( 'EditorTemplate' );

	return {
		selectedTemplateKey,
	};
} )( selectEditorTemplate );

// Subscribes to editor changes.
subscribe( () => {
	watchTemplate();
} );

// Register this all as a plugin and render it inside the existing
// core PluginPostStatusInfo component.
registerPlugin(
	'select-editor-template',
	{
		render() {
			return (
				<PluginPostStatusInfo>
					<SelectEditorTemplateControl />
				</PluginPostStatusInfo>
			);
		},
	}
);
