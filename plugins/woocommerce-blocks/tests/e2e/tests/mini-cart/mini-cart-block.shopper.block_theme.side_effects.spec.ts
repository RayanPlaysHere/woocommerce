/**
 * External dependencies
 */
import { expect, test } from '@woocommerce/e2e-playwright-utils';
import { cli } from '@woocommerce/e2e-utils';

/**
 * Internal dependencies
 */
import { openMiniCart } from './utils';
import { REGULAR_PRICED_PRODUCT_NAME } from '../checkout/constants';

// Skipping translation tests until we fix the missing translations issues after we changed the domain to "woocommerce"
// eslint-disable-next-line playwright/no-skipped-test
test.describe( 'Shopper → Translations', () => {
	test.beforeAll( async () => {
		await cli(
			`npm run wp-env run tests-cli -- wp language core activate nl_NL`
		);
	} );

	test.afterAll( async () => {
		await cli(
			`npm run wp-env run tests-cli -- wp language core activate en_US`
		);
	} );

	test( 'User can see translation in empty Mini-Cart', async ( {
		page,
		frontendUtils,
	} ) => {
		await frontendUtils.goToShop();
		await frontendUtils.emptyCart();
		await openMiniCart( frontendUtils );

		await expect(
			page.getByText( 'Je winkelwagen is momenteel leeg!' )
		).toBeVisible();

		await expect(
			page.getByRole( 'link', { name: 'Begin met winkelen' } )
		).toBeVisible();
	} );

	test( 'User can see translation in filled Mini-Cart', async ( {
		page,
		frontendUtils,
	} ) => {
		await frontendUtils.goToShop();
		await page.getByLabel( 'Toevoegen aan winkelwagen: “Beanie“' ).click();
		await openMiniCart( frontendUtils );

		await expect(
			page.getByRole( 'heading', { name: 'Je winkelwagen (1 artikel)' } )
		).toBeVisible();

		await expect(
			page.getByRole( 'link', { name: 'Mijn winkelmand bekijken' } )
		).toBeVisible();

		await expect(
			page.getByRole( 'link', { name: 'Naar afrekenen' } )
		).toBeVisible();
	} );
} );

// Temporarly skipping this test until why editor sidebar settings are not saved
// eslint-disable-next-line playwright/no-skipped-test
test.describe.skip( 'Shopper → Tax', () => {
	test.beforeAll( async () => {
		await cli(
			`npm run wp-env run tests-cli -- wp option set woocommerce_prices_include_tax no`
		);
		await cli(
			`npm run wp-env run tests-cli -- wp option set woocommerce_tax_display_shop incl`
		);
	} );

	test.afterAll( async () => {
		await cli(
			`npm run wp-env run tests-cli -- wp option set woocommerce_prices_include_tax yes`
		);
		await cli(
			`npm run wp-env run tests-cli -- wp option set woocommerce_tax_display_shop excl`
		);
	} );

	test( 'User can see tax label and price including tax', async ( {
		editorUtils,
		editor,
		frontendUtils,
		page,
	} ) => {
		await page.goto(
			'/wp-admin/site-editor.php?path=/wp_template_part/all'
		);
		await page.getByText( 'Header', { exact: true } ).click();
		await editorUtils.enterEditMode();
		await editorUtils.closeWelcomeGuideModal();
		await editor.openDocumentSettingsSidebar();

		await page
			.frameLocator( 'iframe[name="editor-canvas"]' )
			.getByLabel( 'Block: Mini-Cart' )
			.click();

		await page.getByLabel( 'Display total price' ).check();
		await expect( page.getByLabel( 'Display total price' ) ).toBeChecked();
		// await editorUtils.saveSiteEditorEntities();
		await editorUtils.saveTemplate();

		await frontendUtils.goToShop();
		await frontendUtils.emptyCart();
		await frontendUtils.addToCart( REGULAR_PRICED_PRODUCT_NAME );

		await expect( page.getByLabel( '1 item in cart' ) ).toContainText(
			'(incl. tax)'
		);
	} );
} );
