<template>
<!-- Real time data example -->

    <div class="multi">  
        <div class="chart-box">
            <RealtimeOHLCV1 >
            </RealtimeOHLCV1 >
 
        </div>

        <div class="chart-box">
            <RealtimeOHLCV2>
            </RealtimeOHLCV2>
        </div>  
        <div class="chart-box">
            <RealtimeOHLCV3>
            </RealtimeOHLCV3 >
        </div>  
        <div class="chart-box">
            <RealtimeOHLCV4>
            </RealtimeOHLCV4 >
        </div>  
    </div>     
     
</template>


<script>

import RealtimeOHLCV1 from './RealtimeOHLCV1.vue'
import RealtimeOHLCV2 from './RealtimeOHLCV2.vue'
import RealtimeOHLCV3 from './RealtimeOHLCV3.vue'
import RealtimeOHLCV4 from './RealtimeOHLCV4.vue'


// DENEME


export default {
    name: 'Multichart',
    description: 'All charts must work correctly and independently',
    props: ['night'],
    components: {
        RealtimeOHLCV1,RealtimeOHLCV2,RealtimeOHLCV3,RealtimeOHLCV4
    },
    methods: {
        onResize(event) {
            this.width = window.innerWidth
            this.height = window.innerHeight
            }
    },
    computed: {
        
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize()
    },

  
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        return {
            
            width: (window.innerWidth*97/100),
            height: (window.innerHeight*99/100),
        }
    }
    
}

</script>
<style>

.multi { 
    display: grid;
    grid-template-columns: 50% 50%;
    height:95%;
}
.chart-box {
    display: grid;
    border: 0.1px solid transparent;
    position: relative;  
}
.select{
    position: relative; 
}
</style>





















