import App from './App.vue';
import MultiChart from './MultiChart/MultiChart.vue';
import Trader from './Trader.vue';



const routes = [
    { path: '/App', component: App },
    { path: '/MultiChart', component: MultiChart },
    { path: '/Trader', component: Trader }
];

export default routes;