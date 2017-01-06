(function stylesheetJS(global, doc) {
    "use strict";
    var selection = doc.getElementById('elementType'),
        borderColor = doc.getElementById('borderColor'),
        documentText = doc.getElementById('documentText'),
        swapThemeButton = doc.getElementById('swapTheme'),
        cardProto = Object.create(HTMLDivElement.prototype),
        /**
         *
         * @return {string|*}
         */
        getSelectOption = function getSelectOption() {
            return selection.value;
        },
        /**
         *
         * @return {HTMLElement}
         */
        getElement = function getElement() {
            var el = doc.querySelector(getSelectOption());
            if (el.shadowRoot) {
                return el.shadowRoot.querySelector('.cardStyle');
            }
            return el;
        },
        getBorderColor = function () {
            var target = getElement();
            target.style.borderColor = this.value;
            // target.style.setProperty('border-color', this.value);
            //
        },
        getDocumentText = function () {
            var target = getElement();
            target.querySelector('.documentText').textContent = this.value
        },
        swapTheme = function swapTheme() {
            var styleSheets = doc.styleSheets,
                i = 0,
                len = styleSheets.length,
                styleSheet;
            for (;i < len; i += 1) {
                styleSheet = styleSheets[i];
                if (styleSheet.title === 'pagestyle') {
                    if (styleSheet.href.indexOf('darkSheet') !== -1) {
                        styleSheet.ownerNode.href = '/views/03_stylesheet/css/stylesheet.css';
                    } else {
                        styleSheet.ownerNode.href = '/views/03_stylesheet/css/darkSheet.css';
                    }
                }
            }
        },
        cardObj,
        createShadowCard = function createShadowCard() {
            // Create a Shadow Root
            var shadow = this.attachShadow({mode: 'open'}),
                card = doc.createElement('x-card'),
                div = doc.createElement('div'),
                style = doc.createElement('style');
            style.innerHTML = `
                .cardStyle {
                        --blue: #2f2eff;
                        --yellow: #d8ce35;
                        --paddingHeight: 2rem;
                        --outlineStyle: dotted;
                        --defaultPadding: var(--outlineStyle) var(--paddingHeight) var(--blue);
                        --defaultHeight: 40rem;
                        --defaultWidth: 40rem;
                        --darkGrey: #868686;
                        --largeFont: 3rem;
                        --lineHeight: calc(var(--defaultHeight) - (var(--paddingHeight) * 2));
                        --display: inline-block;
                        border: var(--defaultPadding);
                        height: var(--defaultHeight);
                        width: var(--defaultWidth);
                        background: var(--darkGrey);
                        display: var(--display);
                }
                .cardStyle .documentText {
                    color: var(--yellow);
                    line-height: var(--lineHeight);
                    font-size: var(--largeFont);
                }
                .text-center {
                    text-align:center;
                }
            `;
            div.classList.add('documentText', 'text-center');
            card.classList.add('cardStyle');
            div.textContent = 'Hello From Card';
            card.appendChild(div);
            shadow.append(style);
            shadow.appendChild(card);
        };
    cardProto.createdCallback = createShadowCard;
    cardObj = doc.registerElement('x-card', {
        prototype: cardProto,
        extends: 'div'
    });
    borderColor.addEventListener('change', getBorderColor);
    documentText.addEventListener('keyup', getDocumentText);
    swapThemeButton.addEventListener('click', swapTheme);
}(this, document));
