import { addFilter } from '@wordpress/hooks';

import find from 'lodash/find';

const filterTemplates = function( templates ) {
	if ( ! find( templates, ( template ) => template.id === 'post-with-lede' ) ) {
		templates.push(
            {
				id: 'post-with-lede',
				text: 'Post with lede',
				template: [
					[ 'core/paragraph', {
						placeholder: 'Use this paragraph to introduce the story. This text should take up at least 3 lines so that the drop cap has the intended effect.',
						dropCap: true,
					} ],
					[ 'core/image' ],
					[ 'core/paragraph', {
						placeholder: 'Begin the rest of the story...',
					} ],
				],
				templateLock: false,
			}
		);
	}

	return templates;
}

addFilter(
	'selectEditorTemplate.getTemplates',
	'select-editor-template/extend-self',
	filterTemplates
);
