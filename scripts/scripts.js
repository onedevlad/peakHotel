var expanderHideTimeout, transitionDuration, sliders, navExpandedHeight, middleBarHeight, screens, states, navExpanders, init

transitionDuration=400
expanderHideTimeout
sliders=[]
navExpandedHeight=0
middleBarHeight=0
var resizeTimer=0


screens={
	xs: 480,
	sm: 750,
	md: 970,
	lg: 1170,
	current: 0,
}

states={
	nav: {
		middleBarOpen: false
	},
	navExpanders: {
		servicesOpen: false,
		nightsOpen: false,
		replyOpen: false,
		pickmeupHideAllowed: true
	}
}

navExpanders = {
	services: {
		hideTimeout: null,
		coords: {
			x: 0,
			y: 0,
		},
		init: function(){
			var navWidth, servicesLinkCenter, servicesExpanderTop, servicesExpanderLeft, $nav, $servicesLink, $servicesExpander

			$nav=$('nav')
			$servicesLink=$('.services-link')
			$servicesExpander=$('.services-expander')
			$('.services-link, .services-expander').unbind('click mouseover mouseout mouseenter mouseleave')
			if(screens.current <= screens.md){
				$('.services-link').click(function(e){
					var e = e || window.event
					e.stopPropagation()
					navExpanders.services.show()
					$('html').click(function(){
						navExpanders.services.hide()
					})
				})
			}
			else{
				$('.services-expander').hover(function(){clearTimeout(navExpanders.services.hideTimeout); navExpanders.services.show()}, function(){navExpanders.services.hide()})
				$('.services-link').hover(navExpanders.services.show, navExpanders.services.hide)
			}

			navWidth = $nav.width()
			servicesLinkCenter = $servicesLink.offset().left + $servicesLink.outerWidth()/2
			servicesExpanderTop = $servicesLink.get(0).getBoundingClientRect().top + $servicesLink.outerHeight()
			servicesExpanderLeft = servicesLinkCenter - $servicesExpander.outerWidth()/2
			navExpanders.services.coords.x = servicesExpanderLeft
			navExpanders.services.coords.y = servicesExpanderTop
		},
		show: function(){
			var $globalOverlay, $servicesExpander

			$globalOverlay=$('.global-overlay')
			$servicesExpander=$('.services-expander')
			navExpanders.services.init()
			clearTimeout(navExpanders.services.hideTimeout)
			$globalOverlay.addClass('open')
			$servicesExpander.css({'left': navExpanders.services.coords.x+'px', 'top': navExpanders.services.coords.y+'px'})
			$servicesExpander.addClass('open')
			states.navExpanders.servicesOpen=true

		},
		hide: function(){
			var $globalOverlay, $servicesExpander

			$('html').unbind('click')
			$globalOverlay=$('.global-overlay')
			$servicesExpander=$('.services-expander')
			navExpanders.services.hideTimeout=setTimeout(function(){
				$globalOverlay.removeClass('open')
				$servicesExpander.removeClass('open')
				navExpanders.services.hideTimeout=setTimeout(function(){
					$servicesExpander.css({'left': '-100%'})
					states.navExpanders.servicesOpen=false
				}, transitionDuration)
			}, (screens.current >= screens.md)?transitionDuration:0)
		},
	},
	nights: {
		hideTimeout: null,
		coords: {
			x: 0,
			y: 0
		},
		init: function(){
			var $nightsExpander, $nights, $nightsSpan

			$nightsExpander=$('.nights-expander')
			$nights=$('.nights')
			$nightsSpan=$('.nights > span')
			navExpanders.nights.coords.x=$nightsSpan.offset().left + $nightsSpan.outerWidth()/2 - $('.nights-expander').outerWidth()/2
			navExpanders.nights.coords.y=$nights.get(0).getBoundingClientRect().top+$nights.outerHeight() - 12
		},
		click: function(){
			var $chosen, $nightsOutput

			$chosen=$(this).parent().find('.chosen')
			$nightsOutput=$('.nights .nights-output')
			$chosen.removeClass('chosen')
			$(this).find('span').addClass('chosen')
			$nightsOutput.html($(this).find('span').html())
			navExpanders.nights.hide()
		},
		show: function(){
			var $html, $nightsExpander

			$html=$('html')
			$nightsExpander=$('.nights-expander')
			navExpanders.reply.hide()
			clearInterval(navExpanders.nights.hideTimeout)
			navExpanders.nights.init()
			$nightsExpander.css({'left': navExpanders.nights.coords.x+'px', 'top': navExpanders.nights.coords.y+'px'})
			$nightsExpander.addClass('open')
			states.navExpanders.nightsOpen=true
			$html.click(function(){navExpanders.nights.hide()})
		},
		hide: function(){
			var $html, $nightsExpander

			$html=$('html')
			$nightsExpander=$('.nights-expander')
			$html.unbind('click')
			$nightsExpander.removeClass('open')
			navExpanders.nights.hideTimeout=setTimeout(function(){
				$nightsExpander.css({'left': '-100%'})
				states.navExpanders.nightsOpen=false
			}, transitionDuration)
		},
		toggle: function(){
			if(states.navExpanders.nigthsOpen){
				navExpanders.nights.hide()
			}
			else{
				navExpanders.nights.show()
			}
		}
	},
	reply: {
		hideTimeout: null,
		coords: {
			x: 0,
			y: 0
		},
		init: function(){
			var $nav, $nights, $arrivalDate, $replyExpander, $bookWrap, navWidth, nightsRight, dateLeft, expanderWidth, expanderLeft, btnCenter, potentionalLeft

			$nav=$('nav')
			$nights=$('.nights')
			$arrivalDate=$('.arrival-date')
			$replyExpander=$('.reply-expander')
			$bookWrap=$('.book-wrap')
			navWidth=$nav.width()
			nightsRight=$nights.offset().left+$nights.width()
			dateLeft=$arrivalDate.offset().left
			expanderWidth=$bookWrap.outerWidth()*1.5
			$replyExpander.css({'width': expanderWidth+'px'})
			expanderLeft=$arrivalDate.offset().left
			btnCenter=$bookWrap.offset().left+$bookWrap.outerWidth()/2
			potentionalLeft=btnCenter-expanderWidth/2
			if(potentionalLeft+expanderWidth < navWidth){
				expanderLeft=potentionalLeft
			}
			navExpanders.reply.coords.x=expanderLeft
			navExpanders.reply.coords.y=$bookWrap.get(0).getBoundingClientRect().top+$nights.outerHeight() - 12
		},
		show: function(){
			var $replyExpander, $innerWrap, $arrowRight, $html, $bookWrap

			$html=$('html')
			$replyExpander=$('.reply-expander')
			$bookWrap=$('.book-wrap')
			$innerWrap=$bookWrap.find('.inner-wrap')
			$arrowRight=$bookWrap.find('.arrow-right')

			clearInterval(navExpanders.reply.hideTimeout)
			navExpanders.nights.hide()
			navExpanders.reply.init()

			$replyExpander.addClass('open').css({'left': navExpanders.reply.coords.x+'px', 'top': navExpanders.reply.coords.y+'px'})

			$innerWrap.addClass('open')
			$arrowRight.addClass('open')

			$html.click(function(){navExpanders.reply.hide()})
			states.navExpanders.replyOpen=true

		},
		hide: function(){
			var $html, $replyExpander, $innerWrap, $arrowRight

			$html=$('html')
			$replyExpander=$('.reply-expander')
			$bookWrap=$('.book-wrap')
			$innerWrap=$bookWrap.find('.inner-wrap')
			$arrowRight=$bookWrap.find('.arrow-right')
			$html.unbind('click')
			$replyExpander.removeClass('open')
			$innerWrap.removeClass('open')
			$arrowRight.removeClass('open')

			navExpanders.reply.hideTimeout=setTimeout(function(){
				$replyExpander.css({'left': '-100%'})
				states.navExpanders.replyOpen=false
			}, transitionDuration)
		}
	}
}

