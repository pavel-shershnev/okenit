<template>
<div>
  <v-row justify="center">
    <alert v-if="isAlert" :message="alertMessage" />
    <v-dialog
      hide-overlay
      light
      v-model="dialog2"
      max-width="600px"
      height="100%"
    >
      <v-card width="100%" height="100%">
        <v-card-title>Sending a message</v-card-title>
        
        <form  class="mx-auto">
       
          <v-text-field
            class="mx-5 my-5"
            v-model="email"
            :error-messages="emailErrors"
            label="E-mail"
            required
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
          ></v-text-field>

          <v-text-field 
            class="mx-5"
            v-model="name"
            :error-messages="nameErrors"
            :counter="20"
            label="Title"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>

          <v-textarea
            class="mx-5"
            v-model="body"
            label="Text"
            required
            @input="$v.body.$touch()"
          >
          </v-textarea>

          <div style="text-align: center;">
            <v-btn
            class="mr-4 my-5"
            @click="submit"
            color="primary"
            >
              Send comment
            </v-btn>
          </div>
          
        </form>


      </v-card>
    </v-dialog>

    <v-dialog
      hide-overlay
      light
      v-model="dialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="pb-0">
          <span class="text-h5"><v-icon v-text="'mdi-account'"></v-icon> {{author.name}} </span>
          <v-spacer></v-spacer>
          <v-icon
          @click="dialog = !dialog"
          right>
            mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text><strong>username:</strong>  {{author.username}}</v-card-text>
        <v-card-text><strong>email:</strong> {{author.email}}</v-card-text>
        <v-card-text><strong>address:</strong> street {{author.address.street}}, suite {{author.address.suite}}; city {{author.address.city}} </v-card-text>

      </v-card>
    </v-dialog>

  </v-row>
  <v-card 
    class="mx-auto"
    max-width="800"
  >
    <v-card-title class="primary--text pb-0"> Post </v-card-title>
    <v-card-text class="text-caption" > by <span class="author" @click="showInfo">{{ author.name }}</span> </v-card-text>
    <v-card-title> {{post.title}} </v-card-title>
    <v-card-text> {{post.body}} </v-card-text>
  </v-card>
    
  <v-card
    class="mx-auto mt-7"
      max-width="800"
  >
    <v-card-title class="primary--text"> Сomments </v-card-title>
 
    <div class="box" v-for="item in comments" :key="item.id">

      <div class="acount"> 
        <v-card-text class="pa-0"><v-icon v-text="'mdi-account'"></v-icon> {{ item.email }}</v-card-text>
      </div>
      <v-card-text class="text-h6 pt-1">{{ item.name }}</v-card-text>
      <v-card-text class="pt-0">{{ item.body }}</v-card-text>
      <v-divider class="my-2"></v-divider>

    </div>
    <div class="btn">
      <v-btn
        class="mx-auto my-5"
        color="primary"
        elevation="8"
        @click="dialog2 = !dialog2"
        :disabled="dialog2"
      >add comment
      </v-btn>
    </div>
 
  </v-card>
    
 </div> 
</template>

<script>

import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

import alert from '../components/alert.vue'

export default {
   mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
    body: {  required }
    },
    
  components: {alert},

  data() {
    
    return {
      isAlert: false,
      alertMessage: '',
      name: '',
      email: '',
      body: '',

      postId: null,
      // postNull: { 
      //   userId: '',
      //   id: '',
      //   title: '',
      //   body: ''
      // },
      
      dialog: false,
      dialog2: false,
      authorNull: {       
        id: 1,
        name: '',
        username: '',
        email: '',
        address: {
          street: '',
          suite: '',
          city: '',
          zipcode: '',
          geo: {
            lat: '',
            lng: '',
          }
        },
        phone: '',
        website: '',
        company: {
          name: '',
          catchPhrase: '',
          bs: ''
        }
      }
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      const form = {
        postId: +this.postId,
        id: this.comentsLength + 1,
        name: this.name,
        email:  this.email,
        body:  this.body
      }
      this.dialog2 = !this.dialog2
      this.$store.dispatch('addComment', form)
      
      
      this.comentsLength + 1
      this.name = ''
      this.email = ''
      this.body = ''

      this.$v.$reset()

      this.isAlert=!this.isAlert
      this.alertMessage = 'Сomment sent'
      setTimeout(()=>{
        this.isAlert=!this.isAlert
      }, 4000)
    },
    showInfo() {
      this.dialog = true
    }
  },
  computed: {
    nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('Name must be at most 10 characters long')
        !this.$v.name.required && errors.push('Name is required.')
        return errors
      },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
    comentsLength() {
      return this.$store.getters.getCommentsById.length
    },
    post() {
      return this.$store.getters.getPosts.filter(item => item.id  == this.postId)[0] || {}
    },
    author() {
      return this.$store.getters.getUsers.filter(item => item.id == this.post.userId)[0] || this.authorNull
    },
    comments(){
      return this.$store.getters.getCommentsById 
    }
  },
  async mounted() {
    this.postId = +this.$route.params.id
    await this.$store.dispatch('fetchCommentsById', this.postId)
  },
}
</script>
<style scoped>
.acount{
  margin-left: 20px;
  width: 250px;
  border-bottom: 1px solid rgb(61, 60, 60);
  
}
.box{
  background-color: rgba(255, 245, 238, 0.192);
  padding: 5px;
}
.author:hover{
  cursor: pointer;
}
.btn{
  text-align: center;
}
</style>
