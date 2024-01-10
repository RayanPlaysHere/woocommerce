/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Card } from '@wordpress/components';
import classnames from 'classnames';
import { ExtraProperties, queueRecordEvent } from '@woocommerce/tracks';
import { useQuery } from '@woocommerce/navigation';

/**
 * Internal dependencies
 */
import './product-card.scss';
import ProductCardFooter from './product-card-footer';
import { Product, ProductTracksData, ProductType } from '../product-list/types';
import { appendURLParams } from '../../utils/functions';

export interface ProductCardProps {
	type?: string;
	product?: Product;
	isLoading?: boolean;
	tracksData: ProductTracksData;
	small?: boolean;
}

function ProductCard( props: ProductCardProps ): JSX.Element {
	const { isLoading, type } = props;
	const query = useQuery();
	// Get the product if provided; if not provided, render a skeleton loader
	const product = props.product ?? {
		title: '',
		description: '',
		vendorName: '',
		vendorUrl: '',
		icon: '',
		url: '',
		price: 0,
		image: '',
		averageRating: null,
		reviewsCount: null,
	};

	// We hardcode this for now while we only display prices in USD.
	const currencySymbol = '$';

	function recordTracksEvent( event: string, data: ExtraProperties ) {
		const tracksData = props.tracksData;

		if ( tracksData.position ) {
			data.position = tracksData.position;
		}

		if ( tracksData.label ) {
			data.label = tracksData.label;
		}

		if ( tracksData.group ) {
			data.group = tracksData.group;
		}

		if ( tracksData.searchTerm ) {
			data.search_term = tracksData.searchTerm;
		}

		if ( tracksData.category ) {
			data.category = tracksData.category;
		}

		queueRecordEvent( event, data );
	}

	const isTheme = type === ProductType.theme;
	let productVendor: string | JSX.Element | null = product?.vendorName;
	if ( product?.vendorName && product?.vendorUrl ) {
		productVendor = (
			<a
				href={ product.vendorUrl }
				rel="noopener noreferrer"
				onClick={ () => {
					recordTracksEvent(
						'marketplace_product_card_vendor_clicked',
						{
							product: product.title,
							vendor: product.vendorName,
							product_type: type,
						}
					);
				} }
			>
				{ product.vendorName }
			</a>
		);
	}

	const productUrl = () => {
		if ( query.ref ) {
			return appendURLParams( product.url, [
				[ 'utm_content', query.ref ],
			] );
		}
		return product.url;
	};

	const classNames = classnames(
		'woocommerce-marketplace__product-card',
		`woocommerce-marketplace__product-card--${ type }`,
		{
			'is-loading': isLoading,
			'is-small': props.small,
		}
	);

	return (
		<Card className={ classNames } aria-hidden={ isLoading }>
			<div className="woocommerce-marketplace__product-card__content">
				{ isTheme && (
					<div className="woocommerce-marketplace__product-card__image">
						{ ! isLoading && (
							<img
								className="woocommerce-marketplace__product-card__image-inner"
								src={ product.image }
								alt={ product.title }
							/>
						) }
					</div>
				) }
				<div className="woocommerce-marketplace__product-card__header">
					<div className="woocommerce-marketplace__product-card__details">
						{ ! isTheme && (
							<>
								{ isLoading && (
									<div className="woocommerce-marketplace__product-card__icon" />
								) }
								{ ! isLoading && product.icon && (
									<img
										className="woocommerce-marketplace__product-card__icon"
										src={ product.icon }
										alt={ product.title }
									/>
								) }
							</>
						) }
						<div className="woocommerce-marketplace__product-card__meta">
							<h2 className="woocommerce-marketplace__product-card__title">
								<a
									className="woocommerce-marketplace__product-card__link"
									href={ productUrl() }
									rel="noopener noreferrer"
									onClick={ () => {
										recordTracksEvent(
											'marketplace_product_card_clicked',
											{
												product: product.title,
												vendor: product.vendorName,
												product_type: type,
											}
										);
									} }
								>
									{ isLoading ? ' ' : product.title }
								</a>
							</h2>
							{ isLoading && (
								<p className="woocommerce-marketplace__product-card__vendor" />
							) }
							{ ! isLoading && productVendor && (
								<p className="woocommerce-marketplace__product-card__vendor">
									<span>{ __( 'By ', 'woocommerce' ) }</span>
									{ productVendor }
								</p>
							) }
						</div>
					</div>
				</div>
				{ ! isTheme && (
					<p className="woocommerce-marketplace__product-card__description">
						{ ! isLoading && product.description }
					</p>
				) }
				<footer className="woocommerce-marketplace__product-card__footer">
					{ isLoading && (
						<div className="woocommerce-marketplace__product-card__price" />
					) }
					{ ! isLoading && (
						<ProductCardFooter
							currencySymbol={ currencySymbol }
							price={ product.price }
							averageRating={ product.averageRating }
							reviewsCount={ product.reviewsCount }
						/>
					) }
				</footer>
			</div>
		</Card>
	);
}

export default ProductCard;
