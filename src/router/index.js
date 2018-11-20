import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import posts from '@/components/posts'
import home from '@/components/home'
import booklist from '@/components/booklist'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/posts',
      name: 'posts',
      component: posts
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/booklist',
      name: 'booklist',
      component: booklist
    }
  ]
})
