let emitter = {
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
    let args = Array.prototype.slice.call(this,1)
    let handles = this._handles,calls;

    if (!handles || !(calls = handles[event])){ return this; }

    for (let i = 0,len = calls.length; i < len; i++){
      calls[i].apply(this,args)
    }
    return this;
  }
};