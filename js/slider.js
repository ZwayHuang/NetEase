/**
 * method:
 *  Banner.nav(page)
 *  Banner.autoPlay(time)
 *  Banner.stop()
 * 
 * Syntax:
 *   new Banner({
 *     container: someDom,
 *     sliders:[
 *       {
 *         linkUrl: "http://open.163.com/",
 *         imgSrc: "./image/banner1.jpg",
 *       },
 *       {
 *         linkUrl: "http://study.163.com/",
 *         imgSrc: "./image/banner2.jpg",
 *       },
 *       {
 *         linkUrl: "http://www.icourse163.org/",
 *         imgSrc: "./image/banner3.jpg",
 *       },
 *     ],
 *   })
 * 
 */
// class Banner extends Component{
//   constructor(options){
//     super();

//     let tpl = `<div class="m-banner">
//                   <a class="slider" href="<%=data.sliders[0].linkUrl%>"></a>
//                   <a class="slider" href="<%=data.sliders[1].linkUrl%>"></a>
//                 <ul class="controls">
//                   <% for (let i = 0, len = data.sliders.length; i < len; i++){ %>
//                     <li data-index="<%= i %>"></li>
//                   <% } %>
//                 </ul>
//               </div>`;

//     let configMap = {
//       container: options.container || document.body,
//       sliders:   options.sliders   || [],
//       fadeTime:  options.fadeTime  || 1,
//       loadingImg:options.loadingImg,
//     };

//     this.banner = this.renderTo(configMap.container,tpl,configMap);
   
//     this.amount     = configMap.sliders.length;   // 滑块的总数量
//     this.data       = configMap.sliders;          // 滑块数据数组
//     this.fadeTime   = configMap.fadeTime;         // 淡入动画持续时间
//     this.loadingImg = configMap.loadingImg;       // loading占位图
//     // this.pageIndex = 0;                        // 当前页面索引
//     this._sliderIndex = 0;                        // 滑块的索引
//     this._cache       = {};                       // 已完成加载的图片集
//     // this._oldPageIndex = 0;                    // 上一个页面索引


//     this._init(tpl,configMap)
//   }

//   _setQueryMap(){
//     let queryMap = this.queryMap = {};
//     let banner = this.banner;

//     queryMap.sliders      = banner.querySelectorAll('.slider');
//     queryMap.controlsWrap = banner.querySelector('.controls');
//     queryMap.controls     = queryMap.controlsWrap.querySelectorAll('li');
//   }

//   _bindEvent(){
//     this.on('Banner_nav',(component) => {
//       util.delClass(this.queryMap.controls[component._oldPageIndex],'z-current');
//       util.addClass(this.queryMap.controls[component.pageIndex],'z-current');
//     });

//     this.queryMap.controlsWrap.addEventListener('click',this._onSelect.bind(this),false);
//   }
//   _init(){
//     this._setQueryMap();
//     this._bindEvent();
//     this.nav(0);
//   }

//   _onSelect(e){
//     e = e ? e : window.event;
//     e.preventDefault();
//     e.stopPropagation();
//     let target = e.target ? e.target : e.srcElement;

//     if (target.tagName.toLowerCase() === "li"){
//       let index = +util.getDataSet(e.target).index;
//       this.nav(index);
//     }
//   }




//   // 标准化下标
//   _normalIndex(index,length,initial = 0){
//     let result = initial;
//     index = parseInt(index);
//     index = index ? index : initial;

//     result = (index+length)%length;
//     return  result >= initial ? result : result+length;
//   }

//   _update(){
//     let sliders    = this.queryMap.sliders;
//     let curtSlider = sliders[this._sliderIndex];

//     // 去除全部滑块的z-show类
//     for (let i = 0,len = sliders.length; i < len; i++){
//       util.delClass(sliders[i],'z-show');
//     }
//     curtSlider.style.transitionDuration = this.fadeTime+'s';
//     util.addClass(curtSlider,'z-show')
//   }

//   _setCurtSlider(){
//     let curtPage   = this.data[this.pageIndex];
//     let sliders    = this.queryMap.sliders;
//     let curtSlider = sliders[this._sliderIndex];
//     let curtImg    = curtSlider.querySelector('img');

