<template>
<div>

    <div class="multi"> 
        <trading-vue :data="chart" :width="this.width" :height="this.height"
                :color-back="colors.colorBack"
                :color-grid="colors.colorGrid"
                :color-text="colors.colorText">
        </trading-vue>
    </div> 
    <div> 
    <div class="select" style="top:400px;  ">
        <select  @change="crypto($event)" v-model="types" >
            <option>--- CRYPTO ---</option>
            <option value="DOTUSDT">DOTUSDT</option>
            <option value="ETHUSDT">ETHUSDT</option>
            <option value="BTCUSDT">BTCUSDT</option>
            <option value="YFIUSDT">YFIUSDT</option>
            <option value="1INCHUSDT">1INCHUSDT</option>
            <option value="UNIUSDT">UNIUSDT</option>
        </select> 
    </div>
    <div class="select" style="top:375px; left: 180px;  ">
        <select  @change="script($event)" v-model="types" >
            <option>--- CRYPTO ---</option>
            <option value="StopLose">StopLose</option>
            <option value="HemenAl">Hemen Al</option>
            <option value="HemenSat">Hemen Sat</option>
            <option value="Sat_Fiyat">Satış Fiyatı</option>
            <option value="Al_Fiyat">Alış Fiyatı</option>
            <option value="">RENUSDT</option>
        </select> 
    </div>
        <span class="timeframe"@click="on_click()"> Uygula </span>
    </div> 
</div>
</template>

<script>
import TradingVue from './TradingVue.vue'
import Data from './data/data.json'
import DataCube from './helpers/datacube.js'

var crypto="";
var script="";

export default {
    name: 'App',
    components: {
        TradingVue
    },
    methods: {
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight
        },
        crypto(event) {           
            this.crypto=event.target.value.toString();   
        },
        script(event) {           
            this.script=event.target.value.toString();   
        },
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        window.dc = this.chart
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        return {
            chart: new DataCube(Data),
            width: (window.innerWidth*97/100),
            height: (window.innerHeight*99/150),
            colors: {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333',
            }
        };
    }
};
</script>

<style>

.multi {    
    display: grid;
    position: absolute;
    top: 0px;
    margin-left: 2%;
    
}

</style>
