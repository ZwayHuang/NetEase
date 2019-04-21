const util = (function() {
  return {
    // 去除字符串的首尾空格和中间一个以上空格
    delExcessSpace(str) {
      // 去除中间多余空格
      const result = str.replace(/[\s\uFFFF\xA0]{2,}/g, ' ');
      // 去除首尾多余空格
      return result.trim();
    },

    addClass(node, className) {
      const current = node.className || '';
      if ((' ' + current + ' ').indexOf(' ' + className + ' ') === -1) {
        node.className = current? ( current + ' ' + className ) : className;
      }
    },

    delClass(node, className) {
      const current = node.className || '';
      node.className = (' ' + current + ' ')
          .replace(' ' + className + ' ', ' ').trim();
    },

    hasClass(node, className) {
      const current = node.className || '';
      if ((' ' + current + ' ').indexOf(' ' + className + ' ') === -1) {
        return false;
      }
      return true;
    },

    toggleClass(node, className) {
      if (this.hasClass(node, className)) {
        this.delClass(node, className);
      } else {
        this.addClass(node, className);
      }
    },

    ajax(method, URL, content, async, onSucc, onFail) {
      const xhr = new XMLHttpRequest();
      xhr.open(method, URL, async);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            onSucc(xhr.responseText);
          } else {
            onFail(xhr.status);
          }
        }
      };
      xhr.send(vContent);
    },

    getDataSet(element) {
      if (element.dataset) {
        return element.dataset;
      }

      const dataSet = {};
      const attrs = element.Attributes;
      const attrName = '';

      for (let i = 0, len = attrs.length; i < len; i++ ) {
        if (attrs[i].nodeName.indexOf('data-') === -1) {
          continue;
        }
        attrName = attrs[i].nodeName.slice(5);
        attrName.replace('-', function(match, index, input) {
          return input[index+1].toUpperCase();
        });
        dataSet[attrName] = nodeValue;
      }
      return dataSet;
    },

    getStyle(element, cssPropertyName) {
      const formatName = function(value) {
        if (/\-/.test(value)) {
          value = value.replace(/\-\w/, function(match, index, input) {
            return input.charAt(index + 1).toUpperCase();
          });
        }
        return value;
      };
      const key = formatName(cssPropertyName);
      if (window.getComputedStyle) {
        return window.getComputedStyle(element)[key];
      } else {
        return element.currentStyle[key];
      }
    },

    extend(o1, o2) {
      for (let key in o2) {
        if (o1[key] == undefined) {
          o1[key] = o2[key];
        }
      }
    },

    // 模板编译函数
    compile(template, data) {
      // 匹配表达式
      const evalExpr = /<%=(.+?)%>/g;
      // 匹配语句
      const expr = /<%([\s\S]+?)%>/g;

      // 把模板替换成函数
      template = template.replace(evalExpr, '`); \n echo($1); \n echo(`')
          .replace(expr, '`); \n $1 \n echo(`');
      template = 'echo(`'+template+'`);';

      const parse = eval(
          `(function(data){
            let output = '';
          
            function echo(html){
              output += html;
            }
      
            ${template}
      
            return output;
          })`);

      return parse(data);
    },

    // HTML字符串转换函数
    html2node(htmlStr) {
      const div = document.createElement('div');
      div.innerHTML = htmlStr;
      return div.children[0];
    },

    /**
    * ::事件系统::
    *
    * 语法：
    * emitter.on(event,fn)
    * emitter.off(event,fn)
    * emitter.emit(event)
    */
    emitter: {
      // 注册事件
      on(event, fn) {
        const handles = this._handles || (this._handles = {});
        const calls = handles[event] || (handles[event] = []);
        calls.push(fn);
        return this;
      },

      // 解绑事件
      off(event, fn) {
        if (!event || !this._handles) {
          this._handles = {};
        }
        if (!this._handles) {
          return this;
        }

        const handles = this._handles;
        const calls = handles[event];

        if (calls) {
          if (!fn) {
            handles[event] = [];
            return this;
          }
          for (let i = 0, len = calls.length; i < len; i++) {
            if (fn===calls[i]) {
              calls.splice(i, 1);
              return this;
            }
          }
        }
        return this;
      },

      // 发布事件
      emit(...args) {
        const event = Array.prototype.shift.call(args);
        const handles = this._handles || {};
        const calls = handles[event];

        if (!handles || !calls) {
          return this;
        }

        for (let i = 0, len = calls.length; i < len; i++) {
          calls[i].apply(this, args);
        }
        return this;
      },
    },

    /**
    *
    *  :: cookies.js ::
    *
    *  A complete cookies reader/writer framework with full unicode support.
    *
    *  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
    *
    *  This framework is released under the GNU Public License,
    *  version 3 or later.
    *  http://www.gnu.org/licenses/gpl-3.0-standalone.html
    *
    *  Syntaxes:
    *
    *  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
    *  * docCookies.getItem(name)
    *  * docCookies.removeItem(name[, path], domain)
    *  * docCookies.hasItem(name)
    *  * docCookies.keys()
    *
    */

    docCookies: {

      getItem(key) {
        return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
      },

      setItem(key, value, end, path, domain, secure) {
        if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
          return false;
        }
        let sExpires = '';
        if (end) {
          switch (end.constructor) {
            case Number:
              sExpires = end === Infinity
                          ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
                          : '; max-age=' + end;
              break;
            case String:
              sExpires = '; expires=' + end;
              break;
            case Date:
              sExpires = '; expires=' + end.toUTCString();
              break;
          }
        }
        document.cookie = encodeURIComponent(key)
            + '=' + encodeURIComponent(value)
            + sExpires
            + (domain ? '; domain=' + domain : '')
            + (path ? '; path=' + path : '')
            + (secure ? '; secure' : '');
        return true;
      },

      removeItem(key, path, domain) {
        if (!key || !this.hasItem(key)) {
          return false;
        }
        document.cookie = encodeURIComponent(key)
          + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          + ( domain ? '; domain=' + domain : '')
          + ( path ? '; path=' + path : '');
        return true;
      },

      /**
       * 检测是否包含指定的cookie
       * @param {string} key
       * @return {boolean}
       */
      hasItem(key) {
        const reg = new RegExp('(?:^|;\\s*)'
            + encodeURIComponent(key)
                .replace(/[-.+*]/g, '\\$&') + '\\s*\\=');
        const result = reg.test(document.cookie);
        return result;
      },

      /**
       * 列出所有cookie的键
       * @return {Array}
       */
      keys() {
        const keys = document.cookie
            .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
            .split(/\s*(?:\=[^;]*)?;\s*/);
        for (let nIdx = 0; nIdx < keys.length; nIdx++) {
          keys[nIdx] = decodeURIComponent(keys[nIdx]);
        }
        return keys;
      },
    },
  };
})();
