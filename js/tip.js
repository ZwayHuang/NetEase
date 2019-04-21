

// class Component{
//   constructor(){}

//   // 解析模板
//   compile(template,data){
//     // 匹配表达式
//     const evalExpr = /<%=(.+?)%>/g;
//     // 匹配语句
//     const expr = /<%([\s\S]+?)%>/g;

//     // 把模板替换成函数
//     template = template.replace(evalExpr,'`); \n echo($1); \n echo(`').replace(expr,'`); \n $1 \n echo(`');
//     template = 'echo(`'+template+'`);';

//     let parse = eval(
//       `(function(data){
//         let output = '';

//         function echo(html){
//           output += html;
//         }

//         ${template}

//         return output;
//       })`);

//     return parse(data);
//   }

//   // 将HTML模板渲染成dom树
//   renderTo(container,tpl,data){
//     let temp       = document.createElement('div');
//     temp.innerHTML = this.compile(tpl,data);
//     let domTree    = temp.children[0].cloneNode(true);
//     return container.appendChild(domTree);
//   }
// }


/**
 * Tip类
 */
;(function() {
  const tpl = `<div class="m-tip f-cb">
      <p class="tip_msg"></p>
      <a class="tip_detail u-link" href="javascript:void(0)">立即查看&gt;</a>
      <a class="tip_close u-icon" href="javascript:void(0)">&#xe606;不再提醒</a>
    </div>`;


  /**
   * 提示条组件
   * @class Tip
   */
  class Tip {
    /**
     * 创建一个提示条组件
     * @param {object} opts - msg组件消息，
     */
    constructor(opts) {
      this.el = document.querySelector(opts.el) || document.body;
      this.component = this._layout.cloneNode(true);
      this.msgBox = this.component.querySelector('.tip_msg');
      this.clsBtn = this.component.querySelector('.tip_close');
      this.detail = this.component.querySelector('.tip_detail');
    }

    /**
     * Tip组件初始化
     * @private _init
     */
    _init() {
      this._initEvent();
      this.el.appendChild(this.component);
    }

    /**
     * 初始化事件绑定
     * @method _bindEvent
     */
    _initEvent() {
      this.clsBtn.addEventListener('click', () => this.emit('close'));
      this.detail.addEventListener('click', () => this.emit('detail'));
    }

    /**
     * 设置组件内容方法
     * @interface setContent
     * @param {node|string} content
     */
    setContent(content) {
      if (typeof content !== 'string' && content.nodeType !== 1) {
        return;
      }
      if (content.nodeType === 1) {
        this.msgBox.innerHTML = '';
        this.msgBox.appendChild(content);
      }
      this.msgBox.textContent = content;
      this._init();
    }

    /**
     * 展示方法
     * @param {string|node} msg
     * @interface show
     */
    show(msg) {
      this.setContent(msg);
      this._init();
      util.addClass(this.component, 'z-show');
      this.emit('show');
    }

    /**
     * 隐藏方法
     * @interface hide
     */
    hide() {
      util.delClass(this.component, 'z-show');
      util.addClass(this.component, 'z-hide');  
      this.emit('hide');
    }
  }

  // 将框架节点赋值给组件_layout属性
  Tip.prototype._layout = util.html2node(tpl);
  // 将事件系统混入组件
  util.extend(Tip.prototype, util.emitter);

  //          5.Exports
  // ----------------------------------------------------------------------
  // 暴露API:  Amd || Commonjs  || Global
  // 支持commonjs
  if (typeof exports === 'object') {
    module.exports = Tip;
    // 支持amd
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return Tip;
    });
  } else {
    // 直接暴露到全局
    window.Tip = Tip;
  }
}());