function updateSlider(slider, next){//direction = next?'forward':'backward'
	// NOTE: The 'num' key of a 'sliders[slider]' object represents the length, not the last index
	var slideTo

	slideTo=next?(sliders[slider].current+1):(sliders[slider].current-1)
	if(!next){
		if(sliders[slider].current-1 < 0){
			slideTo=sliders[slider].num-1
		}
	}
	else{
		if(sliders[slider].current+1 >= sliders[slider].num){
			slideTo=0
		}
	}
	sliders[slider].current=slideTo
	$('#slider'+slider).find('.current-slide').html(slideTo+1)
	$('#slider'+slider).find('.slides .slide.open').removeClass('open')
	$('#slider'+slider).find('.slides .slide').eq(slideTo).addClass('open')
}

init={
	screen: function(){
		screens.current=$(window).outerWidth()
	},
	nav: function(){
		var $nav, $middleBar

		$nav=$('nav')
		$middleBar=$('nav .middle-bar')
		$middleBar.css({'-webkit-transition': 'all 0s ease',
						'-moz-transition': 'all 0s ease',
						'transition': 'all 0s ease',
						'position': 'fixed',
						'left': '-100%',
						'opacity': 0}).addClass('open')
		setTimeout(function(){
			middleBarHeight=$middleBar.outerHeight()
			navExpandedHeight=$nav.outerHeight()+middleBarHeight
			$middleBar.removeClass('open')
			setTimeout(function(){
				$middleBar.removeAttr('style')
			}, transitionDuration)
		}, 100)
	},
	sliders: function(){
		var slidersLength
		slidersLength=$('.slider').length
		for(i=0; i<slidersLength; i++){
			sliders[i]={num: $('#slider'+i).find('.slide').length, current: 0}
			$('#slider'+i).find('.slides-num').html(sliders[i].num)
			$('#slider'+i).find('.slide').eq(0).addClass('open')
		}
	},
	expanders: function(){
		navExpanders.services.init()
		navExpanders.nights.init()
		navExpanders.reply.init()
	},
	all: function(){
		for(var key in init){
			if(key === 'all'){
				continue;
			}
			init[key]()
		}
	}
}

