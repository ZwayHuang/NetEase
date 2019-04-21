/**
 * 组件模块
 * new Component({
 *   template:"<div></div>"
 *   data:{},
 *   method:{},
 *   eventHandler:{},
 * 
 *   // 钩子函数
 *   beforeCreate: function(){},
 *   created:function(){},
 *   beforeMount:  function(){},
 *   mounted:function(){},
 *   beforeUpdate: function(){},
 *   updated:function(){},
 *   beforeDestroy:function(){},
 *   destroy:function(){}
 * })
 */




class Component{
  constructor(opts){
    if ((this instanceof Component)){
      throw new Error("此类不能实例化！");
    }
    util.extend(this,opts);
    // this._data = util.extend({},opts);

    // 遍历每个元素的属性节点，文本节点。prop,text,method与元素建立映射关系
    this._dataMap  = {
      props:{
        link:[
          {
            node:"DOMobj",
            prop:"url",
            bind:"link"
          },
          {}
        ]
          
      },
      texts:{
        msg:[{
          parentNode:"DOMobj",
          bind:"msg",
          tpl :"test{{value}}sss",
          oldNode:"DOMobj"
        },{

        }],
        test:[{

        },{

        }]
      },
      events:[{
        node  :"DOMobj",
        event :"click",
        handle:"clickHandle",
      }]
    };

    util.extend(this._dataMap,{

    })



    this.getData = function(key){
      if (!this._data.hasOwnProperty(key)){ return null; }
      return this._data[key];
    }
    this.setData = function(key,value){
      if (!this._data){
        this._data = {};
      }
      return this._data[key] = value;
    }

    this.addToProps = function(node,prop,bind){
      let stack = this._dataMap.props[bind];
      if (!stack){
        stack = [];
      }
      return stack.push({
        node:node,
        prop:prop
      });
    }
    this.addToTexts = function(parentNode,oldNode,bind,tpl){
      let stack = this._dataMap.texts[bind];
      if (!stack){
        stack = [];
      }
      return stack.push({
        tpl       :tpl,
        bind      :bind,
        oldNode   :oldNode,
        parentNode:parentNode
      });
    }
    this.addToEvents = function(node,event,handle){
      let stack = this._dataMap.events;
      if (!stack){
        stack = [];
      }
      return stack.push({
        event :event,
        node  :node,
        hadnle:handle
      });
    }
    this.installProp = function(dataName){
      let stack = this._dataMap.props[dataName],
      value = this.getData(dataName),
      item;

      for(let i = 0,len = stack.length; i<len; i++){
        item = stack[i];
        node = item.node;
        prop = item.prop;
        node.setAttribute(prop,value);
      }
    }

    this.installProps  = function(){
      let props = this._dataMap.props,
      key,

      for(key in props){
        this.installProp(key);
      };
    }

    this.installText = function(dataName){
      let stack = this._dataMap.texts[dataName],
      reg   = /{{[^}]*}}/ig,
      item;

      for(let i = 0,len = stack.length; i<len; i++){
        item = stack[i];
        parentNode = item.parentNode;
        oldNode = item.oldNode;
        tpl = itme.tpl;

        text  = tpl.replace(reg,(match) => {
          return this.getData(match.slice(2,-2));
        })
        newNode = document.createTextNode(text);
        parentNode.replaceChild(newNode,oldNode);
      }
    }
    this.installTexts  = function(){
      let texts = this._dataMap.texts,
      key,

      for(key in texts){
        this.installText(key)
      }
    }
    this.installEvents = function(){
      let events = this._dataMap.events,
      handle,
      event,
      node;
      
      events.forEach(item => {
        node   = item.node;
        event  = item.event;
        handle = this.getEventHandle("");
      });
    }

    this.setUp = function(){
      this.installProps();
      this.installTexts();
      this.installEvents();
    }

  }

  // 模板解析函数
  _compile(template,data){
    const evalExpr = /<%=(.+?)%>/g;    // 匹配表达式
    const expr = /<%([\s\S]+?)%>/g;    // 匹配语句
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

  // 模板渲染函数
  render = function(container,tpl,data){
    if (!template) { return; }
    let temp       = document.createElement('div');
    temp.innerHTML = this._compile(tpl,data);
    let domTree    = temp.children[0].cloneNode(true);  // 不要使用cloneNode，这样就可以在加入文档之前获得元素的引用。
    return container.appendChild(domTree);
  }

  // 传入数据，更新视图
  update(key,value){

    if (!template) { return; }
  }

  // 初始化方法
  init(config){
    this._config = config;
    this.bind();
    this.render();
  }






}


// 解析模板字符串，渲染成DOM
// 遍历DOM，将元素的prop,text,method与元素建立映射关系
// 当其中的某个数据发生变化，则只更新这一个元素
// 将DOM插入到文档中

// prop   -propname
// text   {{value}}  如果插值在一个字符串中间如何完成更新？利用split分割字符串，利用join重组字符串
// method @method    如何完成方法与事件的绑定？
//
// 遍历节点
let traverseEle = function(rootNode){
  if (rootNode.nodeType !== 1 || rootNode.nodeType!== 3){ return; }
  let childNodes = rootNode.childNodes;
  let node,
      i,
      len = childNodes.length;

  this.nodePropsTraverse(rootNode);
  this.textNodesTraverse(rootNode);

  for (i = 0; i<len; i++ ){
    node = childNodes[i];
    this.traverseEle(node);
  }

}

// 匹配绑定的属性
let nodePropsTraverse = function(node){
  if (node.nodeType!==1){return;}
  // 遍历当前节点的attributes节点
  let attrs = node.attributes,
      attr,
      propName,
      propValue;
  // 遍历属性节点
  for(let i = attrs.length-1; i >= 0; i--){
    attr = attrs[i];
    propName  = atttr.name.slice(7);
    bindData = attr.value;
    if(isPropBinder(attr)){
      addToProps(node,propName,bindData);
    }else if(isEventBinder(attr)){
      addToEvents(node,propName,bindData);
    }
  }

}

// 匹配绑定的插值
let textNodesTraverse = function(node){
  if (node.nodeType!==3){return;}

  let reg = /{{([^}]+)}}/ig;
  let str = node.nodeValue;
  let result;
  let propName;
  while((result = reg.exec(str))!==null){
    propName = result[1];
    addToDataMap(node,propName);
  }
}


// 检测属性节点是否为组件自定义属性--属性绑定
let isPropBinder = function(attrNode){
  const reg = /^v-prop:/;
  let name  = attrNode.name;
  // 检测是否属性节点并且是否包含指定标记
  if ((attrNode.nodeType==2) && (reg.test(name))){
    return true;
  }
  return false;
}
// 检测属性节点是否为组件自定义属性--事件绑定
let isEventBinder = function(attrNode){
  const reg = /^v-bind/;
  if ((attrNode.nodeType==2) && (reg.test(name))){
    return true;
  }
  let name = attrNode.name;
  return false;
}

