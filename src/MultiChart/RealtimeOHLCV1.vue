<template>
<!-- Real time data example -->
<div >   
    <div class="select">
        <select  @change="selectCategory($event)" v-model="types" class="form-control">
            <option>--- CRYPTO ---</option>
            <option value="DOTUSDT">DOTUSDT</option>
            <option value="ETHUSDT">ETHUSDT</option>
            <option value="BTCUSDT">BTCUSDT</option>
            <option value="YFIUSDT">YFIUSDT</option>
            <option value="1INCHUSDT">1INCHUSDT</option>
            <option value="UNIUSDT">UNIUSDT</option>
        </select>            
    </div>
    <div class="i">
        <trading-vue                 
            :data="chart"
            :chart-config="{MIN_ZOOM:1}"
            ref="tvjs" :toolbar="true"
            :width="cbox_width" :height="cbox_height"
            :index-based="true"
            
            >
        </trading-vue>
    </div>
    <span class="tf-selector">
        <span class="timeframe" v-for="(tf,i) in this.timeframes[0]"
            @click="on_click(tf)">
            {{tf}}
        </span>
    </span>

 
</div>                       
</template>

<script>
import TradingVue from '../TradingVue.vue'
import DataCube from '../helpers/datacube.js'
import Utils from '../stuff/utils.js'
import Const from '../stuff/constants.js'
import Stream from '../Stream/stream.js' 

// Gettin' data through webpeck proxy

const PORT = location.port
const URL = `http://localhost:${PORT}/api/v1/klines?symbol=`
var zaman="30m"
var timeframes=[ 
                ['1m', '5m', '15m', '30m', '1h', '4h', '12h', '1d', '1w', '1M'],
                [500/720, 500/144, 500/48, 500/24, 500/12, 500/3, 500, 1000, 1000*7, 1000*7]
            ]

