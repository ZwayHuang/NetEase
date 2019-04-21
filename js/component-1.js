/**
 * 组件模块
 * new Component({
 *   el:'#id',
 *   template:"<div></div>",
 *   data:{},
 *   methods:{},
 *   bindEvent(){},
 *   setUp(){},
 *
 *   // 钩子函数
 *   beforeCreate(){},
 *   created(){},
 *   beforeInit(){},
 *   inited(){}
 *   beforeMount(){},
 *   mounted(){},
 *   beforeUpdate(){},
 *   updated(){},
 *   beforeDestroy(){},
 *   destroy(){}
 * })
 */

/**
 * 组件类
 * @class Component
 * @param {Object} opts - the options of the Component
 */
class Component {
  constructor() {
    if ((this instanceof Component)) {
      throw new Error('此类不能实例化！');
    }

    const privateProp = {};
    this.getPrivateProp = key => privateProp[key];
    this.setPrivateProp = (key, value) => {
      privateProp[key] = value;
      return privateProp[key];
    };
  }

  /**
   * 数据绑定监听方法
   * @param {Object} data - 需要绑定的数据.
   */
  dataWatch(data) {
    this.on('update', this.update());

    const keys = Object.keys(data);
    keys.forEach((key) => {
      let val = data[key];
      this[key] = data[key];

      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: false,
        get() {
          return val;
        },
        set(newVal) {
          if (val !== newVal) {
            this[key] = newVal;
            val = this[key];
            this.emit('update');
          }
          return val;
        },
      });
    });
  }


  // 模板解析函数
  compile(data) {
    const EVAL_EXPR = /<%=(.+?)%>/g; // 匹配表达式
    const EXPR = /<%([\s\S]+?)%>/g; // 匹配语句
    // 把模板替换成函数
    let script = this.template.replace(EVAL_EXPR, '`); \n echo($1); \n echo(`').replace(EXPR, '`); \n $1 \n echo(`');
    script = `echo(\`${script}\`);`;

    const parse = eval(`(function(data) {
      let output = '';
      function echo(html) {
        output += html;
      }
      ${script}
      return output;
    })`);
    return parse(data);
  }


  /**
   * 模板渲染函数
   * @return {object} - 未插入文档的DOM树
   */
  render() {
    if (typeof this.html !== 'string') { return null; }
    const ctnr = document.createElement('div');
    ctnr.innerHTML = this.html;
    [this.domTree] = [ctnr.children[0]];
    return this.domTree;
  }

  // 将渲染好的DOM树挂载到文档中
  mount() {
    if (!this.beforeMount) {
      this.beforeMount();
    }

    this.component = this.container.appendChild(this.domTree);

    if (!this.mounted) {
      this.mounted();
    }
    return this.component;
  }

  // 传入数据，更新视图
  // update() {
  //   this.compile(this.template, this.data);
  //   this.render(this.container);
  // }

  // 初始化方法
  init(opts) {
    util.extend(this, opts);
    this.container = document.querySelector(this.el) || document.body;
    this.html = this.compile();
    this.component = this.render();
    this.dataTraverse(this, this.data);
  }

  setChunkData(...args) {
    const stack = [];
    const valName = args.shift();
    const fns = this.getPrivateProp('updateMap')[valName];
    let len = 0;

    if (typeof fns === 'function') {
      stack.push(fns);
    } else {
      stack.concat(fns);
    }

    len = stack.length;
    if (len !== 0) {
      stack.forEach((fn) => {
        fn.apply(this, args);
      });
    }
  }
}



class Router {
  constructor (routes) {
    this.routes = routes || {};
    this.state = '';
    this.hash = '';
  }

  update () {
    this.hash = window.location.hash.slice(1) || '/';
    let hashStr = this.hash,
        index = hashStr.indexOf('='),
        path = '',
        state = '';

    if (index !== -1){
      path = hashStr.slice(0,index);
      state = hashStr.slice(index+1);
    }
    this.routes[key](state);
  }

  init () {
    window.addEventListener('load', this.update.bind(this));
    window.addEventListener('hashchange', this.update.bind(this));
  }
}
