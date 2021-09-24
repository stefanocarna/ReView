import Vue from 'vue'
import Snotify from 'vue-snotify'
import Vuelidate from 'vuelidate'

// TODO Remove prints
export default function(context, inject) {
  console.log('dependecies.js using vue-snotify')
  Vue.use(Snotify)

  console.log('dependecies.js using vuelidate')
  Vue.use(Vuelidate)
}
