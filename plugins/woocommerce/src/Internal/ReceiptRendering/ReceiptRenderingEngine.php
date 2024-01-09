<?php

namespace Automattic\WooCommerce\Internal\ReceiptRendering;

use Automattic\WooCommerce\Internal\TransientFiles\TransientFilesEngine;

class ReceiptRenderingEngine {

	public const RECEIPT_FILE_NAME_META_KEY = '_receipt_file_name';

	private TransientFilesEngine $transient_files_engine;

	final public function init(TransientFilesEngine $transient_files_engine) {
		$this->transient_files_engine = $transient_files_engine;
	}

	public function generate_receipt_for_order(int $order_id, $expiration_date = null, bool $force_new = false) : ?string {
		$order = wc_get_order($order_id);

		if(false === $order) {
			return null;
		}

		if(!$force_new) {
			$existing_receipt_filename = $order->get_meta(self::RECEIPT_FILE_NAME_META_KEY, true);
			if('' !== $existing_receipt_filename && !is_null($this->transient_files_engine->get_transient_file_path($existing_receipt_filename))) {
				return $existing_receipt_filename;
			}
		}

		$expiration_date ??= gmdate('Y-m-d', strtotime('+1 days'));

		$amount = $order->get_total();

		ob_start();
		include __dir__ . '/Templates/order-receipt.php';
		$rendered_template = ob_get_contents();
		ob_end_clean();

		$file_name = $this->transient_files_engine->create_transient_file($rendered_template, $expiration_date);
		$order->update_meta_data(self::RECEIPT_FILE_NAME_META_KEY, $file_name);
		$order->save_meta_data();

		return $file_name;
	}
}
