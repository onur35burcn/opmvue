import Vue from 'vue';
import Ana from './Ana.vue';
import VueRouter from 'vue-router';

import routes from './routes.js';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({routes});

new Vue({
    router,

    render: h => h(Ana)

}).$mount('#app');