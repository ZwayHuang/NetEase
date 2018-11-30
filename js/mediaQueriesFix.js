(function(){
  var limit = document.querySelectorAll(".g-limit");
  var getPageWidth = function(){
    var pageWidth = window.innerWidth;
    if (typeof pageWidth !== "number"){
      if (document.compatMode == "CSS1Compat"){
        pageWidth = document.documentElement.clientWidth;
      }else{
        pageWidth = document.body.clientWidth;
      }
    }
    return pageWidth;
  };

  var setEleListWidth = function(eleList){
    var pageWidth = getPageWidth();
    var i;
    for(i = 0; i<eleList.length; i++){
      if(pageWidth>=1205){
        eleList[i].style.width = 1205+"px";
      }else {
        eleList[i].style.width = 960+"px";
      }
    }
  };

  setEleListWidth(limit);


  function addEvent(ele,event,callback){
    if (typeof ele.addEventListener == "function"){
      ele.addEventListener(event,callback,false);
    }else if (typeof ele.attachEvent == "function"){
      ele.attachEvent('on'+event,callback);
    }else {
      ele['on'+event] = callback;
    }
  }

  addEvent(document,"resize",setEleListWidth(limit));
})()