<template>
  <div class="vue-print">
    <slot />
  </div>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
  name: 'VuePrint',
  data () {
    return {}
  },
  methods: {
    /**
     * 打印
     * */
    print (ele, opts) {
      opts = Object.assign({
        direction: 'portrait', // 空-默认 portrait-纵向 landscape-横向
        margin: [40], // 打印四周边距
        scale: 2, // 清晰度，越大越清晰
        backgroundColor: '#ffffff', // 背景
        startCallback: null, // 处理打印-start
        endCallback: null, // 处理打印-end
        beforePrint: null, // 打印-before
        afterPrint: null // 打印-after
      }, opts)
      let A4_width = 794 // A4纸张宽
      let A4_height = 1123 // A4纸张高
      let marginStr = opts.margin.join('px ') + 'px' // 打印边距
      // let ele_width = ele.clientWidth // 元素宽
      let ele_height = ele.clientHeight // 元素高
      let width = 794
      let height = 1123
      if (opts.direction === 'portrait') {
        width = A4_width
        height = Math.max(A4_height, ele_height)
      } else if (opts.direction === 'landscape') {
        width = A4_height
        height = Math.min(A4_width, ele_height) // 高度取最小值（防止出现空白页）
      }
      opts.startCallback && opts.startCallback()
      // 清晰度
      let _canvas = document.createElement('canvas')
      let scale = opts.scale
      _canvas.width = width * scale
      _canvas.height = height * scale
      _canvas.style.width = `${width}px`
      _canvas.style.height = `${height}px`
      _canvas.getContext('2d').scale(scale, scale)

      html2canvas(ele, {
        canvas: _canvas,
        scale: 1,
        width: width,
        height: height,
        dpi: 600,
        // allowTaint: true,  //允许 canvas 污染， allowTaint参数要去掉，否则是无法通过toDataURL导出canvas数据的
        backgroundColor: opts.backgroundColor,
        allowTaint: true,
        useCORS: true // 允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
      }).then(canvas => {
        let iframeClass = 'media-print'
        // 新建iframe
        let iframe = document.createElement('iframe')
        let iframeId = `canvas_${new Date().getTime()}`
        document.body.appendChild(iframe)
        iframe.style.border = '0px'
        iframe.style.position = 'absolute'
        iframe.style.width = '0px'
        iframe.style.height = '0px'
        iframe.style.left = '0px'
        iframe.style.top = '0px'
        iframe.setAttribute('src', iframeId)
        iframe.setAttribute('class', iframeClass)
        // iframe.doc = null
        // iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document)
        iframe.onload = () => {
          let win = iframe.contentWindow || iframe
          // 打印控制
          let style = win.document.createElement('style')
          style.type = 'text/css'
          style.media = 'print'
          let styleCss = ''
          if (opts.direction) {
            styleCss = `@page { size: A4 ${opts.direction}; ${marginStr ? `margin:${marginStr}` : ''} }`
          } else if (marginStr) {
            styleCss = `@page { size: A4; margin:${marginStr}; }`
          }
          if (style.styleSheet) {
            style.styleSheet.cssText = styleCss
          } else {
            style.innerHTML = styleCss
          }
          win.document.getElementsByTagName('head')[0].appendChild(style)
          // 插入canvas
          win.document.body.innerHTML = ''
          win.document.body.appendChild(canvas)

          const beforePrint = () => {
            opts.beforePrint && opts.beforePrint()
          }
          const afterPrint = () => {
            // 删除旧的iframe
            let oldIframe = document.body.querySelector(`.${iframeClass}`)
            if (oldIframe) {
              document.body.removeChild(oldIframe)
            }
            opts.afterPrint && opts.afterPrint()
          }
          win.onbeforeprint = beforePrint
          win.onafterprint = afterPrint

          win.print()
          opts.endCallback && opts.endCallback()
        }
      })
    }
  }
}
</script>
