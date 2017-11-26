// This function is called immediately. The second function is passed in
// as the factory parameter to this function.
(function (factory) {
    // If there is a variable named module and it has an exports property,
    // then we're working in a Node-like environment. Use require to load
    // the jQuery object that the module system is using and pass it in.
    if (typeof module === "object" && typeof module.exports === "object") {
        factory(require("jquery"), require("jss"), window, document);
    }
    // Otherwise, we're working in a browser, so just pass in the global
    // jQuery object.
    else {
        factory(jQuery, jss, window, document);
    }
}(function ($, jss, window, document, undefined) {
    // This code will receive whatever jQuery object was passed in from
    // the function above and will attach the plugin to it.
    var first = true;
    var defaults = {
        initial: '',
        margins: '8px',
        active_class: 'metroselect-active',
        option_class: 'metroselect-option',
        container_class: 'metroselect-container',
        guide_class: 'metroselect-guide',
        guide_text_left: '[',
        guide_text_right: ']',
        onchange: function () { }
    };

    function MetroSelect(select, options) {
        this.select = select;
        this.settings = $.extend({}, defaults, options);
        this.metroSelect = $("<div class='" + this.settings.container_class + "'></div>");
        this.childContainer = $("<span></span>");
    }

    // Initialize and replace DOM elements.
    MetroSelect.prototype.init = function () {
        this.select.parent().append(this.metroSelect);
        this.select.hide();

        this.childContainer = $("<span></span>");
        var children = this.select.children();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var childElement = $("<span class='" + this.settings.option_class + " " + child.className + "'>" + child.text + "</span>");
            childElement.click(this.select_child.bind(this, child.text));

            this.childContainer.append(childElement);
        }

        this.metroSelect.append($("<span class='" + this.settings.guide_class + "'>" + this.settings.guide_text_left + "</span>"));
        this.metroSelect.append(this.childContainer);
        this.metroSelect.append($("<span class='" + this.settings.guide_class + "'>" + this.settings.guide_text_right + "</span>"));

        jss.set('.' + this.settings.option_class, {
            'display': 'inline-block',
            'cursor': 'pointer',
            'opacity': '0.5',
            'margin-left': this.settings.margins,
            'margin-right': this.settings.margins,
            'transition': 'opacity .25s linear',
            '-webkit-transition': 'opacity .25s linear'
        });
        jss.set('.' + this.settings.active_class, {
            'opacity': '1',
            'transition': 'opacity .25s linear',
            '-webkit-transition': 'opacity .25s linear'
        });
        jss.set('.' + this.settings.guide_class + ':first-child', {
            'margin-right': this.settings.margins,
        });
        jss.set('.' + this.settings.guide_class + ':last-child', {
            'margin-left': this.settings.margins,
        });

        //set the default visibilities
        this.set_active(this.settings.initial);
    };
    
    // Make cihldText the active item and trigger callbacks.
    MetroSelect.prototype.select_child = function (childText) {
        this.set_active(childText);
        this.settings.onchange(child.text());
    };

    // Make childText the acitve item.
    MetroSelect.prototype.set_active = function (childText) {
        var selectedChild = this.childContainer.find(":contains('" + childText + "')");
        selectedChild = selectedChild.filter(function () { return $(this).text() === childText; });
        if (selectedChild.length === 0) {
            selectedChild = this.childContainer.find(">:first-child");
        }

        var child = $(selectedChild);
        child.siblings().removeClass(this.settings.active_class);
        child.addClass(this.settings.active_class);
    };

    $.fn.metroSelect = function (options) {
        var select = $(this);

        if (!select.data('metroSelect')) {
            var metroSelect = new MetroSelect(select, options);
            select.data('metroSelect', metroSelect);
            metroSelect.init(select);

            return metroSelect;
        } else {
            return select.data('metroSelect');
        }
    };
}));