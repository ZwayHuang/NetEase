var util = (function(){
  return {
    // 去除字符串的首尾空格和中间一个以上空格
    delExcessSpace: function(str){
      // 去除中间多余空格
      var result = str.replace(/[\s\uFFFF\xA0]{2,}/g,' ');
      // 去除首尾多余空格
      return result.trim();
    },
    addClass: function (node, className){
      var current = node.className || "";
      if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
        node.className = current? ( current + " " + className ) : className;
      }
    },
    delClass: function (node, className){
      var current = node.className || "";
      node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
    },
    hasClass: function (node,className){
      var current = node.className || "";
      if ((" " + current + " ").indexOf(" " + className + " ") === -1){
        return false;
      }
      return true;
    },
    toggleClass: function(node,className){
      if (this.hasClass(node,className)){
        this.delClass(node,className);
      }else{
        this.addClass(node,className);
      }
    },
    ajax: function(sMethod,sURL,vContent,bAsync,onSucc,onFail){
      let xhr = new XMLHttpRequest();
      xhr.open(sMethod,sURL,bAsync);
      xhr.onreadystatechange = function(){
        if (xhr.readyState === 4){
          if (xhr.status === 200){
            onSucc(xhr.responseText);
          }else{
            onFail(xhr.status);
          }
        }
      };
      xhr.send(vContent);
    },
    
    getDataSet(element){
      if (element.dataset){
        return element.dataset;
      }

      var dataSet = {};
      var attrs = element.Attributes;
      var attrName = '';
      for (var i = 0, len = attrs.length; i < len; i++ ){
        if (attrs[i].nodeName.indexOf('data-') === -1){
          continue;
        }
        attrName = attrs[i].nodeName.slice(5);
        attrName.replace('-',function(match,index,input){
          return input[index+1].toUpperCase();
        });
        dataSet[attrName] = nodeValue;
      }
      
      return dataSet;
      
    },
    getStyle: function (oElement, sCssPropertyName){
      var formatName = function(value){ 
        if(/\-/.test(value)){
          value = value.replace(/\-\w/,function(match,index,input){
            return input.charAt(index + 1).toUpperCase();
          });
        }
        return value;
      };
      var key = formatName(sCssPropertyName);
      if(window.getComputedStyle){
        return window.getComputedStyle(oElement)[key];
      } else{
        return oElement.currentStyle[key];
      }
    },
    extend: function(o1,o2){
      for (i in o2){
        if (o1[i] == undefined){
          o1[i] = o2[i];
        }
      }
    },
    // 模板编译函数
    compile:function(template,data){
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
    },

   /**
    * ::事件系统::
    * 
    * 语法：
    * 
    * emitter.on(event,fn)
    * emitter.off(event,fn)
    * emitter.emit(event)
    */
    emitter: {
      //注册事件
      on: function(event,fn){
        let handles = this._handles  || (this._handles  = {}),
            calls   = handles[event] || (handles[event] = []);
        
        calls.push(fn);
    
        return this;
      },
    
      //解绑事件
      off: function(event,fn){
        if (!event || !this._handles){ this._handles = {}; }
        if (!this._handles){ return this; }
    
        let handles = this._handles, calls;
    
        if (calls = handles[event]){
          if(!fn){
            handles[event] = [];
            return this;
          }
          for (let i = 0,len = calls.length; i < len; i++){
            if (fn===calls[i]){
              calls.splice(i,1);
              return this;
            }
          }
        }
        return this;
      },
    
      //发布事件
      emit: function(event){
        let args = Array.prototype.slice.call(arguments,1)
        let handles = this._handles,calls;
    
        if (!handles || !(calls = handles[event])){ return this; }
    
        for (let i = 0,len = calls.length; i < len; i++){
          calls[i].apply(this,args)
        }
        return this;
      }
    },

   /**
    *
    *  :: cookies.js ::
    *
    *  A complete cookies reader/writer framework with full unicode support.
    *
    *  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
    *
    *  This framework is released under the GNU Public License, version 3 or later.
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

      getItem: function (sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
      },

      setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
          switch (vEnd.constructor) {
            case Number:
              sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
              break;
            case String:
              sExpires = "; expires=" + vEnd;
              break;
            case Date:
              sExpires = "; expires=" + vEnd.toUTCString();
              break;
          }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
      },

      removeItem: function (sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
        return true;
      },
      
      hasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
      },

      /**
       * 列出所有cookie的键
       * @returns {Array}
       */
      keys: /* optional method: you can safely remove it! */ function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
      }
    },

  }
})();





