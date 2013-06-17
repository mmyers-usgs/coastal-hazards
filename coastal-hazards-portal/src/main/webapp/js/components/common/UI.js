var CCH = CCH || {};
CCH.Objects.UI = function(args) {
	CCH.LOG.info('UI.js::constructor: UI class is initializing.');
	var me = (this === window) ? {} : this;
	me.search;
	me.mapdiv = args.mapdiv;
	me.descriptionDiv = args.descriptionDiv;
	me.magicResizeNumber = 767;
	me.minimumHeight = args.minimumHeight || 480;
	me.previousWidth = $(window).width();
	me.currentSizing = '';
	me.navbarPinButton = args.navbarPinButton;
	me.navbarPinDropdownButton = args.navbarDropdownIcon;
	me.navbarClearMenuItem = args.navbarClearMenuItem;
	me.navbarShareMenuListItem = args.navbarShareMenuListItem;
	me.applicationContainer = args.applicationContainer;
	me.headerRow = args.headerRow;
	me.footerRow = args.footerRow;
	me.mapSearchContainer = args.mapSearchContainer;
	me.itemSearchModalWindow = args.itemSearchModalWindow;

	CCH.LOG.debug('UI.js::constructor: UI class initialized.');
	return $.extend(me, {
		init: function() {
			me.bindNavbarPinMenu();
			me.bindWindowResize();

			var currWidth = me.previousWidth;
			if (currWidth <= me.magicResizeNumber) {
				me.currentSizing = 'small';
			} else if (currWidth > me.magicResizeNumber) {
				me.currentSizing = 'large';
			}

			$(window).resize();
			return me;
		},
		bindNavbarPinMenu: function() {
			me.navbarPinButton.on('click', function() {
				// Check to see if any cards are pinned
				var isButtonToggledOn = !$('#app-navbar-pin-control-icon').hasClass('muted');
				var pinnedCardIds = CCH.session.getPinnedIds();
				var pinnedResults = null;

				if (pinnedCardIds.length) {
					// Pinned cards available - toggle the button on/off
					$('#app-navbar-pin-control-icon').toggleClass('muted');
					if (!isButtonToggledOn) {
					// If cards are pinned, show only pinned cards
					// Otherwise, show all cards
					pinnedResults = [];
					for (var pcIdx = 0; pcIdx < pinnedCardIds.length; pcIdx++) {
						var id = pinnedCardIds[pcIdx];
						pinnedResults.push(CCH.CONFIG.popularity.results.find(function(result) {
							return result.id === id;
						}));
					}
					CCH.map.zoomToActiveLayers();
				}
				}

				// pinnedResults may or may not be an empty array. If it is, 
				// the full deck will be seen. Otherwise, if pinnedResults is
				// populated, only pinned cards will be seen
				me.createSlideshow({
					results: pinnedResults
				});

				$(window).trigger('cch.navbar.pinmenu.button.pin.click');
			});

			me.navbarClearMenuItem.on('click', function() {
				$(window).trigger('cch.navbar.pinmenu.item.clear.click');
				me.createSlideshow();
			});
		},
		bindWindowResize: function() {
			$(window).resize(function() {
				var currWidth = $(window).width();
				var contentRowHeight = $(window).height() - me.headerRow.height() - me.footerRow.height();

				if (contentRowHeight < me.minimumHeight) {
					contentRowHeight = me.minimumHeight;
				}

				var updated = false;
				if (me.previousWidth > me.magicResizeNumber && currWidth <= me.magicResizeNumber) {
					CCH.LOG.debug('resize-small');
					me.currentSizing = 'small';
					updated = true;
				} else if (me.previousWidth <= me.magicResizeNumber && currWidth > me.magicResizeNumber) {
					CCH.LOG.debug('resize-large');
					me.currentSizing = 'large';
					updated = true;
				}

				if (me.currentSizing === 'small') {
					$('body').css({
						'padding-left': '0px',
						'padding-right': '0px'
					});
					me.applicationContainer.css({
						'padding-left': '0px',
						'padding-right': '0px'
					});
					var descriptionHeight = Math.round(contentRowHeight * .30);
					if (descriptionHeight < 280) {
						descriptionHeight = 280;
					}
					me.descriptionDiv.height(descriptionHeight);
					me.mapdiv.height(contentRowHeight - descriptionHeight);

				} else if (me.currentSizing === 'large') {
					$('body').css({
						'padding-left': '20px',
						'padding-right': '20px'
					});
					me.applicationContainer.css({
						'padding-left': '20px',
						'padding-right': '20px'
					});
					me.mapdiv.height(contentRowHeight);
					me.descriptionDiv.height(contentRowHeight);
				}

				if (updated) {
					$(window).trigger('cch.ui.resized', me.currentSizing);
					me.createSlideshow();
				}

				var mapPosition = me.mapdiv.position();
				var mapHeight = me.mapdiv.height();
				var mapWidth = me.mapdiv.width();

				var searchContainerHeight = me.mapSearchContainer.height();
				var searchContainerWidth = me.mapSearchContainer.width();
				me.mapSearchContainer.css({
					top: mapPosition.top + mapHeight - searchContainerHeight - 10,
					left: mapPosition.left + mapWidth - searchContainerWidth - 20,
					zIndex: 1004
				})

				me.previousWidth = currWidth;
			});
		},
//		bindShareMenu: function(args) {
//			var menuItem = args.menuItem;
//			menuItem.popover({
//				html: true,
//				placement: 'right',
//				trigger: 'manual',
//				title: 'Share Session',
//				container: 'body',
//				content: "<div class='container-fluid' id='prepare-container'><div>Preparing session export...</div></div>"
//			}).on({
//				'click': me.popoverClickHandler,
//				'shown': function() {
//					CCH.session.getMinifiedEndpoint({
//						callbacks: [
//							function(args) {
//								var response = args.response;
//								var url = args.url;
//
//								// URL controlset
//								var container = $('<div />').addClass('container-fluid');
//								var row = $('<div />').addClass('row-fluid');
//								var controlSetDiv = $('<div />');
//								container.append(row.append(controlSetDiv));
//								$('#prepare-container').replaceWith(container);
//
//
//								var goUsaResponse = JSON.parse(response.response);
//								if (goUsaResponse.response.statusCode && goUsaResponse.response.statusCode.toLowerCase() === 'error') {
//									CCH.LOG.warn(response.response);
//								} else {
//									url = goUsaResponse.response.data.entry[0].short_url;
//								}
//								controlSetDiv.html('Use the following URL to share your current view<br /><br /><b>' + url + '</b>');
//							}
//						]
//					});
//					CCH.CONFIG.ui.popoverShowHandler.call(this);
//				}
//			});
//		},
		slider: function() {
			var iosslider = $('#iosslider-container');
			var sliderFunct;
			if (me.currentSizing === 'large') {
				sliderFunct = iosslider.iosSliderVertical;
			} else if (me.currentSizing === 'small') {
				sliderFunct = iosslider.iosSlider;
			}
			return sliderFunct.apply(iosslider, arguments);
		},
		createSlideshow: function(args) {
			setTimeout(function(args) {
				args = args || {};

				$('#iosslider-container').iosSliderVertical('destroy');
				$('#iosslider-container').iosSlider('destroy');
				$('.iosSlider').remove();

				var sliderContainer = $('<div />').addClass('iosSlider').attr('id', 'iosslider-container');
				var sliderUl = $('<div />').addClass('slider').attr('id', 'iosslider-slider');
				sliderContainer.append(sliderUl);

				$('#description-wrapper').append(sliderContainer);

				var results = args.results || CCH.CONFIG.popularity.results.sortBy(function(result) {
					return parseInt(result.hotness);
				}, true);

				results.each(function(result) {
					var cardContainer = CCH.cards.buildCard({
						'itemId': result.id
					});

					var slide = $('<div />').addClass('slide well well-small').append(cardContainer);

					$('#iosslider-slider').append(slide);

					var card = $(cardContainer.data('card'))[0];
					$(card).on({
						'card-button-pin-clicked': function(evt) {
							me.slider('autoSlidePause');
						},
						'card-pinned': function(evt) {
							var card = evt.currentTarget;

							me.slider('autoSlidePause');

							CCH.map.clearBoundingBoxMarkers();

							CCH.map.displayData({
								"card": card
							});

							CCH.map.zoomToActiveLayers();

						},
						'card-unpinned': function(evt) {
							var card = evt.currentTarget;
							var layers = CCH.map.getMap().getLayersByName(card.name);

							if (layers.length) {
								layers.each(function(layer) {
									CCH.map.getMap().removeLayer(layer, false);
								});
							}

							CCH.map.zoomToActiveLayers();

							if (CCH.map.getMap().getLayersBy('isItemLayer', true).length === 0) {
								me.slider('autoSlidePlay');
							}
						},
						'card-button-tweet-clicked': function(evt) {
							var card = evt.currentTarget;
							me.slider('autoSlidePause');
						}
					});

					if (CCH.session.objects.view.itemIds.indexOf(card.item.id) !== -1) {
						card.pin();
					}
				});

				twttr.widgets.load();

				var resizeVertical = function(event) {
					toggleClassForActiveSlide(event);

					event.sliderContainerObject.css({
						'height': $('#description-wrapper').height() + 'px'
					});
					event.sliderObject.css({
						'height': event.sliderContainerObject.height() + 'px'
					});

					$('.slide').each(function(index, slide) {
						var title = $(slide).find('.description-title-row');
						var descr = $(slide).find('.description-description-row');
						var descrDiv = $(descr).find('p');

						var slideHeight = title.height() + descrDiv.height();
						if (slideHeight > (event.sliderContainerObject.height() - 10)) {
							slideHeight = event.sliderContainerObject.height() - 10;
						}

						$(slide).css({
							'height': slideHeight + 'px'
						});

						descr.css({
							'height': slideHeight - title.height() + 'px'
						});

						descrDiv.css({
							'max-height': descr.height()
						});
					});
				};

				var resizeHorizontal = function(event) {
					toggleClassForActiveSlide(event);
					var container = $(event.sliderContainerObject).parent();
					event.sliderContainerObject.css('height', (container.height()) + 'px');
					event.sliderObject.css('height', (container.height()) + 'px');

					$('.slide').each(function(index, slide) {
						var title = $(slide).find('.description-title-row');
						var descr = $(slide).find('.description-description-row');
						var descrDiv = $(descr).find('p');

						var slideHeight = event.sliderContainerObject.height() - 10;

						$(slide).css({
							'height': slideHeight + 'px'
						});

						descr.css({
							'height': slideHeight - title.height() + 'px'
						});

						descrDiv.css({
							'max-height': descr.height()
						});
					});
				};

				var toggleClassForActiveSlide = function(event) {
					$('.slide').each(function(i, slide) {
						$(slide).removeClass('slider-slide-active');
						$(slide).addClass('slider-slide-inactive');
					});

					event.currentSlideObject.removeClass('slider-slide-inactive');
					event.currentSlideObject.addClass('slider-slide-active');


					CCH.map.boxLayer.markers.each(function(mrk) {
						$(mrk.div).removeClass('marker-active');
						$(mrk.div).addClass('marker-inactive');
					});

					var card = $(event.currentSlideObject[0].firstChild).data('card');
					CCH.map.addBoundingBoxMarker({
						bbox: card.bbox,
						fromProjection: 'EPSG:4326',
						slideOrder: event.currentSlideNumber
					});
				};

				if (me.currentSizing === 'large') {
					sliderContainer.iosSliderVertical({
						desktopClickDrag: true,
						snapToChildren: true,
						snapSlideCenter: true,
						keyboardControls: true,
						autoSlide: true,
						autoSlideTransTimer: 1500,
						unselectableSelector: $('.unselectable'),
						onSliderLoaded: resizeVertical,
						onSliderResize: resizeVertical,
						onSlideChange: toggleClassForActiveSlide
					});
				} else if (me.currentSizing === 'small') {
					sliderContainer.iosSlider({
						desktopClickDrag: true,
						snapToChildren: true,
						snapSlideCenter: true,
						keyboardControls: true,
						autoSlide: true,
						autoSlideTransTimer: 1500,
						unselectableSelector: $('.unselectable'),
						onSliderLoaded: resizeHorizontal,
						onSliderResize: resizeHorizontal,
						onSlideChange: toggleClassForActiveSlide
					});
				}

				var orientationChange = function(event) {
					event.preventDefault();
					me.createSlideshow();
				};

				$(window).off('orientationchange', orientationChange);
				$(window).on('orientationchange', orientationChange);
				$(window).resize();

			}, 1000, args);
		}
	});
};