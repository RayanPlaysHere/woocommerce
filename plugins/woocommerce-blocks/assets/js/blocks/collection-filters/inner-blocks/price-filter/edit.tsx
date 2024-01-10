/**
 * External dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { Template } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { EditProps } from './types';
import { PriceSlider } from './components/price-slider';
import { Inspector } from './components/inspector';

const Edit = ( props: EditProps ) => {
	const { showInputFields, inlineInput } = props.attributes;

	const blockProps = useBlockProps( {
		className: classNames( {
			'inline-input': inlineInput && showInputFields,
		} ),
	} );

	const template: Template[] = [
		[
			'core/heading',
			{ content: __( 'Filter by Price', 'woocommerce' ), level: 3 },
		],
	];

	return (
		<div { ...blockProps }>
			<Inspector { ...props } />
			<InnerBlocks
				template={ template }
				allowedBlocks={ [ 'core/heading' ] }
			/>
			<PriceSlider { ...props } />
		</div>
	);
};

export default Edit;
