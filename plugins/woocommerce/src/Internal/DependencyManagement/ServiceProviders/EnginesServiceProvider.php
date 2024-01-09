<?php
/**
 * UtilsClassesServiceProvider class file.
 */

namespace Automattic\WooCommerce\Internal\DependencyManagement\ServiceProviders;

use Automattic\WooCommerce\Internal\ReceiptRendering\ReceiptRenderingEngine;
use Automattic\WooCommerce\Proxies\LegacyProxy;
use Automattic\WooCommerce\Internal\TransientFiles\TransientFilesEngine;

/**
 * Service provider for the engine classes in the Automattic\WooCommerce\src namespace.
 */
class EnginesServiceProvider extends AbstractInterfaceServiceProvider {

	/**
	 * The classes/interfaces that are serviced by this service provider.
	 *
	 * @var array
	 */
	protected $provides = [
		TransientFilesEngine::class,
		ReceiptRenderingEngine::class
	];

	/**
	 * Register the classes.
	 */
	public function register() {
		$this->share_with_implements_tags( TransientFilesEngine::class )->addArgument( LegacyProxy::class );
		$this->share_with_implements_tags( ReceiptRenderingEngine::class )->addArgument( TransientFilesEngine::class );
	}
}
