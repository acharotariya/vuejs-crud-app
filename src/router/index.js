import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import itemlist from '@/components/itemlist'
import edititem from '@/components/edititem'
import additem from '@/components/additem'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/itemlist',
      name: 'itemlist',
      component: itemlist
    },
    {
      path: '/edititem',
      name: 'edititem',
      component: edititem
    },
    {
      path: '/additem',
      name: 'additem',
      component: additem
    }
  ]
})
