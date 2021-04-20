import vuePrint from './vue-print'

const VuePrint = {
  install (Vue, options) {
    Vue.component(vuePrint.name, vuePrint)
  }
}


if (typeof window !== 'undefined' && window.Vue) {
  window.VuePrint = VuePrint
  Vue.use(VuePrint)
}

export default VuePrint

