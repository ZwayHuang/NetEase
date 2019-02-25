function compile(template,data){
  // 匹配语句
  const evalExpr = /<%=(.+?)%>/g;
  // 匹配表达式
  const expr = /<%([\s\S]+?)%>/g;

  // 把模板替换成函数
  template = template.replace(evalExpr,'`); echo($1); echo(`')
                     .replace(expr,'`); $1 echo(`');
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