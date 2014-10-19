/**
 * Эквалайзер
 * NO CHAINING CALLS
 * @param selector
 * @param timeout
 * @param colWidth
 * @returns {{run: (function(this:Equalizer))}}
 * @constructor
 */
function Equalizer( selector, timeout, colWidth ) {
    var columnsFragment = document.createDocumentFragment(),
        columnWidth = colWidth || 1,
        spans = [],
        columnQuantity,
        newSpan,
        span;

    this.animatedElements = 0;

    // Сохраняем публичный линк на контейнер на случай необходимости
    this.container = document.querySelector( selector );
    this.timeout = timeout || 1000;
    this.spans = spans;

    if ( !this.container ) {
        throw new Error('Element "' + selector + '" not found');
    }

    this.container.style.verticalAlign = 'bottom';
    this.container.style.lineHeight = this.container.clientHeight + 'px';

    // Кол-во столбиков
    columnQuantity = Math.ceil( this.container.clientWidth / columnWidth );

    // Создаем span, который будем в дальнейшем клонировать и добавлять во фрагмент
    span = document.createElement('span');

    span.style.verticalAlign = 'bottom';
    span.style.display = 'inline-block';

    span.style.fontSize = 0 + 'px';
    span.style.lineHeight = 0 + 'px';

    span.style.width = colWidth + 'px';
    span.style.background = 'pink';
    span.style.borderTop = '2px solid red';

    // Создаем "столбики" и добавляем во фрагмент
    for ( var i = 0; i < columnQuantity; i++ ) {
        // Клонируем ранее созданный элемент, а не создаем абсолютно новый
        newSpan = span.cloneNode( false );
        // Сохраняем линки на "столбики"
        spans.push( newSpan );

        columnsFragment.appendChild( newSpan );
    }

    this.container.appendChild( columnsFragment );

    // Делаем публичным только метод "run"
    return {
        run: this.run.bind( this )
    };
}

/**
 * Метод выставляет дефолтную высоту "столбиков",
 * считает таймаут между вызовами функции изменения высоты
 * и запускает анимацию.
 *
 * TODO: Не мешает добавить функцию, которая бы считала таймаут более точно.
 */
Equalizer.prototype.run = function () {
    var targetSpanHeight = this.container.clientHeight / 2,
        i = 0;

    // Выставляем всем "столбикам" начальную высоту равную середине контейнера
    for ( i; i < this.spans.length; i++ ) {
        this.spans[ i ].style.height = targetSpanHeight + 'px';
    }

    this.separate();
};

Equalizer.prototype.getRandomInteger = function(min, max) {
    return Math.round( Math.random() * (max - min) + min );
};

Equalizer.prototype.separate = function() {
    var i = 0,
        currentSpan,
        targetHeight,
        animateTimeout;

    this.animatedElements = this.spans.length;

    for ( i; i < this.spans.length; i++ ) {
        targetHeight = this.getRandomInteger( 0, this.container.clientHeight );
        currentSpan = this.spans[ i ];

        animateTimeout = this.timeout / ( Math.abs( this.container.clientHeight / 2 - targetHeight ) || 1 );
        animateTimeout = Math.floor( animateTimeout );
        this.animateHeight( currentSpan, targetHeight, animateTimeout, this.join );
    }
};

Equalizer.prototype.join = function() {
    var targetSpanHeight = this.container.clientHeight / 2,
        i = 0,
        currentSpan,
        currentHeight,
        animateTimeout;

    this.animatedElements = this.spans.length;

    for ( i; i < this.spans.length; i++ ) {
        currentSpan = this.spans[ i ];
        currentHeight = parseInt( getComputedStyle( currentSpan ).height );
        animateTimeout = this.timeout / ( Math.abs( currentHeight - targetSpanHeight ) || 1 );
        animateTimeout = Math.floor( animateTimeout );

        this.animateHeight( currentSpan, targetSpanHeight, animateTimeout, this.separate );
    }
};

/**
 *
 * @param element - ссылка на элемент
 * @param targetHeight - конечная высота "столбика"
 * @param animateTimeout
 * @param endCallback - вызывается после окончания анимации всех "столбиков"
 */
Equalizer.prototype.animateHeight = function( element, targetHeight, animateTimeout, endCallback ) {
    var currentHeight = parseInt( getComputedStyle( element ).height );

    setTimeout(function () {
        if ( currentHeight < targetHeight ) {
            element.style.height = currentHeight + 1 + 'px';
            this.animateHeight( element, targetHeight, animateTimeout, endCallback );
        } else if ( currentHeight > targetHeight ) {
            element.style.height = currentHeight - 1 + 'px';
            this.animateHeight( element, targetHeight, animateTimeout, endCallback );
        } else {
            this.animatedElements -= 1;

            if ( this.animatedElements == 0 ) {
                endCallback.call( this );
                console.log('Animation end');
            }
        }
    }.bind( this ), animateTimeout  );
};