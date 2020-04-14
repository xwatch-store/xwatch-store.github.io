var processing = {
	quantity: "quantity",
	gender: "gender",
	first_name: "first_name",
	last_name: "last_name",
	email: "email",
	phone: "phone",
	address: "address",
	city: "city",
	country: "country",
	state: "state",
	taxid: "taxid",
	zip: "zip",
	payment_method: "payment_method",
	warrantee: "warrantee",
	cookie_params: { expires: 30, path: "/" },
	btn_order_class: "btn-order",
	hidden_class: "hidden",
	active_class: "active",
	parent_validField_Class: "form-group",
	error_сlass: "has-error",
	btn_pay_with_cc_сlass: "btn-pay-with-cc",
	product_container_class: "product-container",
	section_products_id: "section-products",
	section_additional_products_id: "section-additional-products",
	payment_step_class_prefix: "payment-step-",
	btn_choose_class: "btn-choose",
	btn_choose_paypal_class: "btn-choose-paypal",
	btn_choose_cc_class: "btn-choose-cc",
	box_btn_choose_class: "box-btn-choose",
	additional_product_box_class: "additional-product-box",
	additional_product_count_box_class: "additional-product-count-box",
	btn_add_product_class: "btn-add-product",
	btn_plus_product_class: "btn-plus-product",
	btn_minus_product_class: "btn-minus-product",
	btn_add_product_box_class: "btn-add-product-box",
	btn_plus_minus_product_box_class: "btn-plus-minus-product-box",
	product_count_class: "product-count",
	order_form_id: "order-form",
	modal_loader_Class: "modal-loader",
	modal_loader_open_Class: "modal-loader-open",
	disabled_class: "disabled",
	edit_form_id: "edit-form",
	btn_edit_info_сlass: "btn-edit-info",
	btn_update_info_сlass: "btn-update-info",
	btn_cancel_edit_сlass: "btn-cancel-edit",
	template_label_control_сlass: "template-label-control",
	step_action: "step_action",
	order_form_box: "order-form-box",
	progressbar: "progressbar",
	init: function() {
		Number.prototype.number_format = function(c, d, t) {
			var n = this,
				c = isNaN((c = Math.abs(c))) ? 2 : c,
				d = d == undefined ? "." : d,
				t = t == undefined ? "," : t,
				s = n < 0 ? "-" : "",
				i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
				j = (j = i.length) > 3 ? j % 3 : 0;
			return (
				s +
				(j ? i.substr(0, j) + t : "") +
				i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
				(c
					? d +
					  Math.abs(n - i)
							.toFixed(c)
							.slice(2)
					: "")
			);
		};

		//phone format
		processing.init_api_for_phone();
		//phone format

		//Processing::LOCAL_CALCULATION and payment methods and fields depending_country
		processing.detect_depending_country.init();

		//init all available processors
		$("." + processing.box_btn_choose_class).each(function(i, e) {
			var processor = $(e).data("processor");
			if (
				typeof processing.processors[processor] !== "undefined" &&
				typeof processing.processors[processor].init === "function"
			) {
				//PayPal
				processing.processors[processor].init();
			} else if (typeof processing.processors.CC[processor] !== "undefined") {
				//CC
				//init CC
				processing.processors.CC.init();
				//init CC
				if (typeof processing.processors.CC[processor].init === "function") {
					processing.processors.CC[processor].init();
				}
			}
		});
		//init all available processors

		if (window.location.hash.substr(1) == "order_now") {
			processing.scroll_to($("#" + processing.section_products_id), 1000);
		}
		$("." + processing.btn_order_class).on("click", function() {
			var delay = 0;
			if ($(".navbar-toggle:visible").length) {
				if ($(".navbar-collapse").hasClass("in")) {
					delay = 500;
				}
				$(".navbar-collapse").collapse("hide");
			}
			$that = $(this);
			setTimeout(function() {
				processing.scroll_to($("#" + processing.section_products_id), 1000);
			}, delay);
		});

		$("." + processing.product_container_class).on("click", function() {
			processing.steps.choose_product($(this));
		});

		$("." + processing.btn_add_product_class).on("click", function() {
			processing.steps.add_additional_product($(this));
		});

		$("." + processing.btn_plus_product_class).on("click", function() {
			processing.steps.add_additional_product_item(
				$(this).parents("." + processing.additional_product_box_class)
			);
		});

		$("." + processing.btn_minus_product_class).on("click", function() {
			processing.steps.remove_additional_product_item(
				$(this).parents("." + processing.additional_product_box_class)
			);
		});

		processing.validation.set_limit_rules();

		//change Payment Method
		$("." + processing.btn_choose_class).on("click", function() {
			processing.steps.choose_method($(this));
		});
		//change Payment Method

		//submit proces
		window.in_process = false;
		$("." + processing.btn_pay_with_cc_сlass).on("click", function(event) {
			processing.start_process(event);
		});
		//submit proces

		//response
		$("." + processing.btn_edit_info_сlass).on("click", function() {
			processing.steps.edit_info();
		});
		$("." + processing.btn_cancel_edit_сlass).on("click", function() {
			processing.steps.cancel_edit_info();
		});
		$("." + processing.btn_update_info_сlass).on("click", function() {
			processing.steps.update_info();
		});
		//response

		processing.template_label_control.init();
		processing.template_tooltip.init();

		//taxid field validation init
		if ($("[name='" + processing.taxid + "']").length) {
			var $params = { debug: false, rules: {}, messages: {} };
			$params["rules"][processing.taxid] = "cpf";
			$params["messages"][processing.taxid] = "CPF inv&aacute;lido";
			$(
				"#" + processing.order_form_id + ", #" + processing.edit_form_id
			).validate($params);
		}
		//taxid field validation init

		//form steps
		$("." + processing.step_action).on("click", function(event) {
			event.preventDefault();
			processing.steps.set_form_step($(this).data("step"));
		});
		//form steps
		//menu_scroll
		$(".menu_scroll").on("click", function(event) {
			event.preventDefault();
			if ($(".navbar-toggle:visible").length) {
				$(".navbar-collapse").collapse("hide");
			}
			$that = $(this);
			setTimeout(function() {
				processing.scroll_to($($that.attr("href")), 1000);
			}, 500);
		});
		//menu_scroll
	},
	template_tooltip: {
		init: function() {
			// open
			$('[role="template-tooltip"]').on("click", function() {
				$(this).addClass(processing.active_class);
			});
			// open
			//close
			$(document).on("click", function(event) {
				if ($(event.target).attr("role") != "template-tooltip") {
					processing.template_tooltip.close();
				}
			});
			//close
		},
		close: function() {
			$('[role="template-tooltip"]').removeClass(processing.active_class);
		}
	},
	template_label_control: {
		init: function() {
			$("." + processing.template_label_control_сlass + " .form-control")
				.on("keyup change", function() {
					if (this.value !== "") {
						$(this)
							.parents("." + processing.template_label_control_сlass)
							.addClass(processing.active_class);
					}
				})
				.on("blur", function() {
					if (this.value === "") {
						$(this)
							.parents("." + processing.template_label_control_сlass)
							.removeClass(processing.active_class);
					}
				});
			$("." + processing.template_label_control_сlass + " .form-control").each(
				function(i, e) {
					if (this.value && this.value !== "") {
						$(this)
							.parents("." + processing.template_label_control_сlass)
							.addClass(processing.active_class);
					} else {
						$(this)
							.parents("." + processing.template_label_control_сlass)
							.removeClass(processing.active_class);
					}
				}
			);
		}
	},
	scroll_to: function(el, delay) {
		if (el.length) {
			var page = $("html, body");
			page.on(
				"scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove",
				function() {
					page.stop();
				}
			);

			page.animate(
				{
					scrollTop: el.first().offset().top - $(".navbar").height()
				},
				delay,
				function() {
					page.off(
						"scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove"
					);
				}
			);
		}
	}, //scroll_to
	init_api_for_phone: function() {
		if ($('[name="' + processing.country + '"]').length) {
			intlTelInputGlobals.getCountryData().forEach(function(country){
				c = $('[name="' + processing.country + '"] option[data-iso="' + country.iso2.toUpperCase()  + '"]');
				if (c.length > 0) {
					country.name = c.text();
				}
			});
			
			var onlyCountries = [];
			$('[name="' + processing.country + '"] option').each(function(i, e) {
				if($(e).data('iso').length > 0) {
					onlyCountries.push($(e).data('iso').toLocaleLowerCase());
				}
			});

			$('[name="' + processing.phone + '"]').intlTelInput({
				customPlaceholder: function(
					selectedCountryPlaceholder,
					selectedCountryData
				) {
					selectedCountryPlaceholder =
						selectedCountryPlaceholder == ""
							? $('label[for="' + processing.phone + '"]').text()
							: selectedCountryPlaceholder;
					if (
						selectedCountryPlaceholder !=
						$('label[for="' + processing.phone + '"]').text()
					) {
						switch (selectedCountryData.iso2) {
							case "be": //Belgium
								selectedCountryPlaceholder = "0470 11 23 45";
								break;
							case "hr": //Croatia
								selectedCountryPlaceholder = "098 123 4567";
								break;
						}
					}
					return selectedCountryPlaceholder;
				},
				preferredCountries: [],
				onlyCountries: onlyCountries,
				utilsScript: "../node_modules/intl-tel-input/build/js/utils.js"
			});

			var reset = function() {
				$('[name="' + processing.phone + '"]')
					.parents("." + processing.parent_validField_Class)
					.removeClass(processing.error_сlass);
			};

			// on blur: validate
			// $('[name="'+processing.phone+'"]').keyup(function() {
			$('[name="' + processing.phone + '"]').blur(function() {
				if ($.trim($('[name="' + processing.phone + '"]').val())) {
					if (
						$('[name="' + processing.phone + '"]').intlTelInput("isValidNumber")
					) {
						$('[name="' + processing.phone + '"]')
							.parents("." + processing.parent_validField_Class)
							.removeClass(processing.error_сlass);
					} else {
						$('[name="' + processing.phone + '"]')
							.parents("." + processing.parent_validField_Class)
							.addClass(processing.error_сlass);
					}
				}
			});
			// on blur: validate

			// on keyup / change flag: reset
			$('[name="' + processing.phone + '"]').on("keyup change", reset);
		}
	}, //init_api_for_phone
	start_process: function(event) {
		if (processing.validation.valid_fields()) {
			if (!window.in_process) {
				processing.block.add_loader("transaction");
			}
			var processor = processing.data.get_processor();
			if (typeof processing.processors.CC[processor] !== "undefined") {
				//CC
				processing.processors.CC[processor].submit_payment();
			}
		}
	},
	format_prices: {
		create_format_fd: function(price) {
			return (Math.round(price * 100) / 100).number_format(0, ".", " "); //like format 1 700
		},
		create_format_bd: function(price) {
			return (Math.round(price * 100) / 100).number_format(2, ".", ""); //1700.00
		}
	},
	validation: {
		check_fields: function(name) {
			var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (
				!$("[name='" + name + "']:visible").val() ||
				$("[name='" + name + "']:visible")
					.val()
					.replace(/\s/g, "") == "" ||
				(name == processing.phone &&
					!$('[name="' + processing.phone + '"]').intlTelInput(
						"isValidNumber"
					)) ||
				(name == processing.email &&
					!pattern.test($("[name='" + name + "']").val())) ||
				(name == processing.taxid &&
					!$("[name='" + processing.taxid + "']").valid())
			) {
				return false;
			} else {
				//
				return true;
			}
		},
		valid_fields: function() {
			processing.validation.error_msg.hide();
			$(".validField:visible").each(function(i, e) {
				var name = $(e).attr("name");
				if (!processing.validation.check_fields(name)) {
					$("[name='" + name + "']")
						.parents("." + processing.parent_validField_Class)
						.addClass(processing.error_сlass);
				} else {
					$("[name='" + name + "']")
						.parents("." + processing.parent_validField_Class)
						.removeClass(processing.error_сlass);
				}
			});
			//init valid_fields of CC
			var processor = processing.data.get_processor();
			if (typeof processing.processors.CC[processor] !== "undefined") {
				processing.processors.CC.valid_fields();
			}
			//init valid_fields of CC
			setTimeout(function() {
				if (
					$(
						"." +
							processing.parent_validField_Class +
							"." +
							processing.error_сlass +
							":visible"
					).length > 0
				) {
					processing.scroll_to(
						$(
							"." +
								processing.parent_validField_Class +
								"." +
								processing.error_сlass +
								":visible"
						),
						500
					); //focus to error
				}
			}, 0);
			if (
				$(
					"." +
						processing.parent_validField_Class +
						"." +
						processing.error_сlass +
						":visible"
				).length == 0
			) {
				//check if we have error
				return true;
			} else {
				return false;
			}
		},
		error_msg: {
			show: function(msg) {
				var error_msg = $(".error-msg");
				error_msg.find(".help-block").html(msg);
				error_msg.removeClass(processing.hidden_class);
				processing.block.remove_loader();
			},
			hide: function() {
				var error_msg = $(".error-msg");
				error_msg.addClass(processing.hidden_class);
			},
			reset: function() {
				var error_msg = $(".error-msg");
				error_msg.find(".help-block").html("");
			}
		},
		set_limit_rules: function() {
			var fields_conf = false;

			var processor = processing.data.get_processor();
			if (
				typeof processing.processors.CC[processor] !== "undefined" &&
				typeof processing.processors.CC[processor].get_limit_rules ===
					"function"
			) {
				//CC
				fields_conf = processing.processors.CC[processor].get_limit_rules();
			}

			//reset_limit_rules
			$(".limit-rule").off("keypress keyup change");
			$(".limit-rule").removeClass("limit-rule");
			//reset_limit_rules

			if (fields_conf) {
				$.each(fields_conf, function(field_name, max_length) {
					$("[name='" + field_name + "']").addClass("limit-rule");

					var resetValue = function(that) {
						var length = processing.data.getByteLen($(that).val());
						var remain = parseInt(max_length - length);
						if (remain < 0) {
							for (var i = 0, len = $(that).val().length; i < len; i++) {
								var new_value = $(that)
									.val()
									.substring(0, len - i);
								var new_length = processing.data.getByteLen(new_value);
								var new_remain = parseInt(max_length - new_length);
								if (new_remain >= 0) {
									$(that).val(new_value);
									return false;
								}
							}
						}
					};
					resetValue($(".limit-rule[name='" + field_name + "']"));

					//set limit value to available length
					$(".limit-rule[name='" + field_name + "']").keypress(function(e) {
						var length = processing.data.getByteLen(this.value);
						var remain = parseInt(max_length - length);
						if (remain <= 0) {
							return false;
						}
					});
					//set limit value to available length
					//trim value to available length
					$(".limit-rule[name='" + field_name + "']").on(
						"keyup change",
						function(e) {
							resetValue(this);
						}
					);
					//trim value to available length
				});
			}
		}
	},
	add_zero_to_string: function(str, max, position) {
		str = str.toString();
		position = position ? position : "before";
		var new_str;
		switch (position) {
			case "before":
				new_str = "0" + str;
				break;
			case "after":
				new_str = str + "0";
				break;
		}
		return str.length < max
			? processing.add_zero_to_string(new_str, max, position)
			: str;
	},
	data: {
		get_selected_country_el: function() {
			if ($('[name="' + processing.country + '"]').length) {
				return $('[name="' + processing.country + '"] option:selected');
			} else {
				return false;
			}
		},
		get_chosen_prod_el: function() {
			if (
				$(
					"." +
						processing.product_container_class +
						"." +
						processing.active_class
				).length
			) {
				return $(
					"." +
						processing.product_container_class +
						"." +
						processing.active_class
				);
			} else {
				return false;
			}
		},
		get_qty: function() {
			var chosen_prod_el = processing.data.get_chosen_prod_el();
			if (chosen_prod_el) {
				return chosen_prod_el.data("qty");
			} else {
				return false;
			}
		},
		get_warrantee: function() {
			if ($('[name="' + processing.warrantee + '"]:checked').length > 0) {
				return $('[name="' + processing.warrantee + '"]:checked').val();
			} else {
				return 0;
			}
		},
		get_prod_order: function() {
			return $('[name="prod_order"]').val();
		},
		get_language: function() {
			return $('[name="language"]').val();
		},
		get_order_name: function() {
			var chosen_prod_el = processing.data.get_chosen_prod_el();
			if (chosen_prod_el) {
				var order_name =
					processing.data.get_prod_order() +
					" - " +
					$.trim(chosen_prod_el.find(".product-desc").text()) +
					" (" +
					$.trim(chosen_prod_el.find(".calc-price").text()) +
					" " +
					$.trim(chosen_prod_el.find(".symbol-price").text()) +
					")";
				return order_name;
			} else {
				return false;
			}
		},
		get_chosen_payment_method_el: function() {
			if (
				$("." + processing.box_btn_choose_class + "." + processing.active_class)
					.length
			) {
				return $(
					"." + processing.box_btn_choose_class + "." + processing.active_class
				);
			} else {
				return false;
			}
		},
		get_real_payment_method: function() {
			var chosen_payment_method_el = processing.data.get_chosen_payment_method_el();
			if (chosen_payment_method_el) {
				return chosen_payment_method_el.data("method");
			} else {
				return false;
			}
		},
		get_processor: function() {
			var chosen_payment_method_el = processing.data.get_chosen_payment_method_el();
			if (chosen_payment_method_el) {
				return chosen_payment_method_el.data("processor");
			} else if ($("#processor").val()) {
				return $("#processor").val();
			}
			return false;
		},
		get_company: function() {
			var chosen_payment_method_el = processing.data.get_chosen_payment_method_el();
			if (chosen_payment_method_el) {
				return chosen_payment_method_el.data("company");
			} else {
				return false;
			}
		},
		get_all: function() {
			var data = {};
			$(".toSave").each(function(i, e) {
				var name = $(e).attr("name");
				var value = $(e).val();
				data[name] = value;
			});
			data[processing.quantity] = processing.data.get_qty();
			data[processing.gender] = "";
			data[processing.warrantee] = processing.data.get_warrantee();

			var active_country_filter = $(
				".country-fields:not(." + processing.hidden_class + ")"
			);
			data[processing.state] =
				$('[name="' + processing.state + '"]', active_country_filter).val() ||
				""; //depending country fields
			data[processing.taxid] =
				$('[name="' + processing.taxid + '"]', active_country_filter).val() ||
				""; //depending country fields
			data["source"] = location.href;
			data[
				processing.payment_method
			] = processing.data.get_real_payment_method();
			data["processor"] = processing.data.get_processor();
			data["company"] = processing.data.get_company();
			data[processing.phone] = $(
				'[name="' + processing.phone + '"]'
			).intlTelInput("getNumber");
			data["country_code"] = processing.data
				.get_selected_country_el()
				.data("iso");
			data["additional_products"] = processing.data.get_additional_products();
			//for Japan zip
			if (data["country_code"] == "JP") {
				String.prototype.allReplace = function(obj) {
					var retStr = this;
					for (var x in obj) {
						retStr = retStr.replace(new RegExp(x, "g"), obj[x]);
					}
					return retStr;
				};
				var end = 7;
				var filter_zip = $('[name="' + processing.zip + '"]')
					.val()
					.replace(/[^0-9０-９]/gi, "")
					.allReplace({
						"０": "0",
						"１": "1",
						"２": "2",
						"３": "3",
						"４": "4",
						"５": "5",
						"６": "6",
						"７": "7",
						"８": "8",
						"９": "9"
					});
				filter_zip = processing.add_zero_to_string(filter_zip, end, "after");
				data[processing.zip] =
					filter_zip.substring(0, 3) + "-" + filter_zip.substring(3, end);
			}
			//for Japan zip
			if ($("#" + processing.order_form_id + " :visible").length) {
				var card_data = processing.data.get_card_data();
				data["cc_num"] = card_data["cc_no"].slice(-4);
			} else {
				data["cc_num"] = "";
			}
			return data;
		},
		get_card_data: function() {
			var cc_expiry_val = {};
			if ($("#" + processing.processors.CC.cc_exp_date_ID).length) {
				cc_expiry_val = $(
					"#" + processing.processors.CC.cc_exp_date_ID
				).payment("cardExpiryVal");
			}
			return {
				cc_no: $("#" + processing.processors.CC.cc_no_ID).val()
					? $("#" + processing.processors.CC.cc_no_ID)
							.val()
							.replace(/[^0-9]/g, "")
					: "",
				exp_year: cc_expiry_val.year || "",
				exp_month: cc_expiry_val.month
					? processing.add_zero_to_string(cc_expiry_val.month, 2, "before")
					: "",
				cvc: $("#" + processing.processors.CC.cc_cvv_ID).val() || ""
			};
		},
		get_additional_products: function() {
			var additional_products = {};
			$("." + processing.product_count_class).each(function(i, e) {
				var product_id = $(e)
					.parents("." + processing.additional_product_box_class)
					.find("." + processing.btn_add_product_class)
					.data("product-id");
				var qty = parseInt($(e).text());
				if (qty > 0) {
					additional_products[product_id] = qty;
				}
			});

			if (!$.isEmptyObject(additional_products)) {
				return JSON.stringify(additional_products);
			} else {
				return false;
			}
		},
		getByteLen: function(normal_val) {
			normal_val = String(normal_val);
			var byteLen = 0;
			for (var i = 0; i < normal_val.length; i++) {
				var c = normal_val.charCodeAt(i);
				byteLen +=
					c < 1 << 7
						? 1
						: c < 1 << 11
						? 2
						: c < 1 << 16
						? 3
						: c < 1 << 21
						? 4
						: c < 1 << 26
						? 5
						: c < 1 << 31
						? 6
						: Number.NaN;
			}
			return byteLen;
		},
		product_set_limit: function(qty, is_qty_limit, parent_box, count_box) {
			if (is_qty_limit) {
				var limit_QTY =
					parseFloat($.cookie(processing.cookie.QTY)) ||
					processing.data.get_qty();
				if (qty >= limit_QTY) {
					parent_box
						.find("." + processing.btn_plus_product_class)
						.addClass(processing.disabled_class);
					qty = limit_QTY;
				} else {
					parent_box
						.find("." + processing.btn_plus_product_class)
						.removeClass(processing.disabled_class);
				}
			}
			count_box.find("." + processing.product_count_class).text(qty);
		}
	}, //data
	cookie: {
		QTY: "QTY",
		COUNTRY_RATE: "COUNTRY_RATE",
		COUNTRY_SYMBOL: "COUNTRY_SYMBOL",
		// UPSELL_PAID:'UPSELL_PAID',
		save_data: function(name, value) {
			$.cookie(name, value, processing.cookie_params);
		}
	},
	calculation: {
		calculate_prices: function() {
			var selected_country = processing.data.get_selected_country_el();
			if (selected_country) {
				var price_modifier = selected_country.data("price-modifier");

				var rate = selected_country.data("rate");
				var symbol = selected_country.data("symbol");
				//fore upsell calc
				processing.cookie.save_data(processing.cookie.COUNTRY_RATE, rate);
				processing.cookie.save_data(processing.cookie.COUNTRY_SYMBOL, symbol);
				//fore upsell calc

				$(".calc-price").each(function(i, e) {
					var price = $(e).data("price") * price_modifier;
					price *= rate;
					if ($("body")[0].hasAttribute("data-cc-installment")) {
						//cc_installment
						var cc_installment = $("body").data("cc-installment");
						$(e).html(
							cc_installment +
								" x " +
								processing.format_prices.create_format_fd(
									price / cc_installment
								)
						);
					} else {
						$(e).html(processing.format_prices.create_format_fd(price));
					}
				});

				$(".symbol-price").html(symbol);
			}
		} //calculate_prices
	}, //calculation
	block: {
		add_loader: function(action) {
			if ($("body").find("." + processing.modal_loader_Class).length) {
				$(".loader-text").addClass(processing.hidden_class);
				$(".loader-text-" + action).removeClass(processing.hidden_class);
				$("body").addClass(processing.modal_loader_open_Class);
			}
		},
		remove_loader: function() {
			$("body").removeClass(processing.modal_loader_open_Class);
		}
	},
	detect_depending_country: {
		init: function() {
			processing.calculation.calculate_prices();
			processing.detect_depending_country.fields();
			processing.detect_depending_country.phone_type();
			processing.detect_depending_country.validation.init();
			$('[name="' + processing.country + '"]').on("change", function() {
				processing.calculation.calculate_prices();
				processing.detect_depending_country.fields();
				// processing.detect_depending_country.phone_type();
				processing.detect_depending_country.validation.init();
			});
		},
		phone_type: function() {
			var selected_country = processing.data.get_selected_country_el();
			if (selected_country) {
				var country_iso = selected_country.data("iso");
				$('[name="' + processing.phone + '"]').intlTelInput(
					"setCountry",
					country_iso.toLowerCase()
				);
			}
		},
		fields: function() {
			var selected_country = processing.data.get_selected_country_el();
			if (selected_country) {
				var country_fields = selected_country.data("fields");
				$(".country-fields")
					.addClass(processing.hidden_class)
					.find(".toSave")
					.val("");
				if (country_fields) {
					$.each(country_fields, function(key, name) {
						$("." + name + "-fields")
							.find("." + processing.template_label_control_сlass)
							.removeClass(processing.active_class);
						$("." + name + "-fields").removeClass(processing.hidden_class);
						//response page
						if ($("#" + processing.edit_form_id).length) {
							var field_parent_el = $("." + name + "-fields");
							var field_name = field_parent_el.find(".toSave").attr("name");
							var to_edit =
								$('[name="' + field_name + '_to_edit"]').val() || false;
							if (to_edit) {
								var field_tagname = field_parent_el
									.find(".toSave")
									.prop("tagName")
									.toLowerCase();
								switch (field_tagname) {
									case "select":
										field_parent_el
											.find(
												'[name="' +
													field_name +
													'"] option[value="' +
													to_edit +
													'"]'
											)
											.prop("selected", true);
										break;
									default:
										//input
										field_parent_el
											.find('[name="' + field_name + '"]')
											.val(to_edit);
										break;
								}
							}
						}
						//response page
					});
				}
			}
		},
		validation: {
			init: function() {
				//valid format
				//Israel postcode
				var selected_country = processing.data.get_selected_country_el();
				if (selected_country) {
					switch (selected_country.data("iso")) {
						case "IL": //Israel
							$('[name="' + processing.zip + '"]').val(
								$('[name="' + processing.zip + '"]')
									.val()
									.replace(/[^0-9]/g, "")
							);
							break;
					}
				}
				$(document).on(
					"keypress keyup blur",
					'[name="' + processing.zip + '"]',
					function(event) {
						var selected_country = processing.data.get_selected_country_el();
						if (selected_country) {
							switch (selected_country.data("iso")) {
								case "IL": //Israel
									$(this).val(
										$(this)
											.val()
											.replace(/[^\d].+/, "")
									);
									if (event.which < 48 || event.which > 57) {
										event.preventDefault();
									}
									break;
							}
						}
					}
				);
				//Israel
				//valid format
			}
		}
	},
	steps: {
		active_form_step: 1,
		set_form_step: function(go_to_step, animateInit) {
			var animateInit = animateInit == undefined ? true : animateInit;
			var current_step = processing.steps.active_form_step;
			$("." + processing.order_form_box).each(function(i, e) {
				var item_step = $(e).data("step");
				if (item_step <= go_to_step) {
					var valid = processing.validation.valid_fields();
					if (valid || item_step < processing.steps.active_form_step) {
						processing.steps.active_form_step = item_step;
						var class_animate =
							current_step >= item_step ? "slideRight" : "slideLeft";
						$("." + processing.order_form_box).addClass(
							processing.hidden_class
						);
						$(e).removeClass("slideLeft slideRight " + processing.hidden_class);
						if (current_step != item_step && animateInit) {
							$(e).addClass(class_animate);
							processing.scroll_to(
								$("." + processing.payment_step_class_prefix + "2"),
								1000
							);
						}
					}
				}
			});
			$("." + processing.progressbar + " [data-step]").removeClass(
				processing.active_class
			);
			$("." + processing.progressbar + " [data-step]").each(function(i, e) {
				if ($(e).data("step") <= processing.steps.active_form_step) {
					$(e).addClass(processing.active_class);
				}
			});
		},
		choose_product: function(el) {
			$("." + processing.product_container_class).removeClass(
				processing.active_class
			);
			el.addClass(processing.active_class);
			$("." + processing.payment_step_class_prefix + "1").removeClass(
				processing.hidden_class
			);
			setTimeout(function() {
				processing.scroll_to(
					$("#" + processing.section_additional_products_id),
					1000
				);
			}, 500);

			var qty = processing.data.get_qty();
			//save qty for upsell product limit
			processing.cookie.save_data(processing.cookie.QTY, qty);
			//save qty for upsell product limit

			//reset_limit
			$("." + processing.btn_add_product_class).each(function(i, e) {
				var parent_box = $(e).parents(
					"." + processing.additional_product_box_class
				);
				var count_box = parent_box.find(
					"." + processing.additional_product_count_box_class
				);
				var cur_length = parseInt(
					count_box.find("." + processing.product_count_class).text()
				);
				var is_qty_limit = $(e).data("qty-limit");
				var qty = cur_length;

				processing.data.product_set_limit(
					qty,
					is_qty_limit,
					parent_box,
					count_box
				);
			});
			//reset_limit
		},
		add_additional_product: function(el) {
			el.parents("." + processing.btn_add_product_box_class).addClass(
				processing.hidden_class
			);
			var parent = el.parents("." + processing.additional_product_box_class);
			var btn_plus_minus = parent.find(
				"." + processing.btn_plus_minus_product_box_class
			);
			btn_plus_minus.removeClass(processing.hidden_class);
			processing.steps.add_additional_product_item(parent);
		},
		add_additional_product_item: function(parent_box) {
			var count_box = parent_box.find(
				"." + processing.additional_product_count_box_class
			);
			var cur_length = parseInt(
				count_box.find("." + processing.product_count_class).text()
			);
			var is_qty_limit = parent_box
				.find("." + processing.btn_add_product_class)
				.data("qty-limit");
			var qty = cur_length + 1;
			//limit
			processing.data.product_set_limit(
				qty,
				is_qty_limit,
				parent_box,
				count_box
			);
			//limit
		},
		remove_additional_product_item: function(parent_box) {
			var count_box = parent_box.find(
				"." + processing.additional_product_count_box_class
			);
			var cur_length = parseInt(
				count_box.find("." + processing.product_count_class).text()
			);
			var new_length = cur_length - 1;
			count_box.find("." + processing.product_count_class).text(new_length);
			parent_box
				.find("." + processing.btn_plus_product_class)
				.removeClass(processing.disabled_class);
			if (new_length < 1) {
				var btn_plus_minus = parent_box.find(
					"." + processing.btn_plus_minus_product_box_class
				);
				var btn_add_product_box = parent_box.find(
					"." + processing.btn_add_product_box_class
				);
				btn_plus_minus.addClass(processing.hidden_class);
				btn_add_product_box.removeClass(processing.hidden_class);
			}
		},
		choose_method: function(el) {
			$("." + processing.box_btn_choose_class).removeClass(
				processing.active_class
			);
			el.parents("." + processing.box_btn_choose_class).addClass(
				processing.active_class
			);
			processing.payment_methods.detect_card_data();
			processing.calculation.calculate_prices();
			processing.validation.set_limit_rules();
		},
		edit_info: function() {
			$(".shipping-info-box").addClass(processing.hidden_class);
			$("." + processing.payment_step_class_prefix + "3").removeClass(
				processing.hidden_class
			);
			processing.scroll_to($("#" + processing.edit_form_id), 1000);
		},
		cancel_edit_info: function() {
			$(".shipping-info-box").removeClass(processing.hidden_class);
			$("." + processing.payment_step_class_prefix + "3").addClass(
				processing.hidden_class
			);
			processing.scroll_to($(".shipping-info-box"), 1000);
		},
		update_info: function() {
			if (processing.validation.valid_fields()) {
				if (!window.in_process) {
					window.in_process = true;
					processing.block.add_loader("shipping");
					var data = processing.data.get_all();
					$.ajax({
						url: "/api/customer/update",
						dataType: "json",
						type: "POST",
						data: data,
						success: function(result) {
							window.in_process = false;
							if (result.status) {
								setTimeout(function() {
									$(".section-edit-info-box").html(
										result.section_edit_info_box
									);
									$(".form-section-edit-customer").html(
										result.form_section_customer_data
									);
									if ($(".update_first_name").length) {
										$(".update_first_name").text(result.first_name);
									}
									if ($(".update_last_name").length) {
										$(".update_last_name").text(result.last_name);
									}
									if ($(".update_email").length) {
										$(".update_email").text(result.email);
									}
									processing.init_api_for_phone();
									processing.detect_depending_country.init();
									processing.template_label_control.init();
									processing.block.remove_loader();
									processing.steps.cancel_edit_info();
								}, 500);
							} else {
								var data_attr = $(".error-msg").attr("data-msg");
								var msg = result.action;
								if (
									typeof data_attr !== typeof undefined &&
									data_attr !== false
								) {
									msg = data_attr;
								}
								processing.validation.error_msg.show(msg);
							}
						}
					});
				}
			}
		}
	}, //steps
	payment_methods: {
		visa: "Visa",
		mastercard: "MasterCard",
		jcb: "JCB",
		maestro: "Maestro",
		elo: "Elo",
		get_correct_name: function(name) {
			switch (name) {
				case processing.payment_methods.visa.toLowerCase():
					name = processing.payment_methods.visa;
					break;
				case processing.payment_methods.mastercard.toLowerCase():
					name = processing.payment_methods.mastercard;
					break;
				case processing.payment_methods.jcb.toLowerCase():
					name = processing.payment_methods.jcb;
					break;
				case processing.payment_methods.maestro.toLowerCase():
				case "laser":
					name = processing.payment_methods.maestro;
					break;
				case processing.payment_methods.elo.toLowerCase():
					name = processing.payment_methods.elo;
					break;
			}
			return name;
		},
		detect_card_data: function() {
			var processor = processing.data.get_processor();
			if (typeof processing.processors[processor] !== "undefined") {
				//PayPal
				$("." + processing.payment_step_class_prefix + "2").addClass(
					processing.hidden_class
				);
				processing.steps.set_form_step("1", false);
				processing.reset_fields("all");
			} else if (typeof processing.processors.CC[processor] !== "undefined") {
				//CC
				$("." + processing.payment_step_class_prefix + "2").removeClass(
					processing.hidden_class
				);
				setTimeout(function() {
					processing.scroll_to(
						$("." + processing.payment_step_class_prefix + "2"),
						1000
					);
				}, 1000);
			}
		}
	},
	reset_fields: function(action) {
		var customer_info_reset,
			address_info_reset,
			cc_info_reset = false;
		switch (action) {
			case "customer_info":
				customer_info_reset = true;
				break;
			case "address_info":
				address_info_reset = true;
				break;
			case "cc_info":
				cc_info_reset = true;
				break;
			case "all":
				customer_info_reset = true;
				address_info_reset = true;
				cc_info_reset = true;
				break;
		}
		if (customer_info_reset) {
			$(
				'[name="' +
					processing.last_name +
					'"],[name="' +
					processing.first_name +
					'"],[name="' +
					processing.email +
					'"],[name="' +
					processing.phone +
					'"],[name="' +
					processing.taxid +
					'"]'
			).val("");
		}
		if (address_info_reset) {
			$(
				'[name="' +
					processing.address +
					'"],[name="' +
					processing.city +
					'"],[name="' +
					processing.state +
					'"],[name="' +
					processing.zip +
					'"]'
			).val("");
		}
		if (cc_info_reset) {
			$(
				"#" +
					processing.processors.CC.cc_no_ID +
					",#" +
					processing.processors.CC.cc_exp_date_ID +
					",#" +
					processing.processors.CC.cc_cvv_ID
			).val("");
		}
		processing.template_label_control.init();
	},
	processors: {
		PayPal: {
			payment_response: false,
			supported_locales: {
				en: "en_US",
				// en_AU,
				// en_GB,
				// fr_CA,
				es: "es_ES",
				// 'it':'it_IT',
				fr: "fr_FR",
				// 'de':'de_DE',
				// pt_BR,
				cn: "zh_CN",
				dk: "da_DK",
				// zh_HK,
				id: "id_ID",
				he: "he_IL",
				jp: "ja_JP",
				// 'nl':'nl_NL',
				no: "no_NO",
				pl: "pl_PL",
				pt: "pt_PT",
				ru: "ru_RU",
				se: "sv_SE",
				th: "th_TH"
				// zh_TW
				//'sg', 'kr', 'fi' we will have in eng
			},
			init: function() {
				processing.processors.PayPal.render_button();
			},
			render_button: function() {
				if ($("#paypal-button").length) {
					var PAYMENT_URL = "../api/payment/PayPal";
					var language = processing.data.get_language();

					var set_locale = processing.processors.PayPal.supported_locales.en;
					if (language in processing.processors.PayPal.supported_locales) {
						set_locale =
							processing.processors.PayPal.supported_locales[language];
					}

					var render_style = {
						label: "paypal",
						size: "responsive", // small | medium | large | responsive
						shape: "rect", // pill | rect
						color: "gold", // gold | blue | silver | white | black
						tagline: false
						// layout: 'vertical', //horizontal | vertical
					};
					var render_funding = {
						disallowed: [paypal.FUNDING.CREDIT, paypal.FUNDING.CARD],
						allowed: [
							paypal.FUNDING.BANCONTACT,
							paypal.FUNDING.EPS,
							paypal.FUNDING.GIROPAY,
							paypal.FUNDING.IDEAL,
							paypal.FUNDING.MYBANK,
							paypal.FUNDING.SOFORT
						]
					};

					var all_data = processing.data.get_all();
					switch (all_data["country_code"]) {
						case "DE":
							// set_locale = 'en_DE';//en lang
							set_locale = "de_DE"; //de lang
							break;
						case "AT":
							// set_locale = 'en_AT';//en lang
							set_locale = "de_AT"; //de lang
							break;
						case "BE":
							// set_locale = 'en_BE';//en lang
							// set_locale = 'fr_BE';//fr lang
							set_locale = "nl_BE"; //nl lang
							break;
						case "IT":
							// set_locale = 'en_IT';//en lang
							set_locale = "it_IT"; //it lang
							break;
						case "NL":
							// set_locale = 'en_NL';//en lang
							set_locale = "nl_NL"; //nl lang
							break;
						case "US":
							render_style["layout"] = "vertical";
							render_funding["disallowed"] = [];
							render_funding["allowed"][render_funding["allowed"].length] =
								paypal.FUNDING.CREDIT;
							render_funding["allowed"][render_funding["allowed"].length] =
								paypal.FUNDING.CARD;
							break;
					}

					paypal.Button.render(
						{
							env: $("#paypal_environment").val(), // Or 'sandbox' // production
							style: render_style,
							funding: render_funding,
							commit: true, // Optional: show a 'Pay Now' button in the checkout flow
							locale: set_locale,
							payment: function() {
								processing.steps.choose_method(
									$("." + processing.btn_choose_paypal_class)
								);

								var request_data = processing.data.get_all();
								request_data["action"] = "create_payment";
								request_data["description"] = processing.data.get_order_name();
								return paypal.request
									.post(PAYMENT_URL, request_data)
									.then(function(result) {
										if (result.status) {
											return result.payment_id;
										} else {
											location.href =
												"response.php?st_err=true&action=" + result.action;
										}
									});
							},
							onAuthorize: function(data, actions) {
								return paypal.request
									.post(data.returnUrl)
									.then(function(result) {
										if (result.status) {
											location.href =
												"response.php?tx=" + result.tx + "&amt=" + result.amt;
										} else {
											location.href =
												"response.php?st_err=true&action=" + result.action;
										}
									});
							},
							onCancel: function(data, actions) {
								console.log("Buyer cancelled the payment");
							},
							onError: function(err) {
								// location.href = 'response.php?st_err=true&action=onError'
								/*
								 * An error occurred during the transaction
								 */
								console.log("onError");
								console.log(err);
							}
						},
						"#paypal-button"
					);
				}
			}
		}, //PayPal
		CC: {
			card_box_Class: "card-box",
			cc_exp_date_ID: "expiry_date",
			cc_no_ID: "cc_no",
			cc_cvv_ID: "cc_cvv",
			init: function() {
				$("#" + processing.processors.CC.cc_no_ID).payment("formatCardNumber");
				$("#" + processing.processors.CC.cc_exp_date_ID).payment(
					"formatCardExpiry"
				);
				$("#" + processing.processors.CC.cc_cvv_ID).payment("formatCardCVC");
			},
			set_method: function(name) {
				var chosen_payment_method_el = processing.data.get_chosen_payment_method_el();
				if (chosen_payment_method_el) {
					name = processing.payment_methods.get_correct_name(name);
					chosen_payment_method_el.data("method", name);
				}
			},
			hard_rules_for_type: {
				set: function(name) {
					processing.processors.CC.hard_rules_for_type.reset_fields();
					var chosen_payment_method_el = processing.data.get_chosen_payment_method_el();
					if (chosen_payment_method_el) {
						var methods = chosen_payment_method_el.data("methods");
						name = processing.payment_methods.get_correct_name(name);
						if ($.inArray(name, methods) === -1) {
							var parent_box = $(
								"#" + processing.processors.CC.cc_no_ID
							).parents("." + processing.parent_validField_Class);
							parent_box.addClass(processing.error_сlass);
							parent_box.find(".help-block").addClass(processing.hidden_class);
							parent_box
								.find(".type-help-block")
								.removeClass(processing.hidden_class);
						}
					}
				},
				reset_fields: function(name) {
					var parent_box = $("#" + processing.processors.CC.cc_no_ID).parents(
						"." + processing.parent_validField_Class
					);
					parent_box.find(".help-block").removeClass(processing.hidden_class);
					parent_box.find(".type-help-block").addClass(processing.hidden_class);
				}
			},
			valid_fields: function() {
				//don't check validation if we not on current step
				// if($('#'+processing.payment_carousel_id+' .item.'+processing.active_class).index() != 5){//step 6 of carusel
				//   return true;
				// }
				var is_valid = true;
				var card_data = processing.data.get_card_data();
				var cc_type = $.payment.cardType(card_data.cc_no);
				var cc_expiry_is_valid = $.payment.validateCardExpiry(
					card_data.exp_month,
					card_data.exp_year
				);
				var cc_cvc_per_cc_no_is_valid = $.payment.validateCardCVC(
					card_data.cvc,
					cc_type
				);
				var cc_no_is_valid = $.payment.validateCardNumber(card_data.cc_no);

				if (!cc_expiry_is_valid) {
					$("#" + processing.processors.CC.cc_exp_date_ID + ":visible")
						.parents("." + processing.parent_validField_Class)
						.addClass(processing.error_сlass);
					is_valid = false;
				} else {
					$("#" + processing.processors.CC.cc_exp_date_ID + ":visible")
						.parents("." + processing.parent_validField_Class)
						.removeClass(processing.error_сlass);
				}

				if (!cc_cvc_per_cc_no_is_valid) {
					$("#" + processing.processors.CC.cc_cvv_ID + ":visible")
						.parents("." + processing.parent_validField_Class)
						.addClass(processing.error_сlass);
					is_valid = false;
				} else {
					$("#" + processing.processors.CC.cc_cvv_ID + ":visible")
						.parents("." + processing.parent_validField_Class)
						.removeClass(processing.error_сlass);
				}

				if ($("#" + processing.processors.CC.cc_no_ID + ":visible").length) {
					processing.processors.CC.hard_rules_for_type.reset_fields();
					if (!cc_no_is_valid) {
						$("#" + processing.processors.CC.cc_no_ID + ":visible")
							.parents("." + processing.parent_validField_Class)
							.addClass(processing.error_сlass);
						is_valid = false;
					} else {
						$("#" + processing.processors.CC.cc_no_ID + ":visible")
							.parents("." + processing.parent_validField_Class)
							.removeClass(processing.error_сlass);
					}
				}

				//detect_type
				if (cc_type) {
					processing.processors.CC.set_method(cc_type);
					//hard rules for type
					var processor = processing.data.get_processor();
					if (
						typeof processing.processors.CC[processor] !== "undefined" &&
						typeof processing.processors.CC[processor]
							.set_hard_rules_for_type !== "undefined" &&
						processing.processors.CC[processor].set_hard_rules_for_type
					) {
						processing.processors.CC.hard_rules_for_type.set(cc_type);
					}
					//hard rules for type
				}
				//detect_type

				if (!is_valid) {
					return false;
				}
			},
			remove_fields: function() {
				$('[data-value="CC"]').remove();
				$("." + processing.payment_step_class_prefix + "2").addClass(
					processing.hidden_class
				);
				processing.reset_fields("all");
			},
			yd8X6R9c8TxW9P0Z: {
				set_hard_rules_for_type: true,
				get_limit_rules: function() {
					var fields_conf = {};
					fields_conf[processing.address] = 100;
					return fields_conf;
				},
				submit_payment: function() {
					$(".yd8X6R9c8TxW9P0Z_form").remove();
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("yd8X6R9c8TxW9P0Z", data);
				}
			}, //yd8X6R9c8TxW9P0Z
			OyetcZEBm1OnXHIy: {
				set_hard_rules_for_type: true,
				submit_payment: function() {
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("OyetcZEBm1OnXHIy", data);
				}
			}, //OyetcZEBm1OnXHIy
			FCtEz0vjl0e5ktaq: {
				set_hard_rules_for_type: true,
				submit_payment: function() {
					$(".FCtEz0vjl0e5ktaq_form").remove();
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("FCtEz0vjl0e5ktaq", data);
				}
			}, //FCtEz0vjl0e5ktaq
			DAgGcR7mYE7ja4UY: {
				set_hard_rules_for_type: true,
				submit_payment: function() {
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("DAgGcR7mYE7ja4UY", data);
				}
			}, //DAgGcR7mYE7ja4UY
			liBfN5aIY0j0AeeK: {
				set_hard_rules_for_type: true,
				submit_payment: function() {
					$(".liBfN5aIY0j0AeeK_form").remove();
					var data = processing.data.get_all();
					data["action"] = "generate_form";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("liBfN5aIY0j0AeeK", data);
				}
			}, //liBfN5aIY0j0AeeK
			sxYF7oASMxjvFz1n: {
				set_hard_rules_for_type: true,
				submit_payment: function() {
					$(".sxYF7oASMxjvFz1n_form").remove();
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("sxYF7oASMxjvFz1n", data);
				}
			}, //sxYF7oASMxjvFz1n
			u46CFxOP3s9ouDT7: {
				set_hard_rules_for_type: true,
				get_limit_rules: function() {
					var fields_conf = {};
					fields_conf[processing.first_name] = 50;
					fields_conf[processing.last_name] = 50;
					fields_conf[processing.address] = 100;
					fields_conf[processing.city] = 60;
					fields_conf[processing.zip] = 15;
					return fields_conf;
				},
				submit_payment: function() {
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("u46CFxOP3s9ouDT7", data);
				}
			}, //u46CFxOP3s9ouDT7
			lDXYHpNQBDXmlA99: {
				set_hard_rules_for_type: true,
				submit_payment: function() {
					$(".lDXYHpNQBDXmlA99_form").remove();
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("lDXYHpNQBDXmlA99", data);
				}
			}, //lDXYHpNQBDXmlA99
			aM0cgRze2XxOXj3H: {
				set_hard_rules_for_type: true,
				get_limit_rules: function() {
					var fields_conf = {};
					fields_conf[processing.first_name] = 50;
					fields_conf[processing.last_name] = 50;
					fields_conf[processing.address] = 100;
					fields_conf[processing.city] = 50;
					fields_conf[processing.zip] = 20;
					fields_conf[processing.state] = 50;
					return fields_conf;
				},
				submit_payment: function() {
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("aM0cgRze2XxOXj3H", data);
				}
			}, //aM0cgRze2XxOXj3H
			CeREsycAWouVxBff: {
				set_hard_rules_for_type: true,
				submit_payment: function() {
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("CeREsycAWouVxBff", data);
				}
			}, //CeREsycAWouVxBff
			VKa2GS72eWJApKPf: {
				set_hard_rules_for_type: true,
				getScreenData: function() {
					if (self.screen) {
						// for NN4 and IE4 or later
						return {
							width: screen.width,
							height: screen.height,
							depth: screen.colorDepth
						};
					}
					return false;
				},
				submit_payment: function() {
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					data[
						"screen_data"
					] = processing.processors.CC.VKa2GS72eWJApKPf.getScreenData();
					processing.processors.submit_handler("VKa2GS72eWJApKPf", data);
				}
			}, //VKa2GS72eWJApKPf
			TA4hnTu8B6xKQ5rh: {
				set_hard_rules_for_type: true,
				submit_payment: function() {
					$(".TA4hnTu8B6xKQ5rh_form").remove();
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("TA4hnTu8B6xKQ5rh", data);
				}
			}, //TA4hnTu8B6xKQ5rh
			Eb9O8VOBh0iElnOL: {
				submit_payment: function() {
					$(".Eb9O8VOBh0iElnOL_form").remove();
					var data = processing.data.get_all();
					data["action"] = "submit_payment";
					data["card_data"] = processing.data.get_card_data();
					processing.processors.submit_handler("Eb9O8VOBh0iElnOL", data);
				}
			} //Eb9O8VOBh0iElnOL
		}, //CC
		submit_handler: function(processor, data) {
			$.ajax({
				url: "../api/payment/" + processor,
				dataType: "json",
				type: "POST",
				data: data,
				success: function(result) {
					if (result.status) {
						if (result.form) {
							$("body").append(result.form);
							$("." + processor + "_form").submit();
						} else {
							location.href =
								"response.php?tx=" + result.tx + "&amt=" + result.amt;
						}
					} else {
						var messages = result.messages
							? "&messages=" + JSON.stringify(result.messages)
							: "";
						location.href =
							"response.php?st_err=true&action=" + result.action + messages;
					}
				}
			});
		}
	} //processors
}; //init

$(function() {
	processing.init();
});