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

        loadMarathons() {
            let url = 'data/marathons' + this.currentPage.toString() + '.json';
            $.get(url, (data) => {
                this.marathons = data
            });
        },

        loadMarathon(id) {
            let url = 'data/marathon' + id.toString() + '.json';
            $.get(url, (data) => {
                this.currentMarathon = data
            });
            this.randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        },

        loadPage(page) {
            this.currentPage = page;
            this.loadMarathons();
            this.loadMarathon((page - 1) * 10 + 1);
        },
    }
}).mount('#app');

