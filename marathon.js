import { createApp } from 'https://unpkg.com/vue@3.2.45/dist/vue.esm-browser.js?module'
import $ from 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/+esm?module'

createApp({
    data() {
        return {
            marathons: [],
            currentMarathon: [],
            quotes: [],
            randomQuote: "",
            currentPage: 1
        }
    },

    mounted: function () {
        this.loadQuotes();
        let min = Math.ceil(1);
        let max = Math.floor(8);
        let randomPage = Math.floor(Math.random() * (max - min) + min);
        let randomMarathon = Math.floor(Math.random() * 10);
        this.loadPage(randomPage);
        this.loadMarathon((randomPage - 1) * 10 + randomMarathon);
    },

    methods: {
        loadQuotes() {
            let url = 'data/quotes.json';
            $.get(url, (data) => {
                this.quotes = data
                this.randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
            });
        },

        loadMarathons(page) {
            let url = 'content/data/marathons' + page + '.json';
            $.get(url, (data) => {
                this.marathons = data
            });
        },

        loadAll() {
            let a = [];
            let self = this;
            for (let i = 1; i < 11; i++) {
                let url = 'content/data/marathons' + i + '.json';
                $.get({
                    url, success: function (data) {
                        if (i == 1) {
                            a = data;
                            self.loadMarathon(1);
                        } else {
                            a.data = a.data.concat(data.data);
                        }
                    },
                    async: false
                });
            }
            this.marathons = a;
        },

        loadMarathon(id) {
            let url = 'content/data/marathon' + id.toString() + '.json';
            $.get(url, (data) => {
                this.currentMarathon = data
            });
            this.randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        },

        loadPage(page) {
            this.currentPage = page;
            this.loadMarathons(page);
            this.loadMarathon((page - 1) * 10 + 1);
        },
    }
}).mount('#app');

