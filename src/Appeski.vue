<template>
<div>
<div>
</div>
<div class="multi"> 
    <trading-vue :data="chart" :width="this.width" :height="this.height"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText">
    </trading-vue>
</div> 
</div>
</template>

<script>
import TradingVue from './TradingVue.vue'
import Data from './data/data.json'
import DataCube from './helpers/datacube.js'

export default {
    name: 'App',
    components: {
        TradingVue
    },
    methods: {
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight
        }
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
            height: (window.innerHeight*99/100),
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
