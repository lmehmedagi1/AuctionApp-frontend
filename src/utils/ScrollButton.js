import React from 'react'

class ScrollButton extends React.Component {

    constructor() {
        super();
    }

    delay = async ms => new Promise(res => setTimeout(res, ms));

    scrollToTop = async () => {
        while (window.pageYOffset > 0) {
            await this.delay(16.66);
            window.scroll(0, window.pageYOffset - 50);
        }
    }
}

export default new ScrollButton();
