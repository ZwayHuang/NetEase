/*
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
*/

;(function() {
  const tpl = `<div class="m-follow">
      <a class="follow_btn f-shadow" href="#">+ 关注</a>
      <div class="follow_cancel_wrap">
        <i class="cancel_hook u-icon">&#xe733;</i>
        已关注<i class="cancel_line">I</i>
        <a class="cancel_btn u-link" href="#">取消</a>
      </div>
      <div class="follow_fans"></div>
    </div>`;

  /**
   * 关注组件
   */
  class Follow {
    /**
     * 创建一个关注组件
     * @param {Object} opts
     */
    constructor(opts) {
      this.el = document.querySelector(opts.el) || document.body;
      this.component = this._layout.cloneNode(true);
      this.followed = opts.followed || false;
      this.fans = opts.fans || 0;
      console.log(opts.fans);
      console.log(this.fans);

      // this.onFollow = typeof opts.onFollow == 'function' ?
      //   opts.onFollow : () => {};
      // this.onUnfollow = typeof opts.onUnfollow == 'function' ?
      //   opts.onUnfollow : () => {};
      // this.isLogin = typeof opts.isLogin == 'function' ?
      //   opts.isLogin : () => {};

      this.followBtn = this.component.querySelector('.follow_btn');
      this.cancelBtn = this.component.querySelector('.cancel_btn');
      this.cancelWrap = this.component.querySelector('.follow_cancel_wrap');
      this.fansWrap = this.component.querySelector('.follow_fans');

      // console.log(this.followBtn);
      // console.log(this.cancelBtn);
      // console.log(this.cancelWrap);
      // console.log(this.fansWrap);
      // console.log(typeof this.onFollow);
      // console.log(typeof this.onUnfollow);
      // console.log(this.el);


      this._init();
    }

    /**
     * 组件初始化
     */
    _init() {
      this._setState(this.followed, this.fans);
      this._setFans(this.fans);
      // console.log(this.fans);
      this._initEvent();
      this.el.appendChild(this.component);
    }

    /**
     * 初始化事件
     */
    _initEvent() {
      this.followBtn.addEventListener('click', () => {
        // try {
        //   this.onFollow();
        //   this._onFollowSucc();
        //   this.emit('follow');
        // } catch (err) {
        //   this._onFailed('关注失败，失败代码： ' + err);
        // }

        this.emit('follow');
      }, false);
      this.cancelBtn.addEventListener('click', () => {
        // try {
        //   this.onUnfollow();
        //   this._onUnfollowSucc();
        //   this.emit('unfollow');
        // } catch (err) {
        //   this._onFailed('取消关注失败，失败代码： ' + 'err');
        // }

        this.emit('unfollow');
      }, false);
    }

    /**
     * 更新UI
     * @param {boolean} followed - 指示当前是否关注
     * @param {number} fans - 当前粉丝数
     */
    _setState(followed, fans) {
      this.followed = !!followed;
      if (this.followed) {
        util.delClass(this.followBtn, 'z-active');
        util.addClass(this.cancelWrap, 'z-active');
      } else {
        util.delClass(this.cancelWrap, 'z-active');
        util.addClass(this.followBtn, 'z-active');
      }
      this._setFans(fans);
    }

    /**
     * 设置粉丝数
     * @param {number} fans
     */
    _setFans(fans) {
      fans = parseInt(fans);
      this.fans = fans;
      let content = '';

      switch (true) {
        case 10**4-1 < fans && fans < 10**7:
          content = fans/10**4+' 万';
          break;
        case 10**7-1 < fans && fans < 10**8:
          content = fans/10**7+' 千万';
          break;
        case fans > 10**8-1:
          content = fans/10**8+' 亿';
          break;
        default:
          content = fans;
      }

      this.fansWrap.textContent = '粉丝 ' + content;
    }

    /**
     * 关注成功
     */
    onFollowSucc() {
      if (this.followed) {
        return;
      }
      this._setState(true, ++this.fans);
      console.log('follow successful');
    }

    /**
     * 取消关注成功
     */
    onUnfollowSucc() {
      if (!this.followed) {
        return;
      }
      this._setState(false, --this.fans);
      console.log('unfollow successful');
    }

    /**
     * 操作失败
     * @param {number} errMsg - 失败代码
     */
    onFailed(errMsg) {
      alert(errMsg);
    }
  }
  Follow.prototype._layout = util.html2node(tpl);
  util.extend(Follow.prototype, util.emitter);

  window.Follow = Follow;
}());
