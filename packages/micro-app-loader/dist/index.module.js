import{start as n,loadMicroApp as t}from"qiankun";import e from"vue";function r(){return(r=Object.assign||function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r])}return n}).apply(this,arguments)}var a=function(){function e(){this._started=!1,this._appList=[]}var a=e.prototype;return a.start=function(t){void 0===t&&(t=null),this._started||(t?n(t):n(),this._started=!0)},a._addApp=function(n){var t=n.name,e=this._appList.findIndex(function(n){return n.name===t});-1!==e?(this._appList.splice(e,1,n),console.warn("[QianKunHelper] updated app manifest, name is '"+t+"'")):this._appList.push(n)},a.addApp=function(){var n=this;[].slice.call(arguments).forEach(function(t){return n._addApp(t)})},a._findAppByName=function(n){return this._appList.find(function(t){return t.name===n})},a.getProps=function(n,t){return n.reduce(function(n,e){return n[e]=t[e],n},{})},a.findApp=function(n){return this._findAppByName(n)},a.loadApp=function(n,e,a){var i=r({},n,{container:e,props:this.getProps(n.propKeys||[],a)});return t(i)},e}(),i=new a,p=function(n,t){return function(r,a){void 0===a&&(a={autoRemove:!0});var i="app-container-"+r;return e.extend({data:function(){return{manifest:null,appInstance:null,errorMessage:""}},computed:{appName:function(){return this.manifest&&this.manifest.name||"unname"}},mounted:function(){console.log("MicroAppComponent mounted. containerId =",i);var e=n.findApp(r);if(e){var a=t();this.appInstance=n.loadApp(e,"#"+i,a)}else this.errorMessage="app not found, name = "+r},beforeDestroy:function(){var n;(null==(n=a.autoRemove)||n)&&this.appInstance&&"function"==typeof this.appInstance.unmount&&this.appInstance.unmount()},render:function(n){return n("div",""!==this.errorMessage?this.errorMessage:{attrs:{id:i,"data-app-name":this.appName}})}})}};export{a as MicroAppLoader,p as makeAppComponentCreator,i as microAppLoader};
//# sourceMappingURL=index.module.js.map
