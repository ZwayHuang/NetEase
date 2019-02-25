class Follow extends Component {
  constructor(options){
    super();

    let tpl = `<div class="m-follow">
                  <a class="follow z-active f-shadow" href="javascript:void(0)">+ 关注</a>
                  <div class="cancel"><i class="hook u-icon">&#xe733;</i>已关注<i class="line">I</i><a class="u-link cancel_btn" href="javascript:void(0)">取消</a></div>
                  <div class="fans">粉丝 <%=data.fans%></div>
                </div>`;

    let configMap = {
      container: options.container || document.body,
      fans: parseInt(options.fans) > 0 ? parseInt(options.fans) : 0,
      followed: options.followed || false,
    };

    this.follow = this.renderTo(configMap.container,tpl,configMap);
    this.fans = configMap.fans;
    this.followed = configMap.followed;
    this.checkLogin = options.checkLogin;

    this._init();
  }


  _setQueryMap( ){
    let queryMap = this.queryMap = {};
    let follow = this.follow;

    queryMap.followBtn = follow.querySelector('.follow');
    queryMap.cancelBtn = follow.querySelector('.cancel_btn');
    queryMap.cancelBox = follow.querySelector('.cancel');
    queryMap.fans      = follow.querySelector('.fans');
  }
  _bindEvent(){
    this.queryMap.followBtn.addEventListener('click',this._onGetFollow.bind(this),false);
    this.queryMap.cancelBtn.addEventListener('click',this._onUnfollow.bind(this),false);
  }
  _init(){
    this._setQueryMap();
    this._bindEvent();
  }

  _update(){
    this.queryMap.fans.textContent = '粉丝 ' + this.fans;
    if (this.followed){
      util.delClass(this.queryMap.followBtn,'z-active');
      util.addClass(this.queryMap.cancelBox,'z-active');
    }else{
      util.delClass(this.queryMap.cancelBox,'z-active');
      util.addClass(this.queryMap.followBtn,'z-active');
    }
    return this;
  }

  _onGetFollowSuccess(response){
    if (response == 1){
      this.fans++;
      this.followed = !this.followed;
      this._update();
      this.emit('Follow_getFollowSuccess');
    }else{
      onFollowFailed(response);
    }
  }
  _onGetFollowFailed(err){
    this.emit('Follow_getFollowFailed');
    alert("关注失败!"+err);
  }
  _onUnfollowSuccess(response){
    if (response==1){
      this.fans--;
      this.followed = !this.followed;
      this._update();
      this.emit('Follow_unfollowSuccess');
    }else{
      onUnfollowFailed(err);
    }
  }
  _onUnfollowFailed(err){
    this.emit('Follow_unfollowFailed');
    alert("取消关注失败"+err);
  }
  _onGetFollow(e){
    e = e ? e : window.event;
    e.preventDefault();
    e.stopPropagation();

    if (this.checkLogin()){
      this.getFollow();
    }else{
      // 显示登录模块
      alert("显示登录模块");
      this.emit('Follow_notLogin');
    }
  }
  _onUnfollow(e){
    e = e ? e : window.event;
    e.preventDefault();
    e.stopPropagation();

    if (this.checkLogin()){
      this.unfollow();
    }else{
      // 显示登录模块
      alert("显示登录模块");
      this.emit('Follow_notLogin');
    }
  }



  getFollow(){
    // 调用关注API
    util.ajax('GET','http://study.163.com/webDev/attention.htm','',true,this._onGetFollowSuccess.bind(this),this._onGetFollowFailed.bind(this));
    return this;
  }
  unfollow(){
    util.ajax('GET','http://study.163.com/webDev/attention.htm','',true,this._onUnfollowSuccess.bind(this),this._onUnfollowFailed.bind(this));
    return this;
  }

}
util.extend(Follow.prototype,util.emitter);