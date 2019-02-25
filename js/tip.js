

class Component{
  constructor(){}

  // 解析模板
  compile(template,data){
    // 匹配表达式
    const evalExpr = /<%=(.+?)%>/g;
    // 匹配语句
    const expr = /<%([\s\S]+?)%>/g;
  
    // 把模板替换成函数
    template = template.replace(evalExpr,'`); \n echo($1); \n echo(`').replace(expr,'`); \n $1 \n echo(`');
    template = 'echo(`'+template+'`);';
    
    let parse = eval(
      `(function(data){
        let output = '';
      
        function echo(html){
          output += html;
        }
  
        ${template}
  
        return output;
      })`);
  
    return parse(data);
  }

  // 将HTML模板渲染成dom树
  renderTo(container,tpl,data){
    let temp       = document.createElement('div');
    temp.innerHTML = this.compile(tpl,data);
    let domTree    = temp.children[0].cloneNode(true);
    return container.appendChild(domTree);
  }
}




class Tip extends Component{
  constructor(options){
    super();
        
    let tpl = `<div class="m-tip f-cb">
    <p class="msg"><%=data.msg%><a class="u-link link" href="<%=data.link%>">立即查看&gt;</a></p>
    <a class="cls" href="javascript:void(0)"><i class="u-icon">&#xe606;</i>不再提醒</a>
    </div>`;
    
    // 配置集合
    let configMap = {
      container: options.container || document.body,
      link: options.link || "https://study.163.com/",
      msg: options.msg || "网易云课堂微专业，帮助你掌握专业技能，令你求职或加薪多一份独特优势！",
    };

    // 组件本身
    this.tip = this.renderTo(configMap.container,tpl,configMap);
    // 状态集合
    this.link = configMap.link,
    this.msg  = configMap.msg

    this._init(tpl,configMap);
  }

  // 查询Dom元素集合
  _setQueryMap(){
    let queryMap  = this.queryMap = {};
    let tip       = this.tip;
    queryMap.msg      = tip.querySelector('.msg');
    queryMap.link     = tip.querySelector('.link');
    queryMap.closeBtn = tip.querySelector('.cls');
  }
  _bindEvent(){
    // 元素绑定事件
    let queryMap = this.queryMap;
    queryMap.closeBtn.addEventListener('click',this._onClose.bind(this),false);
  }
  _init(){
    this._setQueryMap();
    this._bindEvent();
  }
  
  
  // 更新组件
  _update(){
    this.queryMap.msg.textContent = this.msg;
    this.queryMap.link.href = this.link;
    return this;
  }
  _onClose(e){
    e = e ? e : window.event;
    e.preventDefault();
    e.stopPropagation();

    // 移除事件绑定
    this.queryMap.closeBtn.removeEventListener('click',this._onClose);
    // 从容器移除Tip模块
    this.tip.parentNode.removeChild(this.tip);
    // 发布关闭事件
    this.emit('Tip_close');
  }

  
  // 公开方法
  // 设置要显示的信息
  setMessage(sMsg){
    this.msg = sMsg;
    return this._update();
  }
  // 设置要跳转的链接
  setLink(sURL){
    this.link = sURL
    return this._update();
  }
}

util.extend(Tip.prototype,util.emitter);
