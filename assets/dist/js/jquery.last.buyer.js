var last_buyer = {
	set_interval: true,
	count: 0,
	init: function() {
		$(window).on("load", function() {
			$(".last-buyer-box").addClass("active");
			last_buyer.ajax_get_last_clients();
			$("select, input").on("focus", function() {
				if ($(window).width() <= 767) {
					last_buyer.stop_process();
				}
			});
		});
	},
	ajax_get_last_clients: function() {
		var data = {};
		var all_data = processing.data.get_all();
		data["country"] = processing.data.get_selected_country_el().val();
		data["country_code"] = processing.data
			.get_selected_country_el()
			.data("iso");
		data["page_name"] = all_data.page_name;
		data["action_buyer"] = "get_buyers";
		$.ajax({
			url: "/api/last-buyer?lang=" + $.cookie("PAGE_LANG"),
			dataType: "json",
			type: "POST",
			data: data,
			success: function(result) {
				if (typeof result == "object") {
					var clients = result;
					last_buyer.show_hide_process(clients);
				}
			}
		});
	},
	change_client: function(clients) {
		var client = clients[last_buyer.count];
		if (client) {
			var country = client["Country"];

			if ($(".last-buyer-text").length) {
				//all pages except intl
				$(".last-buyer-city").text(country);
				var day_interval = 24;
				if (client["first_paid_time_hours_ago"] > 0) {
					$(".last-buyer-text").addClass("hidden");
					if (client["first_paid_time_hours_ago"] > day_interval) {
						var days = Math.floor(
							client["first_paid_time_hours_ago"] / day_interval
						);
						var hourse = client["first_paid_time_hours_ago"] % day_interval;
						$(".last-buyer-days").text(days);
						$(".last-buyer-days-hours").text(hourse);
						$(".last-buyer-days-text").removeClass("hidden");
					} else {
						$(".last-buyer-hours").text(client["first_paid_time_hours_ago"]);
						$(".last-buyer-hours-text").removeClass("hidden");
					}
				} else {
					$(".last-buyer-text").addClass("hidden");
					$(".last-buyer-mins-text").removeClass("hidden");
				}
			} else {
				//intl_4
				if ($(".last-buyer-name").length) {
					$(".last-buyer-name").text(client["Name"]);
				}
				if ($(".last-buyer-city").length) {
					$(".last-buyer-city").text(client["City"]);
				}
				if ($(".last-buyer-country").length) {
					$(".last-buyer-country").text(country);
				}
				if ($(".last-buyer-qty").length) {
					$(".last-buyer-qty").text(client["Quantity"]);
				}
			}

			$(".last-buyer-box.active").addClass("in");
		}
	},
	show_hide_process: function(clients) {
		if (last_buyer.count >= clients.length) {
			last_buyer.set_interval = false;
		}
		if (last_buyer.set_interval) {
			var max_sec = 30;
			var min_sec = 10;
			var time_sec_showing_delay = 5;
			var set_interval_time_sec = Math.floor(
				Math.random() * (max_sec - min_sec + 1) + min_sec
			);

			setTimeout(function() {
				last_buyer.change_client(clients);
				last_buyer.count += 1;
				if ($(".last-buyer-box.active").hasClass("in")) {
					setTimeout(function() {
						$(".last-buyer-box.active").removeClass("in");
						last_buyer.show_hide_process(clients);
					}, time_sec_showing_delay * 1000);
				} else {
					last_buyer.show_hide_process(clients);
				}
			}, set_interval_time_sec * 1000);
		}
	},
	stop_process: function() {
		if (last_buyer.set_interval) {
			if ($(".last-buyer-box.active").hasClass("in")) {
				$(".last-buyer-box.active").removeClass("in");
			}
			last_buyer.set_interval = false;
		}
	}
};

$(function() {
	last_buyer.init();
});