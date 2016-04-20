var expanderHideTimeout, transitionDuration, sliders, navExpandedHeight, middleBarHeight, screens, states, navExpanders, init

transitionDuration=400
expanderHideTimeout
sliders=[]
navExpandedHeight=0
middleBarHeight=0

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
		replyOpen: false
	}
}

navExpanders = {
	services: {
		coords: {
			x: 0,
			y: 0,
		},
		init: function(){
			var navWidth, servicesLinkCenter, servicesExpanderTop, servicesExpanderLeft, $nav, $servicesLink, $servicesExpander

			$nav=$('nav')
			servicesLink=$('.services-link')
			servicesExpander=$('.services-expander')
			navWidth = $nav.width()
			servicesLinkCenter = $servicesLink.offset().left + $servicesLink.outerWidth()/2
			servicesExpanderTop = $servicesLink.get(0).getBoundingClientRect().top + $servicesLink.outerHeight() - 12
			servicesExpanderLeft = servicesLinkCenter - $servicesExpander.outerWidth()/2
			navExpanders.services.coords.x = servicesExpanderLeft
			navExpanders.services.coords.y = servicesExpanderTop
		},
		show: function(){
			var $globalOverlay, $servicesExpander

			$globalOverlay=$('.global-overlay')
			$servicesExpander=$('.services-expander')
			navExpanders.services.init()
			clearInterval(expanderHideTimeout)
			$globalOverlay.addClass('open')
			$servicesExpander.css({'left': navExpanders.services.coords.x+'px', 'top': navExpanders.services.coords.y+'px'})
			$servicesExpander.addClass('open')
		},
		hide: function(){
			var $globalOverlay, $servicesExpander

			$globalOverlay=$('.global-overlay')
			$servicesExpander=$('.services-expander')
			expanderHideTimeout=setTimeout(function(){
				$globalOverlay.removeClass('open')
				$servicesExpander.removeClass('open')
				expanderHideTimeout=setTimeout(function(){
					$servicesExpander.css({'left': '-100%'})
				}, transitionDuration)
			}, transitionDuration)
		},
	},
	nights: {
		visible: false,
		coords: {
			x: 0,
			y: 0
		},
		init: function(){
			var $nightsExpander, $nights

			$nightsExpander=$('.nights-expander')
			$nights=$('.nights')
			$nightsExpander.css({width: ($nights.width())+'px'})
			navExpanders.nights.coords.x=$nights.offset().left
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
			clearInterval(expanderHideTimeout)
			navExpanders.nights.visible=true
			$nightsExpander.css({'left': navExpanders.nights.coords.x+'px', 'top': navExpanders.nights.coords.y+'px'})
			$nightsExpander.addClass('open')
			$html.click(function(){navExpanders.nights.hide()})
		},
		hide: function(){
			var $html, $nightsExpander

			$html=$('html')
			$nightsExpander=$('.nights-expander')
			$html.unbind('click')
			navExpanders.nights.visible=false
			$nightsExpander.removeClass('open')
			expanderHideTimeout=setTimeout(function(){
				$nightsExpander.css({'left': '-100%'})
			}, transitionDuration)
		},
		toggle: function(){
			if(navExpanders.nights.visible){
				navExpanders.nights.hide()
			}
			else{
				navExpanders.nights.show()
			}
		}
	},
	reply: {
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
			clearInterval(expanderHideTimeout)
			navExpanders.nights.hide()
			$replyExpander.addClass('open')
			$replyExpander.css({'left': navExpanders.reply.coords.x+'px', 'top': navExpanders.reply.coords.y+'px'})
			if(states.nav.middleBarOpen){
				$innerWrap.addClass('open')
				$arrowRight.addClass('open')
			}
			$html.click(function(){navExpanders.reply.hide(false)})
		},
		hide: function(){
			var $html, $replyExpander, $innerWrap, $arrowRight

			$replyExpander=$('.reply-expander')
			$bookWrap=$('.book-wrap')
			$innerWrap=$bookWrap.find('.inner-wrap')
			$arrowRight=$bookWrap.find('.arrow-right')
			$html.unbind('click')
			$replyExpander.removeClass('open')

			$innerWrap.removeClass('open')
			$arrowRight.removeClass('open')

			expanderHideTimeout=setTimeout(function(){
				$replyExpander.css({'left': '-100%'})
			}, transitionDuration)
		}
	}
}

function updateSlider(slider, next){//dirention = next?'forward':'backward'
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
	left=-(slideTo*100)
	$('#slider'+slider).find('.slides').css({'left': left+'%'})
}

