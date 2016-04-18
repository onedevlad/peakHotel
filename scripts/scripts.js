var expanderHideDelay=400
var expanderHideTimeout
var sliders=[]

var navExpanders={
	services: {
		coords: {
			x: 0,
			y: 0,
		},
		init: function(){
			var navWidth=$('nav').width()
			var servicesLinkCenter=$('.services-link').offset().left + $('.services-link').outerWidth()/2
			var servicesExpanderTop=$('.services-link').get(0).getBoundingClientRect().top + $('.services-link').outerHeight() - 12
			var servicesExpanderLeft=servicesLinkCenter - $('.services-expander').outerWidth()/2
			navExpanders.services.coords.x=servicesExpanderLeft
			navExpanders.services.coords.y=servicesExpanderTop
		},
		show: function(){
			navExpanders.services.init()
			clearInterval(expanderHideTimeout)
			$('.global-overlay').addClass('open')
			$('.services-expander').css({'left': navExpanders.services.coords.x+'px', 'top': navExpanders.services.coords.y+'px'})
			$('.services-expander').addClass('open')
		},
		hide: function(){
			expanderHideTimeout=setTimeout(function(){
				$('.global-overlay').removeClass('open')
				$('.services-expander').removeClass('open')
				expanderHideTimeout=setTimeout(function(){
					$('.services-expander').css({'left': '-100%'})
				}, expanderHideDelay)
			}, expanderHideDelay)
		},
	},
	nights: {
		visible: false,
		coords: {
			x: 0,
			y: 0
		},
		init: function(){
			$('.nights-expander').css({width: ($('.nights').width())+'px'})
			navExpanders.nights.coords.x=$('.nights').offset().left
			navExpanders.nights.coords.y=$('.nights').get(0).getBoundingClientRect().top+$('.nights').outerHeight() - 10
		},
		click: function(){
			$(this).parent().find('.chosen').removeClass('chosen')
			$(this).find('span').addClass('chosen')
			$('.nights .nights-output').html($(this).find('span').html())
			navExpanders.nights.hide()
		},
		show: function(){
			navExpanders.reply.hide()
			clearInterval(expanderHideTimeout)
			navExpanders.nights.visible=true
			$('.nights-expander').css({'left': navExpanders.nights.coords.x+'px', 'top': navExpanders.nights.coords.y+'px'})
			$('.nights-expander').addClass('open')
			$('html').click(function(){navExpanders.nights.hide()})
		},
		hide: function(){
			$('html').unbind('click')
			navExpanders.nights.visible=false
			$('.nights-expander').removeClass('open')
			expanderHideTimeout=setTimeout(function(){
				$('.nights-expander').css({'left': '-100%'})
			}, expanderHideDelay)
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
			var navWidth=$('nav').width()
			var nightsRight=$('.nights').offset().left+$('.nights').width()
			var dateLeft=$('.arrival-date').offset().left
			var expanderWidth=$('.book-wrap').outerWidth()*1.5
			var expanderLeft=$('.arrival-date').offset().left
			$('.reply-expander').css({'width': expanderWidth+'px'})
			var btnCenter=$('.book-wrap').offset().left+$('.book-wrap').outerWidth()/2
			var potentionalLeft=btnCenter-expanderWidth/2
			if(potentionalLeft+expanderWidth < navWidth){
				expanderLeft=potentionalLeft
			}
			navExpanders.reply.coords.x=expanderLeft
			navExpanders.reply.coords.y=$('.book-wrap').get(0).getBoundingClientRect().top+$('.nights').outerHeight() - 10
		},
		show: function(){
			clearInterval(expanderHideTimeout)
			navExpanders.nights.hide()
			$('.reply-expander').addClass('open')
			$('.reply-expander').css({'left': navExpanders.reply.coords.x+'px', 'top': navExpanders.reply.coords.y+'px'})
			$('html').click(function(){navExpanders.reply.hide(false)})
		},
		hide: function(){
			$('html').unbind('click')
			$('.reply-expander').removeClass('open')
			expanderHideTimeout=setTimeout(function(){
				$('.reply-expander').css({'left': '-100%'})
			}, expanderHideDelay)
		}
	}
}

function initExpanders(){
	navExpanders.services.init()
	navExpanders.nights.init()
	navExpanders.reply.init()
}

function initSliders(){
	var left=100
	var slidersLength=$('.slider').length
	for(var i=0; i<slidersLength; i++){
		sliders[i]={num: $('#slider'+i).find('.slide').length, current: 0}
		for(var j=0; j<=sliders[i].num; j++){
			$('#slider'+i).find('.slide').eq(j).css({'left': (left*j)+'%'})
			$('#slider'+i).find('.slides-num').html(sliders[i].num)
		}
	}
}

function updateSlider(slider, next){//dirention = next?'forward':'backward'
	// NOTE: The 'num' key of a 'sliders[slider]' object represents the length, not the last index
	var slideTo=next?(sliders[slider].current+1):(sliders[slider].current-1)
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

$(document).ready(function(){
	initExpanders()
	initSliders()
	$(window).resize(function(){initExpanders(); $('html').click()})

	$('.toggle-button-wrap').click(function(){
		$(this).find('.toggle-button').toggleClass('open')
		$('nav .middle-bar').toggleClass('open')
	})

	$('.nights, .nights-expander, .book-wrap, .reply-expander').click(function(){event.stopPropagation()})
	$('.services-link').hover(navExpanders.services.show, navExpanders.services.hide)
	$('.services-expander').hover(function(){clearInterval(expanderHideTimeout)}, function(){navExpanders.services.hide(true)})
	$('.nights').click(navExpanders.nights.toggle)
	$('.nights-expander li').click(navExpanders.nights.click)
	$('.book-wrap').click(navExpanders.reply.show)
	
	if($(window).outerWidth() >= 1170){
		$('#footer-up').click(function(){
			var mainPartHeight=$('.main-footer').outerHeight()+75
			$("html, body").animate({scrollTop: $(document).height()}, expanderHideDelay);
			if($('footer').hasClass('open')){
				$('footer').removeAttr('style')
			}
			else{
				$('footer').css({'height': mainPartHeight+'px'})
			}
			$('footer').toggleClass('open')
		})
	}

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
			}, expanderHideDelay)
		}
	})
})