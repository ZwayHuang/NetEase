// IE8兼容
(function(){
  // 兼容bind函数
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // 如果对象不是函数，则报错。
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }
  
      var aArgs   = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP    = function() {},
          fBound  = function() {
            // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
            return fToBind.apply(this instanceof fBound
                   ? this
                   : oThis,
                   // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                   aArgs.concat(Array.prototype.slice.call(arguments)));
          };
  
      // 维护原型关系
      if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype; 
      }
      // 下行的代码使fBound.prototype是fNOP的实例,因此
      // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
      fBound.prototype = new fNOP();
  
      return fBound;
    };
  }

  // 兼容Array.prototype.indexOf
  if (!Array.prototype.indexOf){
    Array.prototype.indexOf = function(searchElement){
      if (this == null){ throw new TypeError('"this"is null or not defined') }
      
      var len = this.length;
      if (len === 0){ return -1; }
      
      var fromIndex = +arguments[1] || 0;
      if (fromIndex<0){ fromIndex += len; }
      if (fromIndex >= len){ return -1; }

      while (fromIndex < len){
        if (fromIndex in this && this[fromIndex] == searchElement){
          return fromIndex;
        }
        fromIndex++;
      }
      return -1;
    };
  }

  // 兼容Array.prototype.forEach
  if (!Array.prototype.forEach){
    Array.prototype.forEach = function(callback){
      var len = this.length;
      var thisArg = arguments[1];
      if (typeof callback !== 'function'){ throw new TypeError('"callback" must be a function'); }

      for (var i=0; i<len; i++){
        if (i in this){
          callback.call(thisArg,this[i],i,this)
        }
      }
    };
  }

  // 兼容String.prototype.trim
  if (!String.prototype.trim){
    String.prototype.trim = function(){
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
  }

  // 兼容preventDefault
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault=function() {
      this.returnValue=false;
    };
  }
  
  // 兼容stopPropagation
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation=function() {
      this.cancelBubble=true;
    };
  }

  // 兼容addEventListener/removeEventListener
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];
    
    var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (typeof listener.handleEvent != 'undefined') {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
        
        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})()

  
