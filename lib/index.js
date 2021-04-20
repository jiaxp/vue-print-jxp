import VuePrint from './vue-print'

const VuePrint = {
  install (Vue, options) {
    Vue.component(VuePrint.name, VuePrint)
  }
}


if (typeof window !== 'undefined' && window.Vue) {
  window.VuePrint = VuePrint
  Vue.use(VuePrint)
}

export default VuePrint

