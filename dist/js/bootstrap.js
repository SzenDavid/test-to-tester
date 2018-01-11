/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2018 [object Object]
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

$(document).ready(function() {
    $('#contact_form').bootstrapValidator({
      submitHandler: function(validator, form, submitButton) {
        $('#success_message').slideDown({ opacity: "show" }, "slow")
        $("#contact_form")[0].reset();
      },
        fields: {
            user_name: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Kérem adjon meg egy felhasználónevet'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Kérem adja meg az e-mail címét'
                    }
                }
            },
            phone: {
                validators: {
                    notEmpty: {
                        message: 'Kérem adja meg telefonszámát'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'Kérem adjon meg jelszót'
                    }
                }
            },
            password_2: {
                validators: {
                    notEmpty: {
                        message: 'Kérem adjon meg jelszót'
                    }
                }
            }
        }
    })
        
});




/**
 * BootstrapValidator (http://bootstrapvalidator.com)
 *
 * The best jQuery plugin to validate form fields. Designed to use with Bootstrap 3
 *
 * @version     v0.4.5
 * @author      https://twitter.com/nghuuphuoc
 * @copyright   (c) 2013 - 2014 Nguyen Huu Phuoc
 * @license     MIT
 */

!function (a) { var b = function (c, d) { this.$form = a(c), this.options = a.extend({}, b.DEFAULT_OPTIONS, d), this.$invalidField = null, this.$submitButton = null, this.STATUS_NOT_VALIDATED = "NOT_VALIDATED", this.STATUS_VALIDATING = "VALIDATING", this.STATUS_INVALID = "INVALID", this.STATUS_VALID = "VALID"; var e = function () { for (var a = 3, b = document.createElement("div"), c = b.all || []; b.innerHTML = "<!--[if gt IE " + ++a + "]><br><![endif]-->", c[0];); return a > 4 ? a : !a }(), f = document.createElement("div"); this._changeEvent = 9 !== e && "oninput" in f ? "input" : "keyup", this._submitIfValid = null, this._init() }; b.DEFAULT_OPTIONS = { elementClass: "bv-form", message: "Ez az érték nem érvényes", threshold: null, excluded: [":disabled", ":hidden", ":not(:visible)"], feedbackIcons: { valid: null, invalid: null, validating: null }, submitButtons: '[type="submit"]', submitHandler: null, live: "enabled", fields: null }, b.prototype = { constructor: b, _init: function () { var b, c, d, e, f, g, h, i = this, j = { excluded: this.$form.attr("data-bv-excluded"), trigger: this.$form.attr("data-bv-trigger"), message: this.$form.attr("data-bv-message"), submitButtons: this.$form.attr("data-bv-submitbuttons"), threshold: this.$form.attr("data-bv-threshold"), live: this.$form.attr("data-bv-live"), fields: {}, feedbackIcons: { valid: this.$form.attr("data-bv-feedbackicons-valid"), invalid: this.$form.attr("data-bv-feedbackicons-invalid"), validating: this.$form.attr("data-bv-feedbackicons-validating") } }; this.$form.attr("novalidate", "novalidate").addClass(this.options.elementClass).on("submit.bv", function (a) { a.preventDefault(), i.validate() }).on("click", this.options.submitButtons, function () { i.$submitButton = a(this), i._submitIfValid = !0 }).find("[name], [data-bv-field]").each(function () { var k = a(this); if (!i._isExcluded(k)) { var l = k.attr("name") || k.attr("data-bv-field"), m = {}; for (c in a.fn.bootstrapValidator.validators) if (b = a.fn.bootstrapValidator.validators[c], d = k.attr("data-bv-" + c.toLowerCase()) + "", h = "function" == typeof b.enableByHtml5 ? b.enableByHtml5(a(this)) : null, h && "false" != d || h !== !0 && ("" == d || "true" == d)) { b.html5Attributes = b.html5Attributes || { message: "message" }, m[c] = a.extend({}, 1 == h ? {} : h, m[c]); for (g in b.html5Attributes) e = b.html5Attributes[g], f = k.attr("data-bv-" + c.toLowerCase() + "-" + g), f && ("true" == f ? f = !0 : "false" == f && (f = !1), m[c][e] = f) } var n = { trigger: k.attr("data-bv-trigger"), message: k.attr("data-bv-message"), container: k.attr("data-bv-container"), selector: k.attr("data-bv-selector"), threshold: k.attr("data-bv-threshold"), validators: m }; a.isEmptyObject(n.validators) || a.isEmptyObject(n) || (k.attr("data-bv-field", l), j.fields[l] = a.extend({}, n, j.fields[l])) } }).end().find(this.options.submitButtons).each(function () { a("<input/>").attr("type", "hidden").attr("name", a(this).attr("name")).val(a(this).val()).appendTo(i.$form) }), this.options = a.extend(!0, this.options, j); for (var k in this.options.fields) this._initField(k); this.setLiveMode(this.options.live) }, _initField: function (b) { if (null != this.options.fields[b] && null != this.options.fields[b].validators) { var c = this.getFieldElements(b); if (null == c) return void delete this.options.fields[b]; for (var d in this.options.fields[b].validators) a.fn.bootstrapValidator.validators[d] || delete this.options.fields[b].validators[d]; for (var e = this, f = c.attr("type"), g = "radio" == f || "checkbox" == f || "file" == f || "SELECT" == c[0].tagName ? "change" : e._changeEvent, h = c.length, i = 1 == h || "radio" == f || "checkbox" == f, j = 0; h > j; j++) { var k = a(c[j]), l = k.parents(".form-group"), m = this.options.fields[b].container ? l.find(this.options.fields[b].container) : this._getMessageContainer(k); k.attr("data-bv-field") || k.attr("data-bv-field", b), k.on(g + ".update.bv", function () { e._submitIfValid = !1, i ? e.updateStatus(b, e.STATUS_NOT_VALIDATED, null) : e.updateElementStatus(a(this), e.STATUS_NOT_VALIDATED, null) }), k.data("bv.messages", m); for (d in this.options.fields[b].validators) k.data("bv.result." + d, this.STATUS_NOT_VALIDATED), i && j != h - 1 || a("<small/>").css("display", "none").attr("data-bv-validator", d).attr("data-bv-validator-for", b).html(this.options.fields[b].validators[d].message || this.options.fields[b].message || this.options.message).addClass("help-block").appendTo(m); if (this.options.feedbackIcons && this.options.feedbackIcons.validating && this.options.feedbackIcons.invalid && this.options.feedbackIcons.valid && (!i || j == h - 1)) { l.addClass("has-feedback"); var n = a("<i/>").css("display", "none").addClass("form-control-feedback").attr("data-bv-icon-for", b).insertAfter(k); 0 == l.find("label").length && n.css("top", 0) } } null == this.options.fields[b].enabled && (this.options.fields[b].enabled = !0) } }, _getMessageContainer: function (a) { var b = a.parent(); if (b.hasClass("form-group")) return b; var c = b.attr("class"); if (!c) return this._getMessageContainer(b); c = c.split(" "); for (var d = c.length, e = 0; d > e; e++)if (/^col-(xs|sm|md|lg)-\d+$/.test(c[e]) || /^col-(xs|sm|md|lg)-offset-\d+$/.test(c[e])) return b; return this._getMessageContainer(b) }, _submit: function () { if (this.isValid()) this.options.submitHandler && "function" == typeof this.options.submitHandler ? this.options.submitHandler.call(this, this, this.$form, this.$submitButton) : this.disableSubmitButtons(!0).defaultSubmit(); else if ("submitted" == this.options.live && this.setLiveMode("enabled"), this.$invalidField) { var b, c = this.$invalidField.parents(".tab-pane"); c && (b = c.attr("id")) && a('a[href="#' + b + '"][data-toggle="tab"]').trigger("click.bs.tab.data-api"), this.$invalidField.focus() } }, _isExcluded: function (b) { if (this.options.excluded) { "string" == typeof this.options.excluded && (this.options.excluded = a.map(this.options.excluded.split(","), function (b) { return a.trim(b) })); for (var c = this.options.excluded.length, d = 0; c > d; d++)if ("string" == typeof this.options.excluded[d] && b.is(this.options.excluded[d]) || "function" == typeof this.options.excluded[d] && 1 == this.options.excluded[d].call(this, b, this)) return !0 } return !1 }, _exceedThreshold: function (a) { var b = a.attr("data-bv-field"), c = this.options.fields[b].threshold || this.options.threshold; if (!c) return !0; var d = a.attr("type"), e = -1 != ["button", "checkbox", "file", "hidden", "image", "radio", "reset", "submit"].indexOf(d); return e || a.val().length >= c }, getFieldElements: function (b) { var c = this.options.fields[b].selector ? a(this.options.fields[b].selector) : this.$form.find('[name="' + b + '"]'); return 0 == c.length ? null : c }, setLiveMode: function (b) { if (this.options.live = b, "submitted" == b) return this; var c = this; for (var d in this.options.fields) !function (e) { var f = c.getFieldElements(e); if (f) for (var g = f.attr("type"), h = f.length, i = 1 == h || "radio" == g || "checkbox" == g, j = c.options.fields[d].trigger || c.options.trigger || ("radio" == g || "checkbox" == g || "file" == g || "SELECT" == f[0].tagName ? "change" : c._changeEvent), k = a.map(j.split(" "), function (a) { return a + ".live.bv" }).join(" "), l = 0; h > l; l++)"enabled" == b ? a(f[l]).on(k, function () { c._exceedThreshold(a(this)) && (i ? c.validateField(e) : c.validateFieldElement(a(this), !1)) }) : a(f[l]).off(k) }(d); return this }, disableSubmitButtons: function (a) { return a ? "disabled" != this.options.live && this.$form.find(this.options.submitButtons).attr("disabled", "disabled") : this.$form.find(this.options.submitButtons).removeAttr("disabled"), this }, validate: function () { if (!this.options.fields) return this; this.disableSubmitButtons(!0); for (var a in this.options.fields) this.validateField(a); return this.$submitButton && this._submit(), this }, validateField: function (b) { for (var c = this.getFieldElements(b), d = c.attr("type"), e = "radio" == d || "checkbox" == d ? 1 : c.length, f = 0; e > f; f++)this.validateFieldElement(a(c[f]), 1 == e); return this }, validateFieldElement: function (b, c) { var d, e, f = this, g = b.attr("data-bv-field"), h = this.options.fields[g].validators; if (!this.options.fields[g].enabled || this._isExcluded(b)) return this; for (d in h) { b.data("bv.dfs." + d) && b.data("bv.dfs." + d).reject(); var i = b.data("bv.result." + d); i != this.STATUS_VALID && i != this.STATUS_INVALID && (b.data("bv.result." + d, this.STATUS_VALIDATING), e = a.fn.bootstrapValidator.validators[d].validate(this, b, h[d]), "object" == typeof e ? (c ? this.updateStatus(g, this.STATUS_VALIDATING, d) : this.updateElementStatus(b, this.STATUS_VALIDATING, d), b.data("bv.dfs." + d, e), e.done(function (a, b, d) { a.removeData("bv.dfs." + b), c ? f.updateStatus(a.attr("data-bv-field"), d ? f.STATUS_VALID : f.STATUS_INVALID, b) : f.updateElementStatus(a, d ? f.STATUS_VALID : f.STATUS_INVALID, b), d && 1 == f._submitIfValid && f._submit() })) : "boolean" == typeof e && (c ? this.updateStatus(g, e ? this.STATUS_VALID : this.STATUS_INVALID, d) : this.updateElementStatus(b, e ? this.STATUS_VALID : this.STATUS_INVALID, d))) } return this }, updateStatus: function (b, c, d) { for (var e = this.getFieldElements(b), f = e.attr("type"), g = "radio" == f || "checkbox" == f ? 1 : e.length, h = 0; g > h; h++)this.updateElementStatus(a(e[h]), c, d); return this }, updateElementStatus: function (b, c, d) { var e = this, f = b.attr("data-bv-field"), g = b.parents(".form-group"), h = b.data("bv.messages"), i = h.find(".help-block[data-bv-validator]"), j = g.find('.form-control-feedback[data-bv-icon-for="' + f + '"]'); if (d) b.data("bv.result." + d, c); else for (var k in this.options.fields[f].validators) b.data("bv.result." + k, c); var l, m, n = b.parents(".tab-pane"); switch (n && (l = n.attr("id")) && (m = a('a[href="#' + l + '"][data-toggle="tab"]').parent()), c) { case this.STATUS_VALIDATING: this.disableSubmitButtons(!0), g.removeClass("has-success").removeClass("has-error"), d ? i.filter('.help-block[data-bv-validator="' + d + '"]').hide() : i.hide(), j && j.removeClass(this.options.feedbackIcons.valid).removeClass(this.options.feedbackIcons.invalid).addClass(this.options.feedbackIcons.validating).show(), m && m.removeClass("bv-tab-success").removeClass("bv-tab-error"); break; case this.STATUS_INVALID: this.disableSubmitButtons(!0), g.removeClass("has-success").addClass("has-error"), d ? i.filter('[data-bv-validator="' + d + '"]').show() : i.show(), j && j.removeClass(this.options.feedbackIcons.valid).removeClass(this.options.feedbackIcons.validating).addClass(this.options.feedbackIcons.invalid).show(), m && m.removeClass("bv-tab-success").addClass("bv-tab-error"); break; case this.STATUS_VALID: d ? i.filter('[data-bv-validator="' + d + '"]').hide() : i.hide(); var o = 0 == i.filter(function () { var c = a(this).css("display"), d = a(this).attr("data-bv-validator"); return "block" == c || b.data("bv.result." + d) != e.STATUS_VALID }).length; this.disableSubmitButtons(!o), j && j.removeClass(this.options.feedbackIcons.invalid).removeClass(this.options.feedbackIcons.validating).removeClass(this.options.feedbackIcons.valid).addClass(o ? this.options.feedbackIcons.valid : this.options.feedbackIcons.invalid).show(); var p = function (c) { return 0 == c.find(".help-block[data-bv-validator]").filter(function () { var c = a(this).css("display"), d = a(this).attr("data-bv-validator"); return "block" == c || b.data("bv.result." + d) && b.data("bv.result." + d) != e.STATUS_VALID }).length }; g.removeClass("has-error has-success").addClass(p(g) ? "has-success" : "has-error"), m && m.removeClass("bv-tab-success").removeClass("bv-tab-error").addClass(p(n) ? "bv-tab-success" : "bv-tab-error"); break; case this.STATUS_NOT_VALIDATED: default: this.disableSubmitButtons(!1), g.removeClass("has-success").removeClass("has-error"), d ? i.filter('.help-block[data-bv-validator="' + d + '"]').hide() : i.hide(), j && j.removeClass(this.options.feedbackIcons.valid).removeClass(this.options.feedbackIcons.invalid).removeClass(this.options.feedbackIcons.validating).hide(), m && m.removeClass("bv-tab-success").removeClass("bv-tab-error") }return this }, isValid: function () { var b, c, d, e, f, g, h, i; for (c in this.options.fields) if (null != this.options.fields[c] && this.options.fields[c].enabled) for (b = this.getFieldElements(c), e = b.attr("type"), h = "radio" == e || "checkbox" == e ? 1 : b.length, i = 0; h > i; i++)if (d = a(b[i]), !this._isExcluded(d)) for (g in this.options.fields[c].validators) { if (f = d.data("bv.result." + g), f == this.STATUS_NOT_VALIDATED || f == this.STATUS_VALIDATING) return !1; if (f == this.STATUS_INVALID) return this.$invalidField = d, !1 } return !0 }, defaultSubmit: function () { this.$form.off("submit.bv").submit() }, resetForm: function (b) { var c, d, e, f, g; for (c in this.options.fields) { d = this.getFieldElements(c), e = d.length; for (var h = 0; e > h; h++)for (g in this.options.fields[c].validators) a(d[h]).removeData("bv.dfs." + g); this.updateStatus(c, this.STATUS_NOT_VALIDATED, null), b && (f = d.attr("type"), "radio" == f || "checkbox" == f ? d.removeAttr("checked").removeAttr("selected") : d.val("")) } return this.$invalidField = null, this.$submitButton = null, this.disableSubmitButtons(!1), this }, enableFieldValidators: function (a, b) { return this.options.fields[a].enabled = b, this.updateStatus(a, this.STATUS_NOT_VALIDATED, null), this } }, a.fn.bootstrapValidator = function (c) { var d = arguments; return this.each(function () { var e = a(this), f = e.data("bootstrapValidator"), g = "object" == typeof c && c; f || (f = new b(this, g), e.data("bootstrapValidator", f)), "string" == typeof c && f[c].apply(f, Array.prototype.slice.call(d, 1)) }) }, a.fn.bootstrapValidator.validators = {}, a.fn.bootstrapValidator.Constructor = b, a.fn.bootstrapValidator.helpers = { date: function (a, b, c, d) { if (1e3 > a || a > 9999 || 0 == b || b > 12) return !1; var e = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; if ((a % 400 == 0 || a % 100 != 0 && a % 4 == 0) && (e[1] = 29), 0 > c || c > e[b - 1]) return !1; if (d === !0) { var f = new Date, g = f.getFullYear(), h = f.getMonth(), i = f.getDate(); return g > a || a == g && h > b - 1 || a == g && b - 1 == h && i > c } return !0 }, luhn: function (a) { for (var b = a.length, c = 0, d = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]], e = 0; b--;)e += d[c][parseInt(a.charAt(b), 10)], c ^= 1; return e % 10 === 0 && e > 0 }, mod_11_10: function (a) { for (var b = 5, c = a.length, d = 0; c > d; d++)b = (2 * (b || 10) % 11 + parseInt(a.charAt(d), 10)) % 10; return 1 == b }, mod_37_36: function (a, b) { b = b || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"; for (var c = b.length, d = a.length, e = Math.floor(c / 2), f = 0; d > f; f++)e = (2 * (e || c) % (c + 1) + b.indexOf(a.charAt(f))) % c; return 1 == e } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.base64 = { validate: function (a, b) { var c = b.val(); return "" == c ? !0 : /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(c) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.between = { html5Attributes: { message: "message", min: "min", max: "max", inclusive: "inclusive" }, enableByHtml5: function (a) { return "range" == a.attr("type") ? { min: a.attr("min"), max: a.attr("max") } : !1 }, validate: function (a, b, c) { var d = b.val(); return "" == d ? !0 : (d = parseFloat(d), c.inclusive === !0 ? d > c.min && d < c.max : d >= c.min && d <= c.max) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.callback = { validate: function (b, c, d) { var e = c.val(); if (d.callback && "function" == typeof d.callback) { var f = new a.Deferred; return f.resolve(c, "callback", d.callback.call(this, e, b)), f } return !0 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.choice = { html5Attributes: { message: "message", min: "min", max: "max" }, validate: function (a, b, c) { var d = b.is("select") ? a.getFieldElements(b.attr("data-bv-field")).find("option").filter(":selected").length : a.getFieldElements(b.attr("data-bv-field")).filter(":checked").length; return c.min && d < c.min || c.max && d > c.max ? !1 : !0 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.creditCard = { validate: function (b, c) { var d = c.val(); if ("" == d) return !0; if (/[^0-9-\s]+/.test(d)) return !1; if (d = d.replace(/\D/g, ""), !a.fn.bootstrapValidator.helpers.luhn(d)) return !1; var e, f, g = { AMERICAN_EXPRESS: { length: [15], prefix: ["34", "37"] }, DINERS_CLUB: { length: [14], prefix: ["300", "301", "302", "303", "304", "305", "36"] }, DINERS_CLUB_US: { length: [16], prefix: ["54", "55"] }, DISCOVER: { length: [16], prefix: ["6011", "622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925", "644", "645", "646", "647", "648", "649", "65"] }, JCB: { length: [16], prefix: ["3528", "3529", "353", "354", "355", "356", "357", "358"] }, LASER: { length: [16, 17, 18, 19], prefix: ["6304", "6706", "6771", "6709"] }, MAESTRO: { length: [12, 13, 14, 15, 16, 17, 18, 19], prefix: ["5018", "5020", "5038", "6304", "6759", "6761", "6762", "6763", "6764", "6765", "6766"] }, MASTERCARD: { length: [16], prefix: ["51", "52", "53", "54", "55"] }, SOLO: { length: [16, 18, 19], prefix: ["6334", "6767"] }, UNIONPAY: { length: [16, 17, 18, 19], prefix: ["622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925"] }, VISA: { length: [16], prefix: ["4"] } }; for (e in g) for (f in g[e].prefix) if (d.substr(0, g[e].prefix[f].length) == g[e].prefix[f] && -1 != g[e].length.indexOf(d.length)) return !0; return !1 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.cusip = { validate: function (b, c) { var d = c.val(); if ("" == d) return !0; if (d = d.toUpperCase(), !/^[0-9A-Z]{9}$/.test(d)) return !1; for (var e = a.map(d.split(""), function (a) { var b = a.charCodeAt(0); return b >= "A".charCodeAt(0) && b <= "Z".charCodeAt(0) ? b - "A".charCodeAt(0) + 10 : a }), f = e.length, g = 0, h = 0; f - 1 > h; h++) { var i = parseInt(e[h]); h % 2 != 0 && (i *= 2), i > 9 && (i -= 9), g += i } return g = (10 - g % 10) % 10, g == e[f - 1] } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.cvv = { html5Attributes: { message: "message", ccfield: "creditCardField" }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; if (!/^[0-9]{3,4}$/.test(d)) return !1; if (!c.creditCardField) return !0; var e = a.getFieldElements(c.creditCardField).val(); if ("" == e) return !0; e = e.replace(/\D/g, ""); var f, g, h = { AMERICAN_EXPRESS: { length: [15], prefix: ["34", "37"] }, DINERS_CLUB: { length: [14], prefix: ["300", "301", "302", "303", "304", "305", "36"] }, DINERS_CLUB_US: { length: [16], prefix: ["54", "55"] }, DISCOVER: { length: [16], prefix: ["6011", "622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925", "644", "645", "646", "647", "648", "649", "65"] }, JCB: { length: [16], prefix: ["3528", "3529", "353", "354", "355", "356", "357", "358"] }, LASER: { length: [16, 17, 18, 19], prefix: ["6304", "6706", "6771", "6709"] }, MAESTRO: { length: [12, 13, 14, 15, 16, 17, 18, 19], prefix: ["5018", "5020", "5038", "6304", "6759", "6761", "6762", "6763", "6764", "6765", "6766"] }, MASTERCARD: { length: [16], prefix: ["51", "52", "53", "54", "55"] }, SOLO: { length: [16, 18, 19], prefix: ["6334", "6767"] }, UNIONPAY: { length: [16, 17, 18, 19], prefix: ["622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925"] }, VISA: { length: [16], prefix: ["4"] } }, i = null; for (f in h) for (g in h[f].prefix) if (e.substr(0, h[f].prefix[g].length) == h[f].prefix[g] && -1 != h[f].length.indexOf(e.length)) { i = f; break } return null == i ? !1 : "AMERICAN_EXPRESS" == i ? 4 == d.length : 3 == d.length } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.date = { html5Attributes: { message: "message", format: "format" }, validate: function (b, c, d) { var e = c.val(); if ("" == e) return !0; d.format = d.format || "MM/DD/YYYY"; var f = d.format.split(" "), g = f[0], h = f.length > 1 ? f[1] : null, i = f.length > 2 ? f[2] : null, j = e.split(" "), k = j[0], l = j.length > 1 ? j[1] : null; if (f.length != j.length) return !1; var m = -1 != k.indexOf("/") ? "/" : -1 != k.indexOf("-") ? "-" : null; if (null == m) return !1; k = k.split(m), g = g.split(m); var n = k[g.indexOf("YYYY")], o = k[g.indexOf("MM")], p = k[g.indexOf("DD")], q = null, r = null, s = null; if (h) { if (h = h.split(":"), l = l.split(":"), h.length != l.length) return !1; if (r = l.length > 0 ? l[0] : null, q = l.length > 1 ? l[1] : null, s = l.length > 2 ? l[2] : null, s && (s = parseInt(s, 10), 0 > s || s > 60)) return !1; if (r && (r = parseInt(r, 10), 0 > r || r >= 24 || i && r > 12)) return !1; if (q && (q = parseInt(q, 10), 0 > q || q > 59)) return !1 } return p = parseInt(p, 10), o = parseInt(o, 10), n = parseInt(n, 10), a.fn.bootstrapValidator.helpers.date(n, o, p) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.different = { html5Attributes: { message: "message", field: "field" }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; var e = a.getFieldElements(c.field); return null == e ? !0 : d != e.val() ? (a.updateStatus(c.field, a.STATUS_VALID, "different"), !0) : !1 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.digits = { validate: function (a, b) { var c = b.val(); return "" == c ? !0 : /^\d+$/.test(c) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.ean = { validate: function (a, b) { var c = b.val(); if ("" == c) return !0; if (!/^(\d{8}|\d{12}|\d{13})$/.test(c)) return !1; for (var d = c.length, e = 0, f = 8 == d ? [3, 1] : [1, 3], g = 0; d - 1 > g; g++)e += parseInt(c.charAt(g)) * f[g % 2]; return e = 10 - e % 10, e == c.charAt(d - 1) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.emailAddress = { enableByHtml5: function (a) { return "email" == a.attr("type") }, validate: function (a, b) { var c = b.val(); if ("" == c) return !0; var d = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; return d.test(c) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.file = { html5Attributes: { extension: "extension", maxsize: "maxSize", message: "message", type: "type" }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; var e, f = c.extension ? c.extension.split(",") : null, g = c.type ? c.type.split(",") : null, h = window.File && window.FileList && window.FileReader; if (h) for (var i = b.get(0).files, j = i.length, k = 0; j > k; k++) { if (c.maxSize && i[k].size > parseInt(c.maxSize)) return !1; if (e = i[k].name.substr(i[k].name.lastIndexOf(".") + 1), f && -1 == f.indexOf(e)) return !1; if (g && -1 == g.indexOf(i[k].type)) return !1 } else if (e = d.substr(d.lastIndexOf(".") + 1), f && -1 == f.indexOf(e)) return !1; return !0 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.greaterThan = { html5Attributes: { message: "message", value: "value", inclusive: "inclusive" }, enableByHtml5: function (a) { var b = a.attr("min"); return b ? { value: b } : !1 }, validate: function (a, b, c) { var d = b.val(); return "" == d ? !0 : (d = parseFloat(d), c.inclusive === !0 ? d > c.value : d >= c.value) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.grid = { validate: function (b, c) { var d = c.val(); return "" == d ? !0 : (d = d.toUpperCase(), /^[GRID:]*([0-9A-Z]{2})[-\s]*([0-9A-Z]{5})[-\s]*([0-9A-Z]{10})[-\s]*([0-9A-Z]{1})$/g.test(d) ? (d = d.replace(/\s/g, "").replace(/-/g, ""), "GRID:" == d.substr(0, 5) && (d = d.substr(5)), a.fn.bootstrapValidator.helpers.mod_37_36(d)) : !1) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.hex = { validate: function (a, b) { var c = b.val(); return "" == c ? !0 : /^[0-9a-fA-F]+$/.test(c) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.hexColor = { enableByHtml5: function (a) { return "color" == a.attr("type") }, validate: function (a, b) { var c = b.val(); return "" == c ? !0 : /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(c) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.iban = { html5Attributes: { message: "message", country: "country" }, validate: function (b, c, d) { var e = c.val(); if ("" == e) return !0; var f = { AD: "AD[0-9]{2}[0-9]{4}[0-9]{4}[A-Z0-9]{12}", AE: "AE[0-9]{2}[0-9]{3}[0-9]{16}", AL: "AL[0-9]{2}[0-9]{8}[A-Z0-9]{16}", AO: "AO[0-9]{2}[0-9]{21}", AT: "AT[0-9]{2}[0-9]{5}[0-9]{11}", AZ: "AZ[0-9]{2}[A-Z]{4}[A-Z0-9]{20}", BA: "BA[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{8}[0-9]{2}", BE: "BE[0-9]{2}[0-9]{3}[0-9]{7}[0-9]{2}", BF: "BF[0-9]{2}[0-9]{23}", BG: "BG[0-9]{2}[A-Z]{4}[0-9]{4}[0-9]{2}[A-Z0-9]{8}", BH: "BH[0-9]{2}[A-Z]{4}[A-Z0-9]{14}", BI: "BI[0-9]{2}[0-9]{12}", BJ: "BJ[0-9]{2}[A-Z]{1}[0-9]{23}", BR: "BR[0-9]{2}[0-9]{8}[0-9]{5}[0-9]{10}[A-Z][A-Z0-9]", CH: "CH[0-9]{2}[0-9]{5}[A-Z0-9]{12}", CI: "CI[0-9]{2}[A-Z]{1}[0-9]{23}", CM: "CM[0-9]{2}[0-9]{23}", CR: "CR[0-9]{2}[0-9]{3}[0-9]{14}", CV: "CV[0-9]{2}[0-9]{21}", CY: "CY[0-9]{2}[0-9]{3}[0-9]{5}[A-Z0-9]{16}", CZ: "CZ[0-9]{2}[0-9]{20}", DE: "DE[0-9]{2}[0-9]{8}[0-9]{10}", DK: "DK[0-9]{2}[0-9]{14}", DO: "DO[0-9]{2}[A-Z0-9]{4}[0-9]{20}", DZ: "DZ[0-9]{2}[0-9]{20}", EE: "EE[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{11}[0-9]{1}", ES: "ES[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{1}[0-9]{1}[0-9]{10}", FI: "FI[0-9]{2}[0-9]{6}[0-9]{7}[0-9]{1}", FO: "FO[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}", FR: "FR[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}", GB: "GB[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}", GE: "GE[0-9]{2}[A-Z]{2}[0-9]{16}", GI: "GI[0-9]{2}[A-Z]{4}[A-Z0-9]{15}", GL: "GL[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}", GR: "GR[0-9]{2}[0-9]{3}[0-9]{4}[A-Z0-9]{16}", GT: "GT[0-9]{2}[A-Z0-9]{4}[A-Z0-9]{20}", HR: "HR[0-9]{2}[0-9]{7}[0-9]{10}", HU: "HU[0-9]{2}[0-9]{3}[0-9]{4}[0-9]{1}[0-9]{15}[0-9]{1}", IE: "IE[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}", IL: "IL[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{13}", IR: "IR[0-9]{2}[0-9]{22}", IS: "IS[0-9]{2}[0-9]{4}[0-9]{2}[0-9]{6}[0-9]{10}", IT: "IT[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}", JO: "JO[0-9]{2}[A-Z]{4}[0-9]{4}[0]{8}[A-Z0-9]{10}", KW: "KW[0-9]{2}[A-Z]{4}[0-9]{22}", KZ: "KZ[0-9]{2}[0-9]{3}[A-Z0-9]{13}", LB: "LB[0-9]{2}[0-9]{4}[A-Z0-9]{20}", LI: "LI[0-9]{2}[0-9]{5}[A-Z0-9]{12}", LT: "LT[0-9]{2}[0-9]{5}[0-9]{11}", LU: "LU[0-9]{2}[0-9]{3}[A-Z0-9]{13}", LV: "LV[0-9]{2}[A-Z]{4}[A-Z0-9]{13}", MC: "MC[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}", MD: "MD[0-9]{2}[A-Z0-9]{20}", ME: "ME[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}", MG: "MG[0-9]{2}[0-9]{23}", MK: "MK[0-9]{2}[0-9]{3}[A-Z0-9]{10}[0-9]{2}", ML: "ML[0-9]{2}[A-Z]{1}[0-9]{23}", MR: "MR13[0-9]{5}[0-9]{5}[0-9]{11}[0-9]{2}", MT: "MT[0-9]{2}[A-Z]{4}[0-9]{5}[A-Z0-9]{18}", MU: "MU[0-9]{2}[A-Z]{4}[0-9]{2}[0-9]{2}[0-9]{12}[0-9]{3}[A-Z]{3}", MZ: "MZ[0-9]{2}[0-9]{21}", NL: "NL[0-9]{2}[A-Z]{4}[0-9]{10}", NO: "NO[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{1}", PK: "PK[0-9]{2}[A-Z]{4}[A-Z0-9]{16}", PL: "PL[0-9]{2}[0-9]{8}[0-9]{16}", PS: "PS[0-9]{2}[A-Z]{4}[A-Z0-9]{21}", PT: "PT[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{11}[0-9]{2}", QA: "QA[0-9]{2}[A-Z]{4}[A-Z0-9]{21}", RO: "RO[0-9]{2}[A-Z]{4}[A-Z0-9]{16}", RS: "RS[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}", SA: "SA[0-9]{2}[0-9]{2}[A-Z0-9]{18}", SE: "SE[0-9]{2}[0-9]{3}[0-9]{16}[0-9]{1}", SI: "SI[0-9]{2}[0-9]{5}[0-9]{8}[0-9]{2}", SK: "SK[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{10}", SM: "SM[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}", SN: "SN[0-9]{2}[A-Z]{1}[0-9]{23}", TN: "TN59[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}", TR: "TR[0-9]{2}[0-9]{5}[A-Z0-9]{1}[A-Z0-9]{16}", VG: "VG[0-9]{2}[A-Z]{4}[0-9]{16}" }; e = e.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(); var g = d.country || e.substr(0, 2); if (!f[g]) return !1; if (!new RegExp("^" + f[g] + "$").test(e)) return !1; e = e.substr(4) + e.substr(0, 4), e = a.map(e.split(""), function (a) { var b = a.charCodeAt(0); return b >= "A".charCodeAt(0) && b <= "Z".charCodeAt(0) ? b - "A".charCodeAt(0) + 10 : a }), e = e.join(""); for (var h = parseInt(e.substr(0, 1), 10), i = e.length, j = 1; i > j; ++j)h = (10 * h + parseInt(e.substr(j, 1), 10)) % 97; return 1 == h } } }(window.jQuery), function (a) {
    a.fn.bootstrapValidator.validators.id = {
        html5Attributes: { message: "message", country: "country" }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; var e = c.country || d.substr(0, 2), f = ["_", e.toLowerCase()].join(""); return this[f] && "function" == typeof this[f] ? this[f](d) : !0 }, _validateJMBG: function (a, b) { if (!/^\d{13}$/.test(a)) return !1; var c = parseInt(a.substr(0, 2), 10), d = parseInt(a.substr(2, 2), 10), e = (parseInt(a.substr(4, 3), 10), parseInt(a.substr(7, 2), 10)), f = parseInt(a.substr(12, 1), 10); if (c > 31 || d > 12) return !1; for (var g = 0, h = 0; 6 > h; h++)g += (7 - h) * (parseInt(a.charAt(h)) + parseInt(a.charAt(h + 6))); if (g = 11 - g % 11, (10 == g || 11 == g) && (g = 0), g != f) return !1; switch (b.toUpperCase()) { case "BA": return e >= 10 && 19 >= e; case "MK": return e >= 41 && 49 >= e; case "ME": return e >= 20 && 29 >= e; case "RS": return e >= 70 && 99 >= e; case "SI": return e >= 50 && 59 >= e; default: return !0 } }, _ba: function (a) { return this._validateJMBG(a, "BA") }, _mk: function (a) { return this._validateJMBG(a, "MK") }, _me: function (a) { return this._validateJMBG(a, "ME") }, _rs: function (a) { return this._validateJMBG(a, "RS") }, _si: function (a) { return this._validateJMBG(a, "SI") }, _bg: function (b) { if (!/^\d{10}$/.test(b) && !/^\d{6}\s\d{3}\s\d{1}$/.test(b)) return !1; b = b.replace(/\s/g, ""); var c = parseInt(b.substr(0, 2), 10) + 1900, d = parseInt(b.substr(2, 2), 10), e = parseInt(b.substr(4, 2), 10); if (d > 40 ? (c += 100, d -= 40) : d > 20 && (c -= 100, d -= 20), !a.fn.bootstrapValidator.helpers.date(c, d, e)) return !1; for (var f = 0, g = [2, 4, 8, 5, 10, 9, 7, 3, 6], h = 0; 9 > h; h++)f += parseInt(b.charAt(h)) * g[h]; return f = f % 11 % 10, f == b.substr(9, 1) }, _br: function (a) { if (/^1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11}|0{11}$/.test(a)) return !1; if (!/^\d{11}$/.test(a) && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(a)) return !1; a = a.replace(/\./g, "").replace(/-/g, ""); for (var b = 0, c = 0; 9 > c; c++)b += (10 - c) * parseInt(a.charAt(c)); if (b = 11 - b % 11, (10 == b || 11 == b) && (b = 0), b != a.charAt(9)) return !1; var d = 0; for (c = 0; 10 > c; c++)d += (11 - c) * parseInt(a.charAt(c)); return d = 11 - d % 11, (10 == d || 11 == d) && (d = 0), d == a.charAt(10) }, _ch: function (a) { if (!/^756[\.]{0,1}[0-9]{4}[\.]{0,1}[0-9]{4}[\.]{0,1}[0-9]{2}$/.test(a)) return !1; a = a.replace(/\D/g, "").substr(3); for (var b = a.length, c = 0, d = 8 == b ? [3, 1] : [1, 3], e = 0; b - 1 > e; e++)c += parseInt(a.charAt(e)) * d[e % 2]; return c = 10 - c % 10, c == a.charAt(b - 1) }, _cl: function (a) { if (!/^\d{7,8}[-]{0,1}[0-9K]$/.test(a)) return !1; for (a = a.replace(/\D/g, ""); a.length < 9;)a = "0" + a; for (var b = 0, c = [3, 2, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b = 11 - b % 11, 11 == b ? b = 0 : 10 == b && (b = "K"), b == a.charAt(8) }, _cz: function (b) { if (!/^\d{9,10}$/.test(b)) return !1; var c = 1900 + parseInt(b.substr(0, 2)), d = parseInt(b.substr(2, 2)) % 50 % 20, e = parseInt(b.substr(4, 2)); if (9 == b.length) { if (c >= 1980 && (c -= 100), c > 1953) return !1 } else 1954 > c && (c += 100); if (!a.fn.bootstrapValidator.helpers.date(c, d, e)) return !1; if (10 == b.length) { var f = parseInt(b.substr(0, 9), 10) % 11; return 1985 > c && (f %= 10), f == b.substr(9, 1) } return !0 }, _dk: function (b) { if (!/^[0-9]{6}[-]{0,1}[0-9]{4}$/.test(b)) return !1; b = b.replace(/-/g, ""); var c = parseInt(b.substr(0, 2), 10), d = parseInt(b.substr(2, 2), 10), e = parseInt(b.substr(4, 2), 10); switch (!0) { case -1 != "5678".indexOf(b.charAt(6)) && e >= 58: e += 1800; break; case -1 != "0123".indexOf(b.charAt(6)): case -1 != "49".indexOf(b.charAt(6)) && e >= 37: e += 1900; break; default: e += 2e3 }return a.fn.bootstrapValidator.helpers.date(e, d, c) }, _ee: function (a) { return this._lt(a) }, _es: function (a) { if (!/^[0-9A-Z]{8}[-]{0,1}[0-9A-Z]$/.test(a) && !/^[XYZ][-]{0,1}[0-9]{7}[-]{0,1}[0-9A-Z]$/.test(a)) return !1; a = a.replace(/-/g, ""); var b = "XYZ".indexOf(a.charAt(0)); -1 != b && (a = b + a.substr(1) + ""); var c = parseInt(a.substr(0, 8), 10); return c = "TRWAGMYFPDXBNJZSQVHLCKE"[c % 23], c == a.substr(8, 1) }, _fi: function (b) { if (!/^[0-9]{6}[-+A][0-9]{3}[0-9ABCDEFHJKLMNPRSTUVWXY]$/.test(b)) return !1; var c = parseInt(b.substr(0, 2), 10), d = parseInt(b.substr(2, 2), 10), e = parseInt(b.substr(4, 2), 10), f = { "+": 1800, "-": 1900, A: 2e3 }; if (e = f[b.charAt(6)] + e, !a.fn.bootstrapValidator.helpers.date(e, d, c)) return !1; var g = parseInt(b.substr(7, 3)); if (2 > g) return !1; var h = b.substr(0, 6) + b.substr(7, 3) + ""; return h = parseInt(h), "0123456789ABCDEFHJKLMNPRSTUVWXY".charAt(h % 31) == b.charAt(10) }, _hr: function (b) { return /^[0-9]{11}$/.test(b) ? a.fn.bootstrapValidator.helpers.mod_11_10(b) : !1 }, _ie: function (a) { if (!/^\d{7}[A-W][AHWTX]?$/.test(a)) return !1; var b = function (a) { for (; a.length < 7;)a = "0" + a; for (var b = "WABCDEFGHIJKLMNOPQRSTUV", c = 0, d = 0; 7 > d; d++)c += parseInt(a.charAt(d)) * (8 - d); return c += 9 * b.indexOf(a.substr(7)), b[c % 23] }; return 9 != a.length || "A" != a.charAt(8) && "H" != a.charAt(8) ? a.charAt(7) == b(a.substr(0, 7)) : a.charAt(7) == b(a.substr(0, 7) + a.substr(8) + "") }, _is: function (b) { if (!/^[0-9]{6}[-]{0,1}[0-9]{4}$/.test(b)) return !1; b = b.replace(/-/g, ""); var c = parseInt(b.substr(0, 2), 10), d = parseInt(b.substr(2, 2), 10), e = parseInt(b.substr(4, 2), 10), f = parseInt(b.charAt(9)); if (e = 9 == f ? 1900 + e : 100 * (20 + f) + e, !a.fn.bootstrapValidator.helpers.date(e, d, c, !0)) return !1; for (var g = 0, h = [3, 2, 7, 6, 5, 4, 3, 2], i = 0; 8 > i; i++)g += parseInt(b.charAt(i)) * h[i]; return g = 11 - g % 11, g == b.charAt(8) }, _lt: function (b) { if (!/^[0-9]{11}$/.test(b)) return !1; var c = parseInt(b.charAt(0)), d = parseInt(b.substr(1, 2), 10), e = parseInt(b.substr(3, 2), 10), f = parseInt(b.substr(5, 2), 10), g = c % 2 == 0 ? 17 + c / 2 : 17 + (c + 1) / 2; if (d = 100 * g + d, !a.fn.bootstrapValidator.helpers.date(d, e, f, !0)) return !1; for (var h = 0, i = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1], j = 0; 10 > j; j++)h += parseInt(b.charAt(j)) * i[j]; if (h %= 11, 10 != h) return h == b.charAt(10); for (h = 0, i = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3], j = 0; 10 > j; j++)h += parseInt(b.charAt(j)) * i[j]; return h %= 11, 10 == h && (h = 0), h == b.charAt(10) }, _lv: function (b) { if (!/^[0-9]{6}[-]{0,1}[0-9]{5}$/.test(b)) return !1; b = b.replace(/\D/g, ""); var c = parseInt(b.substr(0, 2)), d = parseInt(b.substr(2, 2)), e = parseInt(b.substr(4, 2)); if (e = e + 1800 + 100 * parseInt(b.charAt(6)), !a.fn.bootstrapValidator.helpers.date(e, d, c, !0)) return !1; for (var f = 0, g = [10, 5, 8, 4, 2, 1, 6, 3, 7, 9], h = 0; 10 > h; h++)f += parseInt(b.charAt(h)) * g[h]; return f = (f + 1) % 11 % 10, f == b.charAt(10) }, _nl: function (a) { for (; a.length < 9;)a = "0" + a; if (!/^[0-9]{4}[.]{0,1}[0-9]{2}[.]{0,1}[0-9]{3}$/.test(a)) return !1; if (a = a.replace(/\./g, ""), 0 == parseInt(a, 10)) return !1; for (var b = 0, c = a.length, d = 0; c - 1 > d; d++)b += (9 - d) * parseInt(a.charAt(d)); return b %= 11, 10 == b && (b = 0), b == a.charAt(c - 1) }, _ro: function (b) {
            if (!/^[0-9]{13}$/.test(b)) return !1; var c = parseInt(b.charAt(0)); if (0 == c || 7 == c || 8 == c) return !1; var d = parseInt(b.substr(1, 2), 10), e = parseInt(b.substr(3, 2), 10), f = parseInt(b.substr(5, 2), 10), g = { 1: 1900, 2: 1900, 3: 1800, 4: 1800, 5: 2e3, 6: 2e3 }; if (f > 31 && e > 12) return !1; if (9 != c && (d = g[c + ""] + d, !a.fn.bootstrapValidator.helpers.date(d, e, f))) return !1; for (var h = 0, i = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9], j = b.length, k = 0; j - 1 > k; k++)h += parseInt(b.charAt(k)) * i[k];
            return h %= 11, 10 == h && (h = 1), h == b.charAt(j - 1)
        }, _se: function (b) { if (!/^[0-9]{10}$/.test(b) && !/^[0-9]{6}[-|+][0-9]{4}$/.test(b)) return !1; b = b.replace(/[^0-9]/g, ""); var c = parseInt(b.substr(0, 2)) + 1900, d = parseInt(b.substr(2, 2)), e = parseInt(b.substr(4, 2)); return a.fn.bootstrapValidator.helpers.date(c, d, e) ? a.fn.bootstrapValidator.helpers.luhn(b) : !1 }, _sk: function (a) { return this._cz(a) }, _sm: function (a) { return /^\d{5}$/.test(a) }, _za: function (b) { if (!/^[0-9]{10}[0|1][8|9][0-9]$/.test(b)) return !1; var c = parseInt(b.substr(0, 2)), d = (new Date).getFullYear() % 100, e = parseInt(b.substr(2, 2)), f = parseInt(b.substr(4, 2)); return c = c >= d ? c + 1900 : c + 2e3, a.fn.bootstrapValidator.helpers.date(c, e, f) ? a.fn.bootstrapValidator.helpers.luhn(b) : !1 }
    }
}(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.identical = { html5Attributes: { message: "message", field: "field" }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; var e = a.getFieldElements(c.field); return null == e ? !0 : d == e.val() ? (a.updateStatus(c.field, a.STATUS_VALID, "identical"), !0) : !1 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.imei = { validate: function (b, c) { var d = c.val(); if ("" == d) return !0; switch (!0) { case /^\d{15}$/.test(d): case /^\d{2}-\d{6}-\d{6}-\d{1}$/.test(d): case /^\d{2}\s\d{6}\s\d{6}\s\d{1}$/.test(d): return d = d.replace(/[^0-9]/g, ""), a.fn.bootstrapValidator.helpers.luhn(d); case /^\d{14}$/.test(d): case /^\d{16}$/.test(d): case /^\d{2}-\d{6}-\d{6}(|-\d{2})$/.test(d): case /^\d{2}\s\d{6}\s\d{6}(|\s\d{2})$/.test(d): return !0; default: return !1 } } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.integer = { enableByHtml5: function (a) { return "number" == a.attr("type") }, validate: function (a, b) { var c = b.val(); return "" == c ? !0 : /^(?:-?(?:0|[1-9][0-9]*))$/.test(c) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.ip = { html5Attributes: { message: "message", ipv4: "ipv4", ipv6: "ipv6" }, validate: function (b, c, d) { var e = c.val(); return "" == e ? !0 : (d = a.extend({}, { ipv4: !0, ipv6: !0 }, d), d.ipv4 ? /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(e) : d.ipv6 ? /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(str) : !1) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.isbn = { validate: function (a, b) { var c = b.val(); if ("" == c) return !0; var d; switch (!0) { case /^\d{9}[\dX]$/.test(c): case 13 == c.length && /^(\d+)-(\d+)-(\d+)-([\dX])$/.test(c): case 13 == c.length && /^(\d+)\s(\d+)\s(\d+)\s([\dX])$/.test(c): d = "ISBN10"; break; case /^(978|979)\d{9}[\dX]$/.test(c): case 17 == c.length && /^(978|979)-(\d+)-(\d+)-(\d+)-([\dX])$/.test(c): case 17 == c.length && /^(978|979)\s(\d+)\s(\d+)\s(\d+)\s([\dX])$/.test(c): d = "ISBN13"; break; default: return !1 }c = c.replace(/[^0-9X]/gi, ""); var e, f = c.split(""), g = f.length, h = 0; switch (d) { case "ISBN10": h = 0; for (var i = 0; g - 1 > i; i++)h += (10 - i) * parseInt(f[i]); return e = 11 - h % 11, 11 == e ? e = 0 : 10 == e && (e = "X"), e + "" == f[g - 1]; case "ISBN13": h = 0; for (var i = 0; g - 1 > i; i++)h += i % 2 == 0 ? parseInt(f[i]) : 3 * parseInt(f[i]); return e = 10 - h % 10, 10 == e && (e = "0"), e + "" == f[g - 1]; default: return !1 } } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.isin = { COUNTRY_CODES: "AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW", validate: function (a, b) { var c = b.val(); if ("" == c) return !0; c = c.toUpperCase(); var d = new RegExp("^(" + this.COUNTRY_CODES + ")[0-9A-Z]{10}$"); if (!d.test(c)) return !1; for (var e = "", f = c.length, g = 0; f - 1 > g; g++) { var h = c.charCodeAt(g); e += h > 57 ? (h - 55).toString() : c.charAt(g) } var i = "", j = e.length, k = j % 2 != 0 ? 0 : 1; for (g = 0; j > g; g++)i += parseInt(e[g]) * (g % 2 == k ? 2 : 1) + ""; var l = 0; for (g = 0; g < i.length; g++)l += parseInt(i.charAt(g)); return l = (10 - l % 10) % 10, l == c.charAt(f - 1) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.ismn = { validate: function (a, b) { var c = b.val(); if ("" == c) return !0; var d; switch (!0) { case /^M\d{9}$/.test(c): case /^M-\d{4}-\d{4}-\d{1}$/.test(c): case /^M\s\d{4}\s\d{4}\s\d{1}$/.test(c): d = "ISMN10"; break; case /^9790\d{9}$/.test(c): case /^979-0-\d{4}-\d{4}-\d{1}$/.test(c): case /^979\s0\s\d{4}\s\d{4}\s\d{1}$/.test(c): d = "ISMN13"; break; default: return !1 }"ISMN10" == d && (c = "9790" + c.substr(1)), c = c.replace(/[^0-9]/gi, ""); for (var e = c.length, f = 0, g = [1, 3], h = 0; e - 1 > h; h++)f += parseInt(c.charAt(h)) * g[h % 2]; return f = 10 - f % 10, f == c.charAt(e - 1) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.issn = { validate: function (a, b) { var c = b.val(); if ("" == c) return !0; if (!/^\d{4}\-\d{3}[\dX]$/.test(c)) return !1; c = c.replace(/[^0-9X]/gi, ""); var d = c.split(""), e = d.length, f = 0; "X" == d[7] && (d[7] = 10); for (var g = 0; e > g; g++)f += (8 - g) * parseInt(d[g]); return f % 11 == 0 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.lessThan = { html5Attributes: { message: "message", value: "value", inclusive: "inclusive" }, enableByHtml5: function (a) { var b = a.attr("max"); return b ? { value: b } : !1 }, validate: function (a, b, c) { var d = b.val(); return "" == d ? !0 : (d = parseFloat(d), c.inclusive === !1 ? d <= c.value : d < c.value) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.mac = { validate: function (a, b) { var c = b.val(); return "" == c ? !0 : /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/.test(c) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.notEmpty = { enableByHtml5: function (a) { var b = a.attr("required") + ""; return "required" == b || "true" == b }, validate: function (b, c) { var d = c.attr("type"); return "radio" == d || "checkbox" == d ? b.getFieldElements(c.attr("data-bv-field")).filter(":checked").length > 0 : "" != a.trim(c.val()) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.numeric = { html5Attributes: { message: "message", separator: "separator" }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; var e = c.separator || "."; return "." != e && (d = d.replace(e, ".")), !isNaN(parseFloat(d)) && isFinite(d) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.phone = { html5Attributes: { message: "message", country: "country" }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; var e = (c.country || "US").toUpperCase(); switch (e) { case "US": default: return d = d.replace(/\D/g, ""), /^(?:(1\-?)|(\+1 ?))?\(?(\d{3})[\)\-\.]?(\d{3})[\-\.]?(\d{4})$/.test(d) && 10 == d.length } } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.regexp = { html5Attributes: { message: "message", regexp: "regexp" }, enableByHtml5: function (a) { var b = a.attr("pattern"); return b ? { regexp: b } : !1 }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; var e = "string" == typeof c.regexp ? new RegExp(c.regexp) : c.regexp; return e.test(d) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.remote = { html5Attributes: { message: "message", url: "url", name: "name" }, validate: function (b, c, d) { var e = c.val(); if ("" == e) return !0; var f = c.attr("data-bv-field"), g = d.data; null == g && (g = {}), "function" == typeof g && (g = g.call(this, b)), g[d.name || f] = e; var h = new a.Deferred, i = a.ajax({ type: "POST", url: d.url, dataType: "json", data: g }); return i.then(function (a) { h.resolve(c, "remote", a.valid === !0 || "true" === a.valid) }), h.fail(function () { i.abort() }), h } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.rtn = { validate: function (a, b) { var c = b.val(); if ("" == c) return !0; if (!/^\d{9}$/.test(c)) return !1; for (var d = 0, e = 0; e < c.length; e += 3)d += 3 * parseInt(c.charAt(e), 10) + 7 * parseInt(c.charAt(e + 1), 10) + parseInt(c.charAt(e + 2), 10); return 0 != d && d % 10 == 0 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.sedol = { validate: function (a, b) { var c = b.val(); if ("" == c) return !0; if (c = c.toUpperCase(), !/^[0-9A-Z]{7}$/.test(c)) return !1; for (var d = 0, e = [1, 3, 1, 7, 3, 9, 1], f = c.length, g = 0; f - 1 > g; g++)d += e[g] * parseInt(c.charAt(g), 36); return d = (10 - d % 10) % 10, d == c.charAt(f - 1) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.siren = { validate: function (b, c) { var d = c.val(); return "" == d ? !0 : /^\d{9}$/.test(d) ? a.fn.bootstrapValidator.helpers.luhn(d) : !1 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.siret = { validate: function (a, b) { var c = b.val(); if ("" == c) return !0; for (var d, e = 0, f = c.length, g = 0; f > g; g++)d = parseInt(c.charAt(g), 10), g % 2 == 0 && (d = 2 * d, d > 9 && (d -= 9)), e += d; return e % 10 == 0 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.step = { html5Attributes: { message: "message", base: "baseValue", step: "step" }, validate: function (b, c, d) { var e = c.val(); if ("" == e) return !0; if (d = a.extend({}, { baseValue: 0, step: 1 }, d), e = parseFloat(e), isNaN(e) || !isFinite(e)) return !1; var f = function (a, b) { var c = Math.pow(10, b); a *= c; var d = a > 0 | -(0 > a), e = a % 1 === .5 * d; return e ? (Math.floor(a) + (d > 0)) / c : Math.round(a) / c }, g = function (a, b) { if (0 == b) return 1; var c = (a + "").split("."), d = (b + "").split("."), e = (1 == c.length ? 0 : c[1].length) + (1 == d.length ? 0 : d[1].length); return f(a - b * Math.floor(a / b), e) }, h = g(e - d.baseValue, d.step); return 0 == h || h == d.step } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.stringCase = { html5Attributes: { message: "message", "case": "case" }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; var e = (c["case"] || "lower").toLowerCase(); switch (e) { case "upper": return d === d.toUpperCase(); case "lower": default: return d === d.toLowerCase() } } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.stringLength = { html5Attributes: { message: "message", min: "min", max: "max" }, enableByHtml5: function (a) { var b = a.attr("maxlength"); return b ? { max: parseInt(b, 10) } : !1 }, validate: function (b, c, d) { var e = c.val(); if ("" == e) return !0; var f = a.trim(e).length; return d.min && f < d.min || d.max && f > d.max ? !1 : !0 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.uri = { enableByHtml5: function (a) { return "url" == a.attr("type") }, validate: function (a, b) { var c = b.val(); if ("" == c) return !0; var d = new RegExp("^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?!10(?:\\.\\d{1,3}){3})(?!127(?:\\.\\d{1,3}){3})(?!169\\.254(?:\\.\\d{1,3}){2})(?!192\\.168(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:/[^\\s]*)?$", "i"); return d.test(c) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.uuid = { html5Attributes: { message: "message", version: "version" }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; var e = { 3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i, 4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, 5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i }, f = c.version ? c.version + "" : "all"; return null == e[f] ? !0 : e[f].test(d) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.vat = { html5Attributes: { message: "message", country: "country" }, validate: function (a, b, c) { var d = b.val(); if ("" == d) return !0; var e = c.country || d.substr(0, 2), f = ["_", e.toLowerCase()].join(""); return this[f] && "function" == typeof this[f] ? this[f](d) : !0 }, _at: function (a) { if (!/^ATU[0-9]{8}$/.test(a)) return !1; a = a.substr(3); for (var b = 0, c = [1, 2, 1, 2, 1, 2, 1], d = 0, e = 0; 7 > e; e++)d = parseInt(a.charAt(e)) * c[e], d > 9 && (d = Math.floor(d / 10) + d % 10), b += d; return b = 10 - (b + 4) % 10, 10 == b && (b = 0), b == a.substr(7, 1) }, _be: function (a) { if (!/^BE[0]{0,1}[0-9]{9}$/.test(a)) return !1; if (a = a.substr(2), 9 == a.length && (a = "0" + a), 0 == a.substr(1, 1)) return !1; var b = parseInt(a.substr(0, 8), 10) + parseInt(a.substr(8, 2), 10); return b % 97 == 0 }, _bg: function (b) { if (!/^BG[0-9]{9,10}$/.test(b)) return !1; b = b.substr(2); var c = 0, d = 0; if (9 == b.length) { for (d = 0; 8 > d; d++)c += parseInt(b.charAt(d)) * (d + 1); if (c %= 11, 10 == c) for (c = 0, d = 0; 8 > d; d++)c += parseInt(b.charAt(d)) * (d + 3); return c %= 10, c == b.substr(8) } if (10 == b.length) { var e = function (b) { var c = parseInt(b.substr(0, 2), 10) + 1900, d = parseInt(b.substr(2, 2), 10), e = parseInt(b.substr(4, 2), 10); if (d > 40 ? (c += 100, d -= 40) : d > 20 && (c -= 100, d -= 20), !a.fn.bootstrapValidator.helpers.date(c, d, e)) return !1; for (var f = 0, g = [2, 4, 8, 5, 10, 9, 7, 3, 6], h = 0; 9 > h; h++)f += parseInt(b.charAt(h)) * g[h]; return f = f % 11 % 10, f == b.substr(9, 1) }, f = function (a) { for (var b = 0, c = [21, 19, 17, 13, 11, 9, 7, 3, 1], d = 0; 9 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b %= 10, b == a.substr(9, 1) }, g = function (a) { for (var b = 0, c = [4, 3, 2, 7, 6, 5, 4, 3, 2], d = 0; 9 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b = 11 - b % 11, 10 == b ? !1 : (11 == b && (b = 0), b == a.substr(9, 1)) }; return e(b) || f(b) || g(b) } return !1 }, _ch: function (a) { if (!/^CHE[0-9]{9}(MWST)?$/.test(a)) return !1; a = a.substr(3); for (var b = 0, c = [5, 4, 3, 2, 7, 6, 5, 4], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d]; return b = 11 - b % 11, 10 == b ? !1 : (11 == b && (b = 0), b == a.substr(8, 1)) }, _cy: function (a) { if (!/^CY[0-5|9]{1}[0-9]{7}[A-Z]{1}$/.test(a)) return !1; if (a = a.substr(2), "12" == a.substr(0, 2)) return !1; for (var b = 0, c = { 0: 1, 1: 0, 2: 5, 3: 7, 4: 9, 5: 13, 6: 15, 7: 17, 8: 19, 9: 21 }, d = 0; 8 > d; d++) { var e = parseInt(a.charAt(d), 10); d % 2 == 0 && (e = c[e + ""]), b += e } return b = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[b % 26], b == a.substr(8, 1) }, _cz: function (b) { if (!/^CZ[0-9]{8,10}$/.test(b)) return !1; b = b.substr(2); var c = 0, d = 0; if (8 == b.length) { if (b.charAt(0) + "" == "9") return !1; for (c = 0, d = 0; 7 > d; d++)c += parseInt(b.charAt(d), 10) * (8 - d); return c = 11 - c % 11, 10 == c && (c = 0), 11 == c && (c = 1), c == b.substr(7, 1) } if (9 == b.length && b.charAt(0) + "" == "6") { for (c = 0, d = 0; 7 > d; d++)c += parseInt(b.charAt(d + 1), 10) * (8 - d); return c = 11 - c % 11, 10 == c && (c = 0), 11 == c && (c = 1), c = [8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 10][c - 1], c == b.substr(8, 1) } if (9 == b.length || 10 == b.length) { var e = 1900 + parseInt(b.substr(0, 2)), f = parseInt(b.substr(2, 2)) % 50 % 20, g = parseInt(b.substr(4, 2)); if (9 == b.length) { if (e >= 1980 && (e -= 100), e > 1953) return !1 } else 1954 > e && (e += 100); if (!a.fn.bootstrapValidator.helpers.date(e, f, g)) return !1; if (10 == b.length) { var h = parseInt(b.substr(0, 9), 10) % 11; return 1985 > e && (h %= 10), h == b.substr(9, 1) } return !0 } return !1 }, _de: function (b) { return /^DE[0-9]{9}$/.test(b) ? (b = b.substr(2), a.fn.bootstrapValidator.helpers.mod_11_10(b)) : !1 }, _dk: function (a) { if (!/^DK[0-9]{8}$/.test(a)) return !1; a = a.substr(2); for (var b = 0, c = [2, 7, 6, 5, 4, 3, 2, 1], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d]; return b % 11 == 0 }, _ee: function (a) { if (!/^EE[0-9]{9}$/.test(a)) return !1; a = a.substr(2); for (var b = 0, c = [3, 7, 1, 3, 7, 1, 3, 7, 1], d = 0; 9 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b % 10 == 0 }, _es: function (a) { if (!/^ES[0-9A-Z][0-9]{7}[0-9A-Z]$/.test(a)) return !1; a = a.substr(2); var b = function (a) { var b = parseInt(a.substr(0, 8), 10); return b = "TRWAGMYFPDXBNJZSQVHLCKE"[b % 23], b == a.substr(8, 1) }, c = function (a) { var b = ["XYZ".indexOf(a.charAt(0)), a.substr(1)].join(""); return b = parseInt(b, 10), b = "TRWAGMYFPDXBNJZSQVHLCKE"[b % 23], b == a.substr(8, 1) }, d = function (a) { var b, c = a.charAt(0); if (-1 != "KLM".indexOf(c)) return b = parseInt(a.substr(1, 8), 10), b = "TRWAGMYFPDXBNJZSQVHLCKE"[b % 23], b == a.substr(8, 1); if (-1 != "ABCDEFGHJNPQRSUVW".indexOf(c)) { for (var d = 0, e = [2, 1, 2, 1, 2, 1, 2], f = 0, g = 0; 7 > g; g++)f = parseInt(a.charAt(g + 1)) * e[g], f > 9 && (f = Math.floor(f / 10) + f % 10), d += f; return d = 10 - d % 10, d == a.substr(8, 1) || "JABCDEFGHI"[d] == a.substr(8, 1) } return !1 }, e = a.charAt(0); return /^[0-9]$/.test(e) ? b(a) : /^[XYZ]$/.test(e) ? c(a) : d(a) }, _fi: function (a) { if (!/^FI[0-9]{8}$/.test(a)) return !1; a = a.substr(2); for (var b = 0, c = [7, 9, 10, 5, 8, 4, 2, 1], d = 0; 8 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b % 11 == 0 }, _fr: function (b) { if (!/^FR[0-9A-Z]{2}[0-9]{9}$/.test(b)) return !1; if (b = b.substr(2), !a.fn.bootstrapValidator.helpers.luhn(b.substr(2))) return !1; if (/^[0-9]{2}$/.test(b.substr(0, 2))) return b.substr(0, 2) == parseInt(b.substr(2) + "12", 10) % 97; var c, d = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ"; return c = /^[0-9]{1}$/.test(b.charAt(0)) ? 24 * d.indexOf(b.charAt(0)) + d.indexOf(b.charAt(1)) - 10 : 34 * d.indexOf(b.charAt(0)) + d.indexOf(b.charAt(1)) - 100, (parseInt(b.substr(2), 10) + 1 + Math.floor(c / 11)) % 11 == c % 11 }, _gb: function (a) { if (!(/^GB[0-9]{9}$/.test(a) || /^GB[0-9]{12}$/.test(a) || /^GBGD[0-9]{3}$/.test(a) || /^GBHA[0-9]{3}$/.test(a) || /^GB(GD|HA)8888[0-9]{5}$/.test(a))) return !1; a = a.substr(2); var b = a.length; if (5 == b) { var c = a.substr(0, 2), d = parseInt(a.substr(2)); return "GD" == c && 500 > d || "HA" == c && d >= 500 } if (11 == b && ("GD8888" == a.substr(0, 6) || "HA8888" == a.substr(0, 6))) return "GD" == a.substr(0, 2) && parseInt(a.substr(6, 3)) >= 500 || "HA" == a.substr(0, 2) && parseInt(a.substr(6, 3)) < 500 ? !1 : parseInt(a.substr(6, 3)) % 97 == parseInt(a.substr(9, 2)); if (9 == b || 12 == b) { for (var e = 0, f = [8, 7, 6, 5, 4, 3, 2, 10, 1], g = 0; 9 > g; g++)e += parseInt(a.charAt(g)) * f[g]; return e %= 97, parseInt(a.substr(0, 3)) >= 100 ? 0 == e || 42 == e || 55 == e : 0 == e } return !0 }, _gr: function (a) { if (!/^GR[0-9]{9}$/.test(a)) return !1; a = a.substr(2), 8 == a.length && (a = "0" + a); for (var b = 0, c = [256, 128, 64, 32, 16, 8, 4, 2], d = 0; 8 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b = b % 11 % 10, b == a.substr(8, 1) }, _el: function (a) { return /^EL[0-9]{9}$/.test(a) ? (a = "GR" + a.substr(2), this._gr(a)) : !1 }, _hu: function (a) { if (!/^HU[0-9]{8}$/.test(a)) return !1; a = a.substr(2); for (var b = 0, c = [9, 7, 3, 1, 9, 7, 3, 1], d = 0; 8 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b % 10 == 0 }, _hr: function (b) { return /^HR[0-9]{11}$/.test(b) ? (b = b.substr(2), a.fn.bootstrapValidator.helpers.mod_11_10(b)) : !1 }, _ie: function (a) { if (!/^IE[0-9]{1}[0-9A-Z\*\+]{1}[0-9]{5}[A-Z]{1,2}$/.test(a)) return !1; a = a.substr(2); var b = function (a) { for (; a.length < 7;)a = "0" + a; for (var b = "WABCDEFGHIJKLMNOPQRSTUV", c = 0, d = 0; 7 > d; d++)c += parseInt(a.charAt(d)) * (8 - d); return c += 9 * b.indexOf(a.substr(7)), b[c % 23] }; return /^[0-9]+$/.test(a.substr(0, 7)) ? a.charAt(7) == b(a.substr(0, 7) + a.substr(8) + "") : -1 != "ABCDEFGHIJKLMNOPQRSTUVWXYZ+*".indexOf(a.charAt(1)) ? a.charAt(7) == b(a.substr(2, 5) + a.substr(0, 1) + "") : !0 }, _it: function (b) { if (!/^IT[0-9]{11}$/.test(b)) return !1; if (b = b.substr(2), 0 == parseInt(b.substr(0, 7))) return !1; var c = parseInt(b.substr(7, 3)); return 1 > c || c > 201 && 999 != c && 888 != c ? !1 : a.fn.bootstrapValidator.helpers.luhn(b) }, _lt: function (a) { if (!/^LT([0-9]{7}1[0-9]{1}|[0-9]{10}1[0-9]{1})$/.test(a)) return !1; a = a.substr(2); for (var b = a.length, c = 0, d = 0; b - 1 > d; d++)c += parseInt(a.charAt(d)) * (1 + d % 9); var e = c % 11; if (10 == e) { c = 0; for (var d = 0; b - 1 > d; d++)c += parseInt(a.charAt(d)) * (1 + (d + 2) % 9) } return e = e % 11 % 10, e == a.charAt(b - 1) }, _lu: function (a) { return /^LU[0-9]{8}$/.test(a) ? (a = a.substr(2), a.substr(0, 6) % 89 == a.substr(6, 2)) : !1 }, _lv: function (b) { if (!/^LV[0-9]{11}$/.test(b)) return !1; b = b.substr(2); var c = parseInt(b.charAt(0)), d = 0, e = [], f = 0, g = b.length; if (c > 3) { for (d = 0, e = [9, 1, 4, 8, 3, 10, 2, 5, 7, 6, 1], f = 0; g > f; f++)d += parseInt(b.charAt(f)) * e[f]; return d %= 11, 3 == d } var h = parseInt(b.substr(0, 2)), i = parseInt(b.substr(2, 2)), j = parseInt(b.substr(4, 2)); if (j = j + 1800 + 100 * parseInt(b.charAt(6)), !a.fn.bootstrapValidator.helpers.date(j, i, h)) return !1; for (d = 0, e = [10, 5, 8, 4, 2, 1, 6, 3, 7, 9], f = 0; g - 1 > f; f++)d += parseInt(b.charAt(f)) * e[f]; return d = (d + 1) % 11 % 10, d == b.charAt(g - 1) }, _mt: function (a) { if (!/^MT[0-9]{8}$/.test(a)) return !1; a = a.substr(2); for (var b = 0, c = [3, 4, 6, 7, 8, 9, 10, 1], d = 0; 8 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b % 37 == 0 }, _nl: function (a) { if (!/^NL[0-9]{9}B[0-9]{2}$/.test(a)) return !1; a = a.substr(2); for (var b = 0, c = [9, 8, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b %= 11, b > 9 && (b = 0), b == a.substr(8, 1) }, _no: function (a) { if (!/^NO[0-9]{9}$/.test(a)) return !1; a = a.substr(2); for (var b = 0, c = [3, 2, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b = 11 - b % 11, 11 == b && (b = 0), b == a.substr(8, 1) }, _pl: function (a) { if (!/^PL[0-9]{10}$/.test(a)) return !1; a = a.substr(2); for (var b = 0, c = [6, 5, 7, 2, 3, 4, 5, 6, 7, -1], d = 0; 10 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b % 11 == 0 }, _pt: function (a) { if (!/^PT[0-9]{9}$/.test(a)) return !1; a = a.substr(2); for (var b = 0, c = [9, 8, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b = 11 - b % 11, b > 9 && (b = 0), b == a.substr(8, 1) }, _ro: function (a) { if (!/^RO[1-9][0-9]{1,9}$/.test(a)) return !1; a = a.substr(2); for (var b = a.length, c = [7, 5, 3, 2, 1, 7, 5, 3, 2].slice(10 - b), d = 0, e = 0; b - 1 > e; e++)d += parseInt(a.charAt(e)) * c[e]; return d = 10 * d % 11 % 10, d == a.substr(b - 1, 1) }, _ru: function (a) { if (!/^RU([0-9]{9}|[0-9]{12})$/.test(a)) return !1; if (a = a.substr(2), 10 == a.length) { for (var b = 0, c = [2, 4, 10, 3, 5, 9, 4, 6, 8, 0], d = 0; 10 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b %= 11, b > 9 && (b %= 10), b == a.substr(9, 1) } if (12 == a.length) { for (var e = 0, f = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0], g = 0, h = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0], d = 0; 11 > d; d++)e += parseInt(a.charAt(d)) * f[d], g += parseInt(a.charAt(d)) * h[d]; return e %= 11, e > 9 && (e %= 10), g %= 11, g > 9 && (g %= 10), e == a.substr(10, 1) && g == a.substr(11, 1) } return !1 }, _rs: function (a) { if (!/^RS[0-9]{9}$/.test(a)) return !1; a = a.substr(2); for (var b = 10, c = 0, d = 0; 8 > d; d++)c = (parseInt(a.charAt(d)) + b) % 10, 0 == c && (c = 10), b = 2 * c % 11; return (b + parseInt(a.substr(8, 1))) % 10 == 1 }, _se: function (b) { return /^SE[0-9]{10}01$/.test(b) ? (b = b.substr(2, 10), a.fn.bootstrapValidator.helpers.luhn(b)) : !1 }, _si: function (a) { if (!/^SI[0-9]{8}$/.test(a)) return !1; a = a.substr(2); for (var b = 0, c = [8, 7, 6, 5, 4, 3, 2], d = 0; 7 > d; d++)b += parseInt(a.charAt(d)) * c[d]; return b = 11 - b % 11, 10 == b && (b = 0), b == a.substr(7, 1) }, _sk: function (a) { return /^SK[1-9][0-9][(2-4)|(6-9)][0-9]{7}$/.test(a) ? (a = a.substr(2), a % 11 == 0) : !1 } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.vin = { validate: function (a, b) { var c = b.val(); if ("" == c) return !0; if (!/^[a-hj-npr-z0-9]{8}[0-9xX][a-hj-npr-z0-9]{8}$/i.test(c)) return !1; c = c.toUpperCase(); for (var d = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 0: 0 }, e = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2], f = 0, g = c.length, h = 0; g > h; h++)f += d[c.charAt(h) + ""] * e[h]; var i = f % 11; return 10 == i && (i = "X"), i == c.charAt(8) } } }(window.jQuery), function (a) { a.fn.bootstrapValidator.validators.zipCode = { html5Attributes: { message: "message", country: "country" }, validate: function (a, b, c) { var d = b.val(); if ("" == d || !c.country) return !0; var e = (c.country || "US").toUpperCase(); switch (e) { case "CA": return /(?:A|B|C|E|G|J|K|L|M|N|P|R|S|T|V|X|Y){1}[0-9]{1}(?:A|B|C|E|G|J|K|L|M|N|P|R|S|T|V|X|Y){1}\s?[0-9]{1}(?:A|B|C|E|G|J|K|L|M|N|P|R|S|T|V|X|Y){1}[0-9]{1}/i.test(d); case "DK": return /^(DK(-|\s)?)?\d{4}$/i.test(d); case "GB": return this._gb(d); case "IT": return /^(I-|IT-)?\d{5}$/i.test(d); case "NL": return /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(d); case "SE": return /^(S-)?\d{3}\s?\d{2}$/i.test(d); case "US": default: return /^\d{4,5}([\-]\d{4})?$/.test(d) } }, _gb: function (a) { for (var b = "[ABCDEFGHIJKLMNOPRSTUWYZ]", c = "[ABCDEFGHKLMNOPQRSTUVWXY]", d = "[ABCDEFGHJKPMNRSTUVWXY]", e = "[ABEHMNPRVWXY]", f = "[ABDEFGHJLNPQRSTUWXYZ]", g = [new RegExp("^(" + b + "{1}" + c + "?[0-9]{1,2})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(" + b + "{1}[0-9]{1}" + d + "{1})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(" + b + "{1}" + c + "{1}?[0-9]{1}" + e + "{1})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(BF1)(\\s*)([0-6]{1}[ABDEFGHJLNPQRST]{1}[ABDEFGHJLNPQRSTUWZYZ]{1})$", "i"), /^(GIR)(\s*)(0AA)$/i, /^(BFPO)(\s*)([0-9]{1,4})$/i, /^(BFPO)(\s*)(c\/o\s*[0-9]{1,3})$/i, /^([A-Z]{4})(\s*)(1ZZ)$/i, /^(AI-2640)$/i], h = 0; h < g.length; h++)if (g[h].test(a)) return !0; return !1 } } }(window.jQuery);