$(document).ready(function(){
	init.all()

	$(window).resize(function(){
		clearTimeout(resizeTimer)
		resizeTimer = setTimeout(function(){
			init.screen()
			init.expanders()
			init.nav()
			$('.arrival-date').pickmeup('hide')
			$('html').click()
		}, 250)
	})

	$('.toggle-button-wrap').click(function(){
		var $toggleButton, $middleBar

		$toggleButton=$('.toggle-button')
		$middleBar=$('nav .middle-bar')

		$toggleButton.toggleClass('open')
		$middleBar.toggleClass('open')
		states.nav.middleBarOpen=!states.nav.middleBarOpen
		if(screens.current < screens.sm){
			if(states.nav.middleBarOpen){
				$middleBar.css({'max-height': middleBarHeight+'px'})
			}
			else{
				$middleBar.removeAttr('style')
				$('body').removeAttr('style')
			}
		}
	})

	$('.nights, .nights-expander, .book-wrap, .reply-expander').click(function(e){var e = e || event; e.stopPropagation()})

	$('.nights-expander li').click(navExpanders.nights.click)
	$('.nights').click(navExpanders.nights.toggle)
	$('.book-wrap').click(navExpanders.reply.show)

	$('#footer-up').click(function(){
		$('html, body').animate({scrollTop: 0}, transitionDuration)
	})


	$('.slider').each(function(i, el){
		$('#slider'+i+'-prev').click(function(){
			updateSlider(i, false)
		})
		$('#slider'+i+'-next').click(function(){
			updateSlider(i, true)
		})
	})

	$('.units').click(function(){
		$('.temperature').find('.c-value, .f-value').toggleClass('open')
		$('.units .c, .units .f').toggleClass('chosen')
	})

	$('.list-link').click(function(){
		var index=this.id.slice(-1)
		$('.services-img .open').removeClass('open')
		$('#services-img-'+index).addClass('open')
	})

	$('.lang-choose .link-text').click(function(){
		$(this).parent().find('.chosen').removeClass('chosen')
		$(this).addClass('chosen')
	})

	$('.arrival-date').pickmeup({
		position: 'bottom',
		hide_on_select: true,
		prev: '',
		next: '',
		change: function(){
			var $arrivalDate, $arrivalDateOutput

			$arrivalDate=$('.arrival-date')

			$arrivalDate.find('.arrival-date-output').html($arrivalDate.pickmeup('get_date', 'd/m/Y'))
		},
		fill: function(){
			var $arrivalDate, $arrivalDateOutput

			$arrivalDate=$('.arrival-date')

			$arrivalDate.find('.arrival-date-output').html($arrivalDate.pickmeup('get_date', 'd/m/Y'))
		},
		show: function(){
			$('.pickmeup').css({'display': 'block'})
			$('.arrival-date .arrow-up').addClass('open')
			navExpanders.nights.hide()
			navExpanders.reply.hide()
			states.pickmeupHideAllowed=false
			setTimeout(function(){
				states.pickmeupHideAllowed=true
			}, transitionDuration)
		},
		hide: function(){
			$('.arrival-date .arrow-up').removeClass('open')
			if(states.pickmeupHideAllowed){
				setTimeout(function(){
					$('.pickmeup').css({'display': 'none'})
				}, transitionDuration)
			}
		}
	})
})