/*!
 * jQuery Equalizer plugin
 * Original author: Andrew
 */

;(function( $ ) {
    $.fn.equalizer = function( options ) {
        /**
         * Сам конструктор
         * @param container - элемент-контейнер
         * @param timeout - время выполнения анимации
         * @param colWidth - ширина каждого столбика в пикселях
         * @constructor
         */
        function Equalizer ( container, timeout, colWidth ) {
            this.container = container;
            this.timeout = timeout;
            this.colWidth = colWidth;
            this.spans = [];
            this.isInDefaultPosition = true;

            var colQuantity = Math.ceil( container.width() / colWidth ),
                fragment = document.createDocumentFragment(),
                cols = new Array( colQuantity ),
                span = $('<span/>').css({
                    verticalAlign: 'bottom',
                    display: 'inline-block',

                    fontSize: 0,
                    lineHeight: 0,

                    width: colWidth,
                    background: 'pink',
                    borderTop: '2px solid red'
                }),
                i = 0,
                newSpan;

            for ( i; i < cols.length; i++ ) {
                newSpan = span.clone();
                newSpan.appendTo( fragment );
                this.spans.push( newSpan );
            }

            container.css({
                verticalAlign: 'bottom',
                lineHeight: container.height() + 'px'
            });

            container.append( fragment );
            this.spans = $( 'span', this.container );

            this.spans.each(function( index, element ) {
                $(element).height( this.container.height() / 2 );
            }.bind( this ) );

            this.run();
        }

        /**
         * Рекурсивно анимирует "столбики"
         */
        Equalizer.prototype.run = function () {
            this.spans.each(function( index, element ) {
                $(element).animate({
                        height: this.getNewSpanHeight.call( this )
                    },
                    this.timeout,
                    'linear'
                )
            }.bind( this )).promise().done(function() {
                this.isInDefaultPosition = !this.isInDefaultPosition;
                this.run();
            }.bind( this ));
        };

        /**
         * Возвращает рандомное целое число в необъодимом ренже
         * @param min
         * @param max
         * @returns {number}
         */
        Equalizer.prototype.getRandomInteger = function(min, max) {
            return Math.round( Math.random() * (max - min) + min );
        };

        /**
         * Подсчитывает новую высоту "столбика" в зависимости
         * от текущего положения
         * @returns {*}
         */
        Equalizer.prototype.getNewSpanHeight = function() {
            if ( this.isInDefaultPosition ) {
                return  this.getRandomInteger( 0, this.container.height() );
            } else {
                return this.container.height() / 2;
            }
        };

        return this.each(function() {
            var settings = $.extend({
                timeout: 1000,
                colWidth: 2
            }, options );

            // Предотвращаем несколько инициализаций
            if ( !$.data( this, 'plugin_Equalizer' ) ) {
                $.data(this, 'plugin_Equalizer',
                    new Equalizer( $(this), settings.timeout, settings.colWidth ) );
            }
        })
    }
}( jQuery ));