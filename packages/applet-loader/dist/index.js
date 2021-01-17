var t=require("qiankun");function n(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var e=n(require("vue"));function r(){return(r=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t}).apply(this,arguments)}var a,p=function(){function n(){this._started=!1,this._appletList=[]}var e=n.prototype;return e._addApplet=function(t){var n=t.name,e=this._appletList.findIndex(function(t){return t.name===n});-1!==e?(this._appletList.splice(e,1,t),console.warn("[QianKunHelper] updated app manifest, name is '"+n+"'")):this._appletList.push(t)},e._findAppByName=function(t){return this._appletList.find(function(n){return n.name===t})},e.getProps=function(t,n){return t.reduce(function(t,e){return t[e]=n[e],t},{})},e.addApplet=function(){var t=this;[].slice.call(arguments).forEach(function(n){return t._addApplet(n)})},e.findApplet=function(t){return this._findAppByName(t)},e.loadApplet=function(n,e,a){var p=r({},n,{container:e,props:this.getProps(n.propKeys||[],a)});return t.loadMicroApp(p)},e.start=function(n){this._started||(n?t.start(n):t.start(),this._started=!0)},n}(),o=new p,i=(a=0,function(){return a++});exports.AppletLoader=p,exports.appletLoader=o,exports.makeAppletComponentCreator=function(t,n){return function(a,p){void 0===p&&(p={autoRemove:!0,propsData:{}});var o="applet-container-"+a+"-"+i();return e.default.extend({data:function(){return{manifest:null,appInstance:null,errorMessage:""}},computed:{appName:function(){return this.manifest&&this.manifest.name||"unname"}},mounted:function(){console.log("AppletComponent mounted. containerId =",o);var e=t.findApplet(a);if(e){var i=n(this);p&&p.propsData&&Object.keys(p.propsData).length>0&&(i=r({},i,p.propsData)),this.appInstance=t.loadApplet(e,"#"+o,i)}else this.errorMessage="applet not found. lookup with name '"+a+"'"},beforeDestroy:function(){var t;(null==(t=p.autoRemove)||t)&&this.appInstance&&"function"==typeof this.appInstance.unmount&&(console.log("AppletComponent unmounted. containerId =",o),this.appInstance.unmount())},render:function(t){return t("div",""!==this.errorMessage?this.errorMessage:{attrs:{id:o},class:"applet-container"})}})}};
//# sourceMappingURL=index.js.map