init={
	nav: function(){
		var $nav, $middleBar

		$nav=$('nav')
		$middleBar=$('nav .middle-bar')
		navExpandedHeight=$nav.outerHeight()
		middleBarHeight=$middleBar.outerHeight()
		$middleBar.removeClass('open')
	},
	sliders: function(){
		var left, slidersLength, i, j
		left=100
		slidersLength=$('.slider').length
		for(i=0; i<slidersLength; i++){
			sliders[i]={num: $('#slider'+i).find('.slide').length, current: 0}
			for(j=0; j<=sliders[i].num; j++){
				$('#slider'+i).find('.slide').eq(j).css({'left': (left*j)+'%'})
				$('#slider'+i).find('.slides-num').html(sliders[i].num)
			}
		}
	},
	expanders: function(){
		navExpanders.services.init()
		navExpanders.nights.init()
		navExpanders.reply.init()
	},
	screen: function(){
		screens.current=$(window).outerWidth()
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
	var $window, $html, $toggleButtonWrap, $toggleButton, $middleBar, $body, $nights, $nightsExpander, $bookWrap, $replyExpander,
		$servicesExpander, $nightsExpanderLi, $servicesLink, $footerUp, $slider

	$window=$(window)
	$html=$('html')
	$body=$('body')
	$toggleButtonWrap=$('.toggle-button-wrap')
	$toggleButton=$('.toggle-button')
	$middleBar=$('.middel-bar')
	$nights=$('.nights')
	$nightsExpander=$('.nights-expander')
	$bookWrap=$('.book-wrap')
	$replyExpander=$('.reply-expander')
	$servicesExpander=$('.services-expander')
	$nightsExpanderLi=$('.nights-expander li')
	$servicesLink=$('.services-link')
	$footerUp=$('#footer-up')
	$slider=$('.slider')
	init.all()
	$(window).resize(function(){init.expanders(); init.screen(); init.nav(); $('html').click()})

	$('.toggle-button-wrap').click(function(){
		$(this).find('.toggle-button').toggleClass('open')
		$('nav .middle-bar').toggleClass('open')
		states.nav.middleBarOpen=!states.nav.middleBarOpen
		if(screens.current < screens.sm){
			if($('nav .middle-bar').hasClass('open')){
				$('nav .middle-bar').css({'max-height': middleBarHeight+'px'})
				$('body').css({'padding-top': navExpandedHeight+'px'})
			}
			else{
				$('nav .middle-bar').removeAttr('style')
				$('body').removeAttr('style')
			}
		}
	})

	$('.nights, .nights-expander, .book-wrap, .reply-expander').click(function(e){var e = e || event; e.stopPropagation()})
	$('.services-expander').hover(function(){clearInterval(expanderHideTimeout)}, function(){navExpanders.services.hide(true)})

	$('.nights-expander li').click(navExpanders.nights.click)
	$('.nights').click(navExpanders.nights.toggle)
	$('.book-wrap').click(navExpanders.reply.show)

	$('.services-link').hover(navExpanders.services.show, navExpanders.services.hide)

	$('#footer-up').click(function(){
		var mainPartHeight=$('.main-footer').outerHeight()+75
		$('body').animate({scrollTop: $(document).height()+10000}, transitionDuration);//10000 is set to scroll the page to its end
		if($('footer').hasClass('open')){
			$('footer').removeAttr('style')
		}
		else{
			$('footer').css({'height': mainPartHeight+'px'})
		}
		$('footer').toggleClass('open')
	})


	$('.slider').each(function(i, el){
		$('#slider'+i+'-prev').click(function(){
			updateSlider(i, false)
		})
		$('#slider'+i+'-next').click(function(){
			updateSlider(i, true)
		})
	})

	$('.arrival-date').pickmeup({
		position: 'bottom',
		hide_on_select: true,
		prev: '',
		next: '',
		change: function(){
			$('.arrival-date-output').html($('.arrival-date').pickmeup('get_date', 'd/m/Y'))
		},
		fill: function(){
			$('.arrival-date-output').html($('.arrival-date').pickmeup('get_date', 'd/m/Y'))
		},
		show: function(){
			$('.pickmeup').css({'display': 'block'})
			$('.arrival-date .arrow-up').addClass('open')
			navExpanders.nights.hide()
			navExpanders.reply.hide()
		},
		hide: function(){
			$('.arrival-date .arrow-up').removeClass('open')
			setTimeout(function(){
				$('.pickmeup').css({'display': 'none'})
			}, transitionDuration)
		}
	})
})