<template>
<v-app>
 
  <v-main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-main>

</v-app>
</template>

<script>

export default {
  name: 'App',
   async mounted() {
      
      //getAllPosts
      await this.$store.dispatch('getAllPosts')
      
      //getAllComments
      await this.$store.dispatch('getAllComments')
   
      //getAllUsers
      await this.$store.dispatch('getAllUsers')

    },
  
};
</script>
