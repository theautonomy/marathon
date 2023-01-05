import { createApp } from 'https://unpkg.com/vue@3.2.45/dist/vue.esm-browser.js?module'
import $ from 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/+esm?module'
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.2/esm/axios.js'

createApp({
    data() {
        return {
            marathons: [],
            currentMarathon: [],
            quotes: [],
            randomQuote: "",
            totalPages: 8,
            numberPerPage: 10
        }
    },

    mounted: function () {
        navigator.geolocation.getCurrentPosition(this.success);
        this.loadQuotes();
        let randomPage = Math.floor(Math.random() * this.totalPages + 1);
        let randomMarathon = (randomPage - 1) * this.numberPerPage + Math.floor(Math.random() * this.numberPerPage + 1);
        this.loadMarathons(randomPage);
        this.loadMarathon(randomMarathon);
    },

    methods: {
        success(pos) {
            const crd = pos.coords;
            console.log('Your current position is:');
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
        },

        loadQuotes() {
            let url = 'content/data/quotes.json';
            axios.get(url).then(resp => {
                this.quotes = resp.data
                this.randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
            }).catch(e => {
                console.log(e)
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
                            a.hasPrevious = true;
                            a.hasNext = true;
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
            this.loadMarathons(page);
            this.loadMarathon((page - 1) * this.numberPerPage + 1);
        },
    }
}).mount('#app');

