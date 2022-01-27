<template>
<div>
  <div style="text-align: center" v-if="isLoader">
    <v-progress-circular
      :size="70"
      :width="7"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </div>
  
  <v-card v-else
    class="mx-auto"
    max-width="800"
  >
  <v-card color="grey">
    <v-card-text class="black--text">Total posts <span v-show="user"> from {{user}}</span>: <strong>{{selectedPostsByUser.length}}</strong></v-card-text>
    <v-row dense class="ml-2">
      <v-col md="4" class="ml-1" >  
        <v-select
          class="black--text"
          light
          dense
          :items="usersName"
          label="Select user"
          v-model="user"
        ></v-select>
      </v-col>
      <v-col md="1" class="ml-1" v-show="user">
        <v-icon class="reset black--text ml-1" v-text="'mdi-file-excel-box'" @click="reset"></v-icon>
      </v-col>
     </v-row>
    
  
  </v-card>
  
    
    <v-list>
      <v-list-item-group v-model="model">
        <v-list-item
          v-for="(item, i) in selectedPostsByUser"
          :key="i"
          @click="showPost(item.id)"
          class="mb-3"
        >
        
          <v-list-item-icon>
            <v-icon v-text="'mdi-rhombus-medium'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content >
            <div>
              <v-list-item-title class="mb-2"> <span>{{ item.title }}</span></v-list-item-title>
              <v-icon class="ml-1" v-text="'mdi-message-reply'" ></v-icon> <span > <strong>{{ numberComments(item.id) }}</strong> </span>
            </div>
          </v-list-item-content>

        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data: () => ({
      user: null,
      model: null,
      isLoader: false,

    }),

    methods: {
      showPost(id) {
        this.$router.push('/about/'+id)
      },
      test() {
        console.log(this.user);
      },
      reset() {
        this.user = null
        this.$store.commit('clearPostByUser', [])
      },
      numberComments ( id ) {
        let num = 0
        this.$store.getters.getComments.filter(element => {
        if(element.postId == id) {
          num++
        }
        })
      return num
      }
    },
    watch: {
      user(value){
        this.user = value
        if(this.user !== null){
        const selectedUserId = this.$store.getters.getUsers.filter(item => item.name == this.user)[0].id
        this.$store.dispatch('fetchPostsByUser', selectedUserId)
      }
      }
    },
    computed: {
      selectedPostsByUser () {
        if ( this.$store.getters.getPostsByUser.length > 0 ) {
          return this.$store.getters.getPostsByUser
        } else return this.$store.getters.getPosts
      },
      usersName () {
        return this.$store.getters.getUsers.map(item => item.name) || []
      }
    },
  }
</script>
<style >
  .reset:hover{
    cursor: pointer
  }
  /* .toUpperFirstLetter::first-letter{
    font-size: 40px;
  } */
</style>
  

