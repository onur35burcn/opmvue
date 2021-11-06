<template>
  
    <div id="sol" style="    
            
            width:2%;
            
            height: 100%;">
    
    <nav>
        <router-link to='/'>Ana</router-link>
        <router-link to='/App'>App</router-link>
        <router-link to='/MultiChart'>Mc</router-link> 
        <router-link to='/Trader'>Trd</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
}
</script>