//     // 如果当前滑块不存在图片元素没创建一个
//     if (!curtImg){
//       curtImg = document.createElement('img');
//       curtSlider.appendChild(curtImg);
//     }
    
//     // 如果当前图片未被缓存则显示loading图
//     if (!this._cache[this.pageIndex]){
//       curtImg.src = this.loadingImg;
//     }else{
//       curtImg.src = curtPage.imgSrc;
//     }

//     curtImg.alt     = curtPage.imgAlt;
//     curtSlider.href = curtPage.linkUrl;
//   }

//   _loadImg(){
//     let curtIndex = this.pageIndex;

//     for (let index,img,i = -1; i <= 1; i++ ){
//       index = this._normalIndex(curtIndex+i,this.data.length,0);
//       // 如果当前图片已缓存则不再缓存
//       if (this._cache[index]){
//         continue;
//       }
//       img = new Image();
//       img.src = this.data[index].imgSrc;
//       img.onload = function(index){
//         let curtUrl = this.data[index].imgSrc;
//         // 将加载完成的图片地址添加到缓存中
//         this._cache[index] = curtUrl;
//         // 如果未在切换前完成加载则不显示
//         if (this.pageIndex !== index){ return; }
//         // 如果在切换图片前加载完成则显示
//         this._setCurtSlider(index);
//       }.bind(this,index);
//     }
//   }

//   _onNav(){
//     this._loadImg();
//     this._setCurtSlider();

//     this.emit('Banner_nav',this);
//   }


//   nav(index = 1){
//     // 计算参数
//     this._oldPageIndex = this.pageIndex ? this.pageIndex : 0;
//     this.pageIndex    = this._normalIndex(index,this.amount);
//     this._sliderIndex  = (this._sliderIndex+1)%2;

//     this._onNav();
//     this._update();
//     return this.pageIndex;
//   }

//   // 开始自动播放
//   autoPlay(interval = 500){
//     let slide = () => {
//       clearTimeout(this.timer);
//       this.nav(this.pageIndex+1);
//       this.timer = setTimeout(slide,interval);
//     }
//     this.timer = setTimeout(slide,interval);

//     return this;
//   }

//   // 停止自动播放
//   stop(){
//     clearTimeout(this.timer);
//     return this;
//   }



// }
// util.extend(Banner.prototype,util.emitter)


;(function() {
  // 组件模板
  const tpl = `<div class="m-slider">
                <div class="slider"></div>
                <div class="slider z-current"></div>
                <div class="slider"></div>
              </div>`;

  /**
   * 轮播图组件
   */
  class Slider {
    /**
     * 创建一个轮播图组件
     * @param {Object} opts
     */
    constructor(opts) {
      this.el = document.querySelector(opts.el) || document.body;
      this.component = this._layout.cloneNode(true);
      this.numOfSlider = opts.sliders.length || 0;
      this.pageIndex = 1;
      this.sliderIndex = this._normalIndex(this.currIndex, 3);

      this.sliderList = this.component.querySelectorAll('.slider');
    }

    /**
     * 规范化下标
     * @param {Number} index
     * @param {Number} len
     * @return {Number}
     */
    _normalIndex(index, len) {
      return (index+len)%len;
    }

    /**
     * 跳转到下一个slider
     */
    nextStep() {
      const nextIndex = this._normalIndex(this.sliderIndex+1, 3);
      const currSlider = this.sliderList[this.sliderIndex];
      const nextSlider = this.sliderList[nextIndex];
      util.delClass(currSlider, 'z-current');
      util.addClass(nextSlider, 'z-current');
      this.sliderIndex++;
      this.pageIndex++;
    }

    /**
     * 计算当前index
     */
    _calcSlide() {
      const pageIndex = this.pageIndex;
      const currSliderIndex = this._normalIndex(pageIndex, 3);
      const prevSliderIndex = this._normalIndex(currSliderIndex-1, 3);
      const nextSliderIndex = this._normalIndex(currSliderIndex+1, 3);
      this.pageIndex = pageIndex;
      this.sliderIndex = currSliderIndex;
    }

    /**
     * 跳转到指定slider
     * @param {Number} index
     */
    nav(index) {
      if (index = parseInt(index)) {
        return;
      }
      this.pageIndex = index;
      this._calcSlide();
    }

  }
}());