export default {
    name: 'DataHelper',
    icon: '⚡',
    description: 'Real-time updates. Play with DataCube in the console',
    props: [ ],
    components: {
        TradingVue
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize()      
    },
    created () {
        this.types =localStorage.getItem('select1')
        this.kayitli()
    },

    methods: {
        onResize(event) {
            this.width = (window.innerWidth*97.4/100)
            this.height = (window.innerHeight*89/100)
        },
        on_click(zaman,zaman2){
            if (this.stream) this.stream.off()           
            var coins=localStorage.getItem('select1')
            var Lowercoins=coins.toLowerCase()
            var WSS = `ws://localhost:${PORT}/ws/${Lowercoins}@aggTrade`

            // Load the last data chunk & init DataCube:
            let now = Utils.now()            
            var ycoins=`binance-${coins}`
            let time=zaman
            var konum = this.timeframes[0].indexOf(zaman)
            let time2 = this.timeframes[1][konum]

            localStorage.setItem('zaman1', time);
            localStorage.setItem('zaman12', time2);

            this.load_chunk([now - Const.DAY*time2, now],coins,time).then(data => {
                this.chart = new DataCube({
                    ohlcv: data['chart.data'],
                    datasets: [{
                        type: 'Trades',
                        id: ycoins,
                        data: []
                    }]
                }, { aggregation: 100 })
                // Register onrange callback & And a stream of trades
                
                this.chart.onrange(this.load_chunk)
                this.$refs.tvjs.resetChart()
                this.stream = new Stream(WSS)
                this.stream.ontrades = this.on_trades
                window.dc = this.chart      // Debug
                window.tv = this.$refs.tvjs // Debug     
            })
            return coins;

        },
        kayitli(){   
        var coins=localStorage.getItem('select1')
        var Lowercoins=coins.toLowerCase()
        var WSS = `ws://localhost:${PORT}/ws/${Lowercoins}@aggTrade`

          // Load the last data chunk & init DataCube:
        let now = Utils.now()    
        var ycoins=`binance-${coins}`
        let time=localStorage.getItem('zaman1');
        let time2=localStorage.getItem('zaman12');

        this.load_chunk([now - Const.DAY*time2, now],coins,time).then(data => {
            this.chart = new DataCube({
                ohlcv: data['chart.data'],
                datasets: [{
                    type: 'Trades',
                    id: ycoins,
                    data: []
                }]
            }, { aggregation: 100 })
            // Register onrange callback & And a stream of trades
            this.chart.onrange(this.load_chunk)
            this.$refs.tvjs.resetChart()
            this.stream = new Stream(WSS)
            this.stream.ontrades = this.on_trades
            window.dc = this.chart      // Debug
            window.tv = this.$refs.tvjs // Debug
            })
    

        },
        selectCategory(event) {           
            var coins=event.target.value.toString();   
            localStorage.setItem('select1', coins);
        },

        // New data handler. Should return Promise, or
        // use callback: load_chunk(range, tf, callback)
        async load_chunk(range,coins,time) {
            let [t1, t2] = range
            let x = coins
            let t = time
            let q = `${x}&interval=${t}&limit=1000&startTime=${t1}&endTime=${t2}`
            let r = await fetch(URL + q).then(r => r.json())
            return this.format(this.parse_binance(r))
        },

        // Parse a specific exchange format
        parse_binance(data) {
            if (!Array.isArray(data)) return []
            return data.map(x => {
                for (var i = 0; i < x.length; i++) {
                    x[i] = parseFloat(x[i])
                }
                return x.slice(0,6)
            })
        },
        format(data) {
            // Each query sets data to a corresponding overlay
            return {
                'chart.data': data
                // other onchart/offchart overlays can be added here,
                // but we are using Script Engine to calculate some:
                // see EMAx6 & BuySellBalance
            }
        },
        on_trades(trade) {
            var coins=this.selectCategory.coins
            var ycoin=`datasets.binance-${coins}`
            this.chart.update({
                t: trade.T,     // Exchange time (optional)
                price: parseFloat(trade.p),   // Trade price
                volume: parseFloat(trade.q),  // Trade amount
                ycoin: [ // Update dataset
                    trade.T,
                    trade.m ? 0 : 1,          // Sell or Buy
                    parseFloat(trade.q),
                    parseFloat(trade.p)
                ],
                // ... other onchart/offchart updates
            })
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
        if (this.stream) this.stream.off()
    },
    computed: {   
        cbox_width() { return Math.floor(this.width / 2-2) },
        cbox_height() { return Math.floor(this.height / 2 +5) }
    },
    data() {
        return {
            chart: {},
            width: window.innerWidth,
            height: window.innerHeight,  
            timeframes

        }
    }
}
</script>

<style>
.i{
    z-index:-1;}
.select {
    position: absolute;
    
    left: 56px;
    z-index:1;
}
/* Reset Select */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
  outline: 0;
  box-shadow: none;
  border: 0 !important;
  background: #2c3e50;
  background-image: none;
}
/* Remove IE arrow */
select::-ms-expand {
  display: none;
}
/* Custom Select */
.select {
  display: flex;
  width: 7em;
  height: 1.6em;
  top:0px;
  line-height: 3;
  background: #2c3e50;
  overflow: hidden;
  border-radius: .15em;
}
select {
  flex: 1;
  padding: 0 .5em;
  color: #fff;
  cursor: pointer;
}
/* Arrow */
.select::after {
  content: '\25BC';
  position: absolute;
  top: -10px;
  right: 0;
  width:8px;
  padding: 0 16px 0 10px;
  background: #34495e;
  cursor: pointer;
  pointer-events: none;
  -webkit-transition: .25s all ease;
  -o-transition: .25s all ease;
  transition: .25s all ease;
}
/* Transition */
.select:hover::after {
  color: #f39c12;
}

.tf-selector {
    position: absolute;
    top: 0px;
    left: 170px;
    width: 60%;
    height: 1.6em;
    padding: 0 1% 0 1%;
    border-radius: .15em;   
    background: #2c3e50;
     
}
.timeframe {   
    user-select: none;
    cursor: pointer;
    font-size:90%;
    color: #fff; 
}
.timeframe:hover {
    color: #f39c12;
}
</style>

