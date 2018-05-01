import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import QRCode from '@/components/QRCode'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: QRCode
    },
    {
      path: '/barcode',
      name: 'Barcode',
      component: QRCode,
    }
  ]
})
