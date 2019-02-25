class Pager extends Component{
  constructor(options){
    super();

    let tpl = `<ul class="m-pager"></ul>`;
  
    let configMap = {
      container:  options.container || document.body,
      total:      options.total  || 1,                                             // 总页数
      showPages:  options.showPages > this.total ? this.total : options.showPages, // 每次显示多少个页码
      uriParam:   options.uriParam || 'page',
    };

    this.pager = this.renderTo(configMap.container,tpl,configMap);

    this.total     = configMap.total;     // 一共多少页
    this.showPages = configMap.showPages; // 连续显示的页码数量
    this.uriParam  = configMap.uriParam;  // URI参数名

    // this.index     = 1,                // 当前拥有z-crt的元素
    // this.pageIndex = 1,                // 当前页码
    
    this._init();
  }
  _bindEvent(){
   this.pager.addEventListener('click',this._onClick.bind(this),false);
  }

  _init(){
    this.nav(1);
    this._bindEvent();
  }


  _update(){
    this._calc();
    this._insertPage();
  }
  _insertPage(){
    let html = this._createPrevBtn();
        html += this._createHead();
        html += this._createBody();
        html += this._createTail();
        html += this._createNextBtn();
    return this.pager.innerHTML = this.inner = html;
  }
  _createHead(){
    if (this.start === 1){
      return "";
    }
    return `<li class="page"><a data-page="1" href="?${this.uriParam}=1">1</a></li>
            <li class="elips"><span>...</span></li>`;
  }
  _createTail(){
    if (this.end === this.total){
      return "";
    }
    return `<li class="elips"><span>...</span></li>
            <li class="page"><a data-page="${this.total}" href="?${this.uriParam}=${this.total}">${this.total}</a></li>`;
  }
  _createBody(){
    let html = '',
        start = this.start,
        end = this.end,
        i;

    for (i = start; i <= end; i++){
      if (i=== this.pageIndex){
        html +=`<li class="page z-crt"><a data-page="${i}" href="?${this.uriParam}=${i}">${i}</a></li>`;
      }else{
        html += `<li class="page"><a data-page="${i}" href="?${this.uriParam}=${i}">${i}</a></li>`;
      }
    }
    return html;
  }
  _createPrevBtn(){
    if (this.pageIndex === 1){
      return `<li class="prev"><a data-page="${this.pageIndex}" href="?${this.uriParam}=${this.pageIndex}">&lt;</a></li>`
    }
    return `<li class="prev"><a data-page="${this.pageIndex-1}" href="?${this.uriParam}=${this.pageIndex-1}">&lt;</a></li>`
  }
  _createNextBtn(){
    if (this.pageIndex === this.total){
      return `<li class="next"><a data-page="${this.total}" href="?${this.uriParam}=${this.total}">&gt;</a></li>`
    }
    return `<li class="next"><a data-page="${this.pageIndex+1}" href="?${this.uriParam}=${this.pageIndex+1}">&gt;</a></li>`
  }

  _calc(){
    let offset = Math.ceil(this.showPages/2);

    if (this.pageIndex <= this.showPages){
      this.start = 1;
      this.end   = this.showPages;
      this.index = this.pageIndex - this.start;
    }else if (this.pageIndex+this.showPages > this.total){
      this.start = this.total-this.showPages+1;
      this.end   = this.total;
      this.index = this.pageIndex - this.start + 2
    }else if (this.showPages%2===0){
      this.start = this.pageIndex - (offset-1);
      this.end   = this.pageIndex + offset;
      this.index = this.pageIndex - this.start + 2;
    }else{
      this.start = this.pageIndex - (offset-1);
      this.end   = this.pageIndex + (offset-1);
      this.index = this.pageIndex - this.start + 2;
    }
    console.log(this.start,this.end);
  }

  _onClick(e){
    e = e ? e : window.event;
    e.preventDefault();
    e.stopPropagation();

    console.log("click");

    let element = e.target ? e.target : e.srcElement;
    let destination = this.pageIndex;
    console.log(element);
    console.log(element.tagName);
    if (element.tagName.toLowerCase() === 'a'){
      destination = +util.getDataSet(element)['page'];
      console.log("I got you");
    }
    console.log(destination);
    this.nav(destination);
  }

  _checkIndex(index){
    if (!index && index<0 && index>this.total){
      return false;
    }
    return index;
  }

  nav(pageIndex = 1){
    pageIndex = this._checkIndex(pageIndex);
    if (!pageIndex || (pageIndex === this.pageIndex)){
      return this;
    }
    this.pageIndex = pageIndex;
    this._update();
    this.emit('Pager_nav',this.pageIndex);
  }



}
util.extend(Pager.prototype,util.emitter);