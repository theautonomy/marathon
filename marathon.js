import { createApp } from 'https://unpkg.com/vue@3.2.45/dist/vue.esm-browser.js?module'
import $ from 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/+esm?module'

createApp({
    data() {
        return {
            marathons: [],
            currentMarathon: [],
            currentPage: 1
        }
    },

    created: function () {
        let self = this;
        this.loadMarathons();
        this.loadMarathon(self.currentPage);
    },

    methods: {
        loadMarathons() {
            let self = this;
            let url = 'data/marathons' + self.currentPage.toString() + '.json';
            $.get(url, function (data) {
                self.marathons = data
            });
        },

        loadMarathon(id) {
            let self = this;
            let url = 'data/marathon' + id.toString() + '.json';
            $.get(url, function (data) {
                self.currentMarathon = data
            });
        },

        loadPage(page) {
            this.currentPage = page;
            this.loadMarathons();
            this.loadMarathon((page - 1) * 10 + 1);
        },
    }
}).mount('#app');

