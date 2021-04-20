# vue-print-jxp

> 这是基于vue的打印组件

## Install

##### NPM

``` bash
npm install vue-print-jxp --save
```
##### USE
``` bash
import VuePrintJxp from 'vue-print-jxp'

Vue.use(VuePrintJxp);
```

##### Attributes
``` bash
direction       ---【String】打印方向 portrait-纵向 landscape-横向 默认：portrait
scale           ---【Number】清晰度，越大越清晰
margin          ---【Array】打印四周边距
backgroundColor ---【String】背景 默认：#FFFFFF
```

##### Events
``` bash
start          --- 解析页面前
end            --- 解析页面后
before         --- 打印机开启前
after          --- 打印机关闭后
```
