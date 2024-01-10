/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { Icon, starEmpty } from '@wordpress/icons';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

registerBlockType( metadata, {
	icon: {
		src: (
			<Icon
				icon={ starEmpty }
				className="wc-block-editor-components-block-icon"
			/>
		),
	},
	attributes: {
		...metadata.attributes,
	},
	edit,
	save: InnerBlocks.Content,
} );
