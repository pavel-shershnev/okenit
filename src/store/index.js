import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    postsByUser: [],
    users: [],
    comments: [],
    commentsById: []

  },
  getters: {
    getPosts(state){
      return state.posts
    },
    getComments(state){
      return state.comments
    },
    getCommentsById(state){
      return state.commentsById
    },
    getUsers(state){
      return state.users
    },
    getPostsByUser(state){
      return state.postsByUser
    }

 
  },
  mutations: {
    updatePosts(state, posts){
      state.posts = posts
    },
    updateComments(state, comments){
      state.comments = comments
    },
    updateCommentsById(state, commentsArrayById){
      state.commentsById = commentsArrayById
    },
    addNewComment(state, newComment) {
      state.commentsById.push(newComment)
    },
    updateUsers(state, users){
      state.users = users
    },
    updatePostByUser(state, posts){
      state.postsByUser = posts
    },
    clearPostByUser(state, posts){
      state.postsByUser = posts
    }
      
  },
  actions: {
    //=================================posts
    async getAllPosts({ commit }) {
      await fetch(process.env.VUE_APP_URL + '/posts', {
        headers: {
        'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        commit('updatePosts', data)  
      })
      .catch((error) => {
        console.error('Error:', error);
      })
    },
    async fetchPostsByUser({ commit }, userId) {
      
      await fetch(process.env.VUE_APP_URL + `/posts?userId=${userId}`, {
        headers: {
        'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        commit('updatePostByUser', data)  
      })
      .catch((error) => {
        console.error('Error:', error);
      })
    },

    //=================================comments
    async addComment({ commit }, form) {
      await fetch(process.env.VUE_APP_URL + '/comments', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('"на сервер в формате JSON": ' + JSON.stringify(data));
        commit('addNewComment', data)
      })
    },
    async getAllComments({ commit }) {
      await fetch(process.env.VUE_APP_URL + '/comments', {
        headers: {
        'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        commit('updateComments', data)  
      })
      .catch((error) => {
        console.error('Error:', error);
      })
    },
    async fetchCommentsById({commit}, postId) {

      await fetch(process.env.VUE_APP_URL + '/comments', {
        headers: {
        'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        commit('updateCommentsById',  data.filter(item => item.postId == postId))
      })
    },

    //=================================users
    async getAllUsers({ commit }) {
      await fetch(process.env.VUE_APP_URL + '/users', {
        headers: {
        'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        commit('updateUsers', data)  
      })
      .catch((error) => {
        console.error('Error:', error);
      })
    }
  },

  modules: {
  }
})
