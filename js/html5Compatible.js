(function(){
  var tags = "header,nav,section,article,main,aside,footer,audio,video,canvas,datalist,dialog,figure,hgroup,mark,menu,meter,output,progress,time";
  var tagList = tags.split(",");
  var i;
  for( i = 0; i< tagList.length; i++){
    document.createElement(tagList[i]);
  }
})()
