var forum = {
	serverHost: "http://forums-edisa.rhcloud.com",

	// serverHost: "http://192.168.0.106:8080",

	// serverHost: "http://192.168.11.118:8080",

	// serverHost: "http://10.17.35.47:8080",

	clickOrTouch: ("ontouchstart" in document.documentElement) ? "mouseup" : "click",

	// clickOrTouch: "click",

	loginned: false,

	setPageTitle: function(title) {
		document.getElementsByTagName("title")[0].innerHTML = title ? title : "labooda.ru";
	},

	removeListeners: function() {
		for (var i = forum.listenerRemovers.length - 1; i >= 0; i--) {
			forum.listenerRemovers[i]();
		}
		forum.listenerRemovers = [];
		forum.listenerss = [];
	},

	reload: function() {
		forum.removeListeners();
		forum.route(window.location.hash);
	},

	listenerRemovers: [],

	addListener: function(elem, event, listener) {
		forum.listenerRemovers.push((function(elem, event, listener) {
			return function() {
				elem.removeEventListener(event, listener)
			}
		})(elem, event, listener));
		elem.addEventListener(event, listener);
	},

	getCookie: function(name) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	},

	setCookie: function(str) {
		var date = new Date;
		date.setFullYear(date.getFullYear() + 1);
		document.cookie = str + "; path=/; expires=" + date.toUTCString();
	},

	deleteCookie: function(name) {
		var date = new Date;
		date.setDate(0);
		document.cookie = name + "=1; path=/; expires=" + date.toUTCString();
	},

	jsonParse: function(str) {
		try {
			return JSON.parse(str);
		} catch (e) {
			return {};
		}
	},

	escape: function(str) {
		return str
					 .replace(/</g, "&lt;")
					 .replace(/>/g, "&gt;")
					 .replace(/"/g, "&quot;")
					 .replace(/'/g, "&#39;");
	},

	// FOR ALPHA VERSION

	// rewrite: function(str) {
	// 	document.getElementById("content").innerHTML = "\
	// 			<div class=\"content\">\
	// 				<p>" +
	// 					str +
	// 				"</p>\
	// 			</div>";
	// },

	// alphaChecked: false,

	// alphaCheck: function () {
	// 	var uid = forum.getCookie("nickname");
	// 	var hash = window.location.hash;
	// 	var cond = (hash === "#sign-in" || hash.indexOf("#sign-up") === 0 || hash.indexOf("#password") === 0);

	// 	if (uid) {
	// 		var authToken = forum.getCookie("auth-token");

	// 		forum.ajax({
	// 			method: "GET",
	// 			url: forum.serverHost + "/",
	// 			headers: {
	// 				"Auth-Token": authToken
	// 			},
	// 			success: function () {
	// 				forum.alphaChecked = true;
	// 				forum.route(hash);
	// 			},
	// 			error: function () {
	// 				if (cond) {
	// 					forum.alphaChecked = true;
	// 					forum.route(hash);
	// 				} else {
	// 					forum.alphaChecked = false;
	// 					forum.rewrite("Идёт закрытое альфа-тестирование, <a href=\"#sign-in\">Войдите в систему</a>, если вы зарегистрированы");
	// 				}
	// 			}
	// 		});
	// 	} else {
	// 		if (cond) {
	// 			forum.alphaChecked = true;
	// 			forum.route(hash);
	// 		} else {
	// 			forum.alphaChecked = false;
	// 			forum.rewrite("Идёт закрытое альфа-тестирование, <a href=\"#sign-in\">Войдите в систему</a>, если вы зарегистрированы");
	// 		}
	// 	}
	// },

	// END

	makePager: function (page, lastPage, url) {
		page = page*1;
		var pager = '';

		if (lastPage > 6) {

			if ((page > 3) && (page < lastPage - 2)) {
				pager = "<a href=\"" + url + "/page/1\">1</a>\
						...\
						<a href=\"" + url + "/page/" + (page - 1) + '">' + (page - 1) + "</a>\
						<a href=\"" + url + "/page/" + page + '" class="active">' + page + "</a>\
						<a href=\"" + url + "/page/" + (page + 1) + '">' + (page + 1) + "</a>\
						...\
						<a href=\"" + url + "/page/" + lastPage + '">' + lastPage + '</a>';
			} else if (page < 4) {
				pager = "<a href=\"" + url + "/page/1\">1</a>\
						<a href=\"" + url + "/page/2\">2</a>\
						<a href=\"" + url + "/page/3\">3</a>\
						<a href=\"" + url + "/page/4\">4</a>\
						...\
						<a href=\"" + url + "/page/" + lastPage + '">' + lastPage + '</a>';

				pager = pager.replace("/page/" + page, "/page/" + page + "\" class=\"active\"");
			} else if (page > lastPage - 3) {
				pager = "<a href=\"" + url + "/page/1\">1</a>\
						...\
						<a href=\"" + url + "/page/" + (lastPage - 3) + '">' + (lastPage - 3) + "</a>\
						<a href=\"" + url + "/page/" + (lastPage - 2) + '">' + (lastPage - 2) + "</a>\
						<a href=\"" + url + "/page/" + (lastPage - 1) + '">' + (lastPage - 1) + "</a>\
						<a href=\"" + url + "/page/" + lastPage + '">' + lastPage + '</a>';

				pager = pager.replace("/page/" + page, "/page/" + page + "\" class=\"active\"");
			}
		} else if (lastPage < 7) {
			for (var i = 1; i <= lastPage; i++) {
				pager = pager + "<a href=\"" + url + "/page/" + i + "\">" + i + "</a> ";
			}

			pager = pager.replace("/page/" + page, "/page/" + page + "\" class=\"active\"");
		}

		return pager.replace("//", "/");
	},

	makeDateStr: function (num) {
		var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
		date = new Date(num);
		var minutes = date.getMinutes();
		minutes = minutes < 10 ? "0" + minutes : minutes;
		var hours = date.getHours();
		hours = hours < 10 ? "0" + hours : hours;
		return (date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " в " + 
		hours + ":" + minutes);
	}

};
(function() {
	var i = 1;
	function ajax(confs) {
		if (!forum.requestGoing || confs.hidden) {
			// свойства confs: method, url, async, params{}, body{}, headers{}, success(), error()
			// синхронные запросы не работают, если запрос кросс-доменный
			// также при синхронных запросах нельзя указать xhr.timeout
			var xhr = new XMLHttpRequest();
			var body, result;
			forum.requestGoing = !confs.hidden;

			// берём нужные параметры из конфигурационного объекта

			var method = confs.method;
			var url = confs.url;
			var async = (confs.async === undefined ? true : false);
			var params = confs.params;
			var requestBody = confs.body;
			var headers = confs.headers;
			var success = confs.success;
			var error = confs.error;
			var hidden = confs.hidden || false;

			// добавляем к URL переданные параметры

			url += "?";
			for (var key in params) {
				url += key + "=" + params[key] + "&";
			}
			url = url.slice(0, url.length - 1);

			// преобразуем объект тела запроса в строку

			requestBody = JSON.stringify(requestBody);
			body = requestBody;

			xhr.open(method, url, async);

			// устанавливаем переданные заголовки

			for (var key in headers) {
				xhr.setRequestHeader(key, headers[key]);
			}

			xhr.setRequestHeader("Content-Type", "application/json");

			// отправляем запрос

			xhr.send(body);

			if (!hidden) {
				var pbWrapper = document.getElementById("pb-wrapper");
				var pb = forum.progressBar(pbWrapper);
				pb.start();

				xhr.onloadend = function() {
					pb.done();
					window.scrollTo(0, 0);
				}

				xhr.onprogress = function(event) {
					pb.set( (event.loaded/event.total) * 100 );
				}
			}

			// ждём ответ и обрабатываем его

			xhr.onreadystatechange = function() {
				if (xhr.readyState != 4) return;

				forum.requestGoing = false;

				if (xhr.status === 200 || xhr.status === 201) {
					if (success) {
						var result = forum.jsonParse(xhr.responseText);

						if (result) {
							success(result, xhr);
						} else {
							forum.notify("error", "Что-то пошло не так... Попробуйте перезагрузить страницу");
						}
					}
				} else {
					if (error) {
						var result = forum.jsonParse(xhr.responseText);

						if (result) {
							error(result, xhr);
						} else {
							forum.notify("error", "Что-то пошло не так... Попробуйте перезагрузить страницу");
						}
					}
				}
			}
		}
	}

	forum.ajax = ajax;
})();
(function() {
	function progressBar(parent) {
		var pbWrapper = parent;
		var pbElem = document.createElement("div");
		pbElem.className = "progress-bar";
		pbWrapper.appendChild(pbElem);

		pbElem.style.position = "fixed";
		pbElem.style.top = "0px";
		pbElem.style.left = "0px";

		var current = 5;

		return result = {
			start: function() {
				pbElem.style.opacity = "1";

				pbElem.style.width = "5%";
			},
			done: function() {
				pbElem.style.width = "100%";
				(function(el, pbWrapper, pbElem) {
					setTimeout(function() {
						el.style.opacity = "0";
							setTimeout(function() {
							pbWrapper.removeChild(pbElem);
						}, 200);
					}, 600);
				})(pbElem, pbWrapper, pbElem);
			},
			set: function(value) {
				(function(val) {
					setTimeout(function() {
						pbElem.style.width = (value < 5 ? 5 : value) + "%";
					}, 200);
				})(value);
			}
		}
	}

	forum.progressBar = progressBar;
})();
(function() {
	var validators = {
		email: function(email) {
			return (email.indexOf('@') !== -1);
		},

		nickName: function(nickName) {
			return (nickName.search(/^[a-zA-Z0-9]+[a-zA-Z0-9-_\.]*[a-zA-Z0-9]+$/g) !== -1);
		},

		password: function(password) {
			return (password.length > 5 && password.length < 65);
		}
	}

	forum.validators = validators;
})();
(function() {
	forum.renewNav = function() {
		var hash = window.location.hash;
		var template = document.getElementById("nav-template").innerHTML;
		var navContainer = document.getElementById("nav-container");
		var container = document.getElementById("main-nav");
		if (hash.indexOf("#main") === 0 || hash === "") {
			container.innerHTML = templayed(template)({ main: "class=active" });
		} else if (hash.indexOf("#themes") === 0) {
			container.innerHTML = templayed(template)({ themes: "class=active" });
		} else if (hash.indexOf("#users") === 0) {
			container.innerHTML = templayed(template)({ users: "class=active" });
		} else if (hash.indexOf("#feedback") === 0) {
			container.innerHTML = templayed(template)({ feedback: "class=active" });
		} else {
			container.innerHTML = template;
		}

		var navBtn = document.getElementById("nav-btn");

		forum.addListener(navBtn, forum.clickOrTouch, toggleNavContainer);

		forum.addListener(window, "resize", collibrate);

		forum.addListener(window, "scroll", position);

		function collibrate() {
			if (window.innerWidth > 480) {
				navContainer.style.display = "block";
			} else {
				navContainer.style.display = "none";
			}
		}

		var header = document.getElementsByTagName("header")[0];
		var scrollId = header.innerHeight - navBtn.innerHeight;

		function position() {
			if (window.innerWidth < 480) {
				if (window.pageYOffset > 65) {
					header.classList.add("fixed");
				} else {
					header.classList.remove("fixed");
				}
			}
		}

		position();

		collibrate();

		function hide() {
			navContainer.style.display = "none";
		}

		function open() {
			navContainer.style.display = "block";
		}

		function toggleNavContainer() {
			if (navContainer.style.display === "block") {
				hide();
			} else {
				open();
			}
		}
	}

	forum.changeView = function(page) {
		var content = document.getElementById("content");
		var specialAction = page.special;
		var data = page.data;
		var title = page.title;

		forum.setPageTitle(title);

		if (specialAction) {
			specialAction();
		} else {
			var template = document.getElementById(page.templateId).innerHTML;

			var confs = page.confs;
			var action = page.action;

			if (confs) {
				if (!confs.success) {
					confs.success = function(response) {
						content.innerHTML = templayed(template)(response);
						if (action) {
							action();
						}
					}
				}
				if (!confs.error) {
					confs.error = function(response) {
						forum.notify("error", response.meta.message);
					}
				}
				forum.ajax(confs);
			} else if (data) {
				content.innerHTML = templayed(template)(data);
				if (action) {
					action();
				}
			} else {
				content.innerHTML = template;
				if (action) {
					action();
				}
			}
		}
	}

	forum.route = function(hash) {
		forum.removeListeners();
		forum.renewNav();
		forum.showUserPanel();

		// FOR ALPHA VERSION

		// if (!forum.alphaChecked) {
		// 	forum.alphaCheck();
		// 	return;
		// }

		// forum.alphaChecked = false;

		// END

		if (hash.indexOf("#/") === 0) {
			forum.sectionModule(hash.slice(2));
		} else if (hash.indexOf("#themes") === 0) {
			forum.themesSearch(hash);
		} else if (hash === "") {
			forum.changeView(forum.pages["#main"]);
		} else if (hash.indexOf("#user") === 0) { // May be #users for search page
			forum.usersModule();
		} else {
			var page = forum.pages[hash.split("/")[0]];
			if (page) {
				forum.changeView(page);
			} else if (hash.indexOf("#sign-up") === 0) {
				forum.changeView(forum.pages["#sign-up"]);
			} else if (hash.indexOf("#sign-in") === 0) {
				forum.changeView(forum.pages["#sign-in"]);
			} else if (hash.indexOf("#password/") === 0) {
				forum.setPageTitle("Установка нового пароля | labooda.ru");
				var confirmHash = hash.split("/")[1];
				forum.changeView({
					templateId: "repassword-template",
					action: function() {
						var form = document.getElementById("repassword-form");
						var password = form.password;
						var repeatPassword = form["repeat-password"];

						password.focus();
						forum.addListener(form, "submit", repass);

						function repass() {
							if (password.value.indexOf(" ") === -1) {
								if (forum.validators.password(password.value)) {
									if (password.value === repeatPassword.value) {
										forum.ajax({
											method: "PUT",
											url: forum.serverHost + "/password/" + confirmHash,
											headers: {
												password: password.value
											},
											success: function() {
												forum.notify("success", "Новый пароль установлен");
												window.location.hash = "#sign-in";
											},
											error: function(response) {
												forum.notify("error", "Не удалось установить новый пароль");
												forum.notify("error", response.meta.message);
											}
										});
									} else {
										forum.notify("error", "Пароли не совпадают");
									}
								} else {
									forum.notify("error", "Пароль должен быть длиной от 6 до 64 символов");
								}
							} else {
								forum.notify("error", "Пароль не должен содержать пробелов");
							}
						}
					}
				});
			} else if (hash.indexOf("#confirm/") === 0) {
				forum.setPageTitle("...");
				var content = document.getElementById("content");
				content.innerHTML = "<div class=\"content\"><h2>Подождите...</h2></div>";

				if (hash.indexOf("#confirm/email") === 0) {
					var mail = hash.split("/")[2];
					forum.ajax({
						method: "GET",
						url: forum.serverHost + "/confirmation/email",
						headers: {
							"Auth-Token": forum.getCookie("auth-token")
						},
						success: function () {
							setTimeout(function () {
								forum.setPageTitle("Письмо отправлено");
								content.innerHTML = "<div class=\"content\"><h2>Письмо отправлено</h2><p>Письмо для подтверждения email-адреса<strong>(" + mail + ")</strong> отправлено</p></div>";
							}, 1000);
						},
						error: function () {
							setTimeout(function () {
								forum.setPageTitle("Не удалось отправить письмо");
								content.innerHTML = "<div class=\"content\"><h2>Что-то пошло не так</h2><p>Не удалось отправить письмо для подтверждения email-адреса<strong>(" + mail + ")</strong></p></div>";
							}, 1000);
						}
					});
				} else {
					var code = hash.split("/")[1];
					forum.ajax({
						method: "GET",
						url: forum.serverHost + "/confirmation/email/" + code,
						success: function () {
							setTimeout(function () {
								forum.setPageTitle("email-адрес подтверждён");
								content.innerHTML = "<div class=\"content\"><h2>email-адрес успешно подтверждён!</h2></div>";
							}, 1000);
						},
						error: function () {
							setTimeout(function () {
								forum.setPageTitle("Не удалось подтвердить email-адрес");
								content.innerHTML = "<div class=\"content\"><h2>Не удалось подтвердить email-адрес</h2></div>";
							}, 1000);
						}
					});
				}
			} else if (hash.indexOf("#password-recovery") === 0) {
				forum.setPageTitle("Сброс пароля | labooda.ru");
				var index = hash.indexOf("?id=");
				if (index !== -1) {
					var id = hash.slice(index + 4);
				}
				forum.changeView({
					templateId: "repassword-query-template",
					data: {
						email: id
					},
					action: function() {
						var form = document.getElementById("email-form");
						forum.addListener(form, "submit", function(event) {
							var email = form.email.value;
							if (forum.validators.email(email)) {
								email = email.replace(" ", "");
								forum.ajax({
									method: "GET",
									url: forum.serverHost + "/recovery",
									params: {
										mail: email
									},
									success: function() {
										document.getElementById("content").innerHTML = "<div class=\"content\"><h3>Сообщение отправлено</h3><p>Сообщение для сброса пароля отправлено на email: <strong>" + email + "</strong></p></div>";
									},
									error: function (response) {
										forum.notify("error", "Что-то пошло не так...");
									}
								});
							} else {
								forum.notify("error", "Некорректный email-адрес");
							}

							event.preventDefault();
						});
					}
				});
			} else {
				forum.ajax({
					method: "GET",
					url: forum.serverHost + "/info",
					params: {
						identifier: hash.slice(1)
					},
					success: function (response) {
						forum.changeView({
							templateId: "info-template",
							data: response
						});
					},
					error: function () {
						forum.changeView(forum.pages["#404"]);
					}
				});
			}
		}
	}
})();
(function() {
	var serverHost = forum.serverHost;

	function reg() {
		var regForm = document.getElementById("reg-form");

		// FOR ALPHA VERSION

		// var hash = window.location.hash.split("/")[1];

		// END

		var nickInput = regForm["reg-nick"];
		nickInput.focus();
		var mailInput = regForm["reg-mail"];
		var passwordInput = regForm["reg-password"];

		var showPasswordBtn = document.getElementById("show-password-btn");
		showPasswordBtn.style.color = "#aaa";
		var passwordShowed = false;

		forum.addListener(showPasswordBtn, forum.clickOrTouch, function() {
			if (passwordShowed) {
				passwordInput.setAttribute("type", "password");
				showPasswordBtn.style.color = "#aaa";
				passwordShowed = false;
			} else {
				passwordInput.setAttribute("type", "text");
				showPasswordBtn.style.color = "#666";
				passwordShowed = true;
			}
		});

		// В размете у кнопки показать пароль есть лишний аттрибут data-target
		// Его пока не убрал, вдруг пригодится

		forum.addListener(regForm, "submit", handler);

		function handler(event) {
			if (mailInput.value.indexOf(" ") > -1 || nickInput.value.indexOf(" ") > -1 || passwordInput.value.indexOf(" ") > -1) {
				forum.notify("error", "Данные не должны содержать пробелы");
			} else if (!forum.validators.email(mailInput.value)) {
				forum.notify("error", "Некорректный email-адрес");
			} else if (nickInput.value.length < 4 || nickInput.value.length > 64) {
				forum.notify("error", "Никнейм должен быть длиной от 4 до 64 символов");
			} else if (!forum.validators.nickName(nickInput.value)) {
				forum.notify("error", "Никнейм не может начинаться и заканчиваться знаками препинания");
			} else if (!forum.validators.password(passwordInput.value)) {
				forum.notify("error", "Пароль должен быть длиной от 6 до 64 символов");
			} else {
				forum.ajax({
					method: "POST",
					// FOR ALPHA VERSION
					// url: serverHost + "/users/" + hash,
					// END
					url: serverHost + "/users",
					body: {
						nickname: nickInput.value,
						mail: mailInput.value,
						password: passwordInput.value
					},
					success: function(response, xhr) {
						// forum.setCookie("auth-token=" + xhr.getResponseHeader('Auth-Token'));
						// forum.setCookie("nickname=" + response.data.nickname);
						// forum.showUserPanel();
						// forum.notify("success", "Регистрация успешно завершена. Ждём, пока вы подтвердите email-адрес");
						// window.location.hash = "#main";
						document.getElementById("content").innerHTML = "<div class=\"content\"><h2>Вы успешно зарегистрировались!</h2><p>Осталось только подтвердить адрес электронной почты (" + mailInput.value + ")</p></div>";
					},
					error: function(response) {
						if (response.meta) {
							forum.notify("error", response.meta.message);
						} else {	
							forum.notify("error", "Что-то пошло не так...");
						}
					}
				});
			}

			event.preventDefault();
		}
	}

	function aut() {
		var autForm = document.getElementById("aut-form");

		var idInput = autForm["aut-id"];
		var passwordInput = autForm["aut-password"];
		var repasswordLink = document.getElementById("repassword-link");
		var showPasswordBtn = document.getElementById("show-password-btn");
		var passwordShowed = false;

		idInput.focus();
		showPasswordBtn.style.color = "#aaa";

		forum.addListener(repasswordLink, forum.clickOrTouch, repassword);

		function repassword() {
			var q = idInput.value ? "?id=" + idInput.value : "";
			repasswordLink.setAttribute("href", repasswordLink.getAttribute("href") + q);
		}

		forum.addListener(showPasswordBtn, forum.clickOrTouch, function() {
			if (passwordShowed) {
				passwordInput.setAttribute("type", "password");
				showPasswordBtn.style.color = "#aaa";
				passwordShowed = false;
			} else {
				passwordInput.setAttribute("type", "text");
				showPasswordBtn.style.color = "#666";
				passwordShowed = true;
			}
		});

		forum.addListener(autForm, "submit", handler);

		function handler(event) {
			if (idInput.value.indexOf(" ") > -1 || passwordInput.value.indexOf(" ") > -1) {
				forum.notify("error", "Данные не должны содержать пробелы");
			} else {
				forum.ajax({
					method: "POST",
					url: serverHost + "/login",
					headers: {
						identifier: idInput.value,
						password: passwordInput.value
					},
					success: function(response, xhr) {
						forum.setCookie("nickname=" + response.data.nickname);
						forum.setCookie("auth-token=" + xhr.getResponseHeader('Auth-Token'));
						forum.showUserPanel();
						forum.notify("success", "Вы вошли в систему. Приятного использования :)");
						window.location.hash = "#main";
					},
					error: function(response) {
						if (response.meta) {
							forum.notify("error", response.meta.message);
						} else {	
							forum.notify("error", "Что-то пошло не так...");
						}
					}
				});
			}

			event.preventDefault();
		}
	}

	function feedback() {
		var form = document.getElementById("fb-form");

		forum.addListener(form, "submit", handler);

		function handler(event) {
			var msg = form["fb-message"].value;
			var anonym = form["fb-anonym"].checked;

			forum.ajax({
				method: "POST",
				url: forum.serverHost + "/feedback",
				headers: {
					"Auth-Token": forum.getCookie("auth-token")
				},
				body: {
					message: msg
				},
				params: {
					anonymous: anonym
				},
				success: function() {
					forum.notify("success", "Спасибо за отзыв :)");
					forum.reload();
				},
				error: function() {
					forum.notify("error", "Что-то пошло не так...");
				}
			});

			event.preventDefault();
		}
	}

	var pages = {
		"#sign-in": {
			title: "Вход",
			templateId: "sign-in-template",
			action: aut
		},
		"#sign-up": {
			title: "Регистрация",
			templateId: "sign-up-template",
			action: reg
		},
		"#main": {
			title: "labooda.ru",
			templateId: "main-template",
			confs: {
				method: "GET",
				url: serverHost + "/sections"
			}
		},
		"#404": {
			title: "Страница не найдена",
			templateId: "nf-template"
		},

		// FOR ALPHA VERSION

		"#feedback": {
			title: "Отзыв",
			templateId: "feedback-template",
			action: feedback
		}

		// END
	}

	forum.pages = pages;
})();
(function() {
	var notificationTypes = {
		"info": ["notification", "info-notification"],
		"success": ["notification", "success-notification"],
		"warning": ["notification", "warning-notification"],
		"error": ["notification", "error-notification"]
	}

	function notify(type, text) {
		var msg = document.createElement("div");

		for (var i = 0; i < notificationTypes[type].length; i++) {
			msg.classList.add(notificationTypes[type][i]);
		}

		msg.textContent = text;

		var msgs = document.getElementById("notifications");
		var lastMsg = msgs.childNodes[0];
		msgs.insertBefore(msg, lastMsg);

		function close() {
			closeNotification(msg);
		}

		msg.addEventListener(forum.clickOrTouch, close);

		setTimeout(function(msg) {
			closeNotification(msg);
		}, 8000, msg);

		function closeNotification(msg) {
			if (msg.parentNode) {
				msg.parentNode.removeChild(msg);
			}
		}
	}

	forum.notify = notify;
})();
(function() {
	forum.logout = function() {
		forum.loginned = false;
		forum.rights = null;
		forum.deleteCookie("auth-token");
		forum.deleteCookie("nickname");
	}

	forum.userActions = function() {
		var userLink = document.getElementById("user-link");
		var userPanelMenu = document.getElementById("user-panel-menu");
		var userLogoutBtn = document.getElementById("user-logout-btn");

		var touch = ('ontouchstart' in document.documentElement);

		forum.addListener(userLogoutBtn, forum.clickOrTouch, logout);
		forum.addListener(userLink, forum.clickOrTouch, toggleUserPanelMenu);

		function logout() {
			forum.ajax({
				method: "DELETE",
				url: forum.serverHost + "/logout",
				headers: {
					"Auth-Token": forum.getCookie("auth-token")
				},
				success: function() {
					forum.deleteCookie("auth-token");
					forum.deleteCookie("user-id");
					window.location.reload();
				},
				error: function() {
					forum.notify("error", "Не удалось выйти из системы :(");
				}
			});
		}

		function hide() {
			userPanelMenu.style.display = "none";
		}

		function open() {
			userPanelMenu.style.display = "block";
		}

		function toggleUserPanelMenu() {
			if (userPanelMenu.style.display === "block") {
				hide();
			} else {
				open();
			}
		}

		window.addEventListener(forum.clickOrTouch, function(event) {
			if (!(event.target.getAttribute("id") === "user-link")) {
				closeShowedElems();
			}
		});

		function closeShowedElems() {
			var userPanelMenu = document.getElementById("user-panel-menu");
			if (userPanelMenu) {
				userPanelMenu.style.display = "none";
			}
		}
	}

	forum.showUserPanel = function() {
		var nickname = forum.getCookie("nickname");
		var userPanel = document.getElementById("user-panel");
		var template = document.getElementById("user-panel-template").innerHTML;
		if (nickname) {
			var authToken = forum.getCookie("auth-token") || "";

			forum.ajax({
				method: "GET",
				url: forum.serverHost + "/",
				hidden: true,
				headers: {
					"Auth-Token": authToken
				},
				success: function () {
					forum.loginned = true;
					forum.ajax({
						method: "GET",
						url: forum.serverHost + "/users/" + nickname,
						hidden: true,
						headers: {
							"Auth-Token": authToken
						},
						success: function (response) {
							var data = response.data;
							forum.rights = response.data.rights;
							data.showUser = true;
							userPanel.innerHTML = templayed(template)(data);
							forum.userActions();
						},
						error: function () {
							if (response.meta.code === "403") {
								forum.logout();
							}
							userPanel.innerHTML = templayed(template)({
								showLinks: true
							});
						}
					});
				},
				error: function (response) {
					if (response.meta.code === "403") {
						forum.logout();
					}
					userPanel.innerHTML = templayed(template)({
						showLinks: true
					});
				}
			});
		} else {
			forum.logout();
			userPanel.innerHTML = templayed(template)({
				showLinks: true
			});
		}
	}

	forum.usersModule = function() {
		var hash = window.location.hash;
		var urlArr = hash.split("/");
		var section = urlArr[0];
		if (section === "#user") {
			var nickname = urlArr[1];
			if (nickname) {
				if (urlArr[2] === "edit") {
					forum.ajax({
						method: "GET",
						url: forum.serverHost + "/users/" + nickname,
						headers: {
							"Auth-Token": forum.getCookie("auth-token") || ""
						},
						success: function (response) {
							forum.changeView({
								templateId: "profile-edit-template",
								data: response,
								action: forum.profileEditInit
							});
						},
						error: function (response) {
							forum.notify("error", response.meta.message);
						}
					});
				} else {
					forum.showUser(nickname);
				}
			} else {
				window.location.hash = "#users/";
			}
		} else {
			forum.usersSearch(hash);
		}
	}

	forum.showUser = function(nickname) {
		forum.ajax({
			method: "GET",
			url: forum.serverHost + "/users/" + nickname,
			headers: {
				"Auth-Token": forum.getCookie("auth-token") || ""
			},
			success: function (response) {
				if (response.data.mail) {
					response.data.mailExists = true;
				}
				response.data.mailVerified = response.data.rights === "unverified" ? false : true;
				if (response.data.avatar) {
					response.data.avatarExists = true;
				}
				if (response.data.name) {
					response.data.nameExists = true;
				}
				if (response.data.registrationTime) {
					response.data.registrationTime = forum.makeDateStr(response.data.registrationTime);
					response.data.registrationTimeExists = true;
				}
				if (response.data.dateOfBirth) {
					response.data.dateOfBirth = forum.makeDateStr(response.data.dateOfBirth);
					response.data.dateOfBirthExists = true;
				}

				// Проблема, которую в будущем надо будет решить:

				// если запрос с проверкой логина (метод forum.showUserPanel)
				// не получит ответа до того, как начнётся исполнение этого кода,
				// кнопка редактирования профиля не будет показана

				if (forum.loginned && nickname.toLowerCase() === forum.getCookie("nickname").toLowerCase()) {
					response.data.profileEditBtn = true;
				}
				forum.changeView({
					title: response.data.nickname,
					templateId: "user-template",
					data: response
				});
				if (response.data.profileEditBtn) {
					forum.profileEdit(nickname);
				}
			},
			error: function () {
				forum.changeView(forum.pages["#404"]);
			}
		});
	}

	forum.profileEdit = function(nickname) {
		forum.profileEditInit = function() {
			var profileEditBackBtn = document.getElementById("profile-edit-back-btn");
			var form = document.getElementById("profile-edit-form");
			var email = form.email.value;
			forum.addListener(form, "submit", function (event) {
				forum.ajax({
					method: "PUT",
					url: forum.serverHost + "/users/" + nickname,
					headers: {
						"Auth-Token": forum.getCookie("auth-token") || ""
					},
					body: {
						name: form.name.value || null,
						mail: form.email.value || email,
						info: null,
						// info: form.info.value || null,
						dateOfBirth: null,
						avatar: null,
						password: form.password.value || null
					},
					success: function () {
						forum.notify("success", "Информация обновлена");
						forum.reload();
					},
					error: function (response) {
						forum.notify("error", response.meta.message);
					}
				});

				event.preventDefault();
			});

			forum.addListener(profileEditBackBtn, forum.clickOrTouch, function() {
				window.location.hash = window.location.hash.replace(/\/edit\/?/, "");
			})
		}

		var profileEditBtn = document.getElementById("profile-edit-btn");
		forum.addListener(profileEditBtn, forum.clickOrTouch, function (event) {
			var hash = window.location.hash;
			window.location.hash = hash + (hash.lastIndexOf("/") === hash.length - 1 ? "" : "/") + "edit";
		});
	}

	forum.usersSearch = function(url) {
		// url вида #users[/search={query}]

		function activateForm() {
			var form = document.getElementById("users-search-form");
			var input = form["users-search-input"];
			if (forum.clickOrTouch === "click") {
				input.focus();
			}

			forum.addListener(form, "submit", function (event) {
				window.location.hash = "#users/search=" + input.value;

				event.preventDefault();
			})
		}

		var urlArr = url.split("/");
		var usersCount = 30;

		if (urlArr[1] && urlArr[1].indexOf("search=") > -1) {
			var query = decodeURI(urlArr[1].slice(7));
			var params = {
				sort: "byRating",
				find: query,
				count: usersCount
			}
			var curPage = urlArr[3] || 1;
			if (!curPage || curPage < 1) {
				window.location.hash = window.location.hash.replace("page/" + curPage, "page/1");
			}
			params.offset = usersCount * curPage - usersCount;
			forum.ajax({
				method: "GET",
				url: forum.serverHost + "/users",
				params: params,
				headers: {
					"Auth-Token": forum.getCookie("auth-token") || ""
				},
				success: function (response) {
					if (response.meta.count > 0) {
						response.data.usersExist = true;
					}
					var lastPage = Math.ceil(response.meta.count / usersCount) || 1;

					if (lastPage <= curPage) {
						window.location.hash = window.location.hash.replace("page/" + curPage, "page/" + lastPage);
					}

					var coreUrl = urlArr[0] + "/" + urlArr[1];
					response.pager = lastPage > 1 ? forum.makePager(curPage, lastPage, coreUrl) : "";
					response.data.searchQuery = query;
					forum.changeView({
						title: "Пользователи",
						templateId: "users-search-template",
						data: response
					});
					activateForm();
				},
				error: function (response) {
					forum.notify("error", response.meta.message);
				}
			});
		} else {
			var params = {
				sort: "byRating",
				count: usersCount
			}
			var curPage = urlArr[2] || 1;
			if (!curPage || curPage < 1) {
				window.location.hash = window.location.hash.replace("page/" + curPage, "page/1");
			}
			params.offset = usersCount * curPage - usersCount;
			forum.ajax({
				method: "GET",
				url: forum.serverHost + "/users",
				params: params,
				headers: {
					"Auth-Token": forum.getCookie("auth-token") || ""
				},
				success: function (response) {
					if (response.meta.count > 0) {
						response.data.usersExist = true;
					}
					var lastPage = Math.ceil(response.meta.count / usersCount) || 1;

					if (lastPage <= curPage) {
						window.location.hash = window.location.hash.replace("page/" + curPage, "page/" + lastPage);
					}

					var coreUrl = urlArr[0];
					response.pager = lastPage > 1 ? forum.makePager(curPage, lastPage, coreUrl) : "";
					forum.changeView({
						title: "Пользователи",
						templateId: "users-search-template",
						data: response
					});
					activateForm();
				},
				error: function (response) {
					forum.notify("error", response.meta.message)
				}
			});
		}
	}
})();
(function() {
	forum.showTheme = function(url) {
		// Формат url: {section}/{themeId}[/page/{page}]

		var urlArr = url.split("/");
		var themeUrl = urlArr[0] + "/" + urlArr[1];

		var msgsCount = 20;
		var curPage = (urlArr[3] * 1) || 1;
		if (!curPage || curPage < 1) {
			window.location.hash = window.location.hash.replace("page/" + curPage, "page/1");
		}

		var themeId = urlArr[1];
		forum.ajax({
			method: "GET",
			url: forum.serverHost + "/themes/" + themeId,
			headers: {
				"Auth-Token": forum.getCookie("auth-token") || ""
			},
			params: {
				count: msgsCount,
				offset: msgsCount * curPage - msgsCount
			},
			success: function (response) {

				if (response.data.messagesCount) {
					response.data.messagesExists = true;
				}

				var lastPage = Math.ceil(response.data.messagesCount / msgsCount) || 1;
				if (lastPage <= curPage) {
					window.location.hash = window.location.hash.replace("page/" + curPage, "page/" + lastPage);
				}
				response.pager = lastPage > 1 ? forum.makePager(curPage, lastPage, "#/" + themeUrl) : "";

				response.data.date = forum.makeDateStr(response.data.date);

				var l = response.data.messages.length;
				var arr = response.data.messages;

				// Вот тут тоже надо будет попробовать оптимизировать

				for (var i = 0; i < l; i++) {
					arr[i].message = marked(forum.escape(arr[i].message));
					// arr[i].message = marked(arr[i].message);
					arr[i].date = forum.makeDateStr(arr[i].date);
					arr[i].avatarExists = !!arr[i].author.avatar;
					if ( (forum.loginned && (forum.getCookie("nickname") === arr[i].author.nickname)) || forum.rights === "admin" || forum.rights === "moderator") {
						arr[i].showDeleteBtn = true;
					} else {
						arr[i].showDeleteBtn = false;
					}
					switch (arr[i].liked) {
						case true:
							arr[i].votedUp = true;
							break;
						case false:
							arr[i].votedDown = true;
							break;
					}
				}

				response.data.showMessageForm = forum.loginned;

				// ----------

				forum.changeView({
					title: response.data.title,
					templateId: "theme-template",
					data: response,
					action: function() {
						forum.themeModule(themeUrl, themeId, msgsCount);
					}
				});
			}
		});
	}

	forum.addTheme = function() {
		if (forum.loginned) {
			forum.changeView({
				title: "Создание темы",
				templateId: "add-theme-template",
				confs: {
					method: "GET",
					url: forum.serverHost + "/sections"
				},
				action: function() {
					var form = document.getElementById("add-theme-form");
					forum.addListener(form, "submit", function(event) {
						var tags = form.tags.value.replace(/  +/g, " ").split(/, ?/);
						for (var i = 0, l = tags.length; i < l; i++) {
							tags[i] = {name: tags[i]};
						}
						forum.ajax({
							method: "POST",
							url: forum.serverHost + "/themes",
							headers: {
								"Auth-Token": forum.getCookie("auth-token") || ""
							},
							body: {
								title: form.title.value,
								message: form.message.value,
								sectionUrl: form.section.value,
								tags: tags
							},
							success: function(response) {
								forum.notify("success", "Тема создана");
								window.location.hash = "#/" + form.section.value + "/" + response.data.themeId;
							},
							error: function(response) {
								forum.notify("error", response.meta.message);
							}
						});

						event.preventDefault();
					});
				}
			});
		} else {
			window.location.hash = "main";
		}
	}

	forum.themeModule = function(themeUrl, themeId, msgsCount) {
		// Формат url: {section}/{themeId}

		var requestUrl = "themes/" + themeId;
		var form = document.getElementById("add-message-form");

		forum.addListener(window, forum.clickOrTouch, function(event) {
			if (event.target.hasAttribute("data-delete-msg-btn")) {
				if (confirm("Удалить сообщение?")) {
					forum.ajax({
						method: "DELETE",
						url: forum.serverHost + "/messages/" + event.target.getAttribute("data-target"),
						headers: {
							"Auth-Token": forum.getCookie("auth-token") || ""
						},
						success: function() {
							forum.notify("info", "Сообщение удалено");
							forum.reload();
						},
						error: function(response) {
							forum.notify("error", "Не удалось удалить сообщение: " + response.meta.message);
						}
					});
				}
			} else if (event.target.hasAttribute("data-vote-target")) {

				// Здесь как-то очень много кода, надо будет оптимизировать

				if (forum.loginned) {
					var target = event.target.getAttribute("data-vote-target");
					var btns = event.target.parentNode.querySelectorAll("[data-vote-target]");
					var grade = event.target.getAttribute("data-vote-value") ? true : false;
					var value = event.target.parentNode.getElementsByClassName("rating-value")[0];
					forum.ajax({
						hidden: true,
						method: "PUT",
						url: forum.serverHost + "/messages/" + target + "/rating",
						headers: {
							"Auth-Token": forum.getCookie("auth-token")
						},
						params: {
							grade: grade
						},
						success: function() {
							if (grade) {
								if (btns[1].classList.contains("red")) {
									btns[0].classList.remove("green");
									btns[1].classList.remove("red");
								} else {
									btns[0].classList.add("green");
									btns[1].classList.remove("red");
								}
								value.innerHTML = value.innerHTML * 1 + 1;
							} else {
								if (btns[0].classList.contains("green")) {
									btns[1].classList.remove("red");
									btns[0].classList.remove("green");
								} else {
									btns[1].classList.add("red");
									btns[0].classList.remove("green");
								}
								value.innerHTML = value.innerHTML * 1 - 1;
							}
						},
						error: function(response) {
							forum.notify("error", response.meta.message);
						}
					});
				} else {
					forum.notify("info", "Войдите в систему, чтобы голосовать");
				}
			}
		});

		if (form) {
			forum.addListener(form, "submit", function(event) {
				forum.ajax({
					method: "POST",
					url: forum.serverHost + "/" + requestUrl,
					params: {
						count: msgsCount
					},
					headers: {
						"Auth-Token": forum.getCookie("auth-token") || ""
					},
					body: {
						message: form.message.value
					},
					success: function(response) {
						forum.notify("success", "Сообщение добавлено");
						var newHash = "#/" + themeUrl + "/page/" + (Math.ceil(response.data.messagesCount / msgsCount) || 1);
						if (window.location.hash === newHash) {
							forum.reload();
						} else {
							window.location.hash = "#/" + themeUrl + "/page/" + (Math.ceil(response.data.messagesCount / msgsCount) || 1);
						}
					},
					error: function(response) {
						forum.notify("error", response.meta.message);
					}
				});

				event.preventDefault();
			});
		}
	}

	forum.themesSearch = function(url) {
		// url вида themes[/search={query}[/page/{page}]]

		function activateForm() {
			var form = document.getElementById("themes-search-form");
			var input = form["themes-search-input"];
			if (forum.clickOrTouch === "click") {
				input.focus();
			}

			forum.addListener(form, "submit", function (event) {
				window.location.hash = "#themes/search=" + input.value;
				event.preventDefault();
			});
		}

		var urlArr = url.split("/");
		var themesCount = 30;

		if (urlArr[1] && urlArr[1].indexOf("search=") === 0) {
			var query = decodeURI(urlArr[1].slice(7));
			var params = {
				find: query,
				count: themesCount
			}
			var curPage = urlArr[3] || 1;
			if (!curPage || curPage < 1) {
				window.location.hash = window.location.hash.replace("page/" + curPage, "page/1");
			}
			params.offset = themesCount * curPage - themesCount;
			forum.ajax({
				method: "GET",
				url: forum.serverHost + "/themes",
				params: params,
				success: function (response) {
					if (response.meta.count > 0) {
						response.data.themesExist = true;
					}
					var lastPage = Math.ceil(response.meta.count / themesCount) || 1;

					if (lastPage <= curPage) {
						window.location.hash = window.location.hash.replace("page/" + curPage, "page/" + lastPage);
					}

					var coreUrl = urlArr[0] + "/" + urlArr[1];
					response.pager = lastPage > 1 ? forum.makePager(curPage, lastPage, coreUrl) : "";
					response.data.searchQuery = query;
					var arr = response.data;

					for (var i = arr.length - 1; i >= 0; i--) {
						arr[i].date = forum.makeDateStr(arr[i].date);
						if ( (forum.loginned && (forum.getCookie("nickname") === arr[i].nickname)) || forum.rights === "admin" || forum.rights === "moderator") {
							arr[i].showDeleteBtn = true;
						} else {
							arr[i].showDeleteBtn = false;
						}
					}

					forum.addListener(window, forum.clickOrTouch, forum.deleteTheme);

					forum.changeView({
						title: "Темы",
						templateId: "themes-search-template",
						data: response
					});
					activateForm();
				},
				error: function (response) {
					forum.notify("error", response.meta.message);
				}
			});
		} else {
			var params = {
				count: themesCount
			}
			var curPage = urlArr[2] || 1;
			if (!curPage || curPage < 1) {
				window.location.hash = window.location.hash.replace("page/" + curPage, "page/1");
			}
			params.offset = themesCount * curPage - themesCount;
			forum.ajax({
				method: "GET",
				url: forum.serverHost + "/themes",
				params: params,
				success: function (response) {
					if (response.meta.count > 0) {
						response.data.themesExist = true;
					}
					var lastPage = Math.ceil(response.meta.count / themesCount) || 1;

					if (lastPage <= curPage) {
						window.location.hash = window.location.hash.replace("page/" + curPage, "page/" + lastPage);
					}

					var coreUrl = urlArr[0];
					response.pager = lastPage > 1 ? forum.makePager(curPage, lastPage, coreUrl) : "";
					var arr = response.data;

					for (var i = arr.length - 1; i >= 0; i--) {
						arr[i].date = forum.makeDateStr(arr[i].date);
						if ( (forum.loginned && forum.getCookie("nickname") === arr[i].nickname) || forum.rights === "admin" || forum.rights === "moderator") {
							arr[i].showDeleteBtn = true;
						} else {
							arr[i].showDeleteBtn = false;
						}
					}

					forum.addListener(window, forum.clickOrTouch, forum.deleteTheme);

					forum.changeView({
						title: "Темы",
						templateId: "themes-search-template",
						data: response
					});
					activateForm();
				},
				error: function (response) {
					forum.notify("error", response.meta.message);
				}
			});
		}
	}

	forum.deleteTheme = function(event) {
		if (event.target.hasAttribute("data-delete-theme-btn")) {
			if (confirm("Удалить тему?")) {
				forum.ajax({
					method: "DELETE",
					url: forum.serverHost + "/themes/" + event.target.getAttribute("data-target"),
					headers: {
						"Auth-Token": forum.getCookie("auth-token") || ""
					},
					success: function() {
						forum.notify("info", "Тема удалена");
						forum.reload();
					},
					error: function(response) {
						forum.notify("error", "Не удалось удалить тему: " + response.meta.message);
					}
				});
			}
		}
	},

	forum.sectionModule = function(url) {
		// url вида {section}[/page/{page} | /{theme-id}]...

		var sh = url.split("/");
		var section = sh[0]; // {section}
		var url_1 = sh[1]; // "page" | {theme-id}
		var curPage = (sh[2] * 1) || 1;
		if (section === "add-theme") {
			forum.addTheme();
		} else if (url_1 * 1) {
			forum.showTheme(url);
		} else if (url_1 === "page" || url_1 === undefined || url_1 === "") {
			if (!curPage || curPage < 1) {
				window.location.hash = "#/" + section + "/page/1";
			} else {
				showThemesList(curPage);
			}
		} else {
			forum.changeView(forum.pages["#404"]);
		}

		function showThemesList(page) {
			var themesCount = 30;
			forum.ajax({
				method: "GET",
				url: forum.serverHost + "/themes",
				params: {
					count: themesCount,
					offset: themesCount * page - themesCount,
					"section-url": section
				},
				success: function (response) {
					response.getUrl = "#/" + section;

					var lastPage = Math.ceil(response.meta.count / themesCount) || 1;
					if (lastPage <= page) {
						window.location.hash = window.location.hash.replace("page/" + page, "page/" + lastPage);
					}
					response.pager = lastPage > 1 ? forum.makePager(page, lastPage, "#/" + section) : "";
					if (response.meta.count * 1 > 0) {
						response.themesExists = true;
					}

					// Здесь скрипт проходит по всем темам и конвертирует числа response.data[].date
					// строки вида "1 января 2000", возможно, это можно сделать более эффективно

					var l = response.data.length;
					var arr = response.data;

					for (var i = 0; i < l; i++) {
						arr[i].date = forum.makeDateStr(arr[i].date);
						if ( (forum.loginned && (forum.getCookie("nickname") === arr[i].nickname)) || forum.rights === "admin" || forum.rights === "moderator") {
							arr[i].showDeleteBtn = true;
						} else {
							arr[i].showDeleteBtn = false;
						}
					}

					// ----------

					forum.addListener(window, forum.clickOrTouch, forum.deleteTheme);

					forum.changeView({
						title: response.data.section,
						templateId: "themes-list-template",
						data: response,
						action: function () {
							var addThemeBtns = document.getElementsByClassName("add-theme-btn");
							for (var i = addThemeBtns.length - 1; i >= 0; i--) {
								forum.addListener(addThemeBtns[i], forum.clickOrTouch, function (event) {
									window.location.hash = "#/add-theme";
								});
							}
						}
					});
				},
				error: function() {
					forum.notify("error", "Что-то пошло не так...");
				}
			});
		}
	}
})();
window.addEventListener("load", function() {
	forum.init = function() {
		window.addEventListener("hashchange", function() {
			forum.requestGoing = false;
			forum.route(window.location.hash);
		});

		forum.route(window.location.hash);
	}

	forum.init();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBmb3J1bSA9IHtcblx0c2VydmVySG9zdDogXCJodHRwOi8vZm9ydW1zLWVkaXNhLnJoY2xvdWQuY29tXCIsXG5cblx0Ly8gc2VydmVySG9zdDogXCJodHRwOi8vMTkyLjE2OC4wLjEwNjo4MDgwXCIsXG5cblx0Ly8gc2VydmVySG9zdDogXCJodHRwOi8vMTkyLjE2OC4xMS4xMTg6ODA4MFwiLFxuXG5cdC8vIHNlcnZlckhvc3Q6IFwiaHR0cDovLzEwLjE3LjM1LjQ3OjgwODBcIixcblxuXHRjbGlja09yVG91Y2g6IChcIm9udG91Y2hzdGFydFwiIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgPyBcIm1vdXNldXBcIiA6IFwiY2xpY2tcIixcblxuXHQvLyBjbGlja09yVG91Y2g6IFwiY2xpY2tcIixcblxuXHRsb2dpbm5lZDogZmFsc2UsXG5cblx0c2V0UGFnZVRpdGxlOiBmdW5jdGlvbih0aXRsZSkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIilbMF0uaW5uZXJIVE1MID0gdGl0bGUgPyB0aXRsZSA6IFwibGFib29kYS5ydVwiO1xuXHR9LFxuXG5cdHJlbW92ZUxpc3RlbmVyczogZnVuY3Rpb24oKSB7XG5cdFx0Zm9yICh2YXIgaSA9IGZvcnVtLmxpc3RlbmVyUmVtb3ZlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGZvcnVtLmxpc3RlbmVyUmVtb3ZlcnNbaV0oKTtcblx0XHR9XG5cdFx0Zm9ydW0ubGlzdGVuZXJSZW1vdmVycyA9IFtdO1xuXHRcdGZvcnVtLmxpc3RlbmVyc3MgPSBbXTtcblx0fSxcblxuXHRyZWxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdGZvcnVtLnJlbW92ZUxpc3RlbmVycygpO1xuXHRcdGZvcnVtLnJvdXRlKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcblx0fSxcblxuXHRsaXN0ZW5lclJlbW92ZXJzOiBbXSxcblxuXHRhZGRMaXN0ZW5lcjogZnVuY3Rpb24oZWxlbSwgZXZlbnQsIGxpc3RlbmVyKSB7XG5cdFx0Zm9ydW0ubGlzdGVuZXJSZW1vdmVycy5wdXNoKChmdW5jdGlvbihlbGVtLCBldmVudCwgbGlzdGVuZXIpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcilcblx0XHRcdH1cblx0XHR9KShlbGVtLCBldmVudCwgbGlzdGVuZXIpKTtcblx0XHRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcblx0fSxcblxuXHRnZXRDb29raWU6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHR2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKFxuXHRcdFx0XCIoPzpefDsgKVwiICsgbmFtZS5yZXBsYWNlKC8oW1xcLiQ/Knx7fVxcKFxcKVxcW1xcXVxcXFxcXC9cXCteXSkvZywgJ1xcXFwkMScpICsgXCI9KFteO10qKVwiXG5cdFx0KSk7XG5cdFx0cmV0dXJuIG1hdGNoZXMgPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hlc1sxXSkgOiB1bmRlZmluZWQ7XG5cdH0sXG5cblx0c2V0Q29va2llOiBmdW5jdGlvbihzdHIpIHtcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlO1xuXHRcdGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgMSk7XG5cdFx0ZG9jdW1lbnQuY29va2llID0gc3RyICsgXCI7IHBhdGg9LzsgZXhwaXJlcz1cIiArIGRhdGUudG9VVENTdHJpbmcoKTtcblx0fSxcblxuXHRkZWxldGVDb29raWU6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlO1xuXHRcdGRhdGUuc2V0RGF0ZSgwKTtcblx0XHRkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9MTsgcGF0aD0vOyBleHBpcmVzPVwiICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuXHR9LFxuXG5cdGpzb25QYXJzZTogZnVuY3Rpb24oc3RyKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKHN0cik7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmV0dXJuIHt9O1xuXHRcdH1cblx0fSxcblxuXHRlc2NhcGU6IGZ1bmN0aW9uKHN0cikge1xuXHRcdHJldHVybiBzdHJcblx0XHRcdFx0XHQgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG5cdFx0XHRcdFx0IC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuXHRcdFx0XHRcdCAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcblx0XHRcdFx0XHQgLnJlcGxhY2UoLycvZywgXCImIzM5O1wiKTtcblx0fSxcblxuXHQvLyBGT1IgQUxQSEEgVkVSU0lPTlxuXG5cdC8vIHJld3JpdGU6IGZ1bmN0aW9uKHN0cikge1xuXHQvLyBcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKS5pbm5lckhUTUwgPSBcIlxcXG5cdC8vIFx0XHRcdDxkaXYgY2xhc3M9XFxcImNvbnRlbnRcXFwiPlxcXG5cdC8vIFx0XHRcdFx0PHA+XCIgK1xuXHQvLyBcdFx0XHRcdFx0c3RyICtcblx0Ly8gXHRcdFx0XHRcIjwvcD5cXFxuXHQvLyBcdFx0XHQ8L2Rpdj5cIjtcblx0Ly8gfSxcblxuXHQvLyBhbHBoYUNoZWNrZWQ6IGZhbHNlLFxuXG5cdC8vIGFscGhhQ2hlY2s6IGZ1bmN0aW9uICgpIHtcblx0Ly8gXHR2YXIgdWlkID0gZm9ydW0uZ2V0Q29va2llKFwibmlja25hbWVcIik7XG5cdC8vIFx0dmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcblx0Ly8gXHR2YXIgY29uZCA9IChoYXNoID09PSBcIiNzaWduLWluXCIgfHwgaGFzaC5pbmRleE9mKFwiI3NpZ24tdXBcIikgPT09IDAgfHwgaGFzaC5pbmRleE9mKFwiI3Bhc3N3b3JkXCIpID09PSAwKTtcblxuXHQvLyBcdGlmICh1aWQpIHtcblx0Ly8gXHRcdHZhciBhdXRoVG9rZW4gPSBmb3J1bS5nZXRDb29raWUoXCJhdXRoLXRva2VuXCIpO1xuXG5cdC8vIFx0XHRmb3J1bS5hamF4KHtcblx0Ly8gXHRcdFx0bWV0aG9kOiBcIkdFVFwiLFxuXHQvLyBcdFx0XHR1cmw6IGZvcnVtLnNlcnZlckhvc3QgKyBcIi9cIixcblx0Ly8gXHRcdFx0aGVhZGVyczoge1xuXHQvLyBcdFx0XHRcdFwiQXV0aC1Ub2tlblwiOiBhdXRoVG9rZW5cblx0Ly8gXHRcdFx0fSxcblx0Ly8gXHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKCkge1xuXHQvLyBcdFx0XHRcdGZvcnVtLmFscGhhQ2hlY2tlZCA9IHRydWU7XG5cdC8vIFx0XHRcdFx0Zm9ydW0ucm91dGUoaGFzaCk7XG5cdC8vIFx0XHRcdH0sXG5cdC8vIFx0XHRcdGVycm9yOiBmdW5jdGlvbiAoKSB7XG5cdC8vIFx0XHRcdFx0aWYgKGNvbmQpIHtcblx0Ly8gXHRcdFx0XHRcdGZvcnVtLmFscGhhQ2hlY2tlZCA9IHRydWU7XG5cdC8vIFx0XHRcdFx0XHRmb3J1bS5yb3V0ZShoYXNoKTtcblx0Ly8gXHRcdFx0XHR9IGVsc2Uge1xuXHQvLyBcdFx0XHRcdFx0Zm9ydW0uYWxwaGFDaGVja2VkID0gZmFsc2U7XG5cdC8vIFx0XHRcdFx0XHRmb3J1bS5yZXdyaXRlKFwi0JjQtNGR0YIg0LfQsNC60YDRi9GC0L7QtSDQsNC70YzRhNCwLdGC0LXRgdGC0LjRgNC+0LLQsNC90LjQtSwgPGEgaHJlZj1cXFwiI3NpZ24taW5cXFwiPtCS0L7QudC00LjRgtC1INCyINGB0LjRgdGC0LXQvNGDPC9hPiwg0LXRgdC70Lgg0LLRiyDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0L3Ri1wiKTtcblx0Ly8gXHRcdFx0XHR9XG5cdC8vIFx0XHRcdH1cblx0Ly8gXHRcdH0pO1xuXHQvLyBcdH0gZWxzZSB7XG5cdC8vIFx0XHRpZiAoY29uZCkge1xuXHQvLyBcdFx0XHRmb3J1bS5hbHBoYUNoZWNrZWQgPSB0cnVlO1xuXHQvLyBcdFx0XHRmb3J1bS5yb3V0ZShoYXNoKTtcblx0Ly8gXHRcdH0gZWxzZSB7XG5cdC8vIFx0XHRcdGZvcnVtLmFscGhhQ2hlY2tlZCA9IGZhbHNlO1xuXHQvLyBcdFx0XHRmb3J1bS5yZXdyaXRlKFwi0JjQtNGR0YIg0LfQsNC60YDRi9GC0L7QtSDQsNC70YzRhNCwLdGC0LXRgdGC0LjRgNC+0LLQsNC90LjQtSwgPGEgaHJlZj1cXFwiI3NpZ24taW5cXFwiPtCS0L7QudC00LjRgtC1INCyINGB0LjRgdGC0LXQvNGDPC9hPiwg0LXRgdC70Lgg0LLRiyDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0L3Ri1wiKTtcblx0Ly8gXHRcdH1cblx0Ly8gXHR9XG5cdC8vIH0sXG5cblx0Ly8gRU5EXG5cblx0bWFrZVBhZ2VyOiBmdW5jdGlvbiAocGFnZSwgbGFzdFBhZ2UsIHVybCkge1xuXHRcdHBhZ2UgPSBwYWdlKjE7XG5cdFx0dmFyIHBhZ2VyID0gJyc7XG5cblx0XHRpZiAobGFzdFBhZ2UgPiA2KSB7XG5cblx0XHRcdGlmICgocGFnZSA+IDMpICYmIChwYWdlIDwgbGFzdFBhZ2UgLSAyKSkge1xuXHRcdFx0XHRwYWdlciA9IFwiPGEgaHJlZj1cXFwiXCIgKyB1cmwgKyBcIi9wYWdlLzFcXFwiPjE8L2E+XFxcblx0XHRcdFx0XHRcdC4uLlxcXG5cdFx0XHRcdFx0XHQ8YSBocmVmPVxcXCJcIiArIHVybCArIFwiL3BhZ2UvXCIgKyAocGFnZSAtIDEpICsgJ1wiPicgKyAocGFnZSAtIDEpICsgXCI8L2E+XFxcblx0XHRcdFx0XHRcdDxhIGhyZWY9XFxcIlwiICsgdXJsICsgXCIvcGFnZS9cIiArIHBhZ2UgKyAnXCIgY2xhc3M9XCJhY3RpdmVcIj4nICsgcGFnZSArIFwiPC9hPlxcXG5cdFx0XHRcdFx0XHQ8YSBocmVmPVxcXCJcIiArIHVybCArIFwiL3BhZ2UvXCIgKyAocGFnZSArIDEpICsgJ1wiPicgKyAocGFnZSArIDEpICsgXCI8L2E+XFxcblx0XHRcdFx0XHRcdC4uLlxcXG5cdFx0XHRcdFx0XHQ8YSBocmVmPVxcXCJcIiArIHVybCArIFwiL3BhZ2UvXCIgKyBsYXN0UGFnZSArICdcIj4nICsgbGFzdFBhZ2UgKyAnPC9hPic7XG5cdFx0XHR9IGVsc2UgaWYgKHBhZ2UgPCA0KSB7XG5cdFx0XHRcdHBhZ2VyID0gXCI8YSBocmVmPVxcXCJcIiArIHVybCArIFwiL3BhZ2UvMVxcXCI+MTwvYT5cXFxuXHRcdFx0XHRcdFx0PGEgaHJlZj1cXFwiXCIgKyB1cmwgKyBcIi9wYWdlLzJcXFwiPjI8L2E+XFxcblx0XHRcdFx0XHRcdDxhIGhyZWY9XFxcIlwiICsgdXJsICsgXCIvcGFnZS8zXFxcIj4zPC9hPlxcXG5cdFx0XHRcdFx0XHQ8YSBocmVmPVxcXCJcIiArIHVybCArIFwiL3BhZ2UvNFxcXCI+NDwvYT5cXFxuXHRcdFx0XHRcdFx0Li4uXFxcblx0XHRcdFx0XHRcdDxhIGhyZWY9XFxcIlwiICsgdXJsICsgXCIvcGFnZS9cIiArIGxhc3RQYWdlICsgJ1wiPicgKyBsYXN0UGFnZSArICc8L2E+JztcblxuXHRcdFx0XHRwYWdlciA9IHBhZ2VyLnJlcGxhY2UoXCIvcGFnZS9cIiArIHBhZ2UsIFwiL3BhZ2UvXCIgKyBwYWdlICsgXCJcXFwiIGNsYXNzPVxcXCJhY3RpdmVcXFwiXCIpO1xuXHRcdFx0fSBlbHNlIGlmIChwYWdlID4gbGFzdFBhZ2UgLSAzKSB7XG5cdFx0XHRcdHBhZ2VyID0gXCI8YSBocmVmPVxcXCJcIiArIHVybCArIFwiL3BhZ2UvMVxcXCI+MTwvYT5cXFxuXHRcdFx0XHRcdFx0Li4uXFxcblx0XHRcdFx0XHRcdDxhIGhyZWY9XFxcIlwiICsgdXJsICsgXCIvcGFnZS9cIiArIChsYXN0UGFnZSAtIDMpICsgJ1wiPicgKyAobGFzdFBhZ2UgLSAzKSArIFwiPC9hPlxcXG5cdFx0XHRcdFx0XHQ8YSBocmVmPVxcXCJcIiArIHVybCArIFwiL3BhZ2UvXCIgKyAobGFzdFBhZ2UgLSAyKSArICdcIj4nICsgKGxhc3RQYWdlIC0gMikgKyBcIjwvYT5cXFxuXHRcdFx0XHRcdFx0PGEgaHJlZj1cXFwiXCIgKyB1cmwgKyBcIi9wYWdlL1wiICsgKGxhc3RQYWdlIC0gMSkgKyAnXCI+JyArIChsYXN0UGFnZSAtIDEpICsgXCI8L2E+XFxcblx0XHRcdFx0XHRcdDxhIGhyZWY9XFxcIlwiICsgdXJsICsgXCIvcGFnZS9cIiArIGxhc3RQYWdlICsgJ1wiPicgKyBsYXN0UGFnZSArICc8L2E+JztcblxuXHRcdFx0XHRwYWdlciA9IHBhZ2VyLnJlcGxhY2UoXCIvcGFnZS9cIiArIHBhZ2UsIFwiL3BhZ2UvXCIgKyBwYWdlICsgXCJcXFwiIGNsYXNzPVxcXCJhY3RpdmVcXFwiXCIpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAobGFzdFBhZ2UgPCA3KSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8PSBsYXN0UGFnZTsgaSsrKSB7XG5cdFx0XHRcdHBhZ2VyID0gcGFnZXIgKyBcIjxhIGhyZWY9XFxcIlwiICsgdXJsICsgXCIvcGFnZS9cIiArIGkgKyBcIlxcXCI+XCIgKyBpICsgXCI8L2E+IFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRwYWdlciA9IHBhZ2VyLnJlcGxhY2UoXCIvcGFnZS9cIiArIHBhZ2UsIFwiL3BhZ2UvXCIgKyBwYWdlICsgXCJcXFwiIGNsYXNzPVxcXCJhY3RpdmVcXFwiXCIpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYWdlci5yZXBsYWNlKFwiLy9cIiwgXCIvXCIpO1xuXHR9LFxuXG5cdG1ha2VEYXRlU3RyOiBmdW5jdGlvbiAobnVtKSB7XG5cdFx0dmFyIG1vbnRocyA9IFtcItGP0L3QstCw0YDRj1wiLCBcItGE0LXQstGA0LDQu9GPXCIsIFwi0LzQsNGA0YLQsFwiLCBcItCw0L/RgNC10LvRj1wiLCBcItC80LDRj1wiLCBcItC40Y7QvdGPXCIsIFwi0LjRjtC70Y9cIiwgXCLQsNCy0LPRg9GB0YLQsFwiLCBcItGB0LXQvdGC0Y/QsdGA0Y9cIiwgXCLQvtC60YLRj9Cx0YDRj1wiLCBcItC90L7Rj9Cx0YDRj1wiLCBcItC00LXQutCw0LHRgNGPXCJdO1xuXHRcdGRhdGUgPSBuZXcgRGF0ZShudW0pO1xuXHRcdHZhciBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XG5cdFx0bWludXRlcyA9IG1pbnV0ZXMgPCAxMCA/IFwiMFwiICsgbWludXRlcyA6IG1pbnV0ZXM7XG5cdFx0dmFyIGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xuXHRcdGhvdXJzID0gaG91cnMgPCAxMCA/IFwiMFwiICsgaG91cnMgOiBob3Vycztcblx0XHRyZXR1cm4gKGRhdGUuZ2V0RGF0ZSgpICsgXCIgXCIgKyBtb250aHNbZGF0ZS5nZXRNb250aCgpXSArIFwiIFwiICsgZGF0ZS5nZXRGdWxsWWVhcigpICsgXCIg0LIgXCIgKyBcblx0XHRob3VycyArIFwiOlwiICsgbWludXRlcyk7XG5cdH1cblxufTtcbihmdW5jdGlvbigpIHtcblx0dmFyIGkgPSAxO1xuXHRmdW5jdGlvbiBhamF4KGNvbmZzKSB7XG5cdFx0aWYgKCFmb3J1bS5yZXF1ZXN0R29pbmcgfHwgY29uZnMuaGlkZGVuKSB7XG5cdFx0XHQvLyDRgdCy0L7QudGB0YLQstCwIGNvbmZzOiBtZXRob2QsIHVybCwgYXN5bmMsIHBhcmFtc3t9LCBib2R5e30sIGhlYWRlcnN7fSwgc3VjY2VzcygpLCBlcnJvcigpXG5cdFx0XHQvLyDRgdC40L3RhdGA0L7QvdC90YvQtSDQt9Cw0L/RgNC+0YHRiyDQvdC1INGA0LDQsdC+0YLQsNGO0YIsINC10YHQu9C4INC30LDQv9GA0L7RgSDQutGA0L7RgdGBLdC00L7QvNC10L3QvdGL0Llcblx0XHRcdC8vINGC0LDQutC20LUg0L/RgNC4INGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdCw0YUg0L3QtdC70YzQt9GPINGD0LrQsNC30LDRgtGMIHhoci50aW1lb3V0XG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHR2YXIgYm9keSwgcmVzdWx0O1xuXHRcdFx0Zm9ydW0ucmVxdWVzdEdvaW5nID0gIWNvbmZzLmhpZGRlbjtcblxuXHRcdFx0Ly8g0LHQtdGA0ZHQvCDQvdGD0LbQvdGL0LUg0L/QsNGA0LDQvNC10YLRgNGLINC40Lcg0LrQvtC90YTQuNCz0YPRgNCw0YbQuNC+0L3QvdC+0LPQviDQvtCx0YrQtdC60YLQsFxuXG5cdFx0XHR2YXIgbWV0aG9kID0gY29uZnMubWV0aG9kO1xuXHRcdFx0dmFyIHVybCA9IGNvbmZzLnVybDtcblx0XHRcdHZhciBhc3luYyA9IChjb25mcy5hc3luYyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGZhbHNlKTtcblx0XHRcdHZhciBwYXJhbXMgPSBjb25mcy5wYXJhbXM7XG5cdFx0XHR2YXIgcmVxdWVzdEJvZHkgPSBjb25mcy5ib2R5O1xuXHRcdFx0dmFyIGhlYWRlcnMgPSBjb25mcy5oZWFkZXJzO1xuXHRcdFx0dmFyIHN1Y2Nlc3MgPSBjb25mcy5zdWNjZXNzO1xuXHRcdFx0dmFyIGVycm9yID0gY29uZnMuZXJyb3I7XG5cdFx0XHR2YXIgaGlkZGVuID0gY29uZnMuaGlkZGVuIHx8IGZhbHNlO1xuXG5cdFx0XHQvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0LogVVJMINC/0LXRgNC10LTQsNC90L3Ri9C1INC/0LDRgNCw0LzQtdGC0YDRi1xuXG5cdFx0XHR1cmwgKz0gXCI/XCI7XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gcGFyYW1zKSB7XG5cdFx0XHRcdHVybCArPSBrZXkgKyBcIj1cIiArIHBhcmFtc1trZXldICsgXCImXCI7XG5cdFx0XHR9XG5cdFx0XHR1cmwgPSB1cmwuc2xpY2UoMCwgdXJsLmxlbmd0aCAtIDEpO1xuXG5cdFx0XHQvLyDQv9GA0LXQvtCx0YDQsNC30YPQtdC8INC+0LHRitC10LrRgiDRgtC10LvQsCDQt9Cw0L/RgNC+0YHQsCDQsiDRgdGC0YDQvtC60YNcblxuXHRcdFx0cmVxdWVzdEJvZHkgPSBKU09OLnN0cmluZ2lmeShyZXF1ZXN0Qm9keSk7XG5cdFx0XHRib2R5ID0gcmVxdWVzdEJvZHk7XG5cblx0XHRcdHhoci5vcGVuKG1ldGhvZCwgdXJsLCBhc3luYyk7XG5cblx0XHRcdC8vINGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INC/0LXRgNC10LTQsNC90L3Ri9C1INC30LDQs9C+0LvQvtCy0LrQuFxuXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gaGVhZGVycykge1xuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XSk7XG5cdFx0XHR9XG5cblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcblxuXHRcdFx0Ly8g0L7RgtC/0YDQsNCy0LvRj9C10Lwg0LfQsNC/0YDQvtGBXG5cblx0XHRcdHhoci5zZW5kKGJvZHkpO1xuXG5cdFx0XHRpZiAoIWhpZGRlbikge1xuXHRcdFx0XHR2YXIgcGJXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYi13cmFwcGVyXCIpO1xuXHRcdFx0XHR2YXIgcGIgPSBmb3J1bS5wcm9ncmVzc0JhcihwYldyYXBwZXIpO1xuXHRcdFx0XHRwYi5zdGFydCgpO1xuXG5cdFx0XHRcdHhoci5vbmxvYWRlbmQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRwYi5kb25lKCk7XG5cdFx0XHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIDApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0eGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdHBiLnNldCggKGV2ZW50LmxvYWRlZC9ldmVudC50b3RhbCkgKiAxMDAgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyDQttC00ZHQvCDQvtGC0LLQtdGCINC4INC+0LHRgNCw0LHQsNGC0YvQstCw0LXQvCDQtdCz0L5cblxuXHRcdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xuXG5cdFx0XHRcdGZvcnVtLnJlcXVlc3RHb2luZyA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmICh4aHIuc3RhdHVzID09PSAyMDAgfHwgeGhyLnN0YXR1cyA9PT0gMjAxKSB7XG5cdFx0XHRcdFx0aWYgKHN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRcdHZhciByZXN1bHQgPSBmb3J1bS5qc29uUGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cblx0XHRcdFx0XHRcdGlmIChyZXN1bHQpIHtcblx0XHRcdFx0XHRcdFx0c3VjY2VzcyhyZXN1bHQsIHhocik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4g0J/QvtC/0YDQvtCx0YPQudGC0LUg0L/QtdGA0LXQt9Cw0LPRgNGD0LfQuNGC0Ywg0YHRgtGA0LDQvdC40YbRg1wiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gZm9ydW0uanNvblBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuXG5cdFx0XHRcdFx0XHRpZiAocmVzdWx0KSB7XG5cdFx0XHRcdFx0XHRcdGVycm9yKHJlc3VsdCwgeGhyKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImVycm9yXCIsIFwi0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLiDQn9C+0L/RgNC+0LHRg9C50YLQtSDQv9C10YDQtdC30LDQs9GA0YPQt9C40YLRjCDRgdGC0YDQsNC90LjRhtGDXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZvcnVtLmFqYXggPSBhamF4O1xufSkoKTtcbihmdW5jdGlvbigpIHtcblx0ZnVuY3Rpb24gcHJvZ3Jlc3NCYXIocGFyZW50KSB7XG5cdFx0dmFyIHBiV3JhcHBlciA9IHBhcmVudDtcblx0XHR2YXIgcGJFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRwYkVsZW0uY2xhc3NOYW1lID0gXCJwcm9ncmVzcy1iYXJcIjtcblx0XHRwYldyYXBwZXIuYXBwZW5kQ2hpbGQocGJFbGVtKTtcblxuXHRcdHBiRWxlbS5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcblx0XHRwYkVsZW0uc3R5bGUudG9wID0gXCIwcHhcIjtcblx0XHRwYkVsZW0uc3R5bGUubGVmdCA9IFwiMHB4XCI7XG5cblx0XHR2YXIgY3VycmVudCA9IDU7XG5cblx0XHRyZXR1cm4gcmVzdWx0ID0ge1xuXHRcdFx0c3RhcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwYkVsZW0uc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuXG5cdFx0XHRcdHBiRWxlbS5zdHlsZS53aWR0aCA9IFwiNSVcIjtcblx0XHRcdH0sXG5cdFx0XHRkb25lOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cGJFbGVtLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG5cdFx0XHRcdChmdW5jdGlvbihlbCwgcGJXcmFwcGVyLCBwYkVsZW0pIHtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZWwuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRwYldyYXBwZXIucmVtb3ZlQ2hpbGQocGJFbGVtKTtcblx0XHRcdFx0XHRcdH0sIDIwMCk7XG5cdFx0XHRcdFx0fSwgNjAwKTtcblx0XHRcdFx0fSkocGJFbGVtLCBwYldyYXBwZXIsIHBiRWxlbSk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHQoZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHBiRWxlbS5zdHlsZS53aWR0aCA9ICh2YWx1ZSA8IDUgPyA1IDogdmFsdWUpICsgXCIlXCI7XG5cdFx0XHRcdFx0fSwgMjAwKTtcblx0XHRcdFx0fSkodmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZvcnVtLnByb2dyZXNzQmFyID0gcHJvZ3Jlc3NCYXI7XG59KSgpO1xuKGZ1bmN0aW9uKCkge1xuXHR2YXIgdmFsaWRhdG9ycyA9IHtcblx0XHRlbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcblx0XHRcdHJldHVybiAoZW1haWwuaW5kZXhPZignQCcpICE9PSAtMSk7XG5cdFx0fSxcblxuXHRcdG5pY2tOYW1lOiBmdW5jdGlvbihuaWNrTmFtZSkge1xuXHRcdFx0cmV0dXJuIChuaWNrTmFtZS5zZWFyY2goL15bYS16QS1aMC05XStbYS16QS1aMC05LV9cXC5dKlthLXpBLVowLTldKyQvZykgIT09IC0xKTtcblx0XHR9LFxuXG5cdFx0cGFzc3dvcmQ6IGZ1bmN0aW9uKHBhc3N3b3JkKSB7XG5cdFx0XHRyZXR1cm4gKHBhc3N3b3JkLmxlbmd0aCA+IDUgJiYgcGFzc3dvcmQubGVuZ3RoIDwgNjUpO1xuXHRcdH1cblx0fVxuXG5cdGZvcnVtLnZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzO1xufSkoKTtcbihmdW5jdGlvbigpIHtcblx0Zm9ydW0ucmVuZXdOYXYgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHRcdHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmF2LXRlbXBsYXRlXCIpLmlubmVySFRNTDtcblx0XHR2YXIgbmF2Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYXYtY29udGFpbmVyXCIpO1xuXHRcdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tbmF2XCIpO1xuXHRcdGlmIChoYXNoLmluZGV4T2YoXCIjbWFpblwiKSA9PT0gMCB8fCBoYXNoID09PSBcIlwiKSB7XG5cdFx0XHRjb250YWluZXIuaW5uZXJIVE1MID0gdGVtcGxheWVkKHRlbXBsYXRlKSh7IG1haW46IFwiY2xhc3M9YWN0aXZlXCIgfSk7XG5cdFx0fSBlbHNlIGlmIChoYXNoLmluZGV4T2YoXCIjdGhlbWVzXCIpID09PSAwKSB7XG5cdFx0XHRjb250YWluZXIuaW5uZXJIVE1MID0gdGVtcGxheWVkKHRlbXBsYXRlKSh7IHRoZW1lczogXCJjbGFzcz1hY3RpdmVcIiB9KTtcblx0XHR9IGVsc2UgaWYgKGhhc2guaW5kZXhPZihcIiN1c2Vyc1wiKSA9PT0gMCkge1xuXHRcdFx0Y29udGFpbmVyLmlubmVySFRNTCA9IHRlbXBsYXllZCh0ZW1wbGF0ZSkoeyB1c2VyczogXCJjbGFzcz1hY3RpdmVcIiB9KTtcblx0XHR9IGVsc2UgaWYgKGhhc2guaW5kZXhPZihcIiNmZWVkYmFja1wiKSA9PT0gMCkge1xuXHRcdFx0Y29udGFpbmVyLmlubmVySFRNTCA9IHRlbXBsYXllZCh0ZW1wbGF0ZSkoeyBmZWVkYmFjazogXCJjbGFzcz1hY3RpdmVcIiB9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXHRcdH1cblxuXHRcdHZhciBuYXZCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hdi1idG5cIik7XG5cblx0XHRmb3J1bS5hZGRMaXN0ZW5lcihuYXZCdG4sIGZvcnVtLmNsaWNrT3JUb3VjaCwgdG9nZ2xlTmF2Q29udGFpbmVyKTtcblxuXHRcdGZvcnVtLmFkZExpc3RlbmVyKHdpbmRvdywgXCJyZXNpemVcIiwgY29sbGlicmF0ZSk7XG5cblx0XHRmb3J1bS5hZGRMaXN0ZW5lcih3aW5kb3csIFwic2Nyb2xsXCIsIHBvc2l0aW9uKTtcblxuXHRcdGZ1bmN0aW9uIGNvbGxpYnJhdGUoKSB7XG5cdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPiA0ODApIHtcblx0XHRcdFx0bmF2Q29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuYXZDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRlclwiKVswXTtcblx0XHR2YXIgc2Nyb2xsSWQgPSBoZWFkZXIuaW5uZXJIZWlnaHQgLSBuYXZCdG4uaW5uZXJIZWlnaHQ7XG5cblx0XHRmdW5jdGlvbiBwb3NpdGlvbigpIHtcblx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDQ4MCkge1xuXHRcdFx0XHRpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gNjUpIHtcblx0XHRcdFx0XHRoZWFkZXIuY2xhc3NMaXN0LmFkZChcImZpeGVkXCIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKFwiZml4ZWRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRwb3NpdGlvbigpO1xuXG5cdFx0Y29sbGlicmF0ZSgpO1xuXG5cdFx0ZnVuY3Rpb24gaGlkZSgpIHtcblx0XHRcdG5hdkNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb3BlbigpIHtcblx0XHRcdG5hdkNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZU5hdkNvbnRhaW5lcigpIHtcblx0XHRcdGlmIChuYXZDb250YWluZXIuc3R5bGUuZGlzcGxheSA9PT0gXCJibG9ja1wiKSB7XG5cdFx0XHRcdGhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9wZW4oKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmb3J1bS5jaGFuZ2VWaWV3ID0gZnVuY3Rpb24ocGFnZSkge1xuXHRcdHZhciBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpO1xuXHRcdHZhciBzcGVjaWFsQWN0aW9uID0gcGFnZS5zcGVjaWFsO1xuXHRcdHZhciBkYXRhID0gcGFnZS5kYXRhO1xuXHRcdHZhciB0aXRsZSA9IHBhZ2UudGl0bGU7XG5cblx0XHRmb3J1bS5zZXRQYWdlVGl0bGUodGl0bGUpO1xuXG5cdFx0aWYgKHNwZWNpYWxBY3Rpb24pIHtcblx0XHRcdHNwZWNpYWxBY3Rpb24oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFnZS50ZW1wbGF0ZUlkKS5pbm5lckhUTUw7XG5cblx0XHRcdHZhciBjb25mcyA9IHBhZ2UuY29uZnM7XG5cdFx0XHR2YXIgYWN0aW9uID0gcGFnZS5hY3Rpb247XG5cblx0XHRcdGlmIChjb25mcykge1xuXHRcdFx0XHRpZiAoIWNvbmZzLnN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRjb25mcy5zdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gdGVtcGxheWVkKHRlbXBsYXRlKShyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHRpZiAoYWN0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdGFjdGlvbigpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWNvbmZzLmVycm9yKSB7XG5cdFx0XHRcdFx0Y29uZnMuZXJyb3IgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0Zm9ydW0ubm90aWZ5KFwiZXJyb3JcIiwgcmVzcG9uc2UubWV0YS5tZXNzYWdlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9ydW0uYWpheChjb25mcyk7XG5cdFx0XHR9IGVsc2UgaWYgKGRhdGEpIHtcblx0XHRcdFx0Y29udGVudC5pbm5lckhUTUwgPSB0ZW1wbGF5ZWQodGVtcGxhdGUpKGRhdGEpO1xuXHRcdFx0XHRpZiAoYWN0aW9uKSB7XG5cdFx0XHRcdFx0YWN0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cdFx0XHRcdGlmIChhY3Rpb24pIHtcblx0XHRcdFx0XHRhY3Rpb24oKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZvcnVtLnJvdXRlID0gZnVuY3Rpb24oaGFzaCkge1xuXHRcdGZvcnVtLnJlbW92ZUxpc3RlbmVycygpO1xuXHRcdGZvcnVtLnJlbmV3TmF2KCk7XG5cdFx0Zm9ydW0uc2hvd1VzZXJQYW5lbCgpO1xuXG5cdFx0Ly8gRk9SIEFMUEhBIFZFUlNJT05cblxuXHRcdC8vIGlmICghZm9ydW0uYWxwaGFDaGVja2VkKSB7XG5cdFx0Ly8gXHRmb3J1bS5hbHBoYUNoZWNrKCk7XG5cdFx0Ly8gXHRyZXR1cm47XG5cdFx0Ly8gfVxuXG5cdFx0Ly8gZm9ydW0uYWxwaGFDaGVja2VkID0gZmFsc2U7XG5cblx0XHQvLyBFTkRcblxuXHRcdGlmIChoYXNoLmluZGV4T2YoXCIjL1wiKSA9PT0gMCkge1xuXHRcdFx0Zm9ydW0uc2VjdGlvbk1vZHVsZShoYXNoLnNsaWNlKDIpKTtcblx0XHR9IGVsc2UgaWYgKGhhc2guaW5kZXhPZihcIiN0aGVtZXNcIikgPT09IDApIHtcblx0XHRcdGZvcnVtLnRoZW1lc1NlYXJjaChoYXNoKTtcblx0XHR9IGVsc2UgaWYgKGhhc2ggPT09IFwiXCIpIHtcblx0XHRcdGZvcnVtLmNoYW5nZVZpZXcoZm9ydW0ucGFnZXNbXCIjbWFpblwiXSk7XG5cdFx0fSBlbHNlIGlmIChoYXNoLmluZGV4T2YoXCIjdXNlclwiKSA9PT0gMCkgeyAvLyBNYXkgYmUgI3VzZXJzIGZvciBzZWFyY2ggcGFnZVxuXHRcdFx0Zm9ydW0udXNlcnNNb2R1bGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhZ2UgPSBmb3J1bS5wYWdlc1toYXNoLnNwbGl0KFwiL1wiKVswXV07XG5cdFx0XHRpZiAocGFnZSkge1xuXHRcdFx0XHRmb3J1bS5jaGFuZ2VWaWV3KHBhZ2UpO1xuXHRcdFx0fSBlbHNlIGlmIChoYXNoLmluZGV4T2YoXCIjc2lnbi11cFwiKSA9PT0gMCkge1xuXHRcdFx0XHRmb3J1bS5jaGFuZ2VWaWV3KGZvcnVtLnBhZ2VzW1wiI3NpZ24tdXBcIl0pO1xuXHRcdFx0fSBlbHNlIGlmIChoYXNoLmluZGV4T2YoXCIjc2lnbi1pblwiKSA9PT0gMCkge1xuXHRcdFx0XHRmb3J1bS5jaGFuZ2VWaWV3KGZvcnVtLnBhZ2VzW1wiI3NpZ24taW5cIl0pO1xuXHRcdFx0fSBlbHNlIGlmIChoYXNoLmluZGV4T2YoXCIjcGFzc3dvcmQvXCIpID09PSAwKSB7XG5cdFx0XHRcdGZvcnVtLnNldFBhZ2VUaXRsZShcItCj0YHRgtCw0L3QvtCy0LrQsCDQvdC+0LLQvtCz0L4g0L/QsNGA0L7Qu9GPIHwgbGFib29kYS5ydVwiKTtcblx0XHRcdFx0dmFyIGNvbmZpcm1IYXNoID0gaGFzaC5zcGxpdChcIi9cIilbMV07XG5cdFx0XHRcdGZvcnVtLmNoYW5nZVZpZXcoe1xuXHRcdFx0XHRcdHRlbXBsYXRlSWQ6IFwicmVwYXNzd29yZC10ZW1wbGF0ZVwiLFxuXHRcdFx0XHRcdGFjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVwYXNzd29yZC1mb3JtXCIpO1xuXHRcdFx0XHRcdFx0dmFyIHBhc3N3b3JkID0gZm9ybS5wYXNzd29yZDtcblx0XHRcdFx0XHRcdHZhciByZXBlYXRQYXNzd29yZCA9IGZvcm1bXCJyZXBlYXQtcGFzc3dvcmRcIl07XG5cblx0XHRcdFx0XHRcdHBhc3N3b3JkLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRmb3J1bS5hZGRMaXN0ZW5lcihmb3JtLCBcInN1Ym1pdFwiLCByZXBhc3MpO1xuXG5cdFx0XHRcdFx0XHRmdW5jdGlvbiByZXBhc3MoKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwYXNzd29yZC52YWx1ZS5pbmRleE9mKFwiIFwiKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZm9ydW0udmFsaWRhdG9ycy5wYXNzd29yZChwYXNzd29yZC52YWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChwYXNzd29yZC52YWx1ZSA9PT0gcmVwZWF0UGFzc3dvcmQudmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWV0aG9kOiBcIlBVVFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVybDogZm9ydW0uc2VydmVySG9zdCArIFwiL3Bhc3N3b3JkL1wiICsgY29uZmlybUhhc2gsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cGFzc3dvcmQ6IHBhc3N3b3JkLnZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcInN1Y2Nlc3NcIiwgXCLQndC+0LLRi9C5INC/0LDRgNC+0LvRjCDRg9GB0YLQsNC90L7QstC70LXQvVwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCIjc2lnbi1pblwiO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCd0LUg0YPQtNCw0LvQvtGB0Ywg0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0L3QvtCy0YvQuSDQv9Cw0YDQvtC70YxcIik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCByZXNwb25zZS5tZXRhLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCf0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7RglwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ydW0ubm90aWZ5KFwiZXJyb3JcIiwgXCLQn9Cw0YDQvtC70Ywg0LTQvtC70LbQtdC9INCx0YvRgtGMINC00LvQuNC90L7QuSDQvtGCIDYg0LTQviA2NCDRgdC40LzQstC+0LvQvtCyXCIpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCf0LDRgNC+0LvRjCDQvdC1INC00L7Qu9C20LXQvSDRgdC+0LTQtdGA0LbQsNGC0Ywg0L/RgNC+0LHQtdC70L7QslwiKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKGhhc2guaW5kZXhPZihcIiNjb25maXJtL1wiKSA9PT0gMCkge1xuXHRcdFx0XHRmb3J1bS5zZXRQYWdlVGl0bGUoXCIuLi5cIik7XG5cdFx0XHRcdHZhciBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpO1xuXHRcdFx0XHRjb250ZW50LmlubmVySFRNTCA9IFwiPGRpdiBjbGFzcz1cXFwiY29udGVudFxcXCI+PGgyPtCf0L7QtNC+0LbQtNC40YLQtS4uLjwvaDI+PC9kaXY+XCI7XG5cblx0XHRcdFx0aWYgKGhhc2guaW5kZXhPZihcIiNjb25maXJtL2VtYWlsXCIpID09PSAwKSB7XG5cdFx0XHRcdFx0dmFyIG1haWwgPSBoYXNoLnNwbGl0KFwiL1wiKVsyXTtcblx0XHRcdFx0XHRmb3J1bS5hamF4KHtcblx0XHRcdFx0XHRcdG1ldGhvZDogXCJHRVRcIixcblx0XHRcdFx0XHRcdHVybDogZm9ydW0uc2VydmVySG9zdCArIFwiL2NvbmZpcm1hdGlvbi9lbWFpbFwiLFxuXHRcdFx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdFx0XHRcIkF1dGgtVG9rZW5cIjogZm9ydW0uZ2V0Q29va2llKFwiYXV0aC10b2tlblwiKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9ydW0uc2V0UGFnZVRpdGxlKFwi0J/QuNGB0YzQvNC+INC+0YLQv9GA0LDQstC70LXQvdC+XCIpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj48aDI+0J/QuNGB0YzQvNC+INC+0YLQv9GA0LDQstC70LXQvdC+PC9oMj48cD7Qn9C40YHRjNC80L4g0LTQu9GPINC/0L7QtNGC0LLQtdGA0LbQtNC10L3QuNGPIGVtYWlsLdCw0LTRgNC10YHQsDxzdHJvbmc+KFwiICsgbWFpbCArIFwiKTwvc3Ryb25nPiDQvtGC0L/RgNCw0LLQu9C10L3QvjwvcD48L2Rpdj5cIjtcblx0XHRcdFx0XHRcdFx0fSwgMTAwMCk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9ydW0uc2V0UGFnZVRpdGxlKFwi0J3QtSDRg9C00LDQu9C+0YHRjCDQvtGC0L/RgNCw0LLQuNGC0Ywg0L/QuNGB0YzQvNC+XCIpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj48aDI+0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQujwvaDI+PHA+0J3QtSDRg9C00LDQu9C+0YHRjCDQvtGC0L/RgNCw0LLQuNGC0Ywg0L/QuNGB0YzQvNC+INC00LvRjyDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRjyBlbWFpbC3QsNC00YDQtdGB0LA8c3Ryb25nPihcIiArIG1haWwgKyBcIik8L3N0cm9uZz48L3A+PC9kaXY+XCI7XG5cdFx0XHRcdFx0XHRcdH0sIDEwMDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciBjb2RlID0gaGFzaC5zcGxpdChcIi9cIilbMV07XG5cdFx0XHRcdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRcdFx0XHRtZXRob2Q6IFwiR0VUXCIsXG5cdFx0XHRcdFx0XHR1cmw6IGZvcnVtLnNlcnZlckhvc3QgKyBcIi9jb25maXJtYXRpb24vZW1haWwvXCIgKyBjb2RlLFxuXHRcdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3J1bS5zZXRQYWdlVGl0bGUoXCJlbWFpbC3QsNC00YDQtdGBINC/0L7QtNGC0LLQtdGA0LbQtNGR0L1cIik7XG5cdFx0XHRcdFx0XHRcdFx0Y29udGVudC5pbm5lckhUTUwgPSBcIjxkaXYgY2xhc3M9XFxcImNvbnRlbnRcXFwiPjxoMj5lbWFpbC3QsNC00YDQtdGBINGD0YHQv9C10YjQvdC+INC/0L7QtNGC0LLQtdGA0LbQtNGR0L0hPC9oMj48L2Rpdj5cIjtcblx0XHRcdFx0XHRcdFx0fSwgMTAwMCk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9ydW0uc2V0UGFnZVRpdGxlKFwi0J3QtSDRg9C00LDQu9C+0YHRjCDQv9C+0LTRgtCy0LXRgNC00LjRgtGMIGVtYWlsLdCw0LTRgNC10YFcIik7XG5cdFx0XHRcdFx0XHRcdFx0Y29udGVudC5pbm5lckhUTUwgPSBcIjxkaXYgY2xhc3M9XFxcImNvbnRlbnRcXFwiPjxoMj7QndC1INGD0LTQsNC70L7RgdGMINC/0L7QtNGC0LLQtdGA0LTQuNGC0YwgZW1haWwt0LDQtNGA0LXRgTwvaDI+PC9kaXY+XCI7XG5cdFx0XHRcdFx0XHRcdH0sIDEwMDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGhhc2guaW5kZXhPZihcIiNwYXNzd29yZC1yZWNvdmVyeVwiKSA9PT0gMCkge1xuXHRcdFx0XHRmb3J1bS5zZXRQYWdlVGl0bGUoXCLQodCx0YDQvtGBINC/0LDRgNC+0LvRjyB8IGxhYm9vZGEucnVcIik7XG5cdFx0XHRcdHZhciBpbmRleCA9IGhhc2guaW5kZXhPZihcIj9pZD1cIik7XG5cdFx0XHRcdGlmIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0XHR2YXIgaWQgPSBoYXNoLnNsaWNlKGluZGV4ICsgNCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9ydW0uY2hhbmdlVmlldyh7XG5cdFx0XHRcdFx0dGVtcGxhdGVJZDogXCJyZXBhc3N3b3JkLXF1ZXJ5LXRlbXBsYXRlXCIsXG5cdFx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdFx0ZW1haWw6IGlkXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRhY3Rpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVtYWlsLWZvcm1cIik7XG5cdFx0XHRcdFx0XHRmb3J1bS5hZGRMaXN0ZW5lcihmb3JtLCBcInN1Ym1pdFwiLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZW1haWwgPSBmb3JtLmVtYWlsLnZhbHVlO1xuXHRcdFx0XHRcdFx0XHRpZiAoZm9ydW0udmFsaWRhdG9ycy5lbWFpbChlbWFpbCkpIHtcblx0XHRcdFx0XHRcdFx0XHRlbWFpbCA9IGVtYWlsLnJlcGxhY2UoXCIgXCIsIFwiXCIpO1xuXHRcdFx0XHRcdFx0XHRcdGZvcnVtLmFqYXgoe1xuXHRcdFx0XHRcdFx0XHRcdFx0bWV0aG9kOiBcIkdFVFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0dXJsOiBmb3J1bS5zZXJ2ZXJIb3N0ICsgXCIvcmVjb3ZlcnlcIixcblx0XHRcdFx0XHRcdFx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRtYWlsOiBlbWFpbFxuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIikuaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj48aDM+0KHQvtC+0LHRidC10L3QuNC1INC+0YLQv9GA0LDQstC70LXQvdC+PC9oMz48cD7QodC+0L7QsdGJ0LXQvdC40LUg0LTQu9GPINGB0LHRgNC+0YHQsCDQv9Cw0YDQvtC70Y8g0L7RgtC/0YDQsNCy0LvQtdC90L4g0L3QsCBlbWFpbDogPHN0cm9uZz5cIiArIGVtYWlsICsgXCI8L3N0cm9uZz48L3A+PC9kaXY+XCI7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi5cIik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9ydW0ubm90aWZ5KFwiZXJyb3JcIiwgXCLQndC10LrQvtGA0YDQtdC60YLQvdGL0LkgZW1haWwt0LDQtNGA0LXRgVwiKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRcdFx0bWV0aG9kOiBcIkdFVFwiLFxuXHRcdFx0XHRcdHVybDogZm9ydW0uc2VydmVySG9zdCArIFwiL2luZm9cIixcblx0XHRcdFx0XHRwYXJhbXM6IHtcblx0XHRcdFx0XHRcdGlkZW50aWZpZXI6IGhhc2guc2xpY2UoMSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0Zm9ydW0uY2hhbmdlVmlldyh7XG5cdFx0XHRcdFx0XHRcdHRlbXBsYXRlSWQ6IFwiaW5mby10ZW1wbGF0ZVwiLFxuXHRcdFx0XHRcdFx0XHRkYXRhOiByZXNwb25zZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Zm9ydW0uY2hhbmdlVmlldyhmb3J1bS5wYWdlc1tcIiM0MDRcIl0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KSgpO1xuKGZ1bmN0aW9uKCkge1xuXHR2YXIgc2VydmVySG9zdCA9IGZvcnVtLnNlcnZlckhvc3Q7XG5cblx0ZnVuY3Rpb24gcmVnKCkge1xuXHRcdHZhciByZWdGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWctZm9ybVwiKTtcblxuXHRcdC8vIEZPUiBBTFBIQSBWRVJTSU9OXG5cblx0XHQvLyB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KFwiL1wiKVsxXTtcblxuXHRcdC8vIEVORFxuXG5cdFx0dmFyIG5pY2tJbnB1dCA9IHJlZ0Zvcm1bXCJyZWctbmlja1wiXTtcblx0XHRuaWNrSW5wdXQuZm9jdXMoKTtcblx0XHR2YXIgbWFpbElucHV0ID0gcmVnRm9ybVtcInJlZy1tYWlsXCJdO1xuXHRcdHZhciBwYXNzd29yZElucHV0ID0gcmVnRm9ybVtcInJlZy1wYXNzd29yZFwiXTtcblxuXHRcdHZhciBzaG93UGFzc3dvcmRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3ctcGFzc3dvcmQtYnRuXCIpO1xuXHRcdHNob3dQYXNzd29yZEJ0bi5zdHlsZS5jb2xvciA9IFwiI2FhYVwiO1xuXHRcdHZhciBwYXNzd29yZFNob3dlZCA9IGZhbHNlO1xuXG5cdFx0Zm9ydW0uYWRkTGlzdGVuZXIoc2hvd1Bhc3N3b3JkQnRuLCBmb3J1bS5jbGlja09yVG91Y2gsIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHBhc3N3b3JkU2hvd2VkKSB7XG5cdFx0XHRcdHBhc3N3b3JkSW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInBhc3N3b3JkXCIpO1xuXHRcdFx0XHRzaG93UGFzc3dvcmRCdG4uc3R5bGUuY29sb3IgPSBcIiNhYWFcIjtcblx0XHRcdFx0cGFzc3dvcmRTaG93ZWQgPSBmYWxzZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhc3N3b3JkSW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHRcIik7XG5cdFx0XHRcdHNob3dQYXNzd29yZEJ0bi5zdHlsZS5jb2xvciA9IFwiIzY2NlwiO1xuXHRcdFx0XHRwYXNzd29yZFNob3dlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyDQkiDRgNCw0LfQvNC10YLQtSDRgyDQutC90L7Qv9C60Lgg0L/QvtC60LDQt9Cw0YLRjCDQv9Cw0YDQvtC70Ywg0LXRgdGC0Ywg0LvQuNGI0L3QuNC5INCw0YLRgtGA0LjQsdGD0YIgZGF0YS10YXJnZXRcblx0XHQvLyDQldCz0L4g0L/QvtC60LAg0L3QtSDRg9Cx0YDQsNC7LCDQstC00YDRg9CzINC/0YDQuNCz0L7QtNC40YLRgdGPXG5cblx0XHRmb3J1bS5hZGRMaXN0ZW5lcihyZWdGb3JtLCBcInN1Ym1pdFwiLCBoYW5kbGVyKTtcblxuXHRcdGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcblx0XHRcdGlmIChtYWlsSW5wdXQudmFsdWUuaW5kZXhPZihcIiBcIikgPiAtMSB8fCBuaWNrSW5wdXQudmFsdWUuaW5kZXhPZihcIiBcIikgPiAtMSB8fCBwYXNzd29yZElucHV0LnZhbHVlLmluZGV4T2YoXCIgXCIpID4gLTEpIHtcblx0XHRcdFx0Zm9ydW0ubm90aWZ5KFwiZXJyb3JcIiwgXCLQlNCw0L3QvdGL0LUg0L3QtSDQtNC+0LvQttC90Ysg0YHQvtC00LXRgNC20LDRgtGMINC/0YDQvtCx0LXQu9GLXCIpO1xuXHRcdFx0fSBlbHNlIGlmICghZm9ydW0udmFsaWRhdG9ycy5lbWFpbChtYWlsSW5wdXQudmFsdWUpKSB7XG5cdFx0XHRcdGZvcnVtLm5vdGlmeShcImVycm9yXCIsIFwi0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5IGVtYWlsLdCw0LTRgNC10YFcIik7XG5cdFx0XHR9IGVsc2UgaWYgKG5pY2tJbnB1dC52YWx1ZS5sZW5ndGggPCA0IHx8IG5pY2tJbnB1dC52YWx1ZS5sZW5ndGggPiA2NCkge1xuXHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCd0LjQutC90LXQudC8INC00L7Qu9C20LXQvSDQsdGL0YLRjCDQtNC70LjQvdC+0Lkg0L7RgiA0INC00L4gNjQg0YHQuNC80LLQvtC70L7QslwiKTtcblx0XHRcdH0gZWxzZSBpZiAoIWZvcnVtLnZhbGlkYXRvcnMubmlja05hbWUobmlja0lucHV0LnZhbHVlKSkge1xuXHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCd0LjQutC90LXQudC8INC90LUg0LzQvtC20LXRgiDQvdCw0YfQuNC90LDRgtGM0YHRjyDQuCDQt9Cw0LrQsNC90YfQuNCy0LDRgtGM0YHRjyDQt9C90LDQutCw0LzQuCDQv9GA0LXQv9C40L3QsNC90LjRj1wiKTtcblx0XHRcdH0gZWxzZSBpZiAoIWZvcnVtLnZhbGlkYXRvcnMucGFzc3dvcmQocGFzc3dvcmRJbnB1dC52YWx1ZSkpIHtcblx0XHRcdFx0Zm9ydW0ubm90aWZ5KFwiZXJyb3JcIiwgXCLQn9Cw0YDQvtC70Ywg0LTQvtC70LbQtdC9INCx0YvRgtGMINC00LvQuNC90L7QuSDQvtGCIDYg0LTQviA2NCDRgdC40LzQstC+0LvQvtCyXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcblx0XHRcdFx0XHQvLyBGT1IgQUxQSEEgVkVSU0lPTlxuXHRcdFx0XHRcdC8vIHVybDogc2VydmVySG9zdCArIFwiL3VzZXJzL1wiICsgaGFzaCxcblx0XHRcdFx0XHQvLyBFTkRcblx0XHRcdFx0XHR1cmw6IHNlcnZlckhvc3QgKyBcIi91c2Vyc1wiLFxuXHRcdFx0XHRcdGJvZHk6IHtcblx0XHRcdFx0XHRcdG5pY2tuYW1lOiBuaWNrSW5wdXQudmFsdWUsXG5cdFx0XHRcdFx0XHRtYWlsOiBtYWlsSW5wdXQudmFsdWUsXG5cdFx0XHRcdFx0XHRwYXNzd29yZDogcGFzc3dvcmRJbnB1dC52YWx1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UsIHhocikge1xuXHRcdFx0XHRcdFx0Ly8gZm9ydW0uc2V0Q29va2llKFwiYXV0aC10b2tlbj1cIiArIHhoci5nZXRSZXNwb25zZUhlYWRlcignQXV0aC1Ub2tlbicpKTtcblx0XHRcdFx0XHRcdC8vIGZvcnVtLnNldENvb2tpZShcIm5pY2tuYW1lPVwiICsgcmVzcG9uc2UuZGF0YS5uaWNrbmFtZSk7XG5cdFx0XHRcdFx0XHQvLyBmb3J1bS5zaG93VXNlclBhbmVsKCk7XG5cdFx0XHRcdFx0XHQvLyBmb3J1bS5ub3RpZnkoXCJzdWNjZXNzXCIsIFwi0KDQtdCz0LjRgdGC0YDQsNGG0LjRjyDRg9GB0L/QtdGI0L3QviDQt9Cw0LLQtdGA0YjQtdC90LAuINCW0LTRkdC8LCDQv9C+0LrQsCDQstGLINC/0L7QtNGC0LLQtdGA0LTQuNGC0LUgZW1haWwt0LDQtNGA0LXRgVwiKTtcblx0XHRcdFx0XHRcdC8vIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCIjbWFpblwiO1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpLmlubmVySFRNTCA9IFwiPGRpdiBjbGFzcz1cXFwiY29udGVudFxcXCI+PGgyPtCS0Ysg0YPRgdC/0LXRiNC90L4g0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNC70LjRgdGMITwvaDI+PHA+0J7RgdGC0LDQu9C+0YHRjCDRgtC+0LvRjNC60L4g0L/QvtC00YLQstC10YDQtNC40YLRjCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiyAoXCIgKyBtYWlsSW5wdXQudmFsdWUgKyBcIik8L3A+PC9kaXY+XCI7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRcdGlmIChyZXNwb25zZS5tZXRhKSB7XG5cdFx0XHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImVycm9yXCIsIHJlc3BvbnNlLm1ldGEubWVzc2FnZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1x0XG5cdFx0XHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImVycm9yXCIsIFwi0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLlwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGF1dCgpIHtcblx0XHR2YXIgYXV0Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXV0LWZvcm1cIik7XG5cblx0XHR2YXIgaWRJbnB1dCA9IGF1dEZvcm1bXCJhdXQtaWRcIl07XG5cdFx0dmFyIHBhc3N3b3JkSW5wdXQgPSBhdXRGb3JtW1wiYXV0LXBhc3N3b3JkXCJdO1xuXHRcdHZhciByZXBhc3N3b3JkTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVwYXNzd29yZC1saW5rXCIpO1xuXHRcdHZhciBzaG93UGFzc3dvcmRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3ctcGFzc3dvcmQtYnRuXCIpO1xuXHRcdHZhciBwYXNzd29yZFNob3dlZCA9IGZhbHNlO1xuXG5cdFx0aWRJbnB1dC5mb2N1cygpO1xuXHRcdHNob3dQYXNzd29yZEJ0bi5zdHlsZS5jb2xvciA9IFwiI2FhYVwiO1xuXG5cdFx0Zm9ydW0uYWRkTGlzdGVuZXIocmVwYXNzd29yZExpbmssIGZvcnVtLmNsaWNrT3JUb3VjaCwgcmVwYXNzd29yZCk7XG5cblx0XHRmdW5jdGlvbiByZXBhc3N3b3JkKCkge1xuXHRcdFx0dmFyIHEgPSBpZElucHV0LnZhbHVlID8gXCI/aWQ9XCIgKyBpZElucHV0LnZhbHVlIDogXCJcIjtcblx0XHRcdHJlcGFzc3dvcmRMaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgcmVwYXNzd29yZExpbmsuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSArIHEpO1xuXHRcdH1cblxuXHRcdGZvcnVtLmFkZExpc3RlbmVyKHNob3dQYXNzd29yZEJ0biwgZm9ydW0uY2xpY2tPclRvdWNoLCBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChwYXNzd29yZFNob3dlZCkge1xuXHRcdFx0XHRwYXNzd29yZElucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJwYXNzd29yZFwiKTtcblx0XHRcdFx0c2hvd1Bhc3N3b3JkQnRuLnN0eWxlLmNvbG9yID0gXCIjYWFhXCI7XG5cdFx0XHRcdHBhc3N3b3JkU2hvd2VkID0gZmFsc2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXNzd29yZElucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0XCIpO1xuXHRcdFx0XHRzaG93UGFzc3dvcmRCdG4uc3R5bGUuY29sb3IgPSBcIiM2NjZcIjtcblx0XHRcdFx0cGFzc3dvcmRTaG93ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Zm9ydW0uYWRkTGlzdGVuZXIoYXV0Rm9ybSwgXCJzdWJtaXRcIiwgaGFuZGxlcik7XG5cblx0XHRmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XG5cdFx0XHRpZiAoaWRJbnB1dC52YWx1ZS5pbmRleE9mKFwiIFwiKSA+IC0xIHx8IHBhc3N3b3JkSW5wdXQudmFsdWUuaW5kZXhPZihcIiBcIikgPiAtMSkge1xuXHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCU0LDQvdC90YvQtSDQvdC1INC00L7Qu9C20L3RiyDRgdC+0LTQtdGA0LbQsNGC0Ywg0L/RgNC+0LHQtdC70YtcIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3J1bS5hamF4KHtcblx0XHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxuXHRcdFx0XHRcdHVybDogc2VydmVySG9zdCArIFwiL2xvZ2luXCIsXG5cdFx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdFx0aWRlbnRpZmllcjogaWRJbnB1dC52YWx1ZSxcblx0XHRcdFx0XHRcdHBhc3N3b3JkOiBwYXNzd29yZElucHV0LnZhbHVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSwgeGhyKSB7XG5cdFx0XHRcdFx0XHRmb3J1bS5zZXRDb29raWUoXCJuaWNrbmFtZT1cIiArIHJlc3BvbnNlLmRhdGEubmlja25hbWUpO1xuXHRcdFx0XHRcdFx0Zm9ydW0uc2V0Q29va2llKFwiYXV0aC10b2tlbj1cIiArIHhoci5nZXRSZXNwb25zZUhlYWRlcignQXV0aC1Ub2tlbicpKTtcblx0XHRcdFx0XHRcdGZvcnVtLnNob3dVc2VyUGFuZWwoKTtcblx0XHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcInN1Y2Nlc3NcIiwgXCLQktGLINCy0L7RiNC70Lgg0LIg0YHQuNGB0YLQtdC80YMuINCf0YDQuNGP0YLQvdC+0LPQviDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRjyA6KVwiKTtcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCIjbWFpblwiO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2UubWV0YSkge1xuXHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCByZXNwb25zZS5tZXRhLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcdFxuXHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi5cIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBmZWVkYmFjaygpIHtcblx0XHR2YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmItZm9ybVwiKTtcblxuXHRcdGZvcnVtLmFkZExpc3RlbmVyKGZvcm0sIFwic3VibWl0XCIsIGhhbmRsZXIpO1xuXG5cdFx0ZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xuXHRcdFx0dmFyIG1zZyA9IGZvcm1bXCJmYi1tZXNzYWdlXCJdLnZhbHVlO1xuXHRcdFx0dmFyIGFub255bSA9IGZvcm1bXCJmYi1hbm9ueW1cIl0uY2hlY2tlZDtcblxuXHRcdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRcdHVybDogZm9ydW0uc2VydmVySG9zdCArIFwiL2ZlZWRiYWNrXCIsXG5cdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHRcIkF1dGgtVG9rZW5cIjogZm9ydW0uZ2V0Q29va2llKFwiYXV0aC10b2tlblwiKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRib2R5OiB7XG5cdFx0XHRcdFx0bWVzc2FnZTogbXNnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRcdGFub255bW91czogYW5vbnltXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcInN1Y2Nlc3NcIiwgXCLQodC/0LDRgdC40LHQviDQt9CwINC+0YLQt9GL0LIgOilcIik7XG5cdFx0XHRcdFx0Zm9ydW0ucmVsb2FkKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVycm9yOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi5cIik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblx0fVxuXG5cdHZhciBwYWdlcyA9IHtcblx0XHRcIiNzaWduLWluXCI6IHtcblx0XHRcdHRpdGxlOiBcItCS0YXQvtC0XCIsXG5cdFx0XHR0ZW1wbGF0ZUlkOiBcInNpZ24taW4tdGVtcGxhdGVcIixcblx0XHRcdGFjdGlvbjogYXV0XG5cdFx0fSxcblx0XHRcIiNzaWduLXVwXCI6IHtcblx0XHRcdHRpdGxlOiBcItCg0LXQs9C40YHRgtGA0LDRhtC40Y9cIixcblx0XHRcdHRlbXBsYXRlSWQ6IFwic2lnbi11cC10ZW1wbGF0ZVwiLFxuXHRcdFx0YWN0aW9uOiByZWdcblx0XHR9LFxuXHRcdFwiI21haW5cIjoge1xuXHRcdFx0dGl0bGU6IFwibGFib29kYS5ydVwiLFxuXHRcdFx0dGVtcGxhdGVJZDogXCJtYWluLXRlbXBsYXRlXCIsXG5cdFx0XHRjb25mczoge1xuXHRcdFx0XHRtZXRob2Q6IFwiR0VUXCIsXG5cdFx0XHRcdHVybDogc2VydmVySG9zdCArIFwiL3NlY3Rpb25zXCJcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiIzQwNFwiOiB7XG5cdFx0XHR0aXRsZTogXCLQodGC0YDQsNC90LjRhtCwINC90LUg0L3QsNC50LTQtdC90LBcIixcblx0XHRcdHRlbXBsYXRlSWQ6IFwibmYtdGVtcGxhdGVcIlxuXHRcdH0sXG5cblx0XHQvLyBGT1IgQUxQSEEgVkVSU0lPTlxuXG5cdFx0XCIjZmVlZGJhY2tcIjoge1xuXHRcdFx0dGl0bGU6IFwi0J7RgtC30YvQslwiLFxuXHRcdFx0dGVtcGxhdGVJZDogXCJmZWVkYmFjay10ZW1wbGF0ZVwiLFxuXHRcdFx0YWN0aW9uOiBmZWVkYmFja1xuXHRcdH1cblxuXHRcdC8vIEVORFxuXHR9XG5cblx0Zm9ydW0ucGFnZXMgPSBwYWdlcztcbn0pKCk7XG4oZnVuY3Rpb24oKSB7XG5cdHZhciBub3RpZmljYXRpb25UeXBlcyA9IHtcblx0XHRcImluZm9cIjogW1wibm90aWZpY2F0aW9uXCIsIFwiaW5mby1ub3RpZmljYXRpb25cIl0sXG5cdFx0XCJzdWNjZXNzXCI6IFtcIm5vdGlmaWNhdGlvblwiLCBcInN1Y2Nlc3Mtbm90aWZpY2F0aW9uXCJdLFxuXHRcdFwid2FybmluZ1wiOiBbXCJub3RpZmljYXRpb25cIiwgXCJ3YXJuaW5nLW5vdGlmaWNhdGlvblwiXSxcblx0XHRcImVycm9yXCI6IFtcIm5vdGlmaWNhdGlvblwiLCBcImVycm9yLW5vdGlmaWNhdGlvblwiXVxuXHR9XG5cblx0ZnVuY3Rpb24gbm90aWZ5KHR5cGUsIHRleHQpIHtcblx0XHR2YXIgbXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbm90aWZpY2F0aW9uVHlwZXNbdHlwZV0ubGVuZ3RoOyBpKyspIHtcblx0XHRcdG1zZy5jbGFzc0xpc3QuYWRkKG5vdGlmaWNhdGlvblR5cGVzW3R5cGVdW2ldKTtcblx0XHR9XG5cblx0XHRtc2cudGV4dENvbnRlbnQgPSB0ZXh0O1xuXG5cdFx0dmFyIG1zZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vdGlmaWNhdGlvbnNcIik7XG5cdFx0dmFyIGxhc3RNc2cgPSBtc2dzLmNoaWxkTm9kZXNbMF07XG5cdFx0bXNncy5pbnNlcnRCZWZvcmUobXNnLCBsYXN0TXNnKTtcblxuXHRcdGZ1bmN0aW9uIGNsb3NlKCkge1xuXHRcdFx0Y2xvc2VOb3RpZmljYXRpb24obXNnKTtcblx0XHR9XG5cblx0XHRtc2cuYWRkRXZlbnRMaXN0ZW5lcihmb3J1bS5jbGlja09yVG91Y2gsIGNsb3NlKTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24obXNnKSB7XG5cdFx0XHRjbG9zZU5vdGlmaWNhdGlvbihtc2cpO1xuXHRcdH0sIDgwMDAsIG1zZyk7XG5cblx0XHRmdW5jdGlvbiBjbG9zZU5vdGlmaWNhdGlvbihtc2cpIHtcblx0XHRcdGlmIChtc2cucGFyZW50Tm9kZSkge1xuXHRcdFx0XHRtc2cucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChtc2cpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZvcnVtLm5vdGlmeSA9IG5vdGlmeTtcbn0pKCk7XG4oZnVuY3Rpb24oKSB7XG5cdGZvcnVtLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuXHRcdGZvcnVtLmxvZ2lubmVkID0gZmFsc2U7XG5cdFx0Zm9ydW0ucmlnaHRzID0gbnVsbDtcblx0XHRmb3J1bS5kZWxldGVDb29raWUoXCJhdXRoLXRva2VuXCIpO1xuXHRcdGZvcnVtLmRlbGV0ZUNvb2tpZShcIm5pY2tuYW1lXCIpO1xuXHR9XG5cblx0Zm9ydW0udXNlckFjdGlvbnMgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdXNlckxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXItbGlua1wiKTtcblx0XHR2YXIgdXNlclBhbmVsTWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci1wYW5lbC1tZW51XCIpO1xuXHRcdHZhciB1c2VyTG9nb3V0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLWxvZ291dC1idG5cIik7XG5cblx0XHR2YXIgdG91Y2ggPSAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcblxuXHRcdGZvcnVtLmFkZExpc3RlbmVyKHVzZXJMb2dvdXRCdG4sIGZvcnVtLmNsaWNrT3JUb3VjaCwgbG9nb3V0KTtcblx0XHRmb3J1bS5hZGRMaXN0ZW5lcih1c2VyTGluaywgZm9ydW0uY2xpY2tPclRvdWNoLCB0b2dnbGVVc2VyUGFuZWxNZW51KTtcblxuXHRcdGZ1bmN0aW9uIGxvZ291dCgpIHtcblx0XHRcdGZvcnVtLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6IFwiREVMRVRFXCIsXG5cdFx0XHRcdHVybDogZm9ydW0uc2VydmVySG9zdCArIFwiL2xvZ291dFwiLFxuXHRcdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdFx0XCJBdXRoLVRva2VuXCI6IGZvcnVtLmdldENvb2tpZShcImF1dGgtdG9rZW5cIilcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Zm9ydW0uZGVsZXRlQ29va2llKFwiYXV0aC10b2tlblwiKTtcblx0XHRcdFx0XHRmb3J1bS5kZWxldGVDb29raWUoXCJ1c2VyLWlkXCIpO1xuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImVycm9yXCIsIFwi0J3QtSDRg9C00LDQu9C+0YHRjCDQstGL0LnRgtC4INC40Lcg0YHQuNGB0YLQtdC80YsgOihcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhpZGUoKSB7XG5cdFx0XHR1c2VyUGFuZWxNZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvcGVuKCkge1xuXHRcdFx0dXNlclBhbmVsTWVudS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZVVzZXJQYW5lbE1lbnUoKSB7XG5cdFx0XHRpZiAodXNlclBhbmVsTWVudS5zdHlsZS5kaXNwbGF5ID09PSBcImJsb2NrXCIpIHtcblx0XHRcdFx0aGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3BlbigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGZvcnVtLmNsaWNrT3JUb3VjaCwgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGlmICghKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gXCJ1c2VyLWxpbmtcIikpIHtcblx0XHRcdFx0Y2xvc2VTaG93ZWRFbGVtcygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gY2xvc2VTaG93ZWRFbGVtcygpIHtcblx0XHRcdHZhciB1c2VyUGFuZWxNZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLXBhbmVsLW1lbnVcIik7XG5cdFx0XHRpZiAodXNlclBhbmVsTWVudSkge1xuXHRcdFx0XHR1c2VyUGFuZWxNZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmb3J1bS5zaG93VXNlclBhbmVsID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5pY2tuYW1lID0gZm9ydW0uZ2V0Q29va2llKFwibmlja25hbWVcIik7XG5cdFx0dmFyIHVzZXJQYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci1wYW5lbFwiKTtcblx0XHR2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXItcGFuZWwtdGVtcGxhdGVcIikuaW5uZXJIVE1MO1xuXHRcdGlmIChuaWNrbmFtZSkge1xuXHRcdFx0dmFyIGF1dGhUb2tlbiA9IGZvcnVtLmdldENvb2tpZShcImF1dGgtdG9rZW5cIikgfHwgXCJcIjtcblxuXHRcdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogXCJHRVRcIixcblx0XHRcdFx0dXJsOiBmb3J1bS5zZXJ2ZXJIb3N0ICsgXCIvXCIsXG5cdFx0XHRcdGhpZGRlbjogdHJ1ZSxcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdFwiQXV0aC1Ub2tlblwiOiBhdXRoVG9rZW5cblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGZvcnVtLmxvZ2lubmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRmb3J1bS5hamF4KHtcblx0XHRcdFx0XHRcdG1ldGhvZDogXCJHRVRcIixcblx0XHRcdFx0XHRcdHVybDogZm9ydW0uc2VydmVySG9zdCArIFwiL3VzZXJzL1wiICsgbmlja25hbWUsXG5cdFx0XHRcdFx0XHRoaWRkZW46IHRydWUsXG5cdFx0XHRcdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdFx0XHRcdFwiQXV0aC1Ub2tlblwiOiBhdXRoVG9rZW5cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRcdFx0XHRmb3J1bS5yaWdodHMgPSByZXNwb25zZS5kYXRhLnJpZ2h0cztcblx0XHRcdFx0XHRcdFx0ZGF0YS5zaG93VXNlciA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdHVzZXJQYW5lbC5pbm5lckhUTUwgPSB0ZW1wbGF5ZWQodGVtcGxhdGUpKGRhdGEpO1xuXHRcdFx0XHRcdFx0XHRmb3J1bS51c2VyQWN0aW9ucygpO1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGVycm9yOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXNwb25zZS5tZXRhLmNvZGUgPT09IFwiNDAzXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3J1bS5sb2dvdXQoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR1c2VyUGFuZWwuaW5uZXJIVE1MID0gdGVtcGxheWVkKHRlbXBsYXRlKSh7XG5cdFx0XHRcdFx0XHRcdFx0c2hvd0xpbmtzOiB0cnVlXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm1ldGEuY29kZSA9PT0gXCI0MDNcIikge1xuXHRcdFx0XHRcdFx0Zm9ydW0ubG9nb3V0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHVzZXJQYW5lbC5pbm5lckhUTUwgPSB0ZW1wbGF5ZWQodGVtcGxhdGUpKHtcblx0XHRcdFx0XHRcdHNob3dMaW5rczogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9ydW0ubG9nb3V0KCk7XG5cdFx0XHR1c2VyUGFuZWwuaW5uZXJIVE1MID0gdGVtcGxheWVkKHRlbXBsYXRlKSh7XG5cdFx0XHRcdHNob3dMaW5rczogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0Zm9ydW0udXNlcnNNb2R1bGUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHRcdHZhciB1cmxBcnIgPSBoYXNoLnNwbGl0KFwiL1wiKTtcblx0XHR2YXIgc2VjdGlvbiA9IHVybEFyclswXTtcblx0XHRpZiAoc2VjdGlvbiA9PT0gXCIjdXNlclwiKSB7XG5cdFx0XHR2YXIgbmlja25hbWUgPSB1cmxBcnJbMV07XG5cdFx0XHRpZiAobmlja25hbWUpIHtcblx0XHRcdFx0aWYgKHVybEFyclsyXSA9PT0gXCJlZGl0XCIpIHtcblx0XHRcdFx0XHRmb3J1bS5hamF4KHtcblx0XHRcdFx0XHRcdG1ldGhvZDogXCJHRVRcIixcblx0XHRcdFx0XHRcdHVybDogZm9ydW0uc2VydmVySG9zdCArIFwiL3VzZXJzL1wiICsgbmlja25hbWUsXG5cdFx0XHRcdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdFx0XHRcdFwiQXV0aC1Ub2tlblwiOiBmb3J1bS5nZXRDb29raWUoXCJhdXRoLXRva2VuXCIpIHx8IFwiXCJcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRcdFx0Zm9ydW0uY2hhbmdlVmlldyh7XG5cdFx0XHRcdFx0XHRcdFx0dGVtcGxhdGVJZDogXCJwcm9maWxlLWVkaXQtdGVtcGxhdGVcIixcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiByZXNwb25zZSxcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb246IGZvcnVtLnByb2ZpbGVFZGl0SW5pdFxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImVycm9yXCIsIHJlc3BvbnNlLm1ldGEubWVzc2FnZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9ydW0uc2hvd1VzZXIobmlja25hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwiI3VzZXJzL1wiO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3J1bS51c2Vyc1NlYXJjaChoYXNoKTtcblx0XHR9XG5cdH1cblxuXHRmb3J1bS5zaG93VXNlciA9IGZ1bmN0aW9uKG5pY2tuYW1lKSB7XG5cdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRtZXRob2Q6IFwiR0VUXCIsXG5cdFx0XHR1cmw6IGZvcnVtLnNlcnZlckhvc3QgKyBcIi91c2Vycy9cIiArIG5pY2tuYW1lLFxuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcIkF1dGgtVG9rZW5cIjogZm9ydW0uZ2V0Q29va2llKFwiYXV0aC10b2tlblwiKSB8fCBcIlwiXG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGlmIChyZXNwb25zZS5kYXRhLm1haWwpIHtcblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLm1haWxFeGlzdHMgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlc3BvbnNlLmRhdGEubWFpbFZlcmlmaWVkID0gcmVzcG9uc2UuZGF0YS5yaWdodHMgPT09IFwidW52ZXJpZmllZFwiID8gZmFsc2UgOiB0cnVlO1xuXHRcdFx0XHRpZiAocmVzcG9uc2UuZGF0YS5hdmF0YXIpIHtcblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLmF2YXRhckV4aXN0cyA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEubmFtZSkge1xuXHRcdFx0XHRcdHJlc3BvbnNlLmRhdGEubmFtZUV4aXN0cyA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEucmVnaXN0cmF0aW9uVGltZSkge1xuXHRcdFx0XHRcdHJlc3BvbnNlLmRhdGEucmVnaXN0cmF0aW9uVGltZSA9IGZvcnVtLm1ha2VEYXRlU3RyKHJlc3BvbnNlLmRhdGEucmVnaXN0cmF0aW9uVGltZSk7XG5cdFx0XHRcdFx0cmVzcG9uc2UuZGF0YS5yZWdpc3RyYXRpb25UaW1lRXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmVzcG9uc2UuZGF0YS5kYXRlT2ZCaXJ0aCkge1xuXHRcdFx0XHRcdHJlc3BvbnNlLmRhdGEuZGF0ZU9mQmlydGggPSBmb3J1bS5tYWtlRGF0ZVN0cihyZXNwb25zZS5kYXRhLmRhdGVPZkJpcnRoKTtcblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLmRhdGVPZkJpcnRoRXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vINCf0YDQvtCx0LvQtdC80LAsINC60L7RgtC+0YDRg9GOINCyINCx0YPQtNGD0YnQtdC8INC90LDQtNC+INCx0YPQtNC10YIg0YDQtdGI0LjRgtGMOlxuXG5cdFx0XHRcdC8vINC10YHQu9C4INC30LDQv9GA0L7RgSDRgSDQv9GA0L7QstC10YDQutC+0Lkg0LvQvtCz0LjQvdCwICjQvNC10YLQvtC0IGZvcnVtLnNob3dVc2VyUGFuZWwpXG5cdFx0XHRcdC8vINC90LUg0L/QvtC70YPRh9C40YIg0L7RgtCy0LXRgtCwINC00L4g0YLQvtCz0L4sINC60LDQuiDQvdCw0YfQvdGR0YLRgdGPINC40YHQv9C+0LvQvdC10L3QuNC1INGN0YLQvtCz0L4g0LrQvtC00LAsXG5cdFx0XHRcdC8vINC60L3QvtC/0LrQsCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC/0YDQvtGE0LjQu9GPINC90LUg0LHRg9C00LXRgiDQv9C+0LrQsNC30LDQvdCwXG5cblx0XHRcdFx0aWYgKGZvcnVtLmxvZ2lubmVkICYmIG5pY2tuYW1lLnRvTG93ZXJDYXNlKCkgPT09IGZvcnVtLmdldENvb2tpZShcIm5pY2tuYW1lXCIpLnRvTG93ZXJDYXNlKCkpIHtcblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLnByb2ZpbGVFZGl0QnRuID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3J1bS5jaGFuZ2VWaWV3KHtcblx0XHRcdFx0XHR0aXRsZTogcmVzcG9uc2UuZGF0YS5uaWNrbmFtZSxcblx0XHRcdFx0XHR0ZW1wbGF0ZUlkOiBcInVzZXItdGVtcGxhdGVcIixcblx0XHRcdFx0XHRkYXRhOiByZXNwb25zZVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEucHJvZmlsZUVkaXRCdG4pIHtcblx0XHRcdFx0XHRmb3J1bS5wcm9maWxlRWRpdChuaWNrbmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRmb3J1bS5jaGFuZ2VWaWV3KGZvcnVtLnBhZ2VzW1wiIzQwNFwiXSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRmb3J1bS5wcm9maWxlRWRpdCA9IGZ1bmN0aW9uKG5pY2tuYW1lKSB7XG5cdFx0Zm9ydW0ucHJvZmlsZUVkaXRJbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcHJvZmlsZUVkaXRCYWNrQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9maWxlLWVkaXQtYmFjay1idG5cIik7XG5cdFx0XHR2YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZmlsZS1lZGl0LWZvcm1cIik7XG5cdFx0XHR2YXIgZW1haWwgPSBmb3JtLmVtYWlsLnZhbHVlO1xuXHRcdFx0Zm9ydW0uYWRkTGlzdGVuZXIoZm9ybSwgXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdGZvcnVtLmFqYXgoe1xuXHRcdFx0XHRcdG1ldGhvZDogXCJQVVRcIixcblx0XHRcdFx0XHR1cmw6IGZvcnVtLnNlcnZlckhvc3QgKyBcIi91c2Vycy9cIiArIG5pY2tuYW1lLFxuXHRcdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHRcdFwiQXV0aC1Ub2tlblwiOiBmb3J1bS5nZXRDb29raWUoXCJhdXRoLXRva2VuXCIpIHx8IFwiXCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGJvZHk6IHtcblx0XHRcdFx0XHRcdG5hbWU6IGZvcm0ubmFtZS52YWx1ZSB8fCBudWxsLFxuXHRcdFx0XHRcdFx0bWFpbDogZm9ybS5lbWFpbC52YWx1ZSB8fCBlbWFpbCxcblx0XHRcdFx0XHRcdGluZm86IG51bGwsXG5cdFx0XHRcdFx0XHQvLyBpbmZvOiBmb3JtLmluZm8udmFsdWUgfHwgbnVsbCxcblx0XHRcdFx0XHRcdGRhdGVPZkJpcnRoOiBudWxsLFxuXHRcdFx0XHRcdFx0YXZhdGFyOiBudWxsLFxuXHRcdFx0XHRcdFx0cGFzc3dvcmQ6IGZvcm0ucGFzc3dvcmQudmFsdWUgfHwgbnVsbFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Zm9ydW0ubm90aWZ5KFwic3VjY2Vzc1wiLCBcItCY0L3RhNC+0YDQvNCw0YbQuNGPINC+0LHQvdC+0LLQu9C10L3QsFwiKTtcblx0XHRcdFx0XHRcdGZvcnVtLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0Zm9ydW0ubm90aWZ5KFwiZXJyb3JcIiwgcmVzcG9uc2UubWV0YS5tZXNzYWdlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Zm9ydW0uYWRkTGlzdGVuZXIocHJvZmlsZUVkaXRCYWNrQnRuLCBmb3J1bS5jbGlja09yVG91Y2gsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoL1xcL2VkaXRcXC8/LywgXCJcIik7XG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdHZhciBwcm9maWxlRWRpdEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZmlsZS1lZGl0LWJ0blwiKTtcblx0XHRmb3J1bS5hZGRMaXN0ZW5lcihwcm9maWxlRWRpdEJ0biwgZm9ydW0uY2xpY2tPclRvdWNoLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2ggKyAoaGFzaC5sYXN0SW5kZXhPZihcIi9cIikgPT09IGhhc2gubGVuZ3RoIC0gMSA/IFwiXCIgOiBcIi9cIikgKyBcImVkaXRcIjtcblx0XHR9KTtcblx0fVxuXG5cdGZvcnVtLnVzZXJzU2VhcmNoID0gZnVuY3Rpb24odXJsKSB7XG5cdFx0Ly8gdXJsINCy0LjQtNCwICN1c2Vyc1svc2VhcmNoPXtxdWVyeX1dXG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZUZvcm0oKSB7XG5cdFx0XHR2YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlcnMtc2VhcmNoLWZvcm1cIik7XG5cdFx0XHR2YXIgaW5wdXQgPSBmb3JtW1widXNlcnMtc2VhcmNoLWlucHV0XCJdO1xuXHRcdFx0aWYgKGZvcnVtLmNsaWNrT3JUb3VjaCA9PT0gXCJjbGlja1wiKSB7XG5cdFx0XHRcdGlucHV0LmZvY3VzKCk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcnVtLmFkZExpc3RlbmVyKGZvcm0sIFwic3VibWl0XCIsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwiI3VzZXJzL3NlYXJjaD1cIiArIGlucHV0LnZhbHVlO1xuXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdHZhciB1cmxBcnIgPSB1cmwuc3BsaXQoXCIvXCIpO1xuXHRcdHZhciB1c2Vyc0NvdW50ID0gMzA7XG5cblx0XHRpZiAodXJsQXJyWzFdICYmIHVybEFyclsxXS5pbmRleE9mKFwic2VhcmNoPVwiKSA+IC0xKSB7XG5cdFx0XHR2YXIgcXVlcnkgPSBkZWNvZGVVUkkodXJsQXJyWzFdLnNsaWNlKDcpKTtcblx0XHRcdHZhciBwYXJhbXMgPSB7XG5cdFx0XHRcdHNvcnQ6IFwiYnlSYXRpbmdcIixcblx0XHRcdFx0ZmluZDogcXVlcnksXG5cdFx0XHRcdGNvdW50OiB1c2Vyc0NvdW50XG5cdFx0XHR9XG5cdFx0XHR2YXIgY3VyUGFnZSA9IHVybEFyclszXSB8fCAxO1xuXHRcdFx0aWYgKCFjdXJQYWdlIHx8IGN1clBhZ2UgPCAxKSB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShcInBhZ2UvXCIgKyBjdXJQYWdlLCBcInBhZ2UvMVwiKTtcblx0XHRcdH1cblx0XHRcdHBhcmFtcy5vZmZzZXQgPSB1c2Vyc0NvdW50ICogY3VyUGFnZSAtIHVzZXJzQ291bnQ7XG5cdFx0XHRmb3J1bS5hamF4KHtcblx0XHRcdFx0bWV0aG9kOiBcIkdFVFwiLFxuXHRcdFx0XHR1cmw6IGZvcnVtLnNlcnZlckhvc3QgKyBcIi91c2Vyc1wiLFxuXHRcdFx0XHRwYXJhbXM6IHBhcmFtcyxcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdFwiQXV0aC1Ub2tlblwiOiBmb3J1bS5nZXRDb29raWUoXCJhdXRoLXRva2VuXCIpIHx8IFwiXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm1ldGEuY291bnQgPiAwKSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLnVzZXJzRXhpc3QgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbGFzdFBhZ2UgPSBNYXRoLmNlaWwocmVzcG9uc2UubWV0YS5jb3VudCAvIHVzZXJzQ291bnQpIHx8IDE7XG5cblx0XHRcdFx0XHRpZiAobGFzdFBhZ2UgPD0gY3VyUGFnZSkge1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKFwicGFnZS9cIiArIGN1clBhZ2UsIFwicGFnZS9cIiArIGxhc3RQYWdlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgY29yZVVybCA9IHVybEFyclswXSArIFwiL1wiICsgdXJsQXJyWzFdO1xuXHRcdFx0XHRcdHJlc3BvbnNlLnBhZ2VyID0gbGFzdFBhZ2UgPiAxID8gZm9ydW0ubWFrZVBhZ2VyKGN1clBhZ2UsIGxhc3RQYWdlLCBjb3JlVXJsKSA6IFwiXCI7XG5cdFx0XHRcdFx0cmVzcG9uc2UuZGF0YS5zZWFyY2hRdWVyeSA9IHF1ZXJ5O1xuXHRcdFx0XHRcdGZvcnVtLmNoYW5nZVZpZXcoe1xuXHRcdFx0XHRcdFx0dGl0bGU6IFwi0J/QvtC70YzQt9C+0LLQsNGC0LXQu9C4XCIsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZUlkOiBcInVzZXJzLXNlYXJjaC10ZW1wbGF0ZVwiLFxuXHRcdFx0XHRcdFx0ZGF0YTogcmVzcG9uc2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRhY3RpdmF0ZUZvcm0oKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImVycm9yXCIsIHJlc3BvbnNlLm1ldGEubWVzc2FnZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFyYW1zID0ge1xuXHRcdFx0XHRzb3J0OiBcImJ5UmF0aW5nXCIsXG5cdFx0XHRcdGNvdW50OiB1c2Vyc0NvdW50XG5cdFx0XHR9XG5cdFx0XHR2YXIgY3VyUGFnZSA9IHVybEFyclsyXSB8fCAxO1xuXHRcdFx0aWYgKCFjdXJQYWdlIHx8IGN1clBhZ2UgPCAxKSB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShcInBhZ2UvXCIgKyBjdXJQYWdlLCBcInBhZ2UvMVwiKTtcblx0XHRcdH1cblx0XHRcdHBhcmFtcy5vZmZzZXQgPSB1c2Vyc0NvdW50ICogY3VyUGFnZSAtIHVzZXJzQ291bnQ7XG5cdFx0XHRmb3J1bS5hamF4KHtcblx0XHRcdFx0bWV0aG9kOiBcIkdFVFwiLFxuXHRcdFx0XHR1cmw6IGZvcnVtLnNlcnZlckhvc3QgKyBcIi91c2Vyc1wiLFxuXHRcdFx0XHRwYXJhbXM6IHBhcmFtcyxcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdFwiQXV0aC1Ub2tlblwiOiBmb3J1bS5nZXRDb29raWUoXCJhdXRoLXRva2VuXCIpIHx8IFwiXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm1ldGEuY291bnQgPiAwKSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLnVzZXJzRXhpc3QgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbGFzdFBhZ2UgPSBNYXRoLmNlaWwocmVzcG9uc2UubWV0YS5jb3VudCAvIHVzZXJzQ291bnQpIHx8IDE7XG5cblx0XHRcdFx0XHRpZiAobGFzdFBhZ2UgPD0gY3VyUGFnZSkge1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKFwicGFnZS9cIiArIGN1clBhZ2UsIFwicGFnZS9cIiArIGxhc3RQYWdlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgY29yZVVybCA9IHVybEFyclswXTtcblx0XHRcdFx0XHRyZXNwb25zZS5wYWdlciA9IGxhc3RQYWdlID4gMSA/IGZvcnVtLm1ha2VQYWdlcihjdXJQYWdlLCBsYXN0UGFnZSwgY29yZVVybCkgOiBcIlwiO1xuXHRcdFx0XHRcdGZvcnVtLmNoYW5nZVZpZXcoe1xuXHRcdFx0XHRcdFx0dGl0bGU6IFwi0J/QvtC70YzQt9C+0LLQsNGC0LXQu9C4XCIsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZUlkOiBcInVzZXJzLXNlYXJjaC10ZW1wbGF0ZVwiLFxuXHRcdFx0XHRcdFx0ZGF0YTogcmVzcG9uc2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRhY3RpdmF0ZUZvcm0oKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImVycm9yXCIsIHJlc3BvbnNlLm1ldGEubWVzc2FnZSlcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59KSgpO1xuKGZ1bmN0aW9uKCkge1xuXHRmb3J1bS5zaG93VGhlbWUgPSBmdW5jdGlvbih1cmwpIHtcblx0XHQvLyDQpNC+0YDQvNCw0YIgdXJsOiB7c2VjdGlvbn0ve3RoZW1lSWR9Wy9wYWdlL3twYWdlfV1cblxuXHRcdHZhciB1cmxBcnIgPSB1cmwuc3BsaXQoXCIvXCIpO1xuXHRcdHZhciB0aGVtZVVybCA9IHVybEFyclswXSArIFwiL1wiICsgdXJsQXJyWzFdO1xuXG5cdFx0dmFyIG1zZ3NDb3VudCA9IDIwO1xuXHRcdHZhciBjdXJQYWdlID0gKHVybEFyclszXSAqIDEpIHx8IDE7XG5cdFx0aWYgKCFjdXJQYWdlIHx8IGN1clBhZ2UgPCAxKSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoXCJwYWdlL1wiICsgY3VyUGFnZSwgXCJwYWdlLzFcIik7XG5cdFx0fVxuXG5cdFx0dmFyIHRoZW1lSWQgPSB1cmxBcnJbMV07XG5cdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRtZXRob2Q6IFwiR0VUXCIsXG5cdFx0XHR1cmw6IGZvcnVtLnNlcnZlckhvc3QgKyBcIi90aGVtZXMvXCIgKyB0aGVtZUlkLFxuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcIkF1dGgtVG9rZW5cIjogZm9ydW0uZ2V0Q29va2llKFwiYXV0aC10b2tlblwiKSB8fCBcIlwiXG5cdFx0XHR9LFxuXHRcdFx0cGFyYW1zOiB7XG5cdFx0XHRcdGNvdW50OiBtc2dzQ291bnQsXG5cdFx0XHRcdG9mZnNldDogbXNnc0NvdW50ICogY3VyUGFnZSAtIG1zZ3NDb3VudFxuXHRcdFx0fSxcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXG5cdFx0XHRcdGlmIChyZXNwb25zZS5kYXRhLm1lc3NhZ2VzQ291bnQpIHtcblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLm1lc3NhZ2VzRXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBsYXN0UGFnZSA9IE1hdGguY2VpbChyZXNwb25zZS5kYXRhLm1lc3NhZ2VzQ291bnQgLyBtc2dzQ291bnQpIHx8IDE7XG5cdFx0XHRcdGlmIChsYXN0UGFnZSA8PSBjdXJQYWdlKSB7XG5cdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKFwicGFnZS9cIiArIGN1clBhZ2UsIFwicGFnZS9cIiArIGxhc3RQYWdlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXNwb25zZS5wYWdlciA9IGxhc3RQYWdlID4gMSA/IGZvcnVtLm1ha2VQYWdlcihjdXJQYWdlLCBsYXN0UGFnZSwgXCIjL1wiICsgdGhlbWVVcmwpIDogXCJcIjtcblxuXHRcdFx0XHRyZXNwb25zZS5kYXRhLmRhdGUgPSBmb3J1bS5tYWtlRGF0ZVN0cihyZXNwb25zZS5kYXRhLmRhdGUpO1xuXG5cdFx0XHRcdHZhciBsID0gcmVzcG9uc2UuZGF0YS5tZXNzYWdlcy5sZW5ndGg7XG5cdFx0XHRcdHZhciBhcnIgPSByZXNwb25zZS5kYXRhLm1lc3NhZ2VzO1xuXG5cdFx0XHRcdC8vINCS0L7RgiDRgtGD0YIg0YLQvtC20LUg0L3QsNC00L4g0LHRg9C00LXRgiDQv9C+0L/RgNC+0LHQvtCy0LDRgtGMINC+0L/RgtC40LzQuNC30LjRgNC+0LLQsNGC0YxcblxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdGFycltpXS5tZXNzYWdlID0gbWFya2VkKGZvcnVtLmVzY2FwZShhcnJbaV0ubWVzc2FnZSkpO1xuXHRcdFx0XHRcdC8vIGFycltpXS5tZXNzYWdlID0gbWFya2VkKGFycltpXS5tZXNzYWdlKTtcblx0XHRcdFx0XHRhcnJbaV0uZGF0ZSA9IGZvcnVtLm1ha2VEYXRlU3RyKGFycltpXS5kYXRlKTtcblx0XHRcdFx0XHRhcnJbaV0uYXZhdGFyRXhpc3RzID0gISFhcnJbaV0uYXV0aG9yLmF2YXRhcjtcblx0XHRcdFx0XHRpZiAoIChmb3J1bS5sb2dpbm5lZCAmJiAoZm9ydW0uZ2V0Q29va2llKFwibmlja25hbWVcIikgPT09IGFycltpXS5hdXRob3Iubmlja25hbWUpKSB8fCBmb3J1bS5yaWdodHMgPT09IFwiYWRtaW5cIiB8fCBmb3J1bS5yaWdodHMgPT09IFwibW9kZXJhdG9yXCIpIHtcblx0XHRcdFx0XHRcdGFycltpXS5zaG93RGVsZXRlQnRuID0gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YXJyW2ldLnNob3dEZWxldGVCdG4gPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3dpdGNoIChhcnJbaV0ubGlrZWQpIHtcblx0XHRcdFx0XHRcdGNhc2UgdHJ1ZTpcblx0XHRcdFx0XHRcdFx0YXJyW2ldLnZvdGVkVXAgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgZmFsc2U6XG5cdFx0XHRcdFx0XHRcdGFycltpXS52b3RlZERvd24gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXNwb25zZS5kYXRhLnNob3dNZXNzYWdlRm9ybSA9IGZvcnVtLmxvZ2lubmVkO1xuXG5cdFx0XHRcdC8vIC0tLS0tLS0tLS1cblxuXHRcdFx0XHRmb3J1bS5jaGFuZ2VWaWV3KHtcblx0XHRcdFx0XHR0aXRsZTogcmVzcG9uc2UuZGF0YS50aXRsZSxcblx0XHRcdFx0XHR0ZW1wbGF0ZUlkOiBcInRoZW1lLXRlbXBsYXRlXCIsXG5cdFx0XHRcdFx0ZGF0YTogcmVzcG9uc2UsXG5cdFx0XHRcdFx0YWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGZvcnVtLnRoZW1lTW9kdWxlKHRoZW1lVXJsLCB0aGVtZUlkLCBtc2dzQ291bnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRmb3J1bS5hZGRUaGVtZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChmb3J1bS5sb2dpbm5lZCkge1xuXHRcdFx0Zm9ydW0uY2hhbmdlVmlldyh7XG5cdFx0XHRcdHRpdGxlOiBcItCh0L7Qt9C00LDQvdC40LUg0YLQtdC80YtcIixcblx0XHRcdFx0dGVtcGxhdGVJZDogXCJhZGQtdGhlbWUtdGVtcGxhdGVcIixcblx0XHRcdFx0Y29uZnM6IHtcblx0XHRcdFx0XHRtZXRob2Q6IFwiR0VUXCIsXG5cdFx0XHRcdFx0dXJsOiBmb3J1bS5zZXJ2ZXJIb3N0ICsgXCIvc2VjdGlvbnNcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRhY3Rpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGQtdGhlbWUtZm9ybVwiKTtcblx0XHRcdFx0XHRmb3J1bS5hZGRMaXN0ZW5lcihmb3JtLCBcInN1Ym1pdFwiLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdFx0dmFyIHRhZ3MgPSBmb3JtLnRhZ3MudmFsdWUucmVwbGFjZSgvICArL2csIFwiIFwiKS5zcGxpdCgvLCA/Lyk7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbCA9IHRhZ3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHRhZ3NbaV0gPSB7bmFtZTogdGFnc1tpXX07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmb3J1bS5hamF4KHtcblx0XHRcdFx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcblx0XHRcdFx0XHRcdFx0dXJsOiBmb3J1bS5zZXJ2ZXJIb3N0ICsgXCIvdGhlbWVzXCIsXG5cdFx0XHRcdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHRcdFx0XHRcIkF1dGgtVG9rZW5cIjogZm9ydW0uZ2V0Q29va2llKFwiYXV0aC10b2tlblwiKSB8fCBcIlwiXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGJvZHk6IHtcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogZm9ybS50aXRsZS52YWx1ZSxcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBmb3JtLm1lc3NhZ2UudmFsdWUsXG5cdFx0XHRcdFx0XHRcdFx0c2VjdGlvblVybDogZm9ybS5zZWN0aW9uLnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRcdHRhZ3M6IHRhZ3Ncblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJzdWNjZXNzXCIsIFwi0KLQtdC80LAg0YHQvtC30LTQsNC90LBcIik7XG5cdFx0XHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBcIiMvXCIgKyBmb3JtLnNlY3Rpb24udmFsdWUgKyBcIi9cIiArIHJlc3BvbnNlLmRhdGEudGhlbWVJZDtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9ydW0ubm90aWZ5KFwiZXJyb3JcIiwgcmVzcG9uc2UubWV0YS5tZXNzYWdlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwibWFpblwiO1xuXHRcdH1cblx0fVxuXG5cdGZvcnVtLnRoZW1lTW9kdWxlID0gZnVuY3Rpb24odGhlbWVVcmwsIHRoZW1lSWQsIG1zZ3NDb3VudCkge1xuXHRcdC8vINCk0L7RgNC80LDRgiB1cmw6IHtzZWN0aW9ufS97dGhlbWVJZH1cblxuXHRcdHZhciByZXF1ZXN0VXJsID0gXCJ0aGVtZXMvXCIgKyB0aGVtZUlkO1xuXHRcdHZhciBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGQtbWVzc2FnZS1mb3JtXCIpO1xuXG5cdFx0Zm9ydW0uYWRkTGlzdGVuZXIod2luZG93LCBmb3J1bS5jbGlja09yVG91Y2gsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRpZiAoZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcImRhdGEtZGVsZXRlLW1zZy1idG5cIikpIHtcblx0XHRcdFx0aWYgKGNvbmZpcm0oXCLQo9C00LDQu9C40YLRjCDRgdC+0L7QsdGJ0LXQvdC40LU/XCIpKSB7XG5cdFx0XHRcdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRcdFx0XHRtZXRob2Q6IFwiREVMRVRFXCIsXG5cdFx0XHRcdFx0XHR1cmw6IGZvcnVtLnNlcnZlckhvc3QgKyBcIi9tZXNzYWdlcy9cIiArIGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhcmdldFwiKSxcblx0XHRcdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHRcdFx0XCJBdXRoLVRva2VuXCI6IGZvcnVtLmdldENvb2tpZShcImF1dGgtdG9rZW5cIikgfHwgXCJcIlxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJpbmZvXCIsIFwi0KHQvtC+0LHRidC10L3QuNC1INGD0LTQsNC70LXQvdC+XCIpO1xuXHRcdFx0XHRcdFx0XHRmb3J1bS5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRcdFx0Zm9ydW0ubm90aWZ5KFwiZXJyb3JcIiwgXCLQndC1INGD0LTQsNC70L7RgdGMINGD0LTQsNC70LjRgtGMINGB0L7QvtCx0YnQtdC90LjQtTogXCIgKyByZXNwb25zZS5tZXRhLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXZvdGUtdGFyZ2V0XCIpKSB7XG5cblx0XHRcdFx0Ly8g0JfQtNC10YHRjCDQutCw0Lot0YLQviDQvtGH0LXQvdGMINC80L3QvtCz0L4g0LrQvtC00LAsINC90LDQtNC+INCx0YPQtNC10YIg0L7Qv9GC0LjQvNC40LfQuNGA0L7QstCw0YLRjFxuXG5cdFx0XHRcdGlmIChmb3J1bS5sb2dpbm5lZCkge1xuXHRcdFx0XHRcdHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS12b3RlLXRhcmdldFwiKTtcblx0XHRcdFx0XHR2YXIgYnRucyA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS12b3RlLXRhcmdldF1cIik7XG5cdFx0XHRcdFx0dmFyIGdyYWRlID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtdm90ZS12YWx1ZVwiKSA/IHRydWUgOiBmYWxzZTtcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicmF0aW5nLXZhbHVlXCIpWzBdO1xuXHRcdFx0XHRcdGZvcnVtLmFqYXgoe1xuXHRcdFx0XHRcdFx0aGlkZGVuOiB0cnVlLFxuXHRcdFx0XHRcdFx0bWV0aG9kOiBcIlBVVFwiLFxuXHRcdFx0XHRcdFx0dXJsOiBmb3J1bS5zZXJ2ZXJIb3N0ICsgXCIvbWVzc2FnZXMvXCIgKyB0YXJnZXQgKyBcIi9yYXRpbmdcIixcblx0XHRcdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHRcdFx0XCJBdXRoLVRva2VuXCI6IGZvcnVtLmdldENvb2tpZShcImF1dGgtdG9rZW5cIilcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHtcblx0XHRcdFx0XHRcdFx0Z3JhZGU6IGdyYWRlXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChncmFkZSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChidG5zWzFdLmNsYXNzTGlzdC5jb250YWlucyhcInJlZFwiKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0YnRuc1swXS5jbGFzc0xpc3QucmVtb3ZlKFwiZ3JlZW5cIik7XG5cdFx0XHRcdFx0XHRcdFx0XHRidG5zWzFdLmNsYXNzTGlzdC5yZW1vdmUoXCJyZWRcIik7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGJ0bnNbMF0uY2xhc3NMaXN0LmFkZChcImdyZWVuXCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnRuc1sxXS5jbGFzc0xpc3QucmVtb3ZlKFwicmVkXCIpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5pbm5lckhUTUwgPSB2YWx1ZS5pbm5lckhUTUwgKiAxICsgMTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYnRuc1swXS5jbGFzc0xpc3QuY29udGFpbnMoXCJncmVlblwiKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0YnRuc1sxXS5jbGFzc0xpc3QucmVtb3ZlKFwicmVkXCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnRuc1swXS5jbGFzc0xpc3QucmVtb3ZlKFwiZ3JlZW5cIik7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGJ0bnNbMV0uY2xhc3NMaXN0LmFkZChcInJlZFwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJ0bnNbMF0uY2xhc3NMaXN0LnJlbW92ZShcImdyZWVuXCIpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5pbm5lckhUTUwgPSB2YWx1ZS5pbm5lckhUTUwgKiAxIC0gMTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGVycm9yOiBmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCByZXNwb25zZS5tZXRhLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImluZm9cIiwgXCLQktC+0LnQtNC40YLQtSDQsiDRgdC40YHRgtC10LzRgywg0YfRgtC+0LHRiyDQs9C+0LvQvtGB0L7QstCw0YLRjFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKGZvcm0pIHtcblx0XHRcdGZvcnVtLmFkZExpc3RlbmVyKGZvcm0sIFwic3VibWl0XCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGZvcnVtLmFqYXgoe1xuXHRcdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRcdFx0dXJsOiBmb3J1bS5zZXJ2ZXJIb3N0ICsgXCIvXCIgKyByZXF1ZXN0VXJsLFxuXHRcdFx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRcdFx0Y291bnQ6IG1zZ3NDb3VudFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdFx0XCJBdXRoLVRva2VuXCI6IGZvcnVtLmdldENvb2tpZShcImF1dGgtdG9rZW5cIikgfHwgXCJcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Ym9keToge1xuXHRcdFx0XHRcdFx0bWVzc2FnZTogZm9ybS5tZXNzYWdlLnZhbHVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0Zm9ydW0ubm90aWZ5KFwic3VjY2Vzc1wiLCBcItCh0L7QvtCx0YnQtdC90LjQtSDQtNC+0LHQsNCy0LvQtdC90L5cIik7XG5cdFx0XHRcdFx0XHR2YXIgbmV3SGFzaCA9IFwiIy9cIiArIHRoZW1lVXJsICsgXCIvcGFnZS9cIiArIChNYXRoLmNlaWwocmVzcG9uc2UuZGF0YS5tZXNzYWdlc0NvdW50IC8gbXNnc0NvdW50KSB8fCAxKTtcblx0XHRcdFx0XHRcdGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCA9PT0gbmV3SGFzaCkge1xuXHRcdFx0XHRcdFx0XHRmb3J1bS5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCIjL1wiICsgdGhlbWVVcmwgKyBcIi9wYWdlL1wiICsgKE1hdGguY2VpbChyZXNwb25zZS5kYXRhLm1lc3NhZ2VzQ291bnQgLyBtc2dzQ291bnQpIHx8IDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCByZXNwb25zZS5tZXRhLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZvcnVtLnRoZW1lc1NlYXJjaCA9IGZ1bmN0aW9uKHVybCkge1xuXHRcdC8vIHVybCDQstC40LTQsCB0aGVtZXNbL3NlYXJjaD17cXVlcnl9Wy9wYWdlL3twYWdlfV1dXG5cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZUZvcm0oKSB7XG5cdFx0XHR2YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGhlbWVzLXNlYXJjaC1mb3JtXCIpO1xuXHRcdFx0dmFyIGlucHV0ID0gZm9ybVtcInRoZW1lcy1zZWFyY2gtaW5wdXRcIl07XG5cdFx0XHRpZiAoZm9ydW0uY2xpY2tPclRvdWNoID09PSBcImNsaWNrXCIpIHtcblx0XHRcdFx0aW5wdXQuZm9jdXMoKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9ydW0uYWRkTGlzdGVuZXIoZm9ybSwgXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCIjdGhlbWVzL3NlYXJjaD1cIiArIGlucHV0LnZhbHVlO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dmFyIHVybEFyciA9IHVybC5zcGxpdChcIi9cIik7XG5cdFx0dmFyIHRoZW1lc0NvdW50ID0gMzA7XG5cblx0XHRpZiAodXJsQXJyWzFdICYmIHVybEFyclsxXS5pbmRleE9mKFwic2VhcmNoPVwiKSA9PT0gMCkge1xuXHRcdFx0dmFyIHF1ZXJ5ID0gZGVjb2RlVVJJKHVybEFyclsxXS5zbGljZSg3KSk7XG5cdFx0XHR2YXIgcGFyYW1zID0ge1xuXHRcdFx0XHRmaW5kOiBxdWVyeSxcblx0XHRcdFx0Y291bnQ6IHRoZW1lc0NvdW50XG5cdFx0XHR9XG5cdFx0XHR2YXIgY3VyUGFnZSA9IHVybEFyclszXSB8fCAxO1xuXHRcdFx0aWYgKCFjdXJQYWdlIHx8IGN1clBhZ2UgPCAxKSB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShcInBhZ2UvXCIgKyBjdXJQYWdlLCBcInBhZ2UvMVwiKTtcblx0XHRcdH1cblx0XHRcdHBhcmFtcy5vZmZzZXQgPSB0aGVtZXNDb3VudCAqIGN1clBhZ2UgLSB0aGVtZXNDb3VudDtcblx0XHRcdGZvcnVtLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6IFwiR0VUXCIsXG5cdFx0XHRcdHVybDogZm9ydW0uc2VydmVySG9zdCArIFwiL3RoZW1lc1wiLFxuXHRcdFx0XHRwYXJhbXM6IHBhcmFtcyxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm1ldGEuY291bnQgPiAwKSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLnRoZW1lc0V4aXN0ID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIGxhc3RQYWdlID0gTWF0aC5jZWlsKHJlc3BvbnNlLm1ldGEuY291bnQgLyB0aGVtZXNDb3VudCkgfHwgMTtcblxuXHRcdFx0XHRcdGlmIChsYXN0UGFnZSA8PSBjdXJQYWdlKSB7XG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoXCJwYWdlL1wiICsgY3VyUGFnZSwgXCJwYWdlL1wiICsgbGFzdFBhZ2UpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBjb3JlVXJsID0gdXJsQXJyWzBdICsgXCIvXCIgKyB1cmxBcnJbMV07XG5cdFx0XHRcdFx0cmVzcG9uc2UucGFnZXIgPSBsYXN0UGFnZSA+IDEgPyBmb3J1bS5tYWtlUGFnZXIoY3VyUGFnZSwgbGFzdFBhZ2UsIGNvcmVVcmwpIDogXCJcIjtcblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLnNlYXJjaFF1ZXJ5ID0gcXVlcnk7XG5cdFx0XHRcdFx0dmFyIGFyciA9IHJlc3BvbnNlLmRhdGE7XG5cblx0XHRcdFx0XHRmb3IgKHZhciBpID0gYXJyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRhcnJbaV0uZGF0ZSA9IGZvcnVtLm1ha2VEYXRlU3RyKGFycltpXS5kYXRlKTtcblx0XHRcdFx0XHRcdGlmICggKGZvcnVtLmxvZ2lubmVkICYmIChmb3J1bS5nZXRDb29raWUoXCJuaWNrbmFtZVwiKSA9PT0gYXJyW2ldLm5pY2tuYW1lKSkgfHwgZm9ydW0ucmlnaHRzID09PSBcImFkbWluXCIgfHwgZm9ydW0ucmlnaHRzID09PSBcIm1vZGVyYXRvclwiKSB7XG5cdFx0XHRcdFx0XHRcdGFycltpXS5zaG93RGVsZXRlQnRuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGFycltpXS5zaG93RGVsZXRlQnRuID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Zm9ydW0uYWRkTGlzdGVuZXIod2luZG93LCBmb3J1bS5jbGlja09yVG91Y2gsIGZvcnVtLmRlbGV0ZVRoZW1lKTtcblxuXHRcdFx0XHRcdGZvcnVtLmNoYW5nZVZpZXcoe1xuXHRcdFx0XHRcdFx0dGl0bGU6IFwi0KLQtdC80YtcIixcblx0XHRcdFx0XHRcdHRlbXBsYXRlSWQ6IFwidGhlbWVzLXNlYXJjaC10ZW1wbGF0ZVwiLFxuXHRcdFx0XHRcdFx0ZGF0YTogcmVzcG9uc2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRhY3RpdmF0ZUZvcm0oKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImVycm9yXCIsIHJlc3BvbnNlLm1ldGEubWVzc2FnZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFyYW1zID0ge1xuXHRcdFx0XHRjb3VudDogdGhlbWVzQ291bnRcblx0XHRcdH1cblx0XHRcdHZhciBjdXJQYWdlID0gdXJsQXJyWzJdIHx8IDE7XG5cdFx0XHRpZiAoIWN1clBhZ2UgfHwgY3VyUGFnZSA8IDEpIHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKFwicGFnZS9cIiArIGN1clBhZ2UsIFwicGFnZS8xXCIpO1xuXHRcdFx0fVxuXHRcdFx0cGFyYW1zLm9mZnNldCA9IHRoZW1lc0NvdW50ICogY3VyUGFnZSAtIHRoZW1lc0NvdW50O1xuXHRcdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogXCJHRVRcIixcblx0XHRcdFx0dXJsOiBmb3J1bS5zZXJ2ZXJIb3N0ICsgXCIvdGhlbWVzXCIsXG5cdFx0XHRcdHBhcmFtczogcGFyYW1zLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRpZiAocmVzcG9uc2UubWV0YS5jb3VudCA+IDApIHtcblx0XHRcdFx0XHRcdHJlc3BvbnNlLmRhdGEudGhlbWVzRXhpc3QgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbGFzdFBhZ2UgPSBNYXRoLmNlaWwocmVzcG9uc2UubWV0YS5jb3VudCAvIHRoZW1lc0NvdW50KSB8fCAxO1xuXG5cdFx0XHRcdFx0aWYgKGxhc3RQYWdlIDw9IGN1clBhZ2UpIHtcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShcInBhZ2UvXCIgKyBjdXJQYWdlLCBcInBhZ2UvXCIgKyBsYXN0UGFnZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIGNvcmVVcmwgPSB1cmxBcnJbMF07XG5cdFx0XHRcdFx0cmVzcG9uc2UucGFnZXIgPSBsYXN0UGFnZSA+IDEgPyBmb3J1bS5tYWtlUGFnZXIoY3VyUGFnZSwgbGFzdFBhZ2UsIGNvcmVVcmwpIDogXCJcIjtcblx0XHRcdFx0XHR2YXIgYXJyID0gcmVzcG9uc2UuZGF0YTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdGFycltpXS5kYXRlID0gZm9ydW0ubWFrZURhdGVTdHIoYXJyW2ldLmRhdGUpO1xuXHRcdFx0XHRcdFx0aWYgKCAoZm9ydW0ubG9naW5uZWQgJiYgZm9ydW0uZ2V0Q29va2llKFwibmlja25hbWVcIikgPT09IGFycltpXS5uaWNrbmFtZSkgfHwgZm9ydW0ucmlnaHRzID09PSBcImFkbWluXCIgfHwgZm9ydW0ucmlnaHRzID09PSBcIm1vZGVyYXRvclwiKSB7XG5cdFx0XHRcdFx0XHRcdGFycltpXS5zaG93RGVsZXRlQnRuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGFycltpXS5zaG93RGVsZXRlQnRuID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Zm9ydW0uYWRkTGlzdGVuZXIod2luZG93LCBmb3J1bS5jbGlja09yVG91Y2gsIGZvcnVtLmRlbGV0ZVRoZW1lKTtcblxuXHRcdFx0XHRcdGZvcnVtLmNoYW5nZVZpZXcoe1xuXHRcdFx0XHRcdFx0dGl0bGU6IFwi0KLQtdC80YtcIixcblx0XHRcdFx0XHRcdHRlbXBsYXRlSWQ6IFwidGhlbWVzLXNlYXJjaC10ZW1wbGF0ZVwiLFxuXHRcdFx0XHRcdFx0ZGF0YTogcmVzcG9uc2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRhY3RpdmF0ZUZvcm0oKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImVycm9yXCIsIHJlc3BvbnNlLm1ldGEubWVzc2FnZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZvcnVtLmRlbGV0ZVRoZW1lID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcImRhdGEtZGVsZXRlLXRoZW1lLWJ0blwiKSkge1xuXHRcdFx0aWYgKGNvbmZpcm0oXCLQo9C00LDQu9C40YLRjCDRgtC10LzRgz9cIikpIHtcblx0XHRcdFx0Zm9ydW0uYWpheCh7XG5cdFx0XHRcdFx0bWV0aG9kOiBcIkRFTEVURVwiLFxuXHRcdFx0XHRcdHVybDogZm9ydW0uc2VydmVySG9zdCArIFwiL3RoZW1lcy9cIiArIGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhcmdldFwiKSxcblx0XHRcdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdFx0XHRcIkF1dGgtVG9rZW5cIjogZm9ydW0uZ2V0Q29va2llKFwiYXV0aC10b2tlblwiKSB8fCBcIlwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGZvcnVtLm5vdGlmeShcImluZm9cIiwgXCLQotC10LzQsCDRg9C00LDQu9C10L3QsFwiKTtcblx0XHRcdFx0XHRcdGZvcnVtLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCd0LUg0YPQtNCw0LvQvtGB0Ywg0YPQtNCw0LvQuNGC0Ywg0YLQtdC80YM6IFwiICsgcmVzcG9uc2UubWV0YS5tZXNzYWdlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRmb3J1bS5zZWN0aW9uTW9kdWxlID0gZnVuY3Rpb24odXJsKSB7XG5cdFx0Ly8gdXJsINCy0LjQtNCwIHtzZWN0aW9ufVsvcGFnZS97cGFnZX0gfCAve3RoZW1lLWlkfV0uLi5cblxuXHRcdHZhciBzaCA9IHVybC5zcGxpdChcIi9cIik7XG5cdFx0dmFyIHNlY3Rpb24gPSBzaFswXTsgLy8ge3NlY3Rpb259XG5cdFx0dmFyIHVybF8xID0gc2hbMV07IC8vIFwicGFnZVwiIHwge3RoZW1lLWlkfVxuXHRcdHZhciBjdXJQYWdlID0gKHNoWzJdICogMSkgfHwgMTtcblx0XHRpZiAoc2VjdGlvbiA9PT0gXCJhZGQtdGhlbWVcIikge1xuXHRcdFx0Zm9ydW0uYWRkVGhlbWUoKTtcblx0XHR9IGVsc2UgaWYgKHVybF8xICogMSkge1xuXHRcdFx0Zm9ydW0uc2hvd1RoZW1lKHVybCk7XG5cdFx0fSBlbHNlIGlmICh1cmxfMSA9PT0gXCJwYWdlXCIgfHwgdXJsXzEgPT09IHVuZGVmaW5lZCB8fCB1cmxfMSA9PT0gXCJcIikge1xuXHRcdFx0aWYgKCFjdXJQYWdlIHx8IGN1clBhZ2UgPCAxKSB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCIjL1wiICsgc2VjdGlvbiArIFwiL3BhZ2UvMVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2hvd1RoZW1lc0xpc3QoY3VyUGFnZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvcnVtLmNoYW5nZVZpZXcoZm9ydW0ucGFnZXNbXCIjNDA0XCJdKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzaG93VGhlbWVzTGlzdChwYWdlKSB7XG5cdFx0XHR2YXIgdGhlbWVzQ291bnQgPSAzMDtcblx0XHRcdGZvcnVtLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6IFwiR0VUXCIsXG5cdFx0XHRcdHVybDogZm9ydW0uc2VydmVySG9zdCArIFwiL3RoZW1lc1wiLFxuXHRcdFx0XHRwYXJhbXM6IHtcblx0XHRcdFx0XHRjb3VudDogdGhlbWVzQ291bnQsXG5cdFx0XHRcdFx0b2Zmc2V0OiB0aGVtZXNDb3VudCAqIHBhZ2UgLSB0aGVtZXNDb3VudCxcblx0XHRcdFx0XHRcInNlY3Rpb24tdXJsXCI6IHNlY3Rpb25cblx0XHRcdFx0fSxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0cmVzcG9uc2UuZ2V0VXJsID0gXCIjL1wiICsgc2VjdGlvbjtcblxuXHRcdFx0XHRcdHZhciBsYXN0UGFnZSA9IE1hdGguY2VpbChyZXNwb25zZS5tZXRhLmNvdW50IC8gdGhlbWVzQ291bnQpIHx8IDE7XG5cdFx0XHRcdFx0aWYgKGxhc3RQYWdlIDw9IHBhZ2UpIHtcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShcInBhZ2UvXCIgKyBwYWdlLCBcInBhZ2UvXCIgKyBsYXN0UGFnZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc3BvbnNlLnBhZ2VyID0gbGFzdFBhZ2UgPiAxID8gZm9ydW0ubWFrZVBhZ2VyKHBhZ2UsIGxhc3RQYWdlLCBcIiMvXCIgKyBzZWN0aW9uKSA6IFwiXCI7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLm1ldGEuY291bnQgKiAxID4gMCkge1xuXHRcdFx0XHRcdFx0cmVzcG9uc2UudGhlbWVzRXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyDQl9C00LXRgdGMINGB0LrRgNC40L/RgiDQv9GA0L7RhdC+0LTQuNGCINC/0L4g0LLRgdC10Lwg0YLQtdC80LDQvCDQuCDQutC+0L3QstC10YDRgtC40YDRg9C10YIg0YfQuNGB0LvQsCByZXNwb25zZS5kYXRhW10uZGF0ZVxuXHRcdFx0XHRcdC8vINGB0YLRgNC+0LrQuCDQstC40LTQsCBcIjEg0Y/QvdCy0LDRgNGPIDIwMDBcIiwg0LLQvtC30LzQvtC20L3Qviwg0Y3RgtC+INC80L7QttC90L4g0YHQtNC10LvQsNGC0Ywg0LHQvtC70LXQtSDRjdGE0YTQtdC60YLQuNCy0L3QvlxuXG5cdFx0XHRcdFx0dmFyIGwgPSByZXNwb25zZS5kYXRhLmxlbmd0aDtcblx0XHRcdFx0XHR2YXIgYXJyID0gcmVzcG9uc2UuZGF0YTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRhcnJbaV0uZGF0ZSA9IGZvcnVtLm1ha2VEYXRlU3RyKGFycltpXS5kYXRlKTtcblx0XHRcdFx0XHRcdGlmICggKGZvcnVtLmxvZ2lubmVkICYmIChmb3J1bS5nZXRDb29raWUoXCJuaWNrbmFtZVwiKSA9PT0gYXJyW2ldLm5pY2tuYW1lKSkgfHwgZm9ydW0ucmlnaHRzID09PSBcImFkbWluXCIgfHwgZm9ydW0ucmlnaHRzID09PSBcIm1vZGVyYXRvclwiKSB7XG5cdFx0XHRcdFx0XHRcdGFycltpXS5zaG93RGVsZXRlQnRuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGFycltpXS5zaG93RGVsZXRlQnRuID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gLS0tLS0tLS0tLVxuXG5cdFx0XHRcdFx0Zm9ydW0uYWRkTGlzdGVuZXIod2luZG93LCBmb3J1bS5jbGlja09yVG91Y2gsIGZvcnVtLmRlbGV0ZVRoZW1lKTtcblxuXHRcdFx0XHRcdGZvcnVtLmNoYW5nZVZpZXcoe1xuXHRcdFx0XHRcdFx0dGl0bGU6IHJlc3BvbnNlLmRhdGEuc2VjdGlvbixcblx0XHRcdFx0XHRcdHRlbXBsYXRlSWQ6IFwidGhlbWVzLWxpc3QtdGVtcGxhdGVcIixcblx0XHRcdFx0XHRcdGRhdGE6IHJlc3BvbnNlLFxuXHRcdFx0XHRcdFx0YWN0aW9uOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBhZGRUaGVtZUJ0bnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYWRkLXRoZW1lLWJ0blwiKTtcblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IGFkZFRoZW1lQnRucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0XHRcdGZvcnVtLmFkZExpc3RlbmVyKGFkZFRoZW1lQnRuc1tpXSwgZm9ydW0uY2xpY2tPclRvdWNoLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCIjL2FkZC10aGVtZVwiO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVycm9yOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRmb3J1bS5ub3RpZnkoXCJlcnJvclwiLCBcItCn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi5cIik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufSkoKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcblx0Zm9ydW0uaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHRcdGZvcnVtLnJlcXVlc3RHb2luZyA9IGZhbHNlO1xuXHRcdFx0Zm9ydW0ucm91dGUod2luZG93LmxvY2F0aW9uLmhhc2gpO1xuXHRcdH0pO1xuXG5cdFx0Zm9ydW0ucm91dGUod2luZG93LmxvY2F0aW9uLmhhc2gpO1xuXHR9XG5cblx0Zm9ydW0uaW5pdCgpO1xufSk7Il0sImZpbGUiOiJtYWluLmpzIn0=
