var Sf=Object.defineProperty;var Cf=(n,e,t)=>e in n?Sf(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var is=(n,e,t)=>Cf(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();const Pf=()=>{};var Nc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fu=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},kf=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],a=n[t++],c=n[t++],u=((s&7)<<18|(i&63)<<12|(a&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const i=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return e.join("")},pu={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,c=a?n[s+1]:0,u=s+2<n.length,d=u?n[s+2]:0,f=i>>2,m=(i&3)<<4|c>>4;let g=(c&15)<<2|d>>6,R=d&63;u||(R=64,a||(g=64)),r.push(t[f],t[m],t[g],t[R])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(fu(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):kf(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const m=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||c==null||d==null||m==null)throw new Nf;const g=i<<2|c>>4;if(r.push(g),d!==64){const R=c<<4&240|d>>2;if(r.push(R),m!==64){const I=d<<6&192|m;r.push(I)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Nf extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Df=function(n){const e=fu(n);return pu.encodeByteArray(e,!0)},Is=function(n){return Df(n).replace(/\./g,"")},mu=function(n){try{return pu.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xf(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vf=()=>xf().__FIREBASE_DEFAULTS__,Of=()=>{if(typeof process>"u"||typeof Nc>"u")return;const n=Nc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Lf=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&mu(n[1]);return e&&JSON.parse(e)},Ws=()=>{try{return Pf()||Vf()||Of()||Lf()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},gu=n=>{var e,t;return(t=(e=Ws())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},_u=n=>{const e=gu(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},vu=()=>{var n;return(n=Ws())===null||n===void 0?void 0:n.config},yu=n=>{var e;return(e=Ws())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mf{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hn(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Co(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wu(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Is(JSON.stringify(t)),Is(JSON.stringify(a)),""].join(".")}const ur={};function Uf(){const n={prod:[],emulator:[]};for(const e of Object.keys(ur))ur[e]?n.emulator.push(e):n.prod.push(e);return n}function Ff(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let Dc=!1;function Po(n,e){if(typeof window>"u"||typeof document>"u"||!hn(window.location.host)||ur[n]===e||ur[n]||Dc)return;ur[n]=e;function t(g){return`__firebase__banner__${g}`}const r="__firebase__banner",i=Uf().prod.length>0;function a(){const g=document.getElementById(r);g&&g.remove()}function c(g){g.style.display="flex",g.style.background="#7faaf0",g.style.position="fixed",g.style.bottom="5px",g.style.left="5px",g.style.padding=".5em",g.style.borderRadius="5px",g.style.alignItems="center"}function u(g,R){g.setAttribute("width","24"),g.setAttribute("id",R),g.setAttribute("height","24"),g.setAttribute("viewBox","0 0 24 24"),g.setAttribute("fill","none"),g.style.marginLeft="-6px"}function d(){const g=document.createElement("span");return g.style.cursor="pointer",g.style.marginLeft="16px",g.style.fontSize="24px",g.innerHTML=" &times;",g.onclick=()=>{Dc=!0,a()},g}function f(g,R){g.setAttribute("id",R),g.innerText="Learn more",g.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",g.setAttribute("target","__blank"),g.style.paddingLeft="5px",g.style.textDecoration="underline"}function m(){const g=Ff(r),R=t("text"),I=document.getElementById(R)||document.createElement("span"),N=t("learnmore"),C=document.getElementById(N)||document.createElement("a"),O=t("preprendIcon"),F=document.getElementById(O)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(g.created){const M=g.element;c(M),f(C,N);const q=d();u(F,O),M.append(F,I,C,q),document.body.appendChild(M)}i?(I.innerText="Preview backend disconnected.",F.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(F.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,I.innerText="Preview backend running in this workspace."),I.setAttribute("id",R)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",m):m()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ce(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Bf(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ce())}function $f(){var n;const e=(n=Ws())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function qf(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function jf(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Hf(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function zf(){const n=Ce();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Wf(){return!$f()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Gf(){try{return typeof indexedDB=="object"}catch{return!1}}function Kf(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qf="FirebaseError";class it extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Qf,Object.setPrototypeOf(this,it.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Cr.prototype.create)}}class Cr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],a=i?Jf(i,r):"Error",c=`${this.serviceName}: ${a} (${s}).`;return new it(s,c,r)}}function Jf(n,e){return n.replace(Yf,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const Yf=/\{\$([^}]+)}/g;function Xf(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function sn(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],a=e[s];if(xc(i)&&xc(a)){if(!sn(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function xc(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function sr(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function ir(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Zf(n,e){const t=new ep(n,e);return t.subscribe.bind(t)}class ep{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");tp(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=ji),s.error===void 0&&(s.error=ji),s.complete===void 0&&(s.complete=ji);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function tp(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function ji(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(n){return n&&n._delegate?n._delegate:n}class Ot{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class np{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Mf;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(sp(e))try{this.getOrInitializeService({instanceIdentifier:Zt})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=Zt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Zt){return this.instances.has(e)}getOptions(e=Zt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);r===c&&a.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(e),this.onInitCallbacks.set(s,i);const a=this.instances.get(s);return a&&e(a,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:rp(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Zt){return this.component?this.component.multipleInstances?e:Zt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function rp(n){return n===Zt?void 0:n}function sp(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ip{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new np(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var W;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(W||(W={}));const op={debug:W.DEBUG,verbose:W.VERBOSE,info:W.INFO,warn:W.WARN,error:W.ERROR,silent:W.SILENT},ap=W.INFO,cp={[W.DEBUG]:"log",[W.VERBOSE]:"log",[W.INFO]:"info",[W.WARN]:"warn",[W.ERROR]:"error"},lp=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=cp[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ko{constructor(e){this.name=e,this._logLevel=ap,this._logHandler=lp,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in W))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?op[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,W.DEBUG,...e),this._logHandler(this,W.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,W.VERBOSE,...e),this._logHandler(this,W.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,W.INFO,...e),this._logHandler(this,W.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,W.WARN,...e),this._logHandler(this,W.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,W.ERROR,...e),this._logHandler(this,W.ERROR,...e)}}const up=(n,e)=>e.some(t=>n instanceof t);let Vc,Oc;function hp(){return Vc||(Vc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function dp(){return Oc||(Oc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Eu=new WeakMap,to=new WeakMap,Tu=new WeakMap,Hi=new WeakMap,No=new WeakMap;function fp(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{t(kt(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Eu.set(t,n)}).catch(()=>{}),No.set(e,n),e}function pp(n){if(to.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});to.set(n,e)}let no={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return to.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Tu.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return kt(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function mp(n){no=n(no)}function gp(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(zi(this),e,...t);return Tu.set(r,e.sort?e.sort():[e]),kt(r)}:dp().includes(n)?function(...e){return n.apply(zi(this),e),kt(Eu.get(this))}:function(...e){return kt(n.apply(zi(this),e))}}function _p(n){return typeof n=="function"?gp(n):(n instanceof IDBTransaction&&pp(n),up(n,hp())?new Proxy(n,no):n)}function kt(n){if(n instanceof IDBRequest)return fp(n);if(Hi.has(n))return Hi.get(n);const e=_p(n);return e!==n&&(Hi.set(n,e),No.set(e,n)),e}const zi=n=>No.get(n);function vp(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){const a=indexedDB.open(n,e),c=kt(a);return r&&a.addEventListener("upgradeneeded",u=>{r(kt(a.result),u.oldVersion,u.newVersion,kt(a.transaction),u)}),t&&a.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),c}const yp=["get","getKey","getAll","getAllKeys","count"],wp=["put","add","delete","clear"],Wi=new Map;function Lc(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Wi.get(e))return Wi.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=wp.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||yp.includes(t)))return;const i=async function(a,...c){const u=this.transaction(a,s?"readwrite":"readonly");let d=u.store;return r&&(d=d.index(c.shift())),(await Promise.all([d[t](...c),s&&u.done]))[0]};return Wi.set(e,i),i}mp(n=>({...n,get:(e,t,r)=>Lc(e,t)||n.get(e,t,r),has:(e,t)=>!!Lc(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ep{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Tp(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Tp(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ro="@firebase/app",Mc="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pt=new ko("@firebase/app"),Ip="@firebase/app-compat",bp="@firebase/analytics-compat",Ap="@firebase/analytics",Rp="@firebase/app-check-compat",Sp="@firebase/app-check",Cp="@firebase/auth",Pp="@firebase/auth-compat",kp="@firebase/database",Np="@firebase/data-connect",Dp="@firebase/database-compat",xp="@firebase/functions",Vp="@firebase/functions-compat",Op="@firebase/installations",Lp="@firebase/installations-compat",Mp="@firebase/messaging",Up="@firebase/messaging-compat",Fp="@firebase/performance",Bp="@firebase/performance-compat",$p="@firebase/remote-config",qp="@firebase/remote-config-compat",jp="@firebase/storage",Hp="@firebase/storage-compat",zp="@firebase/firestore",Wp="@firebase/ai",Gp="@firebase/firestore-compat",Kp="firebase",Qp="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const so="[DEFAULT]",Jp={[ro]:"fire-core",[Ip]:"fire-core-compat",[Ap]:"fire-analytics",[bp]:"fire-analytics-compat",[Sp]:"fire-app-check",[Rp]:"fire-app-check-compat",[Cp]:"fire-auth",[Pp]:"fire-auth-compat",[kp]:"fire-rtdb",[Np]:"fire-data-connect",[Dp]:"fire-rtdb-compat",[xp]:"fire-fn",[Vp]:"fire-fn-compat",[Op]:"fire-iid",[Lp]:"fire-iid-compat",[Mp]:"fire-fcm",[Up]:"fire-fcm-compat",[Fp]:"fire-perf",[Bp]:"fire-perf-compat",[$p]:"fire-rc",[qp]:"fire-rc-compat",[jp]:"fire-gcs",[Hp]:"fire-gcs-compat",[zp]:"fire-fst",[Gp]:"fire-fst-compat",[Wp]:"fire-vertex","fire-js":"fire-js",[Kp]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bs=new Map,Yp=new Map,io=new Map;function Uc(n,e){try{n.container.addComponent(e)}catch(t){pt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function on(n){const e=n.name;if(io.has(e))return pt.debug(`There were multiple attempts to register component ${e}.`),!1;io.set(e,n);for(const t of bs.values())Uc(t,n);for(const t of Yp.values())Uc(t,n);return!0}function Gs(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Oe(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xp={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Nt=new Cr("app","Firebase",Xp);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zp{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Ot("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Nt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dn=Qp;function Iu(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:so,automaticDataCollectionEnabled:!0},e),s=r.name;if(typeof s!="string"||!s)throw Nt.create("bad-app-name",{appName:String(s)});if(t||(t=vu()),!t)throw Nt.create("no-options");const i=bs.get(s);if(i){if(sn(t,i.options)&&sn(r,i.config))return i;throw Nt.create("duplicate-app",{appName:s})}const a=new ip(s);for(const u of io.values())a.addComponent(u);const c=new Zp(t,r,a);return bs.set(s,c),c}function Do(n=so){const e=bs.get(n);if(!e&&n===so&&vu())return Iu();if(!e)throw Nt.create("no-app",{appName:n});return e}function Je(n,e,t){var r;let s=(r=Jp[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);const i=s.match(/\s|\//),a=e.match(/\s|\//);if(i||a){const c=[`Unable to register library "${s}" with version "${e}":`];i&&c.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&a&&c.push("and"),a&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),pt.warn(c.join(" "));return}on(new Ot(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const em="firebase-heartbeat-database",tm=1,gr="firebase-heartbeat-store";let Gi=null;function bu(){return Gi||(Gi=vp(em,tm,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(gr)}catch(t){console.warn(t)}}}}).catch(n=>{throw Nt.create("idb-open",{originalErrorMessage:n.message})})),Gi}async function nm(n){try{const t=(await bu()).transaction(gr),r=await t.objectStore(gr).get(Au(n));return await t.done,r}catch(e){if(e instanceof it)pt.warn(e.message);else{const t=Nt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});pt.warn(t.message)}}}async function Fc(n,e){try{const r=(await bu()).transaction(gr,"readwrite");await r.objectStore(gr).put(e,Au(n)),await r.done}catch(t){if(t instanceof it)pt.warn(t.message);else{const r=Nt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});pt.warn(r.message)}}}function Au(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rm=1024,sm=30;class im{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new am(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Bc();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>sm){const a=cm(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){pt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Bc(),{heartbeatsToSend:r,unsentEntries:s}=om(this._heartbeatsCache.heartbeats),i=Is(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return pt.warn(t),""}}}function Bc(){return new Date().toISOString().substring(0,10)}function om(n,e=rm){const t=[];let r=n.slice();for(const s of n){const i=t.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),$c(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),$c(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class am{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Gf()?Kf().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await nm(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Fc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Fc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function $c(n){return Is(JSON.stringify({version:2,heartbeats:n})).length}function cm(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lm(n){on(new Ot("platform-logger",e=>new Ep(e),"PRIVATE")),on(new Ot("heartbeat",e=>new im(e),"PRIVATE")),Je(ro,Mc,n),Je(ro,Mc,"esm2017"),Je("fire-js","")}lm("");var um="firebase",hm="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Je(um,hm,"app");function xo(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(t[r[s]]=n[r[s]]);return t}function Ru(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const dm=Ru,Su=new Cr("auth","Firebase",Ru());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const As=new ko("@firebase/auth");function fm(n,...e){As.logLevel<=W.WARN&&As.warn(`Auth (${dn}): ${n}`,...e)}function fs(n,...e){As.logLevel<=W.ERROR&&As.error(`Auth (${dn}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ze(n,...e){throw Vo(n,...e)}function Ye(n,...e){return Vo(n,...e)}function Cu(n,e,t){const r=Object.assign(Object.assign({},dm()),{[e]:t});return new Cr("auth","Firebase",r).create(e,{appName:n.name})}function dt(n){return Cu(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Vo(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Su.create(n,...e)}function B(n,e,...t){if(!n)throw Vo(e,...t)}function ut(n){const e="INTERNAL ASSERTION FAILED: "+n;throw fs(e),new Error(e)}function mt(n,e){n||ut(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oo(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function pm(){return qc()==="http:"||qc()==="https:"}function qc(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mm(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(pm()||jf()||"connection"in navigator)?navigator.onLine:!0}function gm(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(e,t){this.shortDelay=e,this.longDelay=t,mt(t>e,"Short delay should be less than long delay!"),this.isMobile=Bf()||Hf()}get(){return mm()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oo(n,e){mt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pu{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ut("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ut("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ut("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _m={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vm=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],ym=new kr(3e4,6e4);function zt(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Wt(n,e,t,r,s={}){return ku(n,s,async()=>{let i={},a={};r&&(e==="GET"?a=r:i={body:JSON.stringify(r)});const c=Pr(Object.assign({key:n.config.apiKey},a)).slice(1),u=await n._getAdditionalHeaders();u["Content-Type"]="application/json",n.languageCode&&(u["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:u},i);return qf()||(d.referrerPolicy="no-referrer"),n.emulatorConfig&&hn(n.emulatorConfig.host)&&(d.credentials="include"),Pu.fetch()(await Nu(n,n.config.apiHost,t,c),d)})}async function ku(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},_m),e);try{const s=new Em(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw os(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const c=i.ok?a.errorMessage:a.error.message,[u,d]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw os(n,"credential-already-in-use",a);if(u==="EMAIL_EXISTS")throw os(n,"email-already-in-use",a);if(u==="USER_DISABLED")throw os(n,"user-disabled",a);const f=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Cu(n,f,d);ze(n,f)}}catch(s){if(s instanceof it)throw s;ze(n,"network-request-failed",{message:String(s)})}}async function Nr(n,e,t,r,s={}){const i=await Wt(n,e,t,r,s);return"mfaPendingCredential"in i&&ze(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function Nu(n,e,t,r){const s=`${e}${t}?${r}`,i=n,a=i.config.emulator?Oo(n.config,s):`${n.config.apiScheme}://${s}`;return vm.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(a).toString():a}function wm(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Em{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Ye(this.auth,"network-request-failed")),ym.get())})}}function os(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=Ye(n,e,r);return s.customData._tokenResponse=t,s}function jc(n){return n!==void 0&&n.enterprise!==void 0}class Tm{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return wm(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Im(n,e){return Wt(n,"GET","/v2/recaptchaConfig",zt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bm(n,e){return Wt(n,"POST","/v1/accounts:delete",e)}async function Rs(n,e){return Wt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Am(n,e=!1){const t=he(n),r=await t.getIdToken(e),s=Lo(r);B(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:hr(Ki(s.auth_time)),issuedAtTime:hr(Ki(s.iat)),expirationTime:hr(Ki(s.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Ki(n){return Number(n)*1e3}function Lo(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return fs("JWT malformed, contained fewer than 3 sections"),null;try{const s=mu(t);return s?JSON.parse(s):(fs("Failed to decode base64 JWT payload"),null)}catch(s){return fs("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Hc(n){const e=Lo(n);return B(e,"internal-error"),B(typeof e.exp<"u","internal-error"),B(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _r(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof it&&Rm(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Rm({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sm{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ao{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=hr(this.lastLoginAt),this.creationTime=hr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ss(n){var e;const t=n.auth,r=await n.getIdToken(),s=await _r(n,Rs(t,{idToken:r}));B(s==null?void 0:s.users.length,t,"internal-error");const i=s.users[0];n._notifyReloadListener(i);const a=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Du(i.providerUserInfo):[],c=Pm(n.providerData,a),u=n.isAnonymous,d=!(n.email&&i.passwordHash)&&!(c!=null&&c.length),f=u?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:c,metadata:new ao(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function Cm(n){const e=he(n);await Ss(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Pm(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Du(n){return n.map(e=>{var{providerId:t}=e,r=xo(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function km(n,e){const t=await ku(n,{},async()=>{const r=Pr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=await Nu(n,s,"/v1/token",`key=${i}`),c=await n._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:c,body:r};return n.emulatorConfig&&hn(n.emulatorConfig.host)&&(u.credentials="include"),Pu.fetch()(a,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Nm(n,e){return Wt(n,"POST","/v2/accounts:revokeToken",zt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){B(e.idToken,"internal-error"),B(typeof e.idToken<"u","internal-error"),B(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Hc(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){B(e.length!==0,"internal-error");const t=Hc(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(B(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await km(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,a=new An;return r&&(B(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(B(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),i&&(B(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new An,this.toJSON())}_performRefresh(){return ut("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function It(n,e){B(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class $e{constructor(e){var{uid:t,auth:r,stsTokenManager:s}=e,i=xo(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Sm(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new ao(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await _r(this,this.stsTokenManager.getToken(this.auth,e));return B(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Am(this,e)}reload(){return Cm(this)}_assign(e){this!==e&&(B(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new $e(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){B(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Ss(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Oe(this.auth.app))return Promise.reject(dt(this.auth));const e=await this.getIdToken();return await _r(this,bm(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,s,i,a,c,u,d,f;const m=(r=t.displayName)!==null&&r!==void 0?r:void 0,g=(s=t.email)!==null&&s!==void 0?s:void 0,R=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,I=(a=t.photoURL)!==null&&a!==void 0?a:void 0,N=(c=t.tenantId)!==null&&c!==void 0?c:void 0,C=(u=t._redirectEventId)!==null&&u!==void 0?u:void 0,O=(d=t.createdAt)!==null&&d!==void 0?d:void 0,F=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:M,emailVerified:q,isAnonymous:oe,providerData:ee,stsTokenManager:E}=t;B(M&&E,e,"internal-error");const _=An.fromJSON(this.name,E);B(typeof M=="string",e,"internal-error"),It(m,e.name),It(g,e.name),B(typeof q=="boolean",e,"internal-error"),B(typeof oe=="boolean",e,"internal-error"),It(R,e.name),It(I,e.name),It(N,e.name),It(C,e.name),It(O,e.name),It(F,e.name);const y=new $e({uid:M,auth:e,email:g,emailVerified:q,displayName:m,isAnonymous:oe,photoURL:I,phoneNumber:R,tenantId:N,stsTokenManager:_,createdAt:O,lastLoginAt:F});return ee&&Array.isArray(ee)&&(y.providerData=ee.map(w=>Object.assign({},w))),C&&(y._redirectEventId=C),y}static async _fromIdTokenResponse(e,t,r=!1){const s=new An;s.updateFromServerResponse(t);const i=new $e({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Ss(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];B(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?Du(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),c=new An;c.updateFromIdToken(r);const u=new $e({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new ao(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,d),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zc=new Map;function ht(n){mt(n instanceof Function,"Expected a class definition");let e=zc.get(n);return e?(mt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,zc.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xu{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}xu.type="NONE";const Wc=xu;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ps(n,e,t){return`firebase:${n}:${e}:${t}`}class Rn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=ps(this.userKey,s.apiKey,i),this.fullPersistenceKey=ps("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Rs(this.auth,{idToken:e}).catch(()=>{});return t?$e._fromGetAccountInfoResponse(this.auth,t,e):null}return $e._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Rn(ht(Wc),e,r);const s=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=s[0]||ht(Wc);const a=ps(r,e.config.apiKey,e.name);let c=null;for(const d of t)try{const f=await d._get(a);if(f){let m;if(typeof f=="string"){const g=await Rs(e,{idToken:f}).catch(()=>{});if(!g)break;m=await $e._fromGetAccountInfoResponse(e,g,f)}else m=$e._fromJSON(e,f);d!==i&&(c=m),i=d;break}}catch{}const u=s.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new Rn(i,e,r):(i=u[0],c&&await i._set(a,c.toJSON()),await Promise.all(t.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new Rn(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gc(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Mu(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Vu(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Fu(e))return"Blackberry";if(Bu(e))return"Webos";if(Ou(e))return"Safari";if((e.includes("chrome/")||Lu(e))&&!e.includes("edge/"))return"Chrome";if(Uu(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Vu(n=Ce()){return/firefox\//i.test(n)}function Ou(n=Ce()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Lu(n=Ce()){return/crios\//i.test(n)}function Mu(n=Ce()){return/iemobile/i.test(n)}function Uu(n=Ce()){return/android/i.test(n)}function Fu(n=Ce()){return/blackberry/i.test(n)}function Bu(n=Ce()){return/webos/i.test(n)}function Mo(n=Ce()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Dm(n=Ce()){var e;return Mo(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function xm(){return zf()&&document.documentMode===10}function $u(n=Ce()){return Mo(n)||Uu(n)||Bu(n)||Fu(n)||/windows phone/i.test(n)||Mu(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qu(n,e=[]){let t;switch(n){case"Browser":t=Gc(Ce());break;case"Worker":t=`${Gc(Ce())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${dn}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vm{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((a,c)=>{try{const u=e(i);a(u)}catch(u){c(u)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Om(n,e={}){return Wt(n,"GET","/v2/passwordPolicy",zt(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lm=6;class Mm{constructor(e){var t,r,s,i;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:Lm,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,s,i,a,c;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(t=u.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(s=u.containsLowercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(i=u.containsUppercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(a=u.containsNumericCharacter)!==null&&a!==void 0?a:!0),u.isValid&&(u.isValid=(c=u.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),u}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Kc(this),this.idTokenSubscription=new Kc(this),this.beforeStateQueue=new Vm(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Su,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=ht(t)),this._initializationPromise=this.queue(async()=>{var r,s,i;if(!this._deleted&&(this.persistenceManager=await Rn.create(this,e),(r=this._resolvePersistenceManagerAvailable)===null||r===void 0||r.call(this),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Rs(this,{idToken:e}),r=await $e._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Oe(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(c,c))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=s==null?void 0:s._redirectEventId,u=await this.tryRedirectSignIn(e);(!a||a===c)&&(u!=null&&u.user)&&(s=u.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return B(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ss(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=gm()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Oe(this.app))return Promise.reject(dt(this));const t=e?he(e):null;return t&&B(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&B(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Oe(this.app)?Promise.reject(dt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Oe(this.app)?Promise.reject(dt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ht(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Om(this),t=new Mm(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Cr("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Nm(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&ht(e)||this._popupRedirectResolver;B(t,this,"argument-error"),this.redirectPersistenceManager=await Rn.create(this,[ht(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(B(c,this,"internal-error"),c.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,r,s);return()=>{a=!0,u()}}else{const u=e.addObserver(t);return()=>{a=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return B(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=qu(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;if(Oe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&fm(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function fn(n){return he(n)}class Kc{constructor(e){this.auth=e,this.observer=null,this.addObserver=Zf(t=>this.observer=t)}get next(){return B(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ks={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Fm(n){Ks=n}function ju(n){return Ks.loadJS(n)}function Bm(){return Ks.recaptchaEnterpriseScript}function $m(){return Ks.gapiScript}function qm(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class jm{constructor(){this.enterprise=new Hm}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Hm{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const zm="recaptcha-enterprise",Hu="NO_RECAPTCHA";class Wm{constructor(e){this.type=zm,this.auth=fn(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,c)=>{Im(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const d=new Tm(u);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(u=>{c(u)})})}function s(i,a,c){const u=window.grecaptcha;jc(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(d=>{a(d)}).catch(()=>{a(Hu)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new jm().execute("siteKey",{action:"verify"}):new Promise((i,a)=>{r(this.auth).then(c=>{if(!t&&jc(window.grecaptcha))s(c,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let u=Bm();u.length!==0&&(u+=c),ju(u).then(()=>{s(c,i,a)}).catch(d=>{a(d)})}}).catch(c=>{a(c)})})}}async function Qc(n,e,t,r=!1,s=!1){const i=new Wm(n);let a;if(s)a=Hu;else try{a=await i.verify(t)}catch{a=await i.verify(t,!0)}const c=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){const u=c.phoneEnrollmentInfo.phoneNumber,d=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:d,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){const u=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return r?Object.assign(c,{captchaResp:a}):Object.assign(c,{captchaResponse:a}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function co(n,e,t,r,s){var i;if(!((i=n._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Qc(n,e,t,t==="getOobCode");return r(n,a)}else return r(n,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const c=await Qc(n,e,t,t==="getOobCode");return r(n,c)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gm(n,e){const t=Gs(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(sn(i,e??{}))return s;ze(s,"already-initialized")}return t.initialize({options:e})}function Km(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(ht);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Qm(n,e,t){const r=fn(n);B(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=zu(e),{host:a,port:c}=Jm(e),u=c===null?"":`:${c}`,d={url:`${i}//${a}${u}/`},f=Object.freeze({host:a,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){B(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),B(sn(d,r.config.emulator)&&sn(f,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=d,r.emulatorConfig=f,r.settings.appVerificationDisabledForTesting=!0,hn(a)?(Co(`${i}//${a}${u}`),Po("Auth",!0)):Ym()}function zu(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Jm(n){const e=zu(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:Jc(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:Jc(a)}}}function Jc(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Ym(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uo{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return ut("not implemented")}_getIdTokenResponse(e){return ut("not implemented")}_linkToIdToken(e,t){return ut("not implemented")}_getReauthenticationResolver(e){return ut("not implemented")}}async function Xm(n,e){return Wt(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zm(n,e){return Nr(n,"POST","/v1/accounts:signInWithPassword",zt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eg(n,e){return Nr(n,"POST","/v1/accounts:signInWithEmailLink",zt(n,e))}async function tg(n,e){return Nr(n,"POST","/v1/accounts:signInWithEmailLink",zt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vr extends Uo{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new vr(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new vr(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return co(e,t,"signInWithPassword",Zm);case"emailLink":return eg(e,{email:this._email,oobCode:this._password});default:ze(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return co(e,r,"signUpPassword",Xm);case"emailLink":return tg(e,{idToken:t,email:this._email,oobCode:this._password});default:ze(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sn(n,e){return Nr(n,"POST","/v1/accounts:signInWithIdp",zt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ng="http://localhost";class an extends Uo{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new an(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):ze("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=t,i=xo(t,["providerId","signInMethod"]);if(!r||!s)return null;const a=new an(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Sn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Sn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Sn(e,t)}buildRequest(){const e={requestUri:ng,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Pr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rg(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function sg(n){const e=sr(ir(n)).link,t=e?sr(ir(e)).deep_link_id:null,r=sr(ir(n)).deep_link_id;return(r?sr(ir(r)).link:null)||r||t||e||n}class Fo{constructor(e){var t,r,s,i,a,c;const u=sr(ir(e)),d=(t=u.apiKey)!==null&&t!==void 0?t:null,f=(r=u.oobCode)!==null&&r!==void 0?r:null,m=rg((s=u.mode)!==null&&s!==void 0?s:null);B(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=u.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=u.lang)!==null&&a!==void 0?a:null,this.tenantId=(c=u.tenantId)!==null&&c!==void 0?c:null}static parseLink(e){const t=sg(e);try{return new Fo(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On{constructor(){this.providerId=On.PROVIDER_ID}static credential(e,t){return vr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=Fo.parseLink(t);return B(r,"argument-error"),vr._fromEmailAndCode(e,r.code,r.tenantId)}}On.PROVIDER_ID="password";On.EMAIL_PASSWORD_SIGN_IN_METHOD="password";On.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wu{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dr extends Wu{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt extends Dr{constructor(){super("facebook.com")}static credential(e){return an._fromParams({providerId:bt.PROVIDER_ID,signInMethod:bt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return bt.credentialFromTaggedObject(e)}static credentialFromError(e){return bt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return bt.credential(e.oauthAccessToken)}catch{return null}}}bt.FACEBOOK_SIGN_IN_METHOD="facebook.com";bt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At extends Dr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return an._fromParams({providerId:At.PROVIDER_ID,signInMethod:At.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return At.credentialFromTaggedObject(e)}static credentialFromError(e){return At.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return At.credential(t,r)}catch{return null}}}At.GOOGLE_SIGN_IN_METHOD="google.com";At.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt extends Dr{constructor(){super("github.com")}static credential(e){return an._fromParams({providerId:Rt.PROVIDER_ID,signInMethod:Rt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Rt.credentialFromTaggedObject(e)}static credentialFromError(e){return Rt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Rt.credential(e.oauthAccessToken)}catch{return null}}}Rt.GITHUB_SIGN_IN_METHOD="github.com";Rt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St extends Dr{constructor(){super("twitter.com")}static credential(e,t){return an._fromParams({providerId:St.PROVIDER_ID,signInMethod:St.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return St.credentialFromTaggedObject(e)}static credentialFromError(e){return St.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return St.credential(t,r)}catch{return null}}}St.TWITTER_SIGN_IN_METHOD="twitter.com";St.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ig(n,e){return Nr(n,"POST","/v1/accounts:signUp",zt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await $e._fromIdTokenResponse(e,r,s),a=Yc(r);return new cn({user:i,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=Yc(r);return new cn({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function Yc(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs extends it{constructor(e,t,r,s){var i;super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Cs.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Cs(e,t,r,s)}}function Gu(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Cs._fromErrorAndOperation(n,i,e,r):i})}async function og(n,e,t=!1){const r=await _r(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return cn._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ag(n,e,t=!1){const{auth:r}=n;if(Oe(r.app))return Promise.reject(dt(r));const s="reauthenticate";try{const i=await _r(n,Gu(r,s,e,n),t);B(i.idToken,r,"internal-error");const a=Lo(i.idToken);B(a,r,"internal-error");const{sub:c}=a;return B(n.uid===c,r,"user-mismatch"),cn._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&ze(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ku(n,e,t=!1){if(Oe(n.app))return Promise.reject(dt(n));const r="signIn",s=await Gu(n,r,e),i=await cn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}async function cg(n,e){return Ku(fn(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qu(n){const e=fn(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function lg(n,e,t){if(Oe(n.app))return Promise.reject(dt(n));const r=fn(n),a=await co(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",ig).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&Qu(n),u}),c=await cn._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(c.user),c}function ug(n,e,t){return Oe(n.app)?Promise.reject(dt(n)):cg(he(n),On.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Qu(n),r})}function hg(n,e,t,r){return he(n).onIdTokenChanged(e,t,r)}function dg(n,e,t){return he(n).beforeAuthStateChanged(e,t)}function fg(n){return he(n).signOut()}async function pg(n){return he(n).delete()}const Ps="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ju{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ps,"1"),this.storage.removeItem(Ps),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mg=1e3,gg=10;class Yu extends Ju{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=$u(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,c,u)=>{this.notifyListeners(a,u)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);xm()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,gg):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},mg)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Yu.type="LOCAL";const _g=Yu;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xu extends Ju{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Xu.type="SESSION";const Zu=Xu;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vg(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qs{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new Qs(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const c=Array.from(a).map(async d=>d(t.origin,i)),u=await vg(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Qs.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bo(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yg{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((c,u)=>{const d=Bo("",20);s.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const g=m;if(g.data.eventId===d)switch(g.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(g.data.response);break;default:clearTimeout(f),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xe(){return window}function wg(n){Xe().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eh(){return typeof Xe().WorkerGlobalScope<"u"&&typeof Xe().importScripts=="function"}async function Eg(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Tg(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Ig(){return eh()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const th="firebaseLocalStorageDb",bg=1,ks="firebaseLocalStorage",nh="fbase_key";class xr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Js(n,e){return n.transaction([ks],e?"readwrite":"readonly").objectStore(ks)}function Ag(){const n=indexedDB.deleteDatabase(th);return new xr(n).toPromise()}function lo(){const n=indexedDB.open(th,bg);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(ks,{keyPath:nh})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(ks)?e(r):(r.close(),await Ag(),e(await lo()))})})}async function Xc(n,e,t){const r=Js(n,!0).put({[nh]:e,value:t});return new xr(r).toPromise()}async function Rg(n,e){const t=Js(n,!1).get(e),r=await new xr(t).toPromise();return r===void 0?null:r.value}function Zc(n,e){const t=Js(n,!0).delete(e);return new xr(t).toPromise()}const Sg=800,Cg=3;class rh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await lo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>Cg)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return eh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Qs._getInstance(Ig()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Eg(),!this.activeServiceWorker)return;this.sender=new yg(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Tg()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await lo();return await Xc(e,Ps,"1"),await Zc(e,Ps),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Xc(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Rg(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Zc(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=Js(s,!1).getAll();return new xr(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Sg)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}rh.type="LOCAL";const Pg=rh;new kr(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kg(n,e){return e?ht(e):(B(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $o extends Uo{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Sn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Sn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Sn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Ng(n){return Ku(n.auth,new $o(n),n.bypassAuthState)}function Dg(n){const{auth:e,user:t}=n;return B(t,e,"internal-error"),ag(t,new $o(n),n.bypassAuthState)}async function xg(n){const{auth:e,user:t}=n;return B(t,e,"internal-error"),og(t,new $o(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sh{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:a,type:c}=e;if(a){this.reject(a);return}const u={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Ng;case"linkViaPopup":case"linkViaRedirect":return xg;case"reauthViaPopup":case"reauthViaRedirect":return Dg;default:ze(this.auth,"internal-error")}}resolve(e){mt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){mt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vg=new kr(2e3,1e4);class bn extends sh{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,bn.currentPopupAction&&bn.currentPopupAction.cancel(),bn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return B(e,this.auth,"internal-error"),e}async onExecution(){mt(this.filter.length===1,"Popup operations only handle one event");const e=Bo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Ye(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Ye(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,bn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ye(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Vg.get())};e()}}bn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Og="pendingRedirect",ms=new Map;class Lg extends sh{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=ms.get(this.auth._key());if(!e){try{const r=await Mg(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}ms.set(this.auth._key(),e)}return this.bypassAuthState||ms.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Mg(n,e){const t=Bg(e),r=Fg(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function Ug(n,e){ms.set(n._key(),e)}function Fg(n){return ht(n._redirectPersistence)}function Bg(n){return ps(Og,n.config.apiKey,n.name)}async function $g(n,e,t=!1){if(Oe(n.app))return Promise.reject(dt(n));const r=fn(n),s=kg(r,e),a=await new Lg(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qg=600*1e3;class jg{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Hg(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!ih(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(Ye(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=qg&&this.cachedEventUids.clear(),this.cachedEventUids.has(el(e))}saveEventToCache(e){this.cachedEventUids.add(el(e)),this.lastProcessedEventTime=Date.now()}}function el(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function ih({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Hg(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ih(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zg(n,e={}){return Wt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wg=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Gg=/^https?/;async function Kg(n){if(n.config.emulator)return;const{authorizedDomains:e}=await zg(n);for(const t of e)try{if(Qg(t))return}catch{}ze(n,"unauthorized-domain")}function Qg(n){const e=oo(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Gg.test(t))return!1;if(Wg.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jg=new kr(3e4,6e4);function tl(){const n=Xe().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Yg(n){return new Promise((e,t)=>{var r,s,i;function a(){tl(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{tl(),t(Ye(n,"network-request-failed"))},timeout:Jg.get()})}if(!((s=(r=Xe().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Xe().gapi)===null||i===void 0)&&i.load)a();else{const c=qm("iframefcb");return Xe()[c]=()=>{gapi.load?a():t(Ye(n,"network-request-failed"))},ju(`${$m()}?onload=${c}`).catch(u=>t(u))}}).catch(e=>{throw gs=null,e})}let gs=null;function Xg(n){return gs=gs||Yg(n),gs}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zg=new kr(5e3,15e3),e_="__/auth/iframe",t_="emulator/auth/iframe",n_={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},r_=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function s_(n){const e=n.config;B(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Oo(e,t_):`https://${n.config.authDomain}/${e_}`,r={apiKey:e.apiKey,appName:n.name,v:dn},s=r_.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${Pr(r).slice(1)}`}async function i_(n){const e=await Xg(n),t=Xe().gapi;return B(t,n,"internal-error"),e.open({where:document.body,url:s_(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:n_,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=Ye(n,"network-request-failed"),c=Xe().setTimeout(()=>{i(a)},Zg.get());function u(){Xe().clearTimeout(c),s(r)}r.ping(u).then(u,()=>{i(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const o_={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},a_=500,c_=600,l_="_blank",u_="http://localhost";class nl{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function h_(n,e,t,r=a_,s=c_){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const u=Object.assign(Object.assign({},o_),{width:r.toString(),height:s.toString(),top:i,left:a}),d=Ce().toLowerCase();t&&(c=Lu(d)?l_:t),Vu(d)&&(e=e||u_,u.scrollbars="yes");const f=Object.entries(u).reduce((g,[R,I])=>`${g}${R}=${I},`,"");if(Dm(d)&&c!=="_self")return d_(e||"",c),new nl(null);const m=window.open(e||"",c,f);B(m,n,"popup-blocked");try{m.focus()}catch{}return new nl(m)}function d_(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f_="__/auth/handler",p_="emulator/auth/handler",m_=encodeURIComponent("fac");async function rl(n,e,t,r,s,i){B(n.config.authDomain,n,"auth-domain-config-required"),B(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:dn,eventId:s};if(e instanceof Wu){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Xf(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof Dr){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const c=a;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const u=await n._getAppCheckToken(),d=u?`#${m_}=${encodeURIComponent(u)}`:"";return`${g_(n)}?${Pr(c).slice(1)}${d}`}function g_({config:n}){return n.emulator?Oo(n,p_):`https://${n.authDomain}/${f_}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qi="webStorageSupport";class __{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Zu,this._completeRedirectFn=$g,this._overrideRedirectResult=Ug}async _openPopup(e,t,r,s){var i;mt((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await rl(e,t,r,oo(),s);return h_(e,a,Bo())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await rl(e,t,r,oo(),s);return wg(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(mt(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await i_(e),r=new jg(e);return t.register("authEvent",s=>(B(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Qi,{type:Qi},s=>{var i;const a=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[Qi];a!==void 0&&t(!!a),ze(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Kg(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return $u()||Ou()||Mo()}}const v_=__;var sl="@firebase/auth",il="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){B(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function w_(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function E_(n){on(new Ot("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=r.options;B(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:a,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:qu(n)},d=new Um(r,s,i,u);return Km(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),on(new Ot("auth-internal",e=>{const t=fn(e.getProvider("auth").getImmediate());return(r=>new y_(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Je(sl,il,w_(n)),Je(sl,il,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const T_=300,I_=yu("authIdTokenMaxAge")||T_;let ol=null;const b_=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>I_)return;const s=t==null?void 0:t.token;ol!==s&&(ol=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function A_(n=Do()){const e=Gs(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Gm(n,{popupRedirectResolver:v_,persistence:[Pg,_g,Zu]}),r=yu("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=b_(i.toString());dg(t,a,()=>a(t.currentUser)),hg(t,c=>a(c))}}const s=gu("auth");return s&&Qm(t,`http://${s}`),t}function R_(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Fm({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=Ye("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",R_().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});E_("Browser");var al=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Dt,oh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,_){function y(){}y.prototype=_.prototype,E.D=_.prototype,E.prototype=new y,E.prototype.constructor=E,E.C=function(w,T,A){for(var v=Array(arguments.length-2),at=2;at<arguments.length;at++)v[at-2]=arguments[at];return _.prototype[T].apply(w,v)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,_,y){y||(y=0);var w=Array(16);if(typeof _=="string")for(var T=0;16>T;++T)w[T]=_.charCodeAt(y++)|_.charCodeAt(y++)<<8|_.charCodeAt(y++)<<16|_.charCodeAt(y++)<<24;else for(T=0;16>T;++T)w[T]=_[y++]|_[y++]<<8|_[y++]<<16|_[y++]<<24;_=E.g[0],y=E.g[1],T=E.g[2];var A=E.g[3],v=_+(A^y&(T^A))+w[0]+3614090360&4294967295;_=y+(v<<7&4294967295|v>>>25),v=A+(T^_&(y^T))+w[1]+3905402710&4294967295,A=_+(v<<12&4294967295|v>>>20),v=T+(y^A&(_^y))+w[2]+606105819&4294967295,T=A+(v<<17&4294967295|v>>>15),v=y+(_^T&(A^_))+w[3]+3250441966&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(A^y&(T^A))+w[4]+4118548399&4294967295,_=y+(v<<7&4294967295|v>>>25),v=A+(T^_&(y^T))+w[5]+1200080426&4294967295,A=_+(v<<12&4294967295|v>>>20),v=T+(y^A&(_^y))+w[6]+2821735955&4294967295,T=A+(v<<17&4294967295|v>>>15),v=y+(_^T&(A^_))+w[7]+4249261313&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(A^y&(T^A))+w[8]+1770035416&4294967295,_=y+(v<<7&4294967295|v>>>25),v=A+(T^_&(y^T))+w[9]+2336552879&4294967295,A=_+(v<<12&4294967295|v>>>20),v=T+(y^A&(_^y))+w[10]+4294925233&4294967295,T=A+(v<<17&4294967295|v>>>15),v=y+(_^T&(A^_))+w[11]+2304563134&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(A^y&(T^A))+w[12]+1804603682&4294967295,_=y+(v<<7&4294967295|v>>>25),v=A+(T^_&(y^T))+w[13]+4254626195&4294967295,A=_+(v<<12&4294967295|v>>>20),v=T+(y^A&(_^y))+w[14]+2792965006&4294967295,T=A+(v<<17&4294967295|v>>>15),v=y+(_^T&(A^_))+w[15]+1236535329&4294967295,y=T+(v<<22&4294967295|v>>>10),v=_+(T^A&(y^T))+w[1]+4129170786&4294967295,_=y+(v<<5&4294967295|v>>>27),v=A+(y^T&(_^y))+w[6]+3225465664&4294967295,A=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(A^_))+w[11]+643717713&4294967295,T=A+(v<<14&4294967295|v>>>18),v=y+(A^_&(T^A))+w[0]+3921069994&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(T^A&(y^T))+w[5]+3593408605&4294967295,_=y+(v<<5&4294967295|v>>>27),v=A+(y^T&(_^y))+w[10]+38016083&4294967295,A=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(A^_))+w[15]+3634488961&4294967295,T=A+(v<<14&4294967295|v>>>18),v=y+(A^_&(T^A))+w[4]+3889429448&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(T^A&(y^T))+w[9]+568446438&4294967295,_=y+(v<<5&4294967295|v>>>27),v=A+(y^T&(_^y))+w[14]+3275163606&4294967295,A=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(A^_))+w[3]+4107603335&4294967295,T=A+(v<<14&4294967295|v>>>18),v=y+(A^_&(T^A))+w[8]+1163531501&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(T^A&(y^T))+w[13]+2850285829&4294967295,_=y+(v<<5&4294967295|v>>>27),v=A+(y^T&(_^y))+w[2]+4243563512&4294967295,A=_+(v<<9&4294967295|v>>>23),v=T+(_^y&(A^_))+w[7]+1735328473&4294967295,T=A+(v<<14&4294967295|v>>>18),v=y+(A^_&(T^A))+w[12]+2368359562&4294967295,y=T+(v<<20&4294967295|v>>>12),v=_+(y^T^A)+w[5]+4294588738&4294967295,_=y+(v<<4&4294967295|v>>>28),v=A+(_^y^T)+w[8]+2272392833&4294967295,A=_+(v<<11&4294967295|v>>>21),v=T+(A^_^y)+w[11]+1839030562&4294967295,T=A+(v<<16&4294967295|v>>>16),v=y+(T^A^_)+w[14]+4259657740&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(y^T^A)+w[1]+2763975236&4294967295,_=y+(v<<4&4294967295|v>>>28),v=A+(_^y^T)+w[4]+1272893353&4294967295,A=_+(v<<11&4294967295|v>>>21),v=T+(A^_^y)+w[7]+4139469664&4294967295,T=A+(v<<16&4294967295|v>>>16),v=y+(T^A^_)+w[10]+3200236656&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(y^T^A)+w[13]+681279174&4294967295,_=y+(v<<4&4294967295|v>>>28),v=A+(_^y^T)+w[0]+3936430074&4294967295,A=_+(v<<11&4294967295|v>>>21),v=T+(A^_^y)+w[3]+3572445317&4294967295,T=A+(v<<16&4294967295|v>>>16),v=y+(T^A^_)+w[6]+76029189&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(y^T^A)+w[9]+3654602809&4294967295,_=y+(v<<4&4294967295|v>>>28),v=A+(_^y^T)+w[12]+3873151461&4294967295,A=_+(v<<11&4294967295|v>>>21),v=T+(A^_^y)+w[15]+530742520&4294967295,T=A+(v<<16&4294967295|v>>>16),v=y+(T^A^_)+w[2]+3299628645&4294967295,y=T+(v<<23&4294967295|v>>>9),v=_+(T^(y|~A))+w[0]+4096336452&4294967295,_=y+(v<<6&4294967295|v>>>26),v=A+(y^(_|~T))+w[7]+1126891415&4294967295,A=_+(v<<10&4294967295|v>>>22),v=T+(_^(A|~y))+w[14]+2878612391&4294967295,T=A+(v<<15&4294967295|v>>>17),v=y+(A^(T|~_))+w[5]+4237533241&4294967295,y=T+(v<<21&4294967295|v>>>11),v=_+(T^(y|~A))+w[12]+1700485571&4294967295,_=y+(v<<6&4294967295|v>>>26),v=A+(y^(_|~T))+w[3]+2399980690&4294967295,A=_+(v<<10&4294967295|v>>>22),v=T+(_^(A|~y))+w[10]+4293915773&4294967295,T=A+(v<<15&4294967295|v>>>17),v=y+(A^(T|~_))+w[1]+2240044497&4294967295,y=T+(v<<21&4294967295|v>>>11),v=_+(T^(y|~A))+w[8]+1873313359&4294967295,_=y+(v<<6&4294967295|v>>>26),v=A+(y^(_|~T))+w[15]+4264355552&4294967295,A=_+(v<<10&4294967295|v>>>22),v=T+(_^(A|~y))+w[6]+2734768916&4294967295,T=A+(v<<15&4294967295|v>>>17),v=y+(A^(T|~_))+w[13]+1309151649&4294967295,y=T+(v<<21&4294967295|v>>>11),v=_+(T^(y|~A))+w[4]+4149444226&4294967295,_=y+(v<<6&4294967295|v>>>26),v=A+(y^(_|~T))+w[11]+3174756917&4294967295,A=_+(v<<10&4294967295|v>>>22),v=T+(_^(A|~y))+w[2]+718787259&4294967295,T=A+(v<<15&4294967295|v>>>17),v=y+(A^(T|~_))+w[9]+3951481745&4294967295,E.g[0]=E.g[0]+_&4294967295,E.g[1]=E.g[1]+(T+(v<<21&4294967295|v>>>11))&4294967295,E.g[2]=E.g[2]+T&4294967295,E.g[3]=E.g[3]+A&4294967295}r.prototype.u=function(E,_){_===void 0&&(_=E.length);for(var y=_-this.blockSize,w=this.B,T=this.h,A=0;A<_;){if(T==0)for(;A<=y;)s(this,E,A),A+=this.blockSize;if(typeof E=="string"){for(;A<_;)if(w[T++]=E.charCodeAt(A++),T==this.blockSize){s(this,w),T=0;break}}else for(;A<_;)if(w[T++]=E[A++],T==this.blockSize){s(this,w),T=0;break}}this.h=T,this.o+=_},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var _=1;_<E.length-8;++_)E[_]=0;var y=8*this.o;for(_=E.length-8;_<E.length;++_)E[_]=y&255,y/=256;for(this.u(E),E=Array(16),_=y=0;4>_;++_)for(var w=0;32>w;w+=8)E[y++]=this.g[_]>>>w&255;return E};function i(E,_){var y=c;return Object.prototype.hasOwnProperty.call(y,E)?y[E]:y[E]=_(E)}function a(E,_){this.h=_;for(var y=[],w=!0,T=E.length-1;0<=T;T--){var A=E[T]|0;w&&A==_||(y[T]=A,w=!1)}this.g=y}var c={};function u(E){return-128<=E&&128>E?i(E,function(_){return new a([_|0],0>_?-1:0)}):new a([E|0],0>E?-1:0)}function d(E){if(isNaN(E)||!isFinite(E))return m;if(0>E)return C(d(-E));for(var _=[],y=1,w=0;E>=y;w++)_[w]=E/y|0,y*=4294967296;return new a(_,0)}function f(E,_){if(E.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(E.charAt(0)=="-")return C(f(E.substring(1),_));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(_,8)),w=m,T=0;T<E.length;T+=8){var A=Math.min(8,E.length-T),v=parseInt(E.substring(T,T+A),_);8>A?(A=d(Math.pow(_,A)),w=w.j(A).add(d(v))):(w=w.j(y),w=w.add(d(v)))}return w}var m=u(0),g=u(1),R=u(16777216);n=a.prototype,n.m=function(){if(N(this))return-C(this).m();for(var E=0,_=1,y=0;y<this.g.length;y++){var w=this.i(y);E+=(0<=w?w:4294967296+w)*_,_*=4294967296}return E},n.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(I(this))return"0";if(N(this))return"-"+C(this).toString(E);for(var _=d(Math.pow(E,6)),y=this,w="";;){var T=q(y,_).g;y=O(y,T.j(_));var A=((0<y.g.length?y.g[0]:y.h)>>>0).toString(E);if(y=T,I(y))return A+w;for(;6>A.length;)A="0"+A;w=A+w}},n.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function I(E){if(E.h!=0)return!1;for(var _=0;_<E.g.length;_++)if(E.g[_]!=0)return!1;return!0}function N(E){return E.h==-1}n.l=function(E){return E=O(this,E),N(E)?-1:I(E)?0:1};function C(E){for(var _=E.g.length,y=[],w=0;w<_;w++)y[w]=~E.g[w];return new a(y,~E.h).add(g)}n.abs=function(){return N(this)?C(this):this},n.add=function(E){for(var _=Math.max(this.g.length,E.g.length),y=[],w=0,T=0;T<=_;T++){var A=w+(this.i(T)&65535)+(E.i(T)&65535),v=(A>>>16)+(this.i(T)>>>16)+(E.i(T)>>>16);w=v>>>16,A&=65535,v&=65535,y[T]=v<<16|A}return new a(y,y[y.length-1]&-2147483648?-1:0)};function O(E,_){return E.add(C(_))}n.j=function(E){if(I(this)||I(E))return m;if(N(this))return N(E)?C(this).j(C(E)):C(C(this).j(E));if(N(E))return C(this.j(C(E)));if(0>this.l(R)&&0>E.l(R))return d(this.m()*E.m());for(var _=this.g.length+E.g.length,y=[],w=0;w<2*_;w++)y[w]=0;for(w=0;w<this.g.length;w++)for(var T=0;T<E.g.length;T++){var A=this.i(w)>>>16,v=this.i(w)&65535,at=E.i(T)>>>16,$n=E.i(T)&65535;y[2*w+2*T]+=v*$n,F(y,2*w+2*T),y[2*w+2*T+1]+=A*$n,F(y,2*w+2*T+1),y[2*w+2*T+1]+=v*at,F(y,2*w+2*T+1),y[2*w+2*T+2]+=A*at,F(y,2*w+2*T+2)}for(w=0;w<_;w++)y[w]=y[2*w+1]<<16|y[2*w];for(w=_;w<2*_;w++)y[w]=0;return new a(y,0)};function F(E,_){for(;(E[_]&65535)!=E[_];)E[_+1]+=E[_]>>>16,E[_]&=65535,_++}function M(E,_){this.g=E,this.h=_}function q(E,_){if(I(_))throw Error("division by zero");if(I(E))return new M(m,m);if(N(E))return _=q(C(E),_),new M(C(_.g),C(_.h));if(N(_))return _=q(E,C(_)),new M(C(_.g),_.h);if(30<E.g.length){if(N(E)||N(_))throw Error("slowDivide_ only works with positive integers.");for(var y=g,w=_;0>=w.l(E);)y=oe(y),w=oe(w);var T=ee(y,1),A=ee(w,1);for(w=ee(w,2),y=ee(y,2);!I(w);){var v=A.add(w);0>=v.l(E)&&(T=T.add(y),A=v),w=ee(w,1),y=ee(y,1)}return _=O(E,T.j(_)),new M(T,_)}for(T=m;0<=E.l(_);){for(y=Math.max(1,Math.floor(E.m()/_.m())),w=Math.ceil(Math.log(y)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),A=d(y),v=A.j(_);N(v)||0<v.l(E);)y-=w,A=d(y),v=A.j(_);I(A)&&(A=g),T=T.add(A),E=O(E,v)}return new M(T,E)}n.A=function(E){return q(this,E).h},n.and=function(E){for(var _=Math.max(this.g.length,E.g.length),y=[],w=0;w<_;w++)y[w]=this.i(w)&E.i(w);return new a(y,this.h&E.h)},n.or=function(E){for(var _=Math.max(this.g.length,E.g.length),y=[],w=0;w<_;w++)y[w]=this.i(w)|E.i(w);return new a(y,this.h|E.h)},n.xor=function(E){for(var _=Math.max(this.g.length,E.g.length),y=[],w=0;w<_;w++)y[w]=this.i(w)^E.i(w);return new a(y,this.h^E.h)};function oe(E){for(var _=E.g.length+1,y=[],w=0;w<_;w++)y[w]=E.i(w)<<1|E.i(w-1)>>>31;return new a(y,E.h)}function ee(E,_){var y=_>>5;_%=32;for(var w=E.g.length-y,T=[],A=0;A<w;A++)T[A]=0<_?E.i(A+y)>>>_|E.i(A+y+1)<<32-_:E.i(A+y);return new a(T,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,oh=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,Dt=a}).apply(typeof al<"u"?al:typeof self<"u"?self:typeof window<"u"?window:{});var as=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ah,or,ch,_s,uo,lh,uh,hh;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,l,h){return o==Array.prototype||o==Object.prototype||(o[l]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof as=="object"&&as];for(var l=0;l<o.length;++l){var h=o[l];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function s(o,l){if(l)e:{var h=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var b=o[p];if(!(b in h))break e;h=h[b]}o=o[o.length-1],p=h[o],l=l(p),l!=p&&l!=null&&e(h,o,{configurable:!0,writable:!0,value:l})}}function i(o,l){o instanceof String&&(o+="");var h=0,p=!1,b={next:function(){if(!p&&h<o.length){var S=h++;return{value:l(S,o[S]),done:!1}}return p=!0,{done:!0,value:void 0}}};return b[Symbol.iterator]=function(){return b},b}s("Array.prototype.values",function(o){return o||function(){return i(this,function(l,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},c=this||self;function u(o){var l=typeof o;return l=l!="object"?l:o?Array.isArray(o)?"array":l:"null",l=="array"||l=="object"&&typeof o.length=="number"}function d(o){var l=typeof o;return l=="object"&&o!=null||l=="function"}function f(o,l,h){return o.call.apply(o.bind,arguments)}function m(o,l,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var b=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(b,p),o.apply(l,b)}}return function(){return o.apply(l,arguments)}}function g(o,l,h){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,g.apply(null,arguments)}function R(o,l){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function I(o,l){function h(){}h.prototype=l.prototype,o.aa=l.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,b,S){for(var D=Array(arguments.length-2),Y=2;Y<arguments.length;Y++)D[Y-2]=arguments[Y];return l.prototype[b].apply(p,D)}}function N(o){const l=o.length;if(0<l){const h=Array(l);for(let p=0;p<l;p++)h[p]=o[p];return h}return[]}function C(o,l){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(u(p)){const b=o.length||0,S=p.length||0;o.length=b+S;for(let D=0;D<S;D++)o[b+D]=p[D]}else o.push(p)}}class O{constructor(l,h){this.i=l,this.j=h,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function F(o){return/^[\s\xa0]*$/.test(o)}function M(){var o=c.navigator;return o&&(o=o.userAgent)?o:""}function q(o){return q[" "](o),o}q[" "]=function(){};var oe=M().indexOf("Gecko")!=-1&&!(M().toLowerCase().indexOf("webkit")!=-1&&M().indexOf("Edge")==-1)&&!(M().indexOf("Trident")!=-1||M().indexOf("MSIE")!=-1)&&M().indexOf("Edge")==-1;function ee(o,l,h){for(const p in o)l.call(h,o[p],p,o)}function E(o,l){for(const h in o)l.call(void 0,o[h],h,o)}function _(o){const l={};for(const h in o)l[h]=o[h];return l}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(o,l){let h,p;for(let b=1;b<arguments.length;b++){p=arguments[b];for(h in p)o[h]=p[h];for(let S=0;S<y.length;S++)h=y[S],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function T(o){var l=1;o=o.split(":");const h=[];for(;0<l&&o.length;)h.push(o.shift()),l--;return o.length&&h.push(o.join(":")),h}function A(o){c.setTimeout(()=>{throw o},0)}function v(){var o=yi;let l=null;return o.g&&(l=o.g,o.g=o.g.next,o.g||(o.h=null),l.next=null),l}class at{constructor(){this.h=this.g=null}add(l,h){const p=$n.get();p.set(l,h),this.h?this.h.next=p:this.g=p,this.h=p}}var $n=new O(()=>new zd,o=>o.reset());class zd{constructor(){this.next=this.g=this.h=null}set(l,h){this.h=l,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let qn,jn=!1,yi=new at,Na=()=>{const o=c.Promise.resolve(void 0);qn=()=>{o.then(Wd)}};var Wd=()=>{for(var o;o=v();){try{o.h.call(o.g)}catch(h){A(h)}var l=$n;l.j(o),100>l.h&&(l.h++,o.next=l.g,l.g=o)}jn=!1};function yt(){this.s=this.s,this.C=this.C}yt.prototype.s=!1,yt.prototype.ma=function(){this.s||(this.s=!0,this.N())},yt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Ee(o,l){this.type=o,this.g=this.target=l,this.defaultPrevented=!1}Ee.prototype.h=function(){this.defaultPrevented=!0};var Gd=(function(){if(!c.addEventListener||!Object.defineProperty)return!1;var o=!1,l=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};c.addEventListener("test",h,l),c.removeEventListener("test",h,l)}catch{}return o})();function Hn(o,l){if(Ee.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=l,l=o.relatedTarget){if(oe){e:{try{q(l.nodeName);var b=!0;break e}catch{}b=!1}b||(l=null)}}else h=="mouseover"?l=o.fromElement:h=="mouseout"&&(l=o.toElement);this.relatedTarget=l,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:Kd[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&Hn.aa.h.call(this)}}I(Hn,Ee);var Kd={2:"touch",3:"pen",4:"mouse"};Hn.prototype.h=function(){Hn.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Br="closure_listenable_"+(1e6*Math.random()|0),Qd=0;function Jd(o,l,h,p,b){this.listener=o,this.proxy=null,this.src=l,this.type=h,this.capture=!!p,this.ha=b,this.key=++Qd,this.da=this.fa=!1}function $r(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function qr(o){this.src=o,this.g={},this.h=0}qr.prototype.add=function(o,l,h,p,b){var S=o.toString();o=this.g[S],o||(o=this.g[S]=[],this.h++);var D=Ei(o,l,p,b);return-1<D?(l=o[D],h||(l.fa=!1)):(l=new Jd(l,this.src,S,!!p,b),l.fa=h,o.push(l)),l};function wi(o,l){var h=l.type;if(h in o.g){var p=o.g[h],b=Array.prototype.indexOf.call(p,l,void 0),S;(S=0<=b)&&Array.prototype.splice.call(p,b,1),S&&($r(l),o.g[h].length==0&&(delete o.g[h],o.h--))}}function Ei(o,l,h,p){for(var b=0;b<o.length;++b){var S=o[b];if(!S.da&&S.listener==l&&S.capture==!!h&&S.ha==p)return b}return-1}var Ti="closure_lm_"+(1e6*Math.random()|0),Ii={};function Da(o,l,h,p,b){if(Array.isArray(l)){for(var S=0;S<l.length;S++)Da(o,l[S],h,p,b);return null}return h=Oa(h),o&&o[Br]?o.K(l,h,d(p)?!!p.capture:!1,b):Yd(o,l,h,!1,p,b)}function Yd(o,l,h,p,b,S){if(!l)throw Error("Invalid event type");var D=d(b)?!!b.capture:!!b,Y=Ai(o);if(Y||(o[Ti]=Y=new qr(o)),h=Y.add(l,h,p,D,S),h.proxy)return h;if(p=Xd(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)Gd||(b=D),b===void 0&&(b=!1),o.addEventListener(l.toString(),p,b);else if(o.attachEvent)o.attachEvent(Va(l.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Xd(){function o(h){return l.call(o.src,o.listener,h)}const l=Zd;return o}function xa(o,l,h,p,b){if(Array.isArray(l))for(var S=0;S<l.length;S++)xa(o,l[S],h,p,b);else p=d(p)?!!p.capture:!!p,h=Oa(h),o&&o[Br]?(o=o.i,l=String(l).toString(),l in o.g&&(S=o.g[l],h=Ei(S,h,p,b),-1<h&&($r(S[h]),Array.prototype.splice.call(S,h,1),S.length==0&&(delete o.g[l],o.h--)))):o&&(o=Ai(o))&&(l=o.g[l.toString()],o=-1,l&&(o=Ei(l,h,p,b)),(h=-1<o?l[o]:null)&&bi(h))}function bi(o){if(typeof o!="number"&&o&&!o.da){var l=o.src;if(l&&l[Br])wi(l.i,o);else{var h=o.type,p=o.proxy;l.removeEventListener?l.removeEventListener(h,p,o.capture):l.detachEvent?l.detachEvent(Va(h),p):l.addListener&&l.removeListener&&l.removeListener(p),(h=Ai(l))?(wi(h,o),h.h==0&&(h.src=null,l[Ti]=null)):$r(o)}}}function Va(o){return o in Ii?Ii[o]:Ii[o]="on"+o}function Zd(o,l){if(o.da)o=!0;else{l=new Hn(l,this);var h=o.listener,p=o.ha||o.src;o.fa&&bi(o),o=h.call(p,l)}return o}function Ai(o){return o=o[Ti],o instanceof qr?o:null}var Ri="__closure_events_fn_"+(1e9*Math.random()>>>0);function Oa(o){return typeof o=="function"?o:(o[Ri]||(o[Ri]=function(l){return o.handleEvent(l)}),o[Ri])}function Te(){yt.call(this),this.i=new qr(this),this.M=this,this.F=null}I(Te,yt),Te.prototype[Br]=!0,Te.prototype.removeEventListener=function(o,l,h,p){xa(this,o,l,h,p)};function ke(o,l){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=l.type||l,typeof l=="string")l=new Ee(l,o);else if(l instanceof Ee)l.target=l.target||o;else{var b=l;l=new Ee(p,o),w(l,b)}if(b=!0,h)for(var S=h.length-1;0<=S;S--){var D=l.g=h[S];b=jr(D,p,!0,l)&&b}if(D=l.g=o,b=jr(D,p,!0,l)&&b,b=jr(D,p,!1,l)&&b,h)for(S=0;S<h.length;S++)D=l.g=h[S],b=jr(D,p,!1,l)&&b}Te.prototype.N=function(){if(Te.aa.N.call(this),this.i){var o=this.i,l;for(l in o.g){for(var h=o.g[l],p=0;p<h.length;p++)$r(h[p]);delete o.g[l],o.h--}}this.F=null},Te.prototype.K=function(o,l,h,p){return this.i.add(String(o),l,!1,h,p)},Te.prototype.L=function(o,l,h,p){return this.i.add(String(o),l,!0,h,p)};function jr(o,l,h,p){if(l=o.i.g[String(l)],!l)return!0;l=l.concat();for(var b=!0,S=0;S<l.length;++S){var D=l[S];if(D&&!D.da&&D.capture==h){var Y=D.listener,_e=D.ha||D.src;D.fa&&wi(o.i,D),b=Y.call(_e,p)!==!1&&b}}return b&&!p.defaultPrevented}function La(o,l,h){if(typeof o=="function")h&&(o=g(o,h));else if(o&&typeof o.handleEvent=="function")o=g(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:c.setTimeout(o,l||0)}function Ma(o){o.g=La(()=>{o.g=null,o.i&&(o.i=!1,Ma(o))},o.l);const l=o.h;o.h=null,o.m.apply(null,l)}class ef extends yt{constructor(l,h){super(),this.m=l,this.l=h,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Ma(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function zn(o){yt.call(this),this.h=o,this.g={}}I(zn,yt);var Ua=[];function Fa(o){ee(o.g,function(l,h){this.g.hasOwnProperty(h)&&bi(l)},o),o.g={}}zn.prototype.N=function(){zn.aa.N.call(this),Fa(this)},zn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Si=c.JSON.stringify,tf=c.JSON.parse,nf=class{stringify(o){return c.JSON.stringify(o,void 0)}parse(o){return c.JSON.parse(o,void 0)}};function Ci(){}Ci.prototype.h=null;function Ba(o){return o.h||(o.h=o.i())}function $a(){}var Wn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Pi(){Ee.call(this,"d")}I(Pi,Ee);function ki(){Ee.call(this,"c")}I(ki,Ee);var Qt={},qa=null;function Hr(){return qa=qa||new Te}Qt.La="serverreachability";function ja(o){Ee.call(this,Qt.La,o)}I(ja,Ee);function Gn(o){const l=Hr();ke(l,new ja(l))}Qt.STAT_EVENT="statevent";function Ha(o,l){Ee.call(this,Qt.STAT_EVENT,o),this.stat=l}I(Ha,Ee);function Ne(o){const l=Hr();ke(l,new Ha(l,o))}Qt.Ma="timingevent";function za(o,l){Ee.call(this,Qt.Ma,o),this.size=l}I(za,Ee);function Kn(o,l){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){o()},l)}function Qn(){this.g=!0}Qn.prototype.xa=function(){this.g=!1};function rf(o,l,h,p,b,S){o.info(function(){if(o.g)if(S)for(var D="",Y=S.split("&"),_e=0;_e<Y.length;_e++){var Q=Y[_e].split("=");if(1<Q.length){var Ie=Q[0];Q=Q[1];var be=Ie.split("_");D=2<=be.length&&be[1]=="type"?D+(Ie+"="+Q+"&"):D+(Ie+"=redacted&")}}else D=null;else D=S;return"XMLHTTP REQ ("+p+") [attempt "+b+"]: "+l+`
`+h+`
`+D})}function sf(o,l,h,p,b,S,D){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+b+"]: "+l+`
`+h+`
`+S+" "+D})}function gn(o,l,h,p){o.info(function(){return"XMLHTTP TEXT ("+l+"): "+af(o,h)+(p?" "+p:"")})}function of(o,l){o.info(function(){return"TIMEOUT: "+l})}Qn.prototype.info=function(){};function af(o,l){if(!o.g)return l;if(!l)return null;try{var h=JSON.parse(l);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var b=p[1];if(Array.isArray(b)&&!(1>b.length)){var S=b[0];if(S!="noop"&&S!="stop"&&S!="close")for(var D=1;D<b.length;D++)b[D]=""}}}}return Si(h)}catch{return l}}var zr={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Wa={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Ni;function Wr(){}I(Wr,Ci),Wr.prototype.g=function(){return new XMLHttpRequest},Wr.prototype.i=function(){return{}},Ni=new Wr;function wt(o,l,h,p){this.j=o,this.i=l,this.l=h,this.R=p||1,this.U=new zn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ga}function Ga(){this.i=null,this.g="",this.h=!1}var Ka={},Di={};function xi(o,l,h){o.L=1,o.v=Jr(ct(l)),o.m=h,o.P=!0,Qa(o,null)}function Qa(o,l){o.F=Date.now(),Gr(o),o.A=ct(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),lc(h.i,"t",p),o.C=0,h=o.j.J,o.h=new Ga,o.g=Sc(o.j,h?l:null,!o.m),0<o.O&&(o.M=new ef(g(o.Y,o,o.g),o.O)),l=o.U,h=o.g,p=o.ca;var b="readystatechange";Array.isArray(b)||(b&&(Ua[0]=b.toString()),b=Ua);for(var S=0;S<b.length;S++){var D=Da(h,b[S],p||l.handleEvent,!1,l.h||l);if(!D)break;l.g[D.key]=D}l=o.H?_(o.H):{},o.m?(o.u||(o.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,l)):(o.u="GET",o.g.ea(o.A,o.u,null,l)),Gn(),rf(o.i,o.u,o.A,o.l,o.R,o.m)}wt.prototype.ca=function(o){o=o.target;const l=this.M;l&&lt(o)==3?l.j():this.Y(o)},wt.prototype.Y=function(o){try{if(o==this.g)e:{const be=lt(this.g);var l=this.g.Ba();const yn=this.g.Z();if(!(3>be)&&(be!=3||this.g&&(this.h.h||this.g.oa()||gc(this.g)))){this.J||be!=4||l==7||(l==8||0>=yn?Gn(3):Gn(2)),Vi(this);var h=this.g.Z();this.X=h;t:if(Ja(this)){var p=gc(this.g);o="";var b=p.length,S=lt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Jt(this),Jn(this);var D="";break t}this.h.i=new c.TextDecoder}for(l=0;l<b;l++)this.h.h=!0,o+=this.h.i.decode(p[l],{stream:!(S&&l==b-1)});p.length=0,this.h.g+=o,this.C=0,D=this.h.g}else D=this.g.oa();if(this.o=h==200,sf(this.i,this.u,this.A,this.l,this.R,be,h),this.o){if(this.T&&!this.K){t:{if(this.g){var Y,_e=this.g;if((Y=_e.g?_e.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!F(Y)){var Q=Y;break t}}Q=null}if(h=Q)gn(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Oi(this,h);else{this.o=!1,this.s=3,Ne(12),Jt(this),Jn(this);break e}}if(this.P){h=!0;let Be;for(;!this.J&&this.C<D.length;)if(Be=cf(this,D),Be==Di){be==4&&(this.s=4,Ne(14),h=!1),gn(this.i,this.l,null,"[Incomplete Response]");break}else if(Be==Ka){this.s=4,Ne(15),gn(this.i,this.l,D,"[Invalid Chunk]"),h=!1;break}else gn(this.i,this.l,Be,null),Oi(this,Be);if(Ja(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),be!=4||D.length!=0||this.h.h||(this.s=1,Ne(16),h=!1),this.o=this.o&&h,!h)gn(this.i,this.l,D,"[Invalid Chunked Response]"),Jt(this),Jn(this);else if(0<D.length&&!this.W){this.W=!0;var Ie=this.j;Ie.g==this&&Ie.ba&&!Ie.M&&(Ie.j.info("Great, no buffering proxy detected. Bytes received: "+D.length),$i(Ie),Ie.M=!0,Ne(11))}}else gn(this.i,this.l,D,null),Oi(this,D);be==4&&Jt(this),this.o&&!this.J&&(be==4?Ic(this.j,this):(this.o=!1,Gr(this)))}else Af(this.g),h==400&&0<D.indexOf("Unknown SID")?(this.s=3,Ne(12)):(this.s=0,Ne(13)),Jt(this),Jn(this)}}}catch{}finally{}};function Ja(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function cf(o,l){var h=o.C,p=l.indexOf(`
`,h);return p==-1?Di:(h=Number(l.substring(h,p)),isNaN(h)?Ka:(p+=1,p+h>l.length?Di:(l=l.slice(p,p+h),o.C=p+h,l)))}wt.prototype.cancel=function(){this.J=!0,Jt(this)};function Gr(o){o.S=Date.now()+o.I,Ya(o,o.I)}function Ya(o,l){if(o.B!=null)throw Error("WatchDog timer not null");o.B=Kn(g(o.ba,o),l)}function Vi(o){o.B&&(c.clearTimeout(o.B),o.B=null)}wt.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(of(this.i,this.A),this.L!=2&&(Gn(),Ne(17)),Jt(this),this.s=2,Jn(this)):Ya(this,this.S-o)};function Jn(o){o.j.G==0||o.J||Ic(o.j,o)}function Jt(o){Vi(o);var l=o.M;l&&typeof l.ma=="function"&&l.ma(),o.M=null,Fa(o.U),o.g&&(l=o.g,o.g=null,l.abort(),l.ma())}function Oi(o,l){try{var h=o.j;if(h.G!=0&&(h.g==o||Li(h.h,o))){if(!o.K&&Li(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(l)}catch{p=null}if(Array.isArray(p)&&p.length==3){var b=p;if(b[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)ns(h),es(h);else break e;Bi(h),Ne(18)}}else h.za=b[1],0<h.za-h.T&&37500>b[2]&&h.F&&h.v==0&&!h.C&&(h.C=Kn(g(h.Za,h),6e3));if(1>=ec(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Xt(h,11)}else if((o.K||h.g==o)&&ns(h),!F(l))for(b=h.Da.g.parse(l),l=0;l<b.length;l++){let Q=b[l];if(h.T=Q[0],Q=Q[1],h.G==2)if(Q[0]=="c"){h.K=Q[1],h.ia=Q[2];const Ie=Q[3];Ie!=null&&(h.la=Ie,h.j.info("VER="+h.la));const be=Q[4];be!=null&&(h.Aa=be,h.j.info("SVER="+h.Aa));const yn=Q[5];yn!=null&&typeof yn=="number"&&0<yn&&(p=1.5*yn,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const Be=o.g;if(Be){const ss=Be.g?Be.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ss){var S=p.h;S.g||ss.indexOf("spdy")==-1&&ss.indexOf("quic")==-1&&ss.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(Mi(S,S.h),S.h=null))}if(p.D){const qi=Be.g?Be.g.getResponseHeader("X-HTTP-Session-Id"):null;qi&&(p.ya=qi,te(p.I,p.D,qi))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var D=o;if(p.qa=Rc(p,p.J?p.ia:null,p.W),D.K){tc(p.h,D);var Y=D,_e=p.L;_e&&(Y.I=_e),Y.B&&(Vi(Y),Gr(Y)),p.g=D}else Ec(p);0<h.i.length&&ts(h)}else Q[0]!="stop"&&Q[0]!="close"||Xt(h,7);else h.G==3&&(Q[0]=="stop"||Q[0]=="close"?Q[0]=="stop"?Xt(h,7):Fi(h):Q[0]!="noop"&&h.l&&h.l.ta(Q),h.v=0)}}Gn(4)}catch{}}var lf=class{constructor(o,l){this.g=o,this.map=l}};function Xa(o){this.l=o||10,c.PerformanceNavigationTiming?(o=c.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Za(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function ec(o){return o.h?1:o.g?o.g.size:0}function Li(o,l){return o.h?o.h==l:o.g?o.g.has(l):!1}function Mi(o,l){o.g?o.g.add(l):o.h=l}function tc(o,l){o.h&&o.h==l?o.h=null:o.g&&o.g.has(l)&&o.g.delete(l)}Xa.prototype.cancel=function(){if(this.i=nc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function nc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let l=o.i;for(const h of o.g.values())l=l.concat(h.D);return l}return N(o.i)}function uf(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(u(o)){for(var l=[],h=o.length,p=0;p<h;p++)l.push(o[p]);return l}l=[],h=0;for(p in o)l[h++]=o[p];return l}function hf(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(u(o)||typeof o=="string"){var l=[];o=o.length;for(var h=0;h<o;h++)l.push(h);return l}l=[],h=0;for(const p in o)l[h++]=p;return l}}}function rc(o,l){if(o.forEach&&typeof o.forEach=="function")o.forEach(l,void 0);else if(u(o)||typeof o=="string")Array.prototype.forEach.call(o,l,void 0);else for(var h=hf(o),p=uf(o),b=p.length,S=0;S<b;S++)l.call(void 0,p[S],h&&h[S],o)}var sc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function df(o,l){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),b=null;if(0<=p){var S=o[h].substring(0,p);b=o[h].substring(p+1)}else S=o[h];l(S,b?decodeURIComponent(b.replace(/\+/g," ")):"")}}}function Yt(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Yt){this.h=o.h,Kr(this,o.j),this.o=o.o,this.g=o.g,Qr(this,o.s),this.l=o.l;var l=o.i,h=new Zn;h.i=l.i,l.g&&(h.g=new Map(l.g),h.h=l.h),ic(this,h),this.m=o.m}else o&&(l=String(o).match(sc))?(this.h=!1,Kr(this,l[1]||"",!0),this.o=Yn(l[2]||""),this.g=Yn(l[3]||"",!0),Qr(this,l[4]),this.l=Yn(l[5]||"",!0),ic(this,l[6]||"",!0),this.m=Yn(l[7]||"")):(this.h=!1,this.i=new Zn(null,this.h))}Yt.prototype.toString=function(){var o=[],l=this.j;l&&o.push(Xn(l,oc,!0),":");var h=this.g;return(h||l=="file")&&(o.push("//"),(l=this.o)&&o.push(Xn(l,oc,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(Xn(h,h.charAt(0)=="/"?mf:pf,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",Xn(h,_f)),o.join("")};function ct(o){return new Yt(o)}function Kr(o,l,h){o.j=h?Yn(l,!0):l,o.j&&(o.j=o.j.replace(/:$/,""))}function Qr(o,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);o.s=l}else o.s=null}function ic(o,l,h){l instanceof Zn?(o.i=l,vf(o.i,o.h)):(h||(l=Xn(l,gf)),o.i=new Zn(l,o.h))}function te(o,l,h){o.i.set(l,h)}function Jr(o){return te(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Yn(o,l){return o?l?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Xn(o,l,h){return typeof o=="string"?(o=encodeURI(o).replace(l,ff),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function ff(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var oc=/[#\/\?@]/g,pf=/[#\?:]/g,mf=/[#\?]/g,gf=/[#\?@]/g,_f=/#/g;function Zn(o,l){this.h=this.g=null,this.i=o||null,this.j=!!l}function Et(o){o.g||(o.g=new Map,o.h=0,o.i&&df(o.i,function(l,h){o.add(decodeURIComponent(l.replace(/\+/g," ")),h)}))}n=Zn.prototype,n.add=function(o,l){Et(this),this.i=null,o=_n(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(l),this.h+=1,this};function ac(o,l){Et(o),l=_n(o,l),o.g.has(l)&&(o.i=null,o.h-=o.g.get(l).length,o.g.delete(l))}function cc(o,l){return Et(o),l=_n(o,l),o.g.has(l)}n.forEach=function(o,l){Et(this),this.g.forEach(function(h,p){h.forEach(function(b){o.call(l,b,p,this)},this)},this)},n.na=function(){Et(this);const o=Array.from(this.g.values()),l=Array.from(this.g.keys()),h=[];for(let p=0;p<l.length;p++){const b=o[p];for(let S=0;S<b.length;S++)h.push(l[p])}return h},n.V=function(o){Et(this);let l=[];if(typeof o=="string")cc(this,o)&&(l=l.concat(this.g.get(_n(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)l=l.concat(o[h])}return l},n.set=function(o,l){return Et(this),this.i=null,o=_n(this,o),cc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[l]),this.h+=1,this},n.get=function(o,l){return o?(o=this.V(o),0<o.length?String(o[0]):l):l};function lc(o,l,h){ac(o,l),0<h.length&&(o.i=null,o.g.set(_n(o,l),N(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],l=Array.from(this.g.keys());for(var h=0;h<l.length;h++){var p=l[h];const S=encodeURIComponent(String(p)),D=this.V(p);for(p=0;p<D.length;p++){var b=S;D[p]!==""&&(b+="="+encodeURIComponent(String(D[p]))),o.push(b)}}return this.i=o.join("&")};function _n(o,l){return l=String(l),o.j&&(l=l.toLowerCase()),l}function vf(o,l){l&&!o.j&&(Et(o),o.i=null,o.g.forEach(function(h,p){var b=p.toLowerCase();p!=b&&(ac(this,p),lc(this,b,h))},o)),o.j=l}function yf(o,l){const h=new Qn;if(c.Image){const p=new Image;p.onload=R(Tt,h,"TestLoadImage: loaded",!0,l,p),p.onerror=R(Tt,h,"TestLoadImage: error",!1,l,p),p.onabort=R(Tt,h,"TestLoadImage: abort",!1,l,p),p.ontimeout=R(Tt,h,"TestLoadImage: timeout",!1,l,p),c.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else l(!1)}function wf(o,l){const h=new Qn,p=new AbortController,b=setTimeout(()=>{p.abort(),Tt(h,"TestPingServer: timeout",!1,l)},1e4);fetch(o,{signal:p.signal}).then(S=>{clearTimeout(b),S.ok?Tt(h,"TestPingServer: ok",!0,l):Tt(h,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(b),Tt(h,"TestPingServer: error",!1,l)})}function Tt(o,l,h,p,b){try{b&&(b.onload=null,b.onerror=null,b.onabort=null,b.ontimeout=null),p(h)}catch{}}function Ef(){this.g=new nf}function Tf(o,l,h){const p=h||"";try{rc(o,function(b,S){let D=b;d(b)&&(D=Si(b)),l.push(p+S+"="+encodeURIComponent(D))})}catch(b){throw l.push(p+"type="+encodeURIComponent("_badmap")),b}}function Yr(o){this.l=o.Ub||null,this.j=o.eb||!1}I(Yr,Ci),Yr.prototype.g=function(){return new Xr(this.l,this.j)},Yr.prototype.i=(function(o){return function(){return o}})({});function Xr(o,l){Te.call(this),this.D=o,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}I(Xr,Te),n=Xr.prototype,n.open=function(o,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=l,this.readyState=1,tr(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(l.body=o),(this.D||c).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,er(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,tr(this)),this.g&&(this.readyState=3,tr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;uc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function uc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var l=o.value?o.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!o.done}))&&(this.response=this.responseText+=l)}o.done?er(this):tr(this),this.readyState==3&&uc(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,er(this))},n.Qa=function(o){this.g&&(this.response=o,er(this))},n.ga=function(){this.g&&er(this)};function er(o){o.readyState=4,o.l=null,o.j=null,o.v=null,tr(o)}n.setRequestHeader=function(o,l){this.u.append(o,l)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],l=this.h.entries();for(var h=l.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=l.next();return o.join(`\r
`)};function tr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Xr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function hc(o){let l="";return ee(o,function(h,p){l+=p,l+=":",l+=h,l+=`\r
`}),l}function Ui(o,l,h){e:{for(p in h){var p=!1;break e}p=!0}p||(h=hc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):te(o,l,h))}function se(o){Te.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}I(se,Te);var If=/^https?$/i,bf=["POST","PUT"];n=se.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,l,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);l=l?l.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ni.g(),this.v=this.o?Ba(this.o):Ba(Ni),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(l,String(o),!0),this.B=!1}catch(S){dc(this,S);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var b in p)h.set(b,p[b]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const S of p.keys())h.set(S,p.get(S));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(S=>S.toLowerCase()=="content-type"),b=c.FormData&&o instanceof c.FormData,!(0<=Array.prototype.indexOf.call(bf,l,void 0))||p||b||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,D]of h)this.g.setRequestHeader(S,D);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{mc(this),this.u=!0,this.g.send(o),this.u=!1}catch(S){dc(this,S)}};function dc(o,l){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=l,o.m=5,fc(o),Zr(o)}function fc(o){o.A||(o.A=!0,ke(o,"complete"),ke(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,ke(this,"complete"),ke(this,"abort"),Zr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Zr(this,!0)),se.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?pc(this):this.bb())},n.bb=function(){pc(this)};function pc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||lt(o)!=4||o.Z()!=2)){if(o.u&&lt(o)==4)La(o.Ea,0,o);else if(ke(o,"readystatechange"),lt(o)==4){o.h=!1;try{const D=o.Z();e:switch(D){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var h;if(!(h=l)){var p;if(p=D===0){var b=String(o.D).match(sc)[1]||null;!b&&c.self&&c.self.location&&(b=c.self.location.protocol.slice(0,-1)),p=!If.test(b?b.toLowerCase():"")}h=p}if(h)ke(o,"complete"),ke(o,"success");else{o.m=6;try{var S=2<lt(o)?o.g.statusText:""}catch{S=""}o.l=S+" ["+o.Z()+"]",fc(o)}}finally{Zr(o)}}}}function Zr(o,l){if(o.g){mc(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,l||ke(o,"ready");try{h.onreadystatechange=p}catch{}}}function mc(o){o.I&&(c.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function lt(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<lt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var l=this.g.responseText;return o&&l.indexOf(o)==0&&(l=l.substring(o.length)),tf(l)}};function gc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Af(o){const l={};o=(o.g&&2<=lt(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(F(o[p]))continue;var h=T(o[p]);const b=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const S=l[b]||[];l[b]=S,S.push(h)}E(l,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function nr(o,l,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||l}function _c(o){this.Aa=0,this.i=[],this.j=new Qn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=nr("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=nr("baseRetryDelayMs",5e3,o),this.cb=nr("retryDelaySeedMs",1e4,o),this.Wa=nr("forwardChannelMaxRetries",2,o),this.wa=nr("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Xa(o&&o.concurrentRequestLimit),this.Da=new Ef,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=_c.prototype,n.la=8,n.G=1,n.connect=function(o,l,h,p){Ne(0),this.W=o,this.H=l||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=Rc(this,null,this.W),ts(this)};function Fi(o){if(vc(o),o.G==3){var l=o.U++,h=ct(o.I);if(te(h,"SID",o.K),te(h,"RID",l),te(h,"TYPE","terminate"),rr(o,h),l=new wt(o,o.j,l),l.L=2,l.v=Jr(ct(h)),h=!1,c.navigator&&c.navigator.sendBeacon)try{h=c.navigator.sendBeacon(l.v.toString(),"")}catch{}!h&&c.Image&&(new Image().src=l.v,h=!0),h||(l.g=Sc(l.j,null),l.g.ea(l.v)),l.F=Date.now(),Gr(l)}Ac(o)}function es(o){o.g&&($i(o),o.g.cancel(),o.g=null)}function vc(o){es(o),o.u&&(c.clearTimeout(o.u),o.u=null),ns(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&c.clearTimeout(o.s),o.s=null)}function ts(o){if(!Za(o.h)&&!o.s){o.s=!0;var l=o.Ga;qn||Na(),jn||(qn(),jn=!0),yi.add(l,o),o.B=0}}function Rf(o,l){return ec(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=l.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=Kn(g(o.Ga,o,l),bc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const b=new wt(this,this.j,o);let S=this.o;if(this.S&&(S?(S=_(S),w(S,this.S)):S=this.S),this.m!==null||this.O||(b.H=S,S=null),this.P)e:{for(var l=0,h=0;h<this.i.length;h++){t:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(l+=p,4096<l){l=h;break e}if(l===4096||h===this.i.length-1){l=h+1;break e}}l=1e3}else l=1e3;l=wc(this,b,l),h=ct(this.I),te(h,"RID",o),te(h,"CVER",22),this.D&&te(h,"X-HTTP-Session-Id",this.D),rr(this,h),S&&(this.O?l="headers="+encodeURIComponent(String(hc(S)))+"&"+l:this.m&&Ui(h,this.m,S)),Mi(this.h,b),this.Ua&&te(h,"TYPE","init"),this.P?(te(h,"$req",l),te(h,"SID","null"),b.T=!0,xi(b,h,null)):xi(b,h,l),this.G=2}}else this.G==3&&(o?yc(this,o):this.i.length==0||Za(this.h)||yc(this))};function yc(o,l){var h;l?h=l.l:h=o.U++;const p=ct(o.I);te(p,"SID",o.K),te(p,"RID",h),te(p,"AID",o.T),rr(o,p),o.m&&o.o&&Ui(p,o.m,o.o),h=new wt(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),l&&(o.i=l.D.concat(o.i)),l=wc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),Mi(o.h,h),xi(h,p,l)}function rr(o,l){o.H&&ee(o.H,function(h,p){te(l,p,h)}),o.l&&rc({},function(h,p){te(l,p,h)})}function wc(o,l,h){h=Math.min(o.i.length,h);var p=o.l?g(o.l.Na,o.l,o):null;e:{var b=o.i;let S=-1;for(;;){const D=["count="+h];S==-1?0<h?(S=b[0].g,D.push("ofs="+S)):S=0:D.push("ofs="+S);let Y=!0;for(let _e=0;_e<h;_e++){let Q=b[_e].g;const Ie=b[_e].map;if(Q-=S,0>Q)S=Math.max(0,b[_e].g-100),Y=!1;else try{Tf(Ie,D,"req"+Q+"_")}catch{p&&p(Ie)}}if(Y){p=D.join("&");break e}}}return o=o.i.splice(0,h),l.D=o,p}function Ec(o){if(!o.g&&!o.u){o.Y=1;var l=o.Fa;qn||Na(),jn||(qn(),jn=!0),yi.add(l,o),o.v=0}}function Bi(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=Kn(g(o.Fa,o),bc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Tc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=Kn(g(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ne(10),es(this),Tc(this))};function $i(o){o.A!=null&&(c.clearTimeout(o.A),o.A=null)}function Tc(o){o.g=new wt(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var l=ct(o.qa);te(l,"RID","rpc"),te(l,"SID",o.K),te(l,"AID",o.T),te(l,"CI",o.F?"0":"1"),!o.F&&o.ja&&te(l,"TO",o.ja),te(l,"TYPE","xmlhttp"),rr(o,l),o.m&&o.o&&Ui(l,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=Jr(ct(l)),h.m=null,h.P=!0,Qa(h,o)}n.Za=function(){this.C!=null&&(this.C=null,es(this),Bi(this),Ne(19))};function ns(o){o.C!=null&&(c.clearTimeout(o.C),o.C=null)}function Ic(o,l){var h=null;if(o.g==l){ns(o),$i(o),o.g=null;var p=2}else if(Li(o.h,l))h=l.D,tc(o.h,l),p=1;else return;if(o.G!=0){if(l.o)if(p==1){h=l.m?l.m.length:0,l=Date.now()-l.F;var b=o.B;p=Hr(),ke(p,new za(p,h)),ts(o)}else Ec(o);else if(b=l.s,b==3||b==0&&0<l.X||!(p==1&&Rf(o,l)||p==2&&Bi(o)))switch(h&&0<h.length&&(l=o.h,l.i=l.i.concat(h)),b){case 1:Xt(o,5);break;case 4:Xt(o,10);break;case 3:Xt(o,6);break;default:Xt(o,2)}}}function bc(o,l){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*l}function Xt(o,l){if(o.j.info("Error code "+l),l==2){var h=g(o.fb,o),p=o.Xa;const b=!p;p=new Yt(p||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||Kr(p,"https"),Jr(p),b?yf(p.toString(),h):wf(p.toString(),h)}else Ne(2);o.G=0,o.l&&o.l.sa(l),Ac(o),vc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Ne(2)):(this.j.info("Failed to ping google.com"),Ne(1))};function Ac(o){if(o.G=0,o.ka=[],o.l){const l=nc(o.h);(l.length!=0||o.i.length!=0)&&(C(o.ka,l),C(o.ka,o.i),o.h.i.length=0,N(o.i),o.i.length=0),o.l.ra()}}function Rc(o,l,h){var p=h instanceof Yt?ct(h):new Yt(h);if(p.g!="")l&&(p.g=l+"."+p.g),Qr(p,p.s);else{var b=c.location;p=b.protocol,l=l?l+"."+b.hostname:b.hostname,b=+b.port;var S=new Yt(null);p&&Kr(S,p),l&&(S.g=l),b&&Qr(S,b),h&&(S.l=h),p=S}return h=o.D,l=o.ya,h&&l&&te(p,h,l),te(p,"VER",o.la),rr(o,p),p}function Sc(o,l,h){if(l&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=o.Ca&&!o.pa?new se(new Yr({eb:h})):new se(o.pa),l.Ha(o.J),l}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Cc(){}n=Cc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function rs(){}rs.prototype.g=function(o,l){return new Ve(o,l)};function Ve(o,l){Te.call(this),this.g=new _c(l),this.l=o,this.h=l&&l.messageUrlParams||null,o=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(o?o["X-WebChannel-Content-Type"]=l.messageContentType:o={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(o?o["X-WebChannel-Client-Profile"]=l.va:o={"X-WebChannel-Client-Profile":l.va}),this.g.S=o,(o=l&&l.Sb)&&!F(o)&&(this.g.m=o),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!F(l)&&(this.g.D=l,o=this.h,o!==null&&l in o&&(o=this.h,l in o&&delete o[l])),this.j=new vn(this)}I(Ve,Te),Ve.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ve.prototype.close=function(){Fi(this.g)},Ve.prototype.o=function(o){var l=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=Si(o),o=h);l.i.push(new lf(l.Ya++,o)),l.G==3&&ts(l)},Ve.prototype.N=function(){this.g.l=null,delete this.j,Fi(this.g),delete this.g,Ve.aa.N.call(this)};function Pc(o){Pi.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var l=o.__sm__;if(l){e:{for(const h in l){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,l=l!==null&&o in l?l[o]:void 0),this.data=l}else this.data=o}I(Pc,Pi);function kc(){ki.call(this),this.status=1}I(kc,ki);function vn(o){this.g=o}I(vn,Cc),vn.prototype.ua=function(){ke(this.g,"a")},vn.prototype.ta=function(o){ke(this.g,new Pc(o))},vn.prototype.sa=function(o){ke(this.g,new kc)},vn.prototype.ra=function(){ke(this.g,"b")},rs.prototype.createWebChannel=rs.prototype.g,Ve.prototype.send=Ve.prototype.o,Ve.prototype.open=Ve.prototype.m,Ve.prototype.close=Ve.prototype.close,hh=function(){return new rs},uh=function(){return Hr()},lh=Qt,uo={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},zr.NO_ERROR=0,zr.TIMEOUT=8,zr.HTTP_ERROR=6,_s=zr,Wa.COMPLETE="complete",ch=Wa,$a.EventType=Wn,Wn.OPEN="a",Wn.CLOSE="b",Wn.ERROR="c",Wn.MESSAGE="d",Te.prototype.listen=Te.prototype.K,or=$a,se.prototype.listenOnce=se.prototype.L,se.prototype.getLastError=se.prototype.Ka,se.prototype.getLastErrorCode=se.prototype.Ba,se.prototype.getStatus=se.prototype.Z,se.prototype.getResponseJson=se.prototype.Oa,se.prototype.getResponseText=se.prototype.oa,se.prototype.send=se.prototype.ea,se.prototype.setWithCredentials=se.prototype.Ha,ah=se}).apply(typeof as<"u"?as:typeof self<"u"?self:typeof window<"u"?window:{});const cl="@firebase/firestore",ll="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Re.UNAUTHENTICATED=new Re(null),Re.GOOGLE_CREDENTIALS=new Re("google-credentials-uid"),Re.FIRST_PARTY=new Re("first-party-uid"),Re.MOCK_USER=new Re("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ln="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ln=new ko("@firebase/firestore");function wn(){return ln.logLevel}function V(n,...e){if(ln.logLevel<=W.DEBUG){const t=e.map(qo);ln.debug(`Firestore (${Ln}): ${n}`,...t)}}function gt(n,...e){if(ln.logLevel<=W.ERROR){const t=e.map(qo);ln.error(`Firestore (${Ln}): ${n}`,...t)}}function Lt(n,...e){if(ln.logLevel<=W.WARN){const t=e.map(qo);ln.warn(`Firestore (${Ln}): ${n}`,...t)}}function qo(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,dh(n,r,t)}function dh(n,e,t){let r=`FIRESTORE (${Ln}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw gt(r),new Error(r)}function J(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||dh(e,s,r)}function H(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class x extends it{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class S_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Re.UNAUTHENTICATED)))}shutdown(){}}class C_{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class P_{constructor(e){this.t=e,this.currentUser=Re.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){J(this.o===void 0,42304);let r=this.i;const s=u=>this.i!==r?(r=this.i,t(u)):Promise.resolve();let i=new ft;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new ft,e.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},c=u=>{V("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((u=>c(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?c(u):(V("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new ft)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.i!==e?(V("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(J(typeof r.accessToken=="string",31837,{l:r}),new fh(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return J(e===null||typeof e=="string",2055,{h:e}),new Re(e)}}class k_{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=Re.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class N_{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new k_(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Re.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class ul{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class D_{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Oe(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){J(this.o===void 0,3512);const r=i=>{i.error!=null&&V("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.m;return this.m=i.token,V("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>r(i)))};const s=i=>{V("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):V("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new ul(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(J(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new ul(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x_(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ph(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jo{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=x_(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}}function z(n,e){return n<e?-1:n>e?1:0}function ho(n,e){let t=0;for(;t<n.length&&t<e.length;){const r=n.codePointAt(t),s=e.codePointAt(t);if(r!==s){if(r<128&&s<128)return z(r,s);{const i=ph(),a=V_(i.encode(hl(n,t)),i.encode(hl(e,t)));return a!==0?a:z(r,s)}}t+=r>65535?2:1}return z(n.length,e.length)}function hl(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function V_(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return z(n[t],e[t]);return z(n.length,e.length)}function Pn(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dl="__name__";class Qe{constructor(e,t,r){t===void 0?t=0:t>e.length&&$(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&$(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Qe.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Qe?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=Qe.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return z(e.length,t.length)}static compareSegments(e,t){const r=Qe.isNumericId(e),s=Qe.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?Qe.extractNumericId(e).compare(Qe.extractNumericId(t)):ho(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Dt.fromString(e.substring(4,e.length-2))}}class X extends Qe{construct(e,t,r){return new X(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new x(P.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new X(t)}static emptyPath(){return new X([])}}const O_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ye extends Qe{construct(e,t,r){return new ye(e,t,r)}static isValidIdentifier(e){return O_.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ye.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===dl}static keyField(){return new ye([dl])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new x(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new x(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new x(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,s+=2}else c==="`"?(a=!a,s++):c!=="."||a?(r+=c,s++):(i(),s++)}if(i(),a)throw new x(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ye(t)}static emptyPath(){return new ye([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(e){this.path=e}static fromPath(e){return new U(X.fromString(e))}static fromName(e){return new U(X.fromString(e).popFirst(5))}static empty(){return new U(X.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&X.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return X.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new U(new X(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mh(n,e,t){if(!t)throw new x(P.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function L_(n,e,t,r){if(e===!0&&r===!0)throw new x(P.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function fl(n){if(!U.isDocumentKey(n))throw new x(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function pl(n){if(U.isDocumentKey(n))throw new x(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function gh(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Ys(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":$(12329,{type:typeof n})}function Me(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new x(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ys(n);throw new x(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ue(n,e){const t={typeString:n};return e&&(t.value=e),t}function Vr(n,e){if(!gh(n))throw new x(P.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&a!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new x(P.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ml=-62135596800,gl=1e6;class ne{static now(){return ne.fromMillis(Date.now())}static fromDate(e){return ne.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*gl);return new ne(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new x(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new x(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<ml)throw new x(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new x(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/gl}_compareTo(e){return this.seconds===e.seconds?z(this.nanoseconds,e.nanoseconds):z(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ne._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Vr(e,ne._jsonSchema))return new ne(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-ml;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ne._jsonSchemaVersion="firestore/timestamp/1.0",ne._jsonSchema={type:ue("string",ne._jsonSchemaVersion),seconds:ue("number"),nanoseconds:ue("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{static fromTimestamp(e){return new j(e)}static min(){return new j(new ne(0,0))}static max(){return new j(new ne(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yr=-1;function M_(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=j.fromTimestamp(r===1e9?new ne(t+1,0):new ne(t,r));return new Mt(s,U.empty(),e)}function U_(n){return new Mt(n.readTime,n.key,yr)}class Mt{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Mt(j.min(),U.empty(),yr)}static max(){return new Mt(j.max(),U.empty(),yr)}}function F_(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=U.comparator(n.documentKey,e.documentKey),t!==0?t:z(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B_="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class $_{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mn(n){if(n.code!==P.FAILED_PRECONDITION||n.message!==B_)throw n;V("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&$(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new k(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof k?t:k.resolve(t)}catch(t){return k.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):k.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):k.reject(t)}static resolve(e){return new k(((t,r)=>{t(e)}))}static reject(e){return new k(((t,r)=>{r(e)}))}static waitFor(e){return new k(((t,r)=>{let s=0,i=0,a=!1;e.forEach((c=>{++s,c.next((()=>{++i,a&&i===s&&t()}),(u=>r(u)))})),a=!0,i===s&&t()}))}static or(e){let t=k.resolve(!1);for(const r of e)t=t.next((s=>s?k.resolve(s):r()));return t}static forEach(e,t){const r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new k(((r,s)=>{const i=e.length,a=new Array(i);let c=0;for(let u=0;u<i;u++){const d=u;t(e[d]).next((f=>{a[d]=f,++c,c===i&&r(a)}),(f=>s(f)))}}))}static doWhile(e,t){return new k(((r,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}}function q_(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Un(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xs{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this._e(r),this.ae=r=>t.writeSequenceNumber(r))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Xs.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ho=-1;function Zs(n){return n==null}function Ns(n){return n===0&&1/n==-1/0}function j_(n){return typeof n=="number"&&Number.isInteger(n)&&!Ns(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h="";function H_(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=_l(e)),e=z_(n.get(t),e);return _l(e)}function z_(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const i=n.charAt(s);switch(i){case"\0":t+="";break;case _h:t+="";break;default:t+=i}}return t}function _l(n){return n+_h+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vl(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Gt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function vh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e,t){this.comparator=e,this.root=t||ve.EMPTY}insert(e,t){return new re(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ve.BLACK,null,null))}remove(e){return new re(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ve.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new cs(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new cs(this.root,e,this.comparator,!1)}getReverseIterator(){return new cs(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new cs(this.root,e,this.comparator,!0)}}class cs{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ve{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??ve.RED,this.left=s??ve.EMPTY,this.right=i??ve.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new ve(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return ve.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return ve.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ve.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ve.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw $(43730,{key:this.key,value:this.value});if(this.right.isRed())throw $(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw $(27949);return e+(this.isRed()?0:1)}}ve.EMPTY=null,ve.RED=!0,ve.BLACK=!1;ve.EMPTY=new class{constructor(){this.size=0}get key(){throw $(57766)}get value(){throw $(16141)}get color(){throw $(16727)}get left(){throw $(29726)}get right(){throw $(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new ve(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(e){this.comparator=e,this.data=new re(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new yl(this.data.getIterator())}getIteratorFrom(e){return new yl(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof fe)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new fe(this.comparator);return t.data=e,t}}class yl{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le{constructor(e){this.fields=e,e.sort(ye.comparator)}static empty(){return new Le([])}unionWith(e){let t=new fe(ye.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new Le(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Pn(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new yh("Invalid base64 string: "+i):i}})(e);return new we(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i})(e);return new we(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return z(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}we.EMPTY_BYTE_STRING=new we("");const W_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ut(n){if(J(!!n,39018),typeof n=="string"){let e=0;const t=W_.exec(n);if(J(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ae(n.seconds),nanos:ae(n.nanos)}}function ae(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Ft(n){return typeof n=="string"?we.fromBase64String(n):we.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wh="server_timestamp",Eh="__type__",Th="__previous_value__",Ih="__local_write_time__";function zo(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[Eh])===null||t===void 0?void 0:t.stringValue)===wh}function ei(n){const e=n.mapValue.fields[Th];return zo(e)?ei(e):e}function wr(n){const e=Ut(n.mapValue.fields[Ih].timestampValue);return new ne(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G_{constructor(e,t,r,s,i,a,c,u,d,f){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=d,this.isUsingEmulator=f}}const Ds="(default)";class Er{constructor(e,t){this.projectId=e,this.database=t||Ds}static empty(){return new Er("","")}get isDefaultDatabase(){return this.database===Ds}isEqual(e){return e instanceof Er&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bh="__type__",K_="__max__",ls={mapValue:{}},Ah="__vector__",xs="value";function Bt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?zo(n)?4:J_(n)?9007199254740991:Q_(n)?10:11:$(28295,{value:n})}function rt(n,e){if(n===e)return!0;const t=Bt(n);if(t!==Bt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return wr(n).isEqual(wr(e));case 3:return(function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const a=Ut(s.timestampValue),c=Ut(i.timestampValue);return a.seconds===c.seconds&&a.nanos===c.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(s,i){return Ft(s.bytesValue).isEqual(Ft(i.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(s,i){return ae(s.geoPointValue.latitude)===ae(i.geoPointValue.latitude)&&ae(s.geoPointValue.longitude)===ae(i.geoPointValue.longitude)})(n,e);case 2:return(function(s,i){if("integerValue"in s&&"integerValue"in i)return ae(s.integerValue)===ae(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const a=ae(s.doubleValue),c=ae(i.doubleValue);return a===c?Ns(a)===Ns(c):isNaN(a)&&isNaN(c)}return!1})(n,e);case 9:return Pn(n.arrayValue.values||[],e.arrayValue.values||[],rt);case 10:case 11:return(function(s,i){const a=s.mapValue.fields||{},c=i.mapValue.fields||{};if(vl(a)!==vl(c))return!1;for(const u in a)if(a.hasOwnProperty(u)&&(c[u]===void 0||!rt(a[u],c[u])))return!1;return!0})(n,e);default:return $(52216,{left:n})}}function Tr(n,e){return(n.values||[]).find((t=>rt(t,e)))!==void 0}function kn(n,e){if(n===e)return 0;const t=Bt(n),r=Bt(e);if(t!==r)return z(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return z(n.booleanValue,e.booleanValue);case 2:return(function(i,a){const c=ae(i.integerValue||i.doubleValue),u=ae(a.integerValue||a.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1})(n,e);case 3:return wl(n.timestampValue,e.timestampValue);case 4:return wl(wr(n),wr(e));case 5:return ho(n.stringValue,e.stringValue);case 6:return(function(i,a){const c=Ft(i),u=Ft(a);return c.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(i,a){const c=i.split("/"),u=a.split("/");for(let d=0;d<c.length&&d<u.length;d++){const f=z(c[d],u[d]);if(f!==0)return f}return z(c.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,a){const c=z(ae(i.latitude),ae(a.latitude));return c!==0?c:z(ae(i.longitude),ae(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return El(n.arrayValue,e.arrayValue);case 10:return(function(i,a){var c,u,d,f;const m=i.fields||{},g=a.fields||{},R=(c=m[xs])===null||c===void 0?void 0:c.arrayValue,I=(u=g[xs])===null||u===void 0?void 0:u.arrayValue,N=z(((d=R==null?void 0:R.values)===null||d===void 0?void 0:d.length)||0,((f=I==null?void 0:I.values)===null||f===void 0?void 0:f.length)||0);return N!==0?N:El(R,I)})(n.mapValue,e.mapValue);case 11:return(function(i,a){if(i===ls.mapValue&&a===ls.mapValue)return 0;if(i===ls.mapValue)return 1;if(a===ls.mapValue)return-1;const c=i.fields||{},u=Object.keys(c),d=a.fields||{},f=Object.keys(d);u.sort(),f.sort();for(let m=0;m<u.length&&m<f.length;++m){const g=ho(u[m],f[m]);if(g!==0)return g;const R=kn(c[u[m]],d[f[m]]);if(R!==0)return R}return z(u.length,f.length)})(n.mapValue,e.mapValue);default:throw $(23264,{le:t})}}function wl(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return z(n,e);const t=Ut(n),r=Ut(e),s=z(t.seconds,r.seconds);return s!==0?s:z(t.nanos,r.nanos)}function El(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=kn(t[s],r[s]);if(i)return i}return z(t.length,r.length)}function Nn(n){return fo(n)}function fo(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=Ut(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Ft(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return U.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=fo(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${fo(t.fields[a])}`;return s+"}"})(n.mapValue):$(61005,{value:n})}function vs(n){switch(Bt(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=ei(n);return e?16+vs(e):16;case 5:return 2*n.stringValue.length;case 6:return Ft(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,i)=>s+vs(i)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return Gt(r.fields,((i,a)=>{s+=i.length+vs(a)})),s})(n.mapValue);default:throw $(13486,{value:n})}}function Tl(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function po(n){return!!n&&"integerValue"in n}function Wo(n){return!!n&&"arrayValue"in n}function Il(n){return!!n&&"nullValue"in n}function bl(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function ys(n){return!!n&&"mapValue"in n}function Q_(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[bh])===null||t===void 0?void 0:t.stringValue)===Ah}function dr(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Gt(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=dr(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=dr(n.arrayValue.values[t]);return e}return Object.assign({},n)}function J_(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===K_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this.value=e}static empty(){return new xe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!ys(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=dr(t)}setAll(e){let t=ye.emptyPath(),r={},s=[];e.forEach(((a,c)=>{if(!t.isImmediateParentOf(c)){const u=this.getFieldsMap(t);this.applyChanges(u,r,s),r={},s=[],t=c.popLast()}a?r[c.lastSegment()]=dr(a):s.push(c.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());ys(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return rt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];ys(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Gt(t,((s,i)=>e[s]=i));for(const s of r)delete e[s]}clone(){return new xe(dr(this.value))}}function Rh(n){const e=[];return Gt(n.fields,((t,r)=>{const s=new ye([t]);if(ys(r)){const i=Rh(r.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)})),new Le(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e,t,r,s,i,a,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=c}static newInvalidDocument(e){return new Se(e,0,j.min(),j.min(),j.min(),xe.empty(),0)}static newFoundDocument(e,t,r,s){return new Se(e,1,t,j.min(),r,s,0)}static newNoDocument(e,t){return new Se(e,2,t,j.min(),j.min(),xe.empty(),0)}static newUnknownDocument(e,t){return new Se(e,3,t,j.min(),j.min(),xe.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(j.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=xe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=xe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=j.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Se&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Se(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vs{constructor(e,t){this.position=e,this.inclusive=t}}function Al(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],a=n.position[s];if(i.field.isKeyField()?r=U.comparator(U.fromName(a.referenceValue),t.key):r=kn(a,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function Rl(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!rt(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ir{constructor(e,t="asc"){this.field=e,this.dir=t}}function Y_(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sh{}class le extends Sh{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Z_(e,t,r):t==="array-contains"?new nv(e,r):t==="in"?new rv(e,r):t==="not-in"?new sv(e,r):t==="array-contains-any"?new iv(e,r):new le(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new ev(e,r):new tv(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(kn(t,this.value)):t!==null&&Bt(this.value)===Bt(t)&&this.matchesComparison(kn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return $(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class We extends Sh{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new We(e,t)}matches(e){return Ch(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function Ch(n){return n.op==="and"}function Ph(n){return X_(n)&&Ch(n)}function X_(n){for(const e of n.filters)if(e instanceof We)return!1;return!0}function mo(n){if(n instanceof le)return n.field.canonicalString()+n.op.toString()+Nn(n.value);if(Ph(n))return n.filters.map((e=>mo(e))).join(",");{const e=n.filters.map((t=>mo(t))).join(",");return`${n.op}(${e})`}}function kh(n,e){return n instanceof le?(function(r,s){return s instanceof le&&r.op===s.op&&r.field.isEqual(s.field)&&rt(r.value,s.value)})(n,e):n instanceof We?(function(r,s){return s instanceof We&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,a,c)=>i&&kh(a,s.filters[c])),!0):!1})(n,e):void $(19439)}function Nh(n){return n instanceof le?(function(t){return`${t.field.canonicalString()} ${t.op} ${Nn(t.value)}`})(n):n instanceof We?(function(t){return t.op.toString()+" {"+t.getFilters().map(Nh).join(" ,")+"}"})(n):"Filter"}class Z_ extends le{constructor(e,t,r){super(e,t,r),this.key=U.fromName(r.referenceValue)}matches(e){const t=U.comparator(e.key,this.key);return this.matchesComparison(t)}}class ev extends le{constructor(e,t){super(e,"in",t),this.keys=Dh("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class tv extends le{constructor(e,t){super(e,"not-in",t),this.keys=Dh("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Dh(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((r=>U.fromName(r.referenceValue)))}class nv extends le{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Wo(t)&&Tr(t.arrayValue,this.value)}}class rv extends le{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Tr(this.value.arrayValue,t)}}class sv extends le{constructor(e,t){super(e,"not-in",t)}matches(e){if(Tr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Tr(this.value.arrayValue,t)}}class iv extends le{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Wo(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>Tr(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ov{constructor(e,t=null,r=[],s=[],i=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=c,this.Pe=null}}function Sl(n,e=null,t=[],r=[],s=null,i=null,a=null){return new ov(n,e,t,r,s,i,a)}function Go(n){const e=H(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>mo(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),Zs(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>Nn(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>Nn(r))).join(",")),e.Pe=t}return e.Pe}function Ko(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!Y_(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!kh(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Rl(n.startAt,e.startAt)&&Rl(n.endAt,e.endAt)}function go(n){return U.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e,t=null,r=[],s=[],i=null,a="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=c,this.endAt=u,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function av(n,e,t,r,s,i,a,c){return new Fn(n,e,t,r,s,i,a,c)}function ti(n){return new Fn(n)}function Cl(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function xh(n){return n.collectionGroup!==null}function fr(n){const e=H(n);if(e.Te===null){e.Te=[];const t=new Set;for(const i of e.explicitOrderBy)e.Te.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new fe(ye.comparator);return a.filters.forEach((u=>{u.getFlattenedFilters().forEach((d=>{d.isInequality()&&(c=c.add(d.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.Te.push(new Ir(i,r))})),t.has(ye.keyField().canonicalString())||e.Te.push(new Ir(ye.keyField(),r))}return e.Te}function Ze(n){const e=H(n);return e.Ie||(e.Ie=cv(e,fr(n))),e.Ie}function cv(n,e){if(n.limitType==="F")return Sl(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new Ir(s.field,i)}));const t=n.endAt?new Vs(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Vs(n.startAt.position,n.startAt.inclusive):null;return Sl(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function _o(n,e){const t=n.filters.concat([e]);return new Fn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Os(n,e,t){return new Fn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function ni(n,e){return Ko(Ze(n),Ze(e))&&n.limitType===e.limitType}function Vh(n){return`${Go(Ze(n))}|lt:${n.limitType}`}function En(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>Nh(s))).join(", ")}]`),Zs(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>Nn(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>Nn(s))).join(",")),`Target(${r})`})(Ze(n))}; limitType=${n.limitType})`}function ri(n,e){return e.isFoundDocument()&&(function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):U.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(const i of fr(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(a,c,u){const d=Al(a,c,u);return a.inclusive?d<=0:d<0})(r.startAt,fr(r),s)||r.endAt&&!(function(a,c,u){const d=Al(a,c,u);return a.inclusive?d>=0:d>0})(r.endAt,fr(r),s))})(n,e)}function lv(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Oh(n){return(e,t)=>{let r=!1;for(const s of fr(n)){const i=uv(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function uv(n,e,t){const r=n.field.isKeyField()?U.comparator(e.key,t.key):(function(i,a,c){const u=a.data.field(i),d=c.data.field(i);return u!==null&&d!==null?kn(u,d):$(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return $(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Gt(this.inner,((t,r)=>{for(const[s,i]of r)e(s,i)}))}isEmpty(){return vh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hv=new re(U.comparator);function _t(){return hv}const Lh=new re(U.comparator);function ar(...n){let e=Lh;for(const t of n)e=e.insert(t.key,t);return e}function Mh(n){let e=Lh;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function en(){return pr()}function Uh(){return pr()}function pr(){return new pn((n=>n.toString()),((n,e)=>n.isEqual(e)))}const dv=new re(U.comparator),fv=new fe(U.comparator);function G(...n){let e=fv;for(const t of n)e=e.add(t);return e}const pv=new fe(z);function mv(){return pv}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qo(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ns(e)?"-0":e}}function Fh(n){return{integerValue:""+n}}function gv(n,e){return j_(e)?Fh(e):Qo(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(){this._=void 0}}function _v(n,e,t){return n instanceof br?(function(s,i){const a={fields:{[Eh]:{stringValue:wh},[Ih]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&zo(i)&&(i=ei(i)),i&&(a.fields[Th]=i),{mapValue:a}})(t,e):n instanceof Ar?$h(n,e):n instanceof Rr?qh(n,e):(function(s,i){const a=Bh(s,i),c=Pl(a)+Pl(s.Ee);return po(a)&&po(s.Ee)?Fh(c):Qo(s.serializer,c)})(n,e)}function vv(n,e,t){return n instanceof Ar?$h(n,e):n instanceof Rr?qh(n,e):t}function Bh(n,e){return n instanceof Ls?(function(r){return po(r)||(function(i){return!!i&&"doubleValue"in i})(r)})(e)?e:{integerValue:0}:null}class br extends si{}class Ar extends si{constructor(e){super(),this.elements=e}}function $h(n,e){const t=jh(e);for(const r of n.elements)t.some((s=>rt(s,r)))||t.push(r);return{arrayValue:{values:t}}}class Rr extends si{constructor(e){super(),this.elements=e}}function qh(n,e){let t=jh(e);for(const r of n.elements)t=t.filter((s=>!rt(s,r)));return{arrayValue:{values:t}}}class Ls extends si{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function Pl(n){return ae(n.integerValue||n.doubleValue)}function jh(n){return Wo(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yv{constructor(e,t){this.field=e,this.transform=t}}function wv(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof Ar&&s instanceof Ar||r instanceof Rr&&s instanceof Rr?Pn(r.elements,s.elements,rt):r instanceof Ls&&s instanceof Ls?rt(r.Ee,s.Ee):r instanceof br&&s instanceof br})(n.transform,e.transform)}class Ev{constructor(e,t){this.version=e,this.transformResults=t}}class He{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new He}static exists(e){return new He(void 0,e)}static updateTime(e){return new He(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ws(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class ii{}function Hh(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Wh(n.key,He.none()):new Or(n.key,n.data,He.none());{const t=n.data,r=xe.empty();let s=new fe(ye.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new Kt(n.key,r,new Le(s.toArray()),He.none())}}function Tv(n,e,t){n instanceof Or?(function(s,i,a){const c=s.value.clone(),u=Nl(s.fieldTransforms,i,a.transformResults);c.setAll(u),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()})(n,e,t):n instanceof Kt?(function(s,i,a){if(!ws(s.precondition,i))return void i.convertToUnknownDocument(a.version);const c=Nl(s.fieldTransforms,i,a.transformResults),u=i.data;u.setAll(zh(s)),u.setAll(c),i.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(n,e,t):(function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function mr(n,e,t,r){return n instanceof Or?(function(i,a,c,u){if(!ws(i.precondition,a))return c;const d=i.value.clone(),f=Dl(i.fieldTransforms,u,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null})(n,e,t,r):n instanceof Kt?(function(i,a,c,u){if(!ws(i.precondition,a))return c;const d=Dl(i.fieldTransforms,u,a),f=a.data;return f.setAll(zh(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((m=>m.field)))})(n,e,t,r):(function(i,a,c){return ws(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c})(n,e,t)}function Iv(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=Bh(r.transform,s||null);i!=null&&(t===null&&(t=xe.empty()),t.set(r.field,i))}return t||null}function kl(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Pn(r,s,((i,a)=>wv(i,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Or extends ii{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Kt extends ii{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function zh(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function Nl(n,e,t){const r=new Map;J(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let s=0;s<t.length;s++){const i=n[s],a=i.transform,c=e.data.field(i.field);r.set(i.field,vv(a,c,t[s]))}return r}function Dl(n,e,t){const r=new Map;for(const s of n){const i=s.transform,a=t.data.field(s.field);r.set(s.field,_v(i,a,e))}return r}class Wh extends ii{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class bv extends ii{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Av{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&Tv(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=mr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=mr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Uh();return this.mutations.forEach((s=>{const i=e.get(s.key),a=i.overlayedDocument;let c=this.applyToLocalView(a,i.mutatedFields);c=t.has(s.key)?null:c;const u=Hh(a,c);u!==null&&r.set(s.key,u),a.isValidDocument()||a.convertToNoDocument(j.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),G())}isEqual(e){return this.batchId===e.batchId&&Pn(this.mutations,e.mutations,((t,r)=>kl(t,r)))&&Pn(this.baseMutations,e.baseMutations,((t,r)=>kl(t,r)))}}class Jo{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){J(e.mutations.length===r.length,58842,{Ve:e.mutations.length,me:r.length});let s=(function(){return dv})();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new Jo(e,t,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rv{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sv{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ce,K;function Cv(n){switch(n){case P.OK:return $(64938);case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return $(15467,{code:n})}}function Gh(n){if(n===void 0)return gt("GRPC error has no .code"),P.UNKNOWN;switch(n){case ce.OK:return P.OK;case ce.CANCELLED:return P.CANCELLED;case ce.UNKNOWN:return P.UNKNOWN;case ce.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case ce.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case ce.INTERNAL:return P.INTERNAL;case ce.UNAVAILABLE:return P.UNAVAILABLE;case ce.UNAUTHENTICATED:return P.UNAUTHENTICATED;case ce.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case ce.NOT_FOUND:return P.NOT_FOUND;case ce.ALREADY_EXISTS:return P.ALREADY_EXISTS;case ce.PERMISSION_DENIED:return P.PERMISSION_DENIED;case ce.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case ce.ABORTED:return P.ABORTED;case ce.OUT_OF_RANGE:return P.OUT_OF_RANGE;case ce.UNIMPLEMENTED:return P.UNIMPLEMENTED;case ce.DATA_LOSS:return P.DATA_LOSS;default:return $(39323,{code:n})}}(K=ce||(ce={}))[K.OK=0]="OK",K[K.CANCELLED=1]="CANCELLED",K[K.UNKNOWN=2]="UNKNOWN",K[K.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",K[K.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",K[K.NOT_FOUND=5]="NOT_FOUND",K[K.ALREADY_EXISTS=6]="ALREADY_EXISTS",K[K.PERMISSION_DENIED=7]="PERMISSION_DENIED",K[K.UNAUTHENTICATED=16]="UNAUTHENTICATED",K[K.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",K[K.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",K[K.ABORTED=10]="ABORTED",K[K.OUT_OF_RANGE=11]="OUT_OF_RANGE",K[K.UNIMPLEMENTED=12]="UNIMPLEMENTED",K[K.INTERNAL=13]="INTERNAL",K[K.UNAVAILABLE=14]="UNAVAILABLE",K[K.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pv=new Dt([4294967295,4294967295],0);function xl(n){const e=ph().encode(n),t=new oh;return t.update(e),new Uint8Array(t.digest())}function Vl(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Dt([t,r],0),new Dt([s,i],0)]}class Yo{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new cr(`Invalid padding: ${t}`);if(r<0)throw new cr(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new cr(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new cr(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=Dt.fromNumber(this.fe)}pe(e,t,r){let s=e.add(t.multiply(Dt.fromNumber(r)));return s.compare(Pv)===1&&(s=new Dt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=xl(e),[r,s]=Vl(t);for(let i=0;i<this.hashCount;i++){const a=this.pe(r,s,i);if(!this.ye(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new Yo(i,s,t);return r.forEach((c=>a.insert(c))),a}insert(e){if(this.fe===0)return;const t=xl(e),[r,s]=Vl(t);for(let i=0;i<this.hashCount;i++){const a=this.pe(r,s,i);this.we(a)}}we(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class cr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oi{constructor(e,t,r,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,Lr.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new oi(j.min(),s,new re(z),_t(),G())}}class Lr{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Lr(r,t,G(),G(),G())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Es{constructor(e,t,r,s){this.Se=e,this.removedTargetIds=t,this.key=r,this.be=s}}class Kh{constructor(e,t){this.targetId=e,this.De=t}}class Qh{constructor(e,t,r=we.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class Ol{constructor(){this.ve=0,this.Ce=Ll(),this.Fe=we.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=G(),t=G(),r=G();return this.Ce.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:$(38017,{changeType:i})}})),new Lr(this.Fe,this.Me,e,t,r)}ke(){this.xe=!1,this.Ce=Ll()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,J(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class kv{constructor(e){this.We=e,this.Ge=new Map,this.ze=_t(),this.je=us(),this.Je=us(),this.He=new re(z)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const r=this.tt(t);switch(e.state){case 0:this.nt(t)&&r.Be(e.resumeToken);break;case 1:r.Ue(),r.Oe||r.ke(),r.Be(e.resumeToken);break;case 2:r.Ue(),r.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(r.Ke(),r.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),r.Be(e.resumeToken));break;default:$(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((r,s)=>{this.nt(s)&&t(s)}))}it(e){const t=e.targetId,r=e.De.count,s=this.st(t);if(s){const i=s.target;if(go(i))if(r===0){const a=new U(i.path);this.Xe(t,a,Se.newNoDocument(a,j.min()))}else J(r===1,20013,{expectedCount:r});else{const a=this.ot(t);if(a!==r){const c=this._t(e),u=c?this.ut(c,e,a):1;if(u!==0){this.rt(t);const d=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,d)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let a,c;try{a=Ft(r).toUint8Array()}catch(u){if(u instanceof yh)return Lt("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new Yo(a,s,i)}catch(u){return Lt(u instanceof cr?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.fe===0?null:c}ut(e,t,r){return t.De.count===r-this.ht(e,t.targetId)?0:2}ht(e,t){const r=this.We.getRemoteKeysForTarget(t);let s=0;return r.forEach((i=>{const a=this.We.lt(),c=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.Xe(t,i,null),s++)})),s}Pt(e){const t=new Map;this.Ge.forEach(((i,a)=>{const c=this.st(a);if(c){if(i.current&&go(c.target)){const u=new U(c.target.path);this.Tt(u).has(a)||this.It(a,u)||this.Xe(a,u,Se.newNoDocument(u,e))}i.Ne&&(t.set(a,i.Le()),i.ke())}}));let r=G();this.Je.forEach(((i,a)=>{let c=!0;a.forEachWhile((u=>{const d=this.st(u);return!d||d.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(i))})),this.ze.forEach(((i,a)=>a.setReadTime(e)));const s=new oi(e,t,this.He,this.ze,r);return this.ze=_t(),this.je=us(),this.Je=us(),this.He=new re(z),s}Ze(e,t){if(!this.nt(e))return;const r=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,r),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,r){if(!this.nt(e))return;const s=this.tt(e);this.It(e,t)?s.qe(t,1):s.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),r&&(this.ze=this.ze.insert(t,r))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new Ol,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new fe(z),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new fe(z),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||V("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new Ol),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function us(){return new re(U.comparator)}function Ll(){return new re(U.comparator)}const Nv={asc:"ASCENDING",desc:"DESCENDING"},Dv={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},xv={and:"AND",or:"OR"};class Vv{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function vo(n,e){return n.useProto3Json||Zs(e)?e:{value:e}}function Ms(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Jh(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Ov(n,e){return Ms(n,e.toTimestamp())}function et(n){return J(!!n,49232),j.fromTimestamp((function(t){const r=Ut(t);return new ne(r.seconds,r.nanos)})(n))}function Xo(n,e){return yo(n,e).canonicalString()}function yo(n,e){const t=(function(s){return new X(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Yh(n){const e=X.fromString(n);return J(nd(e),10190,{key:e.toString()}),e}function wo(n,e){return Xo(n.databaseId,e.path)}function Ji(n,e){const t=Yh(e);if(t.get(1)!==n.databaseId.projectId)throw new x(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new x(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new U(Zh(t))}function Xh(n,e){return Xo(n.databaseId,e)}function Lv(n){const e=Yh(n);return e.length===4?X.emptyPath():Zh(e)}function Eo(n){return new X(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Zh(n){return J(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Ml(n,e,t){return{name:wo(n,e),fields:t.value.mapValue.fields}}function Mv(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:$(39313,{state:d})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(d,f){return d.useProto3Json?(J(f===void 0||typeof f=="string",58123),we.fromBase64String(f||"")):(J(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),we.fromUint8Array(f||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&(function(d){const f=d.code===void 0?P.UNKNOWN:Gh(d.code);return new x(f,d.message||"")})(a);t=new Qh(r,s,i,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Ji(n,r.document.name),i=et(r.document.updateTime),a=r.document.createTime?et(r.document.createTime):j.min(),c=new xe({mapValue:{fields:r.document.fields}}),u=Se.newFoundDocument(s,i,a,c),d=r.targetIds||[],f=r.removedTargetIds||[];t=new Es(d,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Ji(n,r.document),i=r.readTime?et(r.readTime):j.min(),a=Se.newNoDocument(s,i),c=r.removedTargetIds||[];t=new Es([],c,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Ji(n,r.document),i=r.removedTargetIds||[];t=new Es([],i,s,null)}else{if(!("filter"in e))return $(11601,{At:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new Sv(s,i),c=r.targetId;t=new Kh(c,a)}}return t}function Uv(n,e){let t;if(e instanceof Or)t={update:Ml(n,e.key,e.value)};else if(e instanceof Wh)t={delete:wo(n,e.key)};else if(e instanceof Kt)t={update:Ml(n,e.key,e.data),updateMask:Gv(e.fieldMask)};else{if(!(e instanceof bv))return $(16599,{Rt:e.type});t={verify:wo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,a){const c=a.transform;if(c instanceof br)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Ar)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Rr)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof Ls)return{fieldPath:a.field.canonicalString(),increment:c.Ee};throw $(20930,{transform:a.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:Ov(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:$(27497)})(n,e.precondition)),t}function Fv(n,e){return n&&n.length>0?(J(e!==void 0,14353),n.map((t=>(function(s,i){let a=s.updateTime?et(s.updateTime):et(i);return a.isEqual(j.min())&&(a=et(i)),new Ev(a,s.transformResults||[])})(t,e)))):[]}function Bv(n,e){return{documents:[Xh(n,e.path)]}}function $v(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Xh(n,s);const i=(function(d){if(d.length!==0)return td(We.create(d,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const a=(function(d){if(d.length!==0)return d.map((f=>(function(g){return{field:Tn(g.field),direction:Hv(g.dir)}})(f)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const c=vo(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(d){return{before:d.inclusive,values:d.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(d){return{before:!d.inclusive,values:d.position}})(e.endAt)),{Vt:t,parent:s}}function qv(n){let e=Lv(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){J(r===1,65062);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=(function(m){const g=ed(m);return g instanceof We&&Ph(g)?g.getFilters():[g]})(t.where));let a=[];t.orderBy&&(a=(function(m){return m.map((g=>(function(I){return new Ir(In(I.field),(function(C){switch(C){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(I.direction))})(g)))})(t.orderBy));let c=null;t.limit&&(c=(function(m){let g;return g=typeof m=="object"?m.value:m,Zs(g)?null:g})(t.limit));let u=null;t.startAt&&(u=(function(m){const g=!!m.before,R=m.values||[];return new Vs(R,g)})(t.startAt));let d=null;return t.endAt&&(d=(function(m){const g=!m.before,R=m.values||[];return new Vs(R,g)})(t.endAt)),av(e,s,a,i,c,"F",u,d)}function jv(n,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return $(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function ed(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=In(t.unaryFilter.field);return le.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=In(t.unaryFilter.field);return le.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=In(t.unaryFilter.field);return le.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=In(t.unaryFilter.field);return le.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return $(61313);default:return $(60726)}})(n):n.fieldFilter!==void 0?(function(t){return le.create(In(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return $(58110);default:return $(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return We.create(t.compositeFilter.filters.map((r=>ed(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return $(1026)}})(t.compositeFilter.op))})(n):$(30097,{filter:n})}function Hv(n){return Nv[n]}function zv(n){return Dv[n]}function Wv(n){return xv[n]}function Tn(n){return{fieldPath:n.canonicalString()}}function In(n){return ye.fromServerFormat(n.fieldPath)}function td(n){return n instanceof le?(function(t){if(t.op==="=="){if(bl(t.value))return{unaryFilter:{field:Tn(t.field),op:"IS_NAN"}};if(Il(t.value))return{unaryFilter:{field:Tn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(bl(t.value))return{unaryFilter:{field:Tn(t.field),op:"IS_NOT_NAN"}};if(Il(t.value))return{unaryFilter:{field:Tn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Tn(t.field),op:zv(t.op),value:t.value}}})(n):n instanceof We?(function(t){const r=t.getFilters().map((s=>td(s)));return r.length===1?r[0]:{compositeFilter:{op:Wv(t.op),filters:r}}})(n):$(54877,{filter:n})}function Gv(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function nd(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e,t,r,s,i=j.min(),a=j.min(),c=we.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new Ct(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kv{constructor(e){this.gt=e}}function Qv(n){const e=qv({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Os(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jv{constructor(){this.Dn=new Yv}addToCollectionParentIndex(e,t){return this.Dn.add(t),k.resolve()}getCollectionParents(e,t){return k.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return k.resolve()}deleteFieldIndex(e,t){return k.resolve()}deleteAllFieldIndexes(e){return k.resolve()}createTargetIndexes(e,t){return k.resolve()}getDocumentsMatchingTarget(e,t){return k.resolve(null)}getIndexType(e,t){return k.resolve(0)}getFieldIndexes(e,t){return k.resolve([])}getNextCollectionGroupToUpdate(e){return k.resolve(null)}getMinOffset(e,t){return k.resolve(Mt.min())}getMinOffsetFromCollectionGroup(e,t){return k.resolve(Mt.min())}updateCollectionGroup(e,t,r){return k.resolve()}updateIndexEntries(e,t){return k.resolve()}}class Yv{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new fe(X.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new fe(X.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ul={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},rd=41943040;class De{static withCacheSize(e){return new De(e,De.DEFAULT_COLLECTION_PERCENTILE,De.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */De.DEFAULT_COLLECTION_PERCENTILE=10,De.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,De.DEFAULT=new De(rd,De.DEFAULT_COLLECTION_PERCENTILE,De.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),De.DISABLED=new De(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new Dn(0)}static ur(){return new Dn(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fl="LruGarbageCollector",Xv=1048576;function Bl([n,e],[t,r]){const s=z(n,t);return s===0?z(e,r):s}class Zv{constructor(e){this.Tr=e,this.buffer=new fe(Bl),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();Bl(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class ey{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){V(Fl,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Un(t)?V(Fl,"Ignoring IndexedDB error during garbage collection: ",t):await Mn(t)}await this.Rr(3e5)}))}}class ty{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return k.resolve(Xs.ue);const r=new Zv(t);return this.Vr.forEachTarget(e,(s=>r.Er(s.sequenceNumber))).next((()=>this.Vr.gr(e,(s=>r.Er(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.Vr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(V("LruGarbageCollector","Garbage collection skipped; disabled"),k.resolve(Ul)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(V("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Ul):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let r,s,i,a,c,u,d;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((m=>(m>this.params.maximumSequenceNumbersToCollect?(V("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),s=this.params.maximumSequenceNumbersToCollect):s=m,a=Date.now(),this.nthSequenceNumber(e,s)))).next((m=>(r=m,c=Date.now(),this.removeTargets(e,r,t)))).next((m=>(i=m,u=Date.now(),this.removeOrphanedDocuments(e,r)))).next((m=>(d=Date.now(),wn()<=W.DEBUG&&V("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-f}ms
	Determined least recently used ${s} in `+(c-a)+`ms
	Removed ${i} targets in `+(u-c)+`ms
	Removed ${m} documents in `+(d-u)+`ms
Total Duration: ${d-f}ms`),k.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:m}))))}}function ny(n,e){return new ty(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ry{constructor(){this.changes=new pn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Se.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?k.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sy{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iy{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&mr(r.mutation,s,Le.empty(),ne.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,G()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=G()){const s=en();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let a=ar();return i.forEach(((c,u)=>{a=a.insert(c,u.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const r=en();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,G())))}populateOverlays(e,t,r){const s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((a,c)=>{t.set(a,c)}))}))}computeViews(e,t,r,s){let i=_t();const a=pr(),c=(function(){return pr()})();return t.forEach(((u,d)=>{const f=r.get(d.key);s.has(d.key)&&(f===void 0||f.mutation instanceof Kt)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),mr(f.mutation,d,f.mutation.getFieldMask(),ne.now())):a.set(d.key,Le.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((d,f)=>a.set(d,f))),t.forEach(((d,f)=>{var m;return c.set(d,new sy(f,(m=a.get(d))!==null&&m!==void 0?m:null))})),c)))}recalculateAndSaveOverlays(e,t){const r=pr();let s=new re(((a,c)=>a-c)),i=G();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const c of a)c.keys().forEach((u=>{const d=t.get(u);if(d===null)return;let f=r.get(u)||Le.empty();f=c.applyToLocalView(d,f),r.set(u,f);const m=(s.get(c.batchId)||G()).add(u);s=s.insert(c.batchId,m)}))})).next((()=>{const a=[],c=s.getReverseIterator();for(;c.hasNext();){const u=c.getNext(),d=u.key,f=u.value,m=Uh();f.forEach((g=>{if(!i.has(g)){const R=Hh(t.get(g),r.get(g));R!==null&&m.set(g,R),i=i.add(g)}})),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return k.waitFor(a)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return(function(a){return U.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):xh(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):k.resolve(en());let c=yr,u=i;return a.next((d=>k.forEach(d,((f,m)=>(c<m.largestBatchId&&(c=m.largestBatchId),i.get(f)?k.resolve():this.remoteDocumentCache.getEntry(e,f).next((g=>{u=u.insert(f,g)}))))).next((()=>this.populateOverlays(e,d,i))).next((()=>this.computeViews(e,u,d,G()))).next((f=>({batchId:c,changes:Mh(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new U(t)).next((r=>{let s=ar();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let a=ar();return this.indexManager.getCollectionParents(e,i).next((c=>k.forEach(c,(u=>{const d=(function(m,g){return new Fn(g,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next((f=>{f.forEach(((m,g)=>{a=a.insert(m,g)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((a=>{i.forEach(((u,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Se.newInvalidDocument(f)))}));let c=ar();return a.forEach(((u,d)=>{const f=i.get(u);f!==void 0&&mr(f.mutation,d,Le.empty(),ne.now()),ri(t,d)&&(c=c.insert(u,d))})),c}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oy{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return k.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:et(s.createTime)}})(t)),k.resolve()}getNamedQuery(e,t){return k.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(s){return{name:s.name,query:Qv(s.bundledQuery),readTime:et(s.readTime)}})(t)),k.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ay{constructor(){this.overlays=new re(U.comparator),this.kr=new Map}getOverlay(e,t){return k.resolve(this.overlays.get(t))}getOverlays(e,t){const r=en();return k.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.wt(e,t,i)})),k.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.kr.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.kr.delete(r)),k.resolve()}getOverlaysForCollection(e,t,r){const s=en(),i=t.length+1,a=new U(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const u=c.getNext().value,d=u.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===i&&u.largestBatchId>r&&s.set(u.getKey(),u)}return k.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new re(((d,f)=>d-f));const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let f=i.get(d.largestBatchId);f===null&&(f=en(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const c=en(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((d,f)=>c.set(d,f))),!(c.size()>=s)););return k.resolve(c)}wt(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.kr.get(s.largestBatchId).delete(r.key);this.kr.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new Rv(t,r));let i=this.kr.get(t);i===void 0&&(i=G(),this.kr.set(t,i)),this.kr.set(t,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cy{constructor(){this.sessionToken=we.EMPTY_BYTE_STRING}getSessionToken(e){return k.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,k.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo{constructor(){this.qr=new fe(pe.Qr),this.$r=new fe(pe.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const r=new pe(e,t);this.qr=this.qr.add(r),this.$r=this.$r.add(r)}Kr(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Wr(new pe(e,t))}Gr(e,t){e.forEach((r=>this.removeReference(r,t)))}zr(e){const t=new U(new X([])),r=new pe(t,e),s=new pe(t,e+1),i=[];return this.$r.forEachInRange([r,s],(a=>{this.Wr(a),i.push(a.key)})),i}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new U(new X([])),r=new pe(t,e),s=new pe(t,e+1);let i=G();return this.$r.forEachInRange([r,s],(a=>{i=i.add(a.key)})),i}containsKey(e){const t=new pe(e,0),r=this.qr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class pe{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return U.comparator(e.key,t.key)||z(e.Hr,t.Hr)}static Ur(e,t){return z(e.Hr,t.Hr)||U.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ly{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new fe(pe.Qr)}checkEmpty(e){return k.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Av(i,t,r,s);this.mutationQueue.push(a);for(const c of s)this.Yr=this.Yr.add(new pe(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return k.resolve(a)}lookupMutationBatch(e,t){return k.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.Xr(r),i=s<0?0:s;return k.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return k.resolve(this.mutationQueue.length===0?Ho:this.er-1)}getAllMutationBatches(e){return k.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new pe(t,0),s=new pe(t,Number.POSITIVE_INFINITY),i=[];return this.Yr.forEachInRange([r,s],(a=>{const c=this.Zr(a.Hr);i.push(c)})),k.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new fe(z);return t.forEach((s=>{const i=new pe(s,0),a=new pe(s,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([i,a],(c=>{r=r.add(c.Hr)}))})),k.resolve(this.ei(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;U.isDocumentKey(i)||(i=i.child(""));const a=new pe(new U(i),0);let c=new fe(z);return this.Yr.forEachWhile((u=>{const d=u.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(c=c.add(u.Hr)),!0)}),a),k.resolve(this.ei(c))}ei(e){const t=[];return e.forEach((r=>{const s=this.Zr(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){J(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Yr;return k.forEach(t.mutations,(s=>{const i=new pe(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.Yr=r}))}rr(e){}containsKey(e,t){const r=new pe(t,0),s=this.Yr.firstAfterOrEqual(r);return k.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,k.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uy{constructor(e){this.ni=e,this.docs=(function(){return new re(U.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,a=this.ni(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return k.resolve(r?r.document.mutableCopy():Se.newInvalidDocument(t))}getEntries(e,t){let r=_t();return t.forEach((s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Se.newInvalidDocument(s))})),k.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let i=_t();const a=t.path,c=new U(a.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(c);for(;u.hasNext();){const{key:d,value:{document:f}}=u.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||F_(U_(f),r)<=0||(s.has(f.key)||ri(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return k.resolve(i)}getAllFromCollectionGroup(e,t,r,s){$(9500)}ri(e,t){return k.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new hy(this)}getSize(e){return k.resolve(this.size)}}class hy extends ry{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.Or.addEntry(e,s)):this.Or.removeEntry(r)})),k.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dy{constructor(e){this.persistence=e,this.ii=new pn((t=>Go(t)),Ko),this.lastRemoteSnapshotVersion=j.min(),this.highestTargetId=0,this.si=0,this.oi=new Zo,this.targetCount=0,this._i=Dn.ar()}forEachTarget(e,t){return this.ii.forEach(((r,s)=>t(s))),k.resolve()}getLastRemoteSnapshotVersion(e){return k.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return k.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),k.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.si&&(this.si=t),k.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Dn(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,k.resolve()}updateTargetData(e,t){return this.hr(t),k.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,k.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.ii.forEach(((a,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.ii.delete(a),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),k.waitFor(i).next((()=>s))}getTargetCount(e){return k.resolve(this.targetCount)}getTargetData(e,t){const r=this.ii.get(t)||null;return k.resolve(r)}addMatchingKeys(e,t,r){return this.oi.Kr(t,r),k.resolve()}removeMatchingKeys(e,t,r){this.oi.Gr(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((a=>{i.push(s.markPotentiallyOrphaned(e,a))})),k.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),k.resolve()}getMatchingKeysForTargetId(e,t){const r=this.oi.Jr(t);return k.resolve(r)}containsKey(e,t){return k.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sd{constructor(e,t){this.ai={},this.overlays={},this.ui=new Xs(0),this.ci=!1,this.ci=!0,this.li=new cy,this.referenceDelegate=e(this),this.hi=new dy(this),this.indexManager=new Jv,this.remoteDocumentCache=(function(s){return new uy(s)})((r=>this.referenceDelegate.Pi(r))),this.serializer=new Kv(t),this.Ti=new oy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new ay,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.ai[e.toKey()];return r||(r=new ly(t,this.referenceDelegate),this.ai[e.toKey()]=r),r}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,r){V("MemoryPersistence","Starting transaction:",e);const s=new fy(this.ui.next());return this.referenceDelegate.Ii(),r(s).next((i=>this.referenceDelegate.di(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Ei(e,t){return k.or(Object.values(this.ai).map((r=>()=>r.containsKey(e,t))))}}class fy extends $_{constructor(e){super(),this.currentSequenceNumber=e}}class ea{constructor(e){this.persistence=e,this.Ai=new Zo,this.Ri=null}static Vi(e){return new ea(e)}get mi(){if(this.Ri)return this.Ri;throw $(60996)}addReference(e,t,r){return this.Ai.addReference(r,t),this.mi.delete(r.toString()),k.resolve()}removeReference(e,t,r){return this.Ai.removeReference(r,t),this.mi.add(r.toString()),k.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),k.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((s=>this.mi.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.mi.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return k.forEach(this.mi,(r=>{const s=U.fromPath(r);return this.fi(e,s).next((i=>{i||t.removeEntry(s,j.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((r=>{r?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return k.or([()=>k.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Us{constructor(e,t){this.persistence=e,this.gi=new pn((r=>H_(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=ny(this,t)}static Vi(e,t){return new Us(e,t)}Ii(){}di(e){return k.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}yr(e){let t=0;return this.gr(e,(r=>{t++})).next((()=>t))}gr(e,t){return k.forEach(this.gi,((r,s)=>this.Sr(e,r,s).next((i=>i?k.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ri(e,(a=>this.Sr(e,a,t).next((c=>{c||(r++,i.removeEntry(a,j.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),k.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.gi.set(r,e.currentSequenceNumber),k.resolve()}removeReference(e,t,r){return this.gi.set(r,e.currentSequenceNumber),k.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),k.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=vs(e.data.value)),t}Sr(e,t,r){return k.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.gi.get(t);return k.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ta{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Is=r,this.ds=s}static Es(e,t){let r=G(),s=G();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new ta(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class py{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class my{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return Wf()?8:q_(Ce())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.ps(e,t).next((a=>{i.result=a})).next((()=>{if(!i.result)return this.ys(e,t,s,r).next((a=>{i.result=a}))})).next((()=>{if(i.result)return;const a=new py;return this.ws(e,t,a).next((c=>{if(i.result=c,this.Rs)return this.Ss(e,t,a,c.size)}))})).next((()=>i.result))}Ss(e,t,r,s){return r.documentReadCount<this.Vs?(wn()<=W.DEBUG&&V("QueryEngine","SDK will not create cache indexes for query:",En(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),k.resolve()):(wn()<=W.DEBUG&&V("QueryEngine","Query:",En(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.fs*s?(wn()<=W.DEBUG&&V("QueryEngine","The SDK decides to create cache indexes for query:",En(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ze(t))):k.resolve())}ps(e,t){if(Cl(t))return k.resolve(null);let r=Ze(t);return this.indexManager.getIndexType(e,r).next((s=>s===0?null:(t.limit!==null&&s===1&&(t=Os(t,null,"F"),r=Ze(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next((i=>{const a=G(...i);return this.gs.getDocuments(e,a).next((c=>this.indexManager.getMinOffset(e,r).next((u=>{const d=this.bs(t,c);return this.Ds(t,d,a,u.readTime)?this.ps(e,Os(t,null,"F")):this.vs(e,d,t,u)}))))})))))}ys(e,t,r,s){return Cl(t)||s.isEqual(j.min())?k.resolve(null):this.gs.getDocuments(e,r).next((i=>{const a=this.bs(t,i);return this.Ds(t,a,r,s)?k.resolve(null):(wn()<=W.DEBUG&&V("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),En(t)),this.vs(e,a,t,M_(s,yr)).next((c=>c)))}))}bs(e,t){let r=new fe(Oh(e));return t.forEach(((s,i)=>{ri(e,i)&&(r=r.add(i))})),r}Ds(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}ws(e,t,r){return wn()<=W.DEBUG&&V("QueryEngine","Using full collection scan to execute query:",En(t)),this.gs.getDocumentsMatchingQuery(e,t,Mt.min(),r)}vs(e,t,r,s){return this.gs.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((a=>{i=i.insert(a.key,a)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const na="LocalStore",gy=3e8;class _y{constructor(e,t,r,s){this.persistence=e,this.Cs=t,this.serializer=s,this.Fs=new re(z),this.Ms=new pn((i=>Go(i)),Ko),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(r)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new iy(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function vy(n,e,t,r){return new _y(n,e,t,r)}async function id(n,e){const t=H(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.Ns(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{const a=[],c=[];let u=G();for(const d of s){a.push(d.batchId);for(const f of d.mutations)u=u.add(f.key)}for(const d of i){c.push(d.batchId);for(const f of d.mutations)u=u.add(f.key)}return t.localDocuments.getDocuments(r,u).next((d=>({Bs:d,removedBatchIds:a,addedBatchIds:c})))}))}))}function yy(n,e){const t=H(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=e.batch.keys(),i=t.Os.newChangeBuffer({trackRemovals:!0});return(function(c,u,d,f){const m=d.batch,g=m.keys();let R=k.resolve();return g.forEach((I=>{R=R.next((()=>f.getEntry(u,I))).next((N=>{const C=d.docVersions.get(I);J(C!==null,48541),N.version.compareTo(C)<0&&(m.applyToRemoteDocument(N,d),N.isValidDocument()&&(N.setReadTime(d.commitVersion),f.addEntry(N)))}))})),R.next((()=>c.mutationQueue.removeMutationBatch(u,m)))})(t,r,e,i).next((()=>i.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(c){let u=G();for(let d=0;d<c.mutationResults.length;++d)c.mutationResults[d].transformResults.length>0&&(u=u.add(c.batch.mutations[d].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(r,s)))}))}function od(n){const e=H(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function wy(n,e){const t=H(n),r=e.snapshotVersion;let s=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const a=t.Os.newChangeBuffer({trackRemovals:!0});s=t.Fs;const c=[];e.targetChanges.forEach(((f,m)=>{const g=s.get(m);if(!g)return;c.push(t.hi.removeMatchingKeys(i,f.removedDocuments,m).next((()=>t.hi.addMatchingKeys(i,f.addedDocuments,m))));let R=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?R=R.withResumeToken(we.EMPTY_BYTE_STRING,j.min()).withLastLimboFreeSnapshotVersion(j.min()):f.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(f.resumeToken,r)),s=s.insert(m,R),(function(N,C,O){return N.resumeToken.approximateByteSize()===0||C.snapshotVersion.toMicroseconds()-N.snapshotVersion.toMicroseconds()>=gy?!0:O.addedDocuments.size+O.modifiedDocuments.size+O.removedDocuments.size>0})(g,R,f)&&c.push(t.hi.updateTargetData(i,R))}));let u=_t(),d=G();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))})),c.push(Ey(i,a,e.documentUpdates).next((f=>{u=f.Ls,d=f.ks}))),!r.isEqual(j.min())){const f=t.hi.getLastRemoteSnapshotVersion(i).next((m=>t.hi.setTargetsMetadata(i,i.currentSequenceNumber,r)));c.push(f)}return k.waitFor(c).next((()=>a.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,d))).next((()=>u))})).then((i=>(t.Fs=s,i)))}function Ey(n,e,t){let r=G(),s=G();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let a=_t();return t.forEach(((c,u)=>{const d=i.get(c);u.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(c)),u.isNoDocument()&&u.version.isEqual(j.min())?(e.removeEntry(c,u.readTime),a=a.insert(c,u)):!d.isValidDocument()||u.version.compareTo(d.version)>0||u.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(u),a=a.insert(c,u)):V(na,"Ignoring outdated watch update for ",c,". Current version:",d.version," Watch version:",u.version)})),{Ls:a,ks:s}}))}function Ty(n,e){const t=H(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=Ho),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function Iy(n,e){const t=H(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.hi.getTargetData(r,e).next((i=>i?(s=i,k.resolve(s)):t.hi.allocateTargetId(r).next((a=>(s=new Ct(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.hi.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=t.Fs.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(r.targetId,r),t.Ms.set(e,r.targetId)),r}))}async function To(n,e,t){const r=H(n),s=r.Fs.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(a=>r.persistence.referenceDelegate.removeTarget(a,s)))}catch(a){if(!Un(a))throw a;V(na,`Failed to update sequence numbers for target ${e}: ${a}`)}r.Fs=r.Fs.remove(e),r.Ms.delete(s.target)}function $l(n,e,t){const r=H(n);let s=j.min(),i=G();return r.persistence.runTransaction("Execute query","readwrite",(a=>(function(u,d,f){const m=H(u),g=m.Ms.get(f);return g!==void 0?k.resolve(m.Fs.get(g)):m.hi.getTargetData(d,f)})(r,a,Ze(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.hi.getMatchingKeysForTargetId(a,c.targetId).next((u=>{i=u}))})).next((()=>r.Cs.getDocumentsMatchingQuery(a,e,t?s:j.min(),t?i:G()))).next((c=>(by(r,lv(e),c),{documents:c,qs:i})))))}function by(n,e,t){let r=n.xs.get(e)||j.min();t.forEach(((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)})),n.xs.set(e,r)}class ql{constructor(){this.activeTargetIds=mv()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Ay{constructor(){this.Fo=new ql,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,r){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new ql,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ry{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jl="ConnectivityMonitor";class Hl{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){V(jl,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){V(jl,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let hs=null;function Io(){return hs===null?hs=(function(){return 268435456+Math.round(2147483648*Math.random())})():hs++,"0x"+hs.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yi="RestConnection",Sy={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Cy{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${r}/databases/${s}`,this.Ko=this.databaseId.database===Ds?`project_id=${r}`:`project_id=${r}&database_id=${s}`}Wo(e,t,r,s,i){const a=Io(),c=this.Go(e,t.toUriEncodedString());V(Yi,`Sending RPC '${e}' ${a}:`,c,r);const u={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(u,s,i);const{host:d}=new URL(c),f=hn(d);return this.jo(e,c,u,r,f).then((m=>(V(Yi,`Received RPC '${e}' ${a}: `,m),m)),(m=>{throw Lt(Yi,`RPC '${e}' ${a} failed with error: `,m,"url: ",c,"request:",r),m}))}Jo(e,t,r,s,i,a){return this.Wo(e,t,r,s,i)}zo(e,t,r){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Ln})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s))}Go(e,t){const r=Sy[e];return`${this.$o}/v1/${t}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Py{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ae="WebChannelConnection";class ky extends Cy{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,r,s,i){const a=Io();return new Promise(((c,u)=>{const d=new ah;d.setWithCredentials(!0),d.listenOnce(ch.COMPLETE,(()=>{try{switch(d.getLastErrorCode()){case _s.NO_ERROR:const m=d.getResponseJson();V(Ae,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(m)),c(m);break;case _s.TIMEOUT:V(Ae,`RPC '${e}' ${a} timed out`),u(new x(P.DEADLINE_EXCEEDED,"Request time out"));break;case _s.HTTP_ERROR:const g=d.getStatus();if(V(Ae,`RPC '${e}' ${a} failed with status:`,g,"response text:",d.getResponseText()),g>0){let R=d.getResponseJson();Array.isArray(R)&&(R=R[0]);const I=R==null?void 0:R.error;if(I&&I.status&&I.message){const N=(function(O){const F=O.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(F)>=0?F:P.UNKNOWN})(I.status);u(new x(N,I.message))}else u(new x(P.UNKNOWN,"Server responded with status "+d.getStatus()))}else u(new x(P.UNAVAILABLE,"Connection failed."));break;default:$(9055,{c_:e,streamId:a,l_:d.getLastErrorCode(),h_:d.getLastError()})}}finally{V(Ae,`RPC '${e}' ${a} completed.`)}}));const f=JSON.stringify(s);V(Ae,`RPC '${e}' ${a} sending request:`,s),d.send(t,"POST",f,r,15)}))}P_(e,t,r){const s=Io(),i=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=hh(),c=uh(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(u.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(u.useFetchStreams=!0),this.zo(u.initMessageHeaders,t,r),u.encodeInitMessageHeaders=!0;const f=i.join("");V(Ae,`Creating RPC '${e}' stream ${s}: ${f}`,u);const m=a.createWebChannel(f,u);this.T_(m);let g=!1,R=!1;const I=new Py({Ho:C=>{R?V(Ae,`Not sending because RPC '${e}' stream ${s} is closed:`,C):(g||(V(Ae,`Opening RPC '${e}' stream ${s} transport.`),m.open(),g=!0),V(Ae,`RPC '${e}' stream ${s} sending:`,C),m.send(C))},Yo:()=>m.close()}),N=(C,O,F)=>{C.listen(O,(M=>{try{F(M)}catch(q){setTimeout((()=>{throw q}),0)}}))};return N(m,or.EventType.OPEN,(()=>{R||(V(Ae,`RPC '${e}' stream ${s} transport opened.`),I.s_())})),N(m,or.EventType.CLOSE,(()=>{R||(R=!0,V(Ae,`RPC '${e}' stream ${s} transport closed`),I.__(),this.I_(m))})),N(m,or.EventType.ERROR,(C=>{R||(R=!0,Lt(Ae,`RPC '${e}' stream ${s} transport errored. Name:`,C.name,"Message:",C.message),I.__(new x(P.UNAVAILABLE,"The operation could not be completed")))})),N(m,or.EventType.MESSAGE,(C=>{var O;if(!R){const F=C.data[0];J(!!F,16349);const M=F,q=(M==null?void 0:M.error)||((O=M[0])===null||O===void 0?void 0:O.error);if(q){V(Ae,`RPC '${e}' stream ${s} received error:`,q);const oe=q.status;let ee=(function(y){const w=ce[y];if(w!==void 0)return Gh(w)})(oe),E=q.message;ee===void 0&&(ee=P.INTERNAL,E="Unknown error status: "+oe+" with message "+q.message),R=!0,I.__(new x(ee,E)),m.close()}else V(Ae,`RPC '${e}' stream ${s} received:`,F),I.a_(F)}})),N(c,lh.STAT_EVENT,(C=>{C.stat===uo.PROXY?V(Ae,`RPC '${e}' stream ${s} detected buffering proxy`):C.stat===uo.NOPROXY&&V(Ae,`RPC '${e}' stream ${s} detected no buffering proxy`)})),setTimeout((()=>{I.o_()}),0),I}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function Xi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ai(n){return new Vv(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ad{constructor(e,t,r=1e3,s=1.5,i=6e4){this.Fi=e,this.timerId=t,this.d_=r,this.E_=s,this.A_=i,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),r=Math.max(0,Date.now()-this.m_),s=Math.max(0,t-r);s>0&&V("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,s,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zl="PersistentStream";class cd{constructor(e,t,r,s,i,a,c,u){this.Fi=e,this.w_=r,this.S_=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new ad(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(gt(t.toString()),gt("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.b_===t&&this.W_(r,s)}),(r=>{e((()=>{const s=new x(P.UNKNOWN,"Fetching auth token failed: "+r.message);return this.G_(s)}))}))}W_(e,t){const r=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{r((()=>this.listener.Zo()))})),this.stream.e_((()=>{r((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((s=>{r((()=>this.G_(s)))})),this.stream.onMessage((s=>{r((()=>++this.C_==1?this.j_(s):this.onNext(s)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return V(zl,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(V(zl,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Ny extends cd{constructor(e,t,r,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=Mv(this.serializer,e),r=(function(i){if(!("targetChange"in i))return j.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?j.min():a.readTime?et(a.readTime):j.min()})(e);return this.listener.J_(t,r)}H_(e){const t={};t.database=Eo(this.serializer),t.addTarget=(function(i,a){let c;const u=a.target;if(c=go(u)?{documents:Bv(i,u)}:{query:$v(i,u).Vt},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=Jh(i,a.resumeToken);const d=vo(i,a.expectedCount);d!==null&&(c.expectedCount=d)}else if(a.snapshotVersion.compareTo(j.min())>0){c.readTime=Ms(i,a.snapshotVersion.toTimestamp());const d=vo(i,a.expectedCount);d!==null&&(c.expectedCount=d)}return c})(this.serializer,e);const r=jv(this.serializer,e);r&&(t.labels=r),this.k_(t)}Y_(e){const t={};t.database=Eo(this.serializer),t.removeTarget=e,this.k_(t)}}class Dy extends cd{constructor(e,t,r,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return J(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,J(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){J(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=Fv(e.writeResults,e.commitTime),r=et(e.commitTime);return this.listener.ta(r,t)}na(){const e={};e.database=Eo(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>Uv(this.serializer,r)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xy{}class Vy extends xy{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.ra=!1}ia(){if(this.ra)throw new x(P.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,r,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,a])=>this.connection.Wo(e,yo(t,r),s,i,a))).catch((i=>{throw i.name==="FirebaseError"?(i.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new x(P.UNKNOWN,i.toString())}))}Jo(e,t,r,s,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,c])=>this.connection.Jo(e,yo(t,r),s,a,c,i))).catch((a=>{throw a.name==="FirebaseError"?(a.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new x(P.UNKNOWN,a.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class Oy{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(gt(t),this._a=!1):V("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const un="RemoteStore";class Ly{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=i,this.Ea.xo((a=>{r.enqueueAndForget((async()=>{mn(this)&&(V(un,"Restarting streams for network reachability change."),await(async function(u){const d=H(u);d.Ia.add(4),await Mr(d),d.Aa.set("Unknown"),d.Ia.delete(4),await ci(d)})(this))}))})),this.Aa=new Oy(r,s)}}async function ci(n){if(mn(n))for(const e of n.da)await e(!0)}async function Mr(n){for(const e of n.da)await e(!1)}function ld(n,e){const t=H(n);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),oa(t)?ia(t):Bn(t).x_()&&sa(t,e))}function ra(n,e){const t=H(n),r=Bn(t);t.Ta.delete(e),r.x_()&&ud(t,e),t.Ta.size===0&&(r.x_()?r.B_():mn(t)&&t.Aa.set("Unknown"))}function sa(n,e){if(n.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(j.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Bn(n).H_(e)}function ud(n,e){n.Ra.$e(e),Bn(n).Y_(e)}function ia(n){n.Ra=new kv({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),Bn(n).start(),n.Aa.aa()}function oa(n){return mn(n)&&!Bn(n).M_()&&n.Ta.size>0}function mn(n){return H(n).Ia.size===0}function hd(n){n.Ra=void 0}async function My(n){n.Aa.set("Online")}async function Uy(n){n.Ta.forEach(((e,t)=>{sa(n,e)}))}async function Fy(n,e){hd(n),oa(n)?(n.Aa.la(e),ia(n)):n.Aa.set("Unknown")}async function By(n,e,t){if(n.Aa.set("Online"),e instanceof Qh&&e.state===2&&e.cause)try{await(async function(s,i){const a=i.cause;for(const c of i.targetIds)s.Ta.has(c)&&(await s.remoteSyncer.rejectListen(c,a),s.Ta.delete(c),s.Ra.removeTarget(c))})(n,e)}catch(r){V(un,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Fs(n,r)}else if(e instanceof Es?n.Ra.Ye(e):e instanceof Kh?n.Ra.it(e):n.Ra.et(e),!t.isEqual(j.min()))try{const r=await od(n.localStore);t.compareTo(r)>=0&&await(function(i,a){const c=i.Ra.Pt(a);return c.targetChanges.forEach(((u,d)=>{if(u.resumeToken.approximateByteSize()>0){const f=i.Ta.get(d);f&&i.Ta.set(d,f.withResumeToken(u.resumeToken,a))}})),c.targetMismatches.forEach(((u,d)=>{const f=i.Ta.get(u);if(!f)return;i.Ta.set(u,f.withResumeToken(we.EMPTY_BYTE_STRING,f.snapshotVersion)),ud(i,u);const m=new Ct(f.target,u,d,f.sequenceNumber);sa(i,m)})),i.remoteSyncer.applyRemoteEvent(c)})(n,t)}catch(r){V(un,"Failed to raise snapshot:",r),await Fs(n,r)}}async function Fs(n,e,t){if(!Un(e))throw e;n.Ia.add(1),await Mr(n),n.Aa.set("Offline"),t||(t=()=>od(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{V(un,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await ci(n)}))}function dd(n,e){return e().catch((t=>Fs(n,t,e)))}async function li(n){const e=H(n),t=$t(e);let r=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Ho;for(;$y(e);)try{const s=await Ty(e.localStore,r);if(s===null){e.Pa.length===0&&t.B_();break}r=s.batchId,qy(e,s)}catch(s){await Fs(e,s)}fd(e)&&pd(e)}function $y(n){return mn(n)&&n.Pa.length<10}function qy(n,e){n.Pa.push(e);const t=$t(n);t.x_()&&t.Z_&&t.X_(e.mutations)}function fd(n){return mn(n)&&!$t(n).M_()&&n.Pa.length>0}function pd(n){$t(n).start()}async function jy(n){$t(n).na()}async function Hy(n){const e=$t(n);for(const t of n.Pa)e.X_(t.mutations)}async function zy(n,e,t){const r=n.Pa.shift(),s=Jo.from(r,e,t);await dd(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await li(n)}async function Wy(n,e){e&&$t(n).Z_&&await(async function(r,s){if((function(a){return Cv(a)&&a!==P.ABORTED})(s.code)){const i=r.Pa.shift();$t(r).N_(),await dd(r,(()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s))),await li(r)}})(n,e),fd(n)&&pd(n)}async function Wl(n,e){const t=H(n);t.asyncQueue.verifyOperationInProgress(),V(un,"RemoteStore received new credentials");const r=mn(t);t.Ia.add(3),await Mr(t),r&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await ci(t)}async function Gy(n,e){const t=H(n);e?(t.Ia.delete(2),await ci(t)):e||(t.Ia.add(2),await Mr(t),t.Aa.set("Unknown"))}function Bn(n){return n.Va||(n.Va=(function(t,r,s){const i=H(t);return i.ia(),new Ny(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{Zo:My.bind(null,n),e_:Uy.bind(null,n),n_:Fy.bind(null,n),J_:By.bind(null,n)}),n.da.push((async e=>{e?(n.Va.N_(),oa(n)?ia(n):n.Aa.set("Unknown")):(await n.Va.stop(),hd(n))}))),n.Va}function $t(n){return n.ma||(n.ma=(function(t,r,s){const i=H(t);return i.ia(),new Dy(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),e_:jy.bind(null,n),n_:Wy.bind(null,n),ea:Hy.bind(null,n),ta:zy.bind(null,n)}),n.da.push((async e=>{e?(n.ma.N_(),await li(n)):(await n.ma.stop(),n.Pa.length>0&&(V(un,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))}))),n.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aa{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new ft,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const a=Date.now()+r,c=new aa(e,t,a,s,i);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new x(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ca(n,e){if(gt("AsyncQueue",`${e}: ${n}`),Un(n))return new x(P.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn{static emptySet(e){return new Cn(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||U.comparator(t.key,r.key):(t,r)=>U.comparator(t.key,r.key),this.keyedMap=ar(),this.sortedSet=new re(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Cn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new Cn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gl{constructor(){this.fa=new re(U.comparator)}track(e){const t=e.doc.key,r=this.fa.get(t);r?e.type!==0&&r.type===3?this.fa=this.fa.insert(t,e):e.type===3&&r.type!==1?this.fa=this.fa.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.fa=this.fa.remove(t):e.type===1&&r.type===2?this.fa=this.fa.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):$(63341,{At:e,ga:r}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,r)=>{e.push(r)})),e}}class xn{constructor(e,t,r,s,i,a,c,u,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,i){const a=[];return t.forEach((c=>{a.push({type:0,doc:c})})),new xn(e,t,Cn.emptySet(t),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ni(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class Qy{constructor(){this.queries=Kl(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,r){const s=H(t),i=s.queries;s.queries=Kl(),i.forEach(((a,c)=>{for(const u of c.wa)u.onError(r)}))})(this,new x(P.ABORTED,"Firestore shutting down"))}}function Kl(){return new pn((n=>Vh(n)),ni)}async function la(n,e){const t=H(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.Sa()&&e.ba()&&(r=2):(i=new Ky,r=e.ba()?0:1);try{switch(r){case 0:i.ya=await t.onListen(s,!0);break;case 1:i.ya=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const c=ca(a,`Initialization of query '${En(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.wa.push(e),e.va(t.onlineState),i.ya&&e.Ca(i.ya)&&ha(t)}async function ua(n,e){const t=H(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const a=i.wa.indexOf(e);a>=0&&(i.wa.splice(a,1),i.wa.length===0?s=e.ba()?0:1:!i.Sa()&&e.ba()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function Jy(n,e){const t=H(n);let r=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const c of a.wa)c.Ca(s)&&(r=!0);a.ya=s}}r&&ha(t)}function Yy(n,e,t){const r=H(n),s=r.queries.get(e);if(s)for(const i of s.wa)i.onError(t);r.queries.delete(e)}function ha(n){n.Da.forEach((e=>{e.next()}))}var bo,Ql;(Ql=bo||(bo={})).Fa="default",Ql.Cache="cache";class da{constructor(e,t,r){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=r||{}}Ca(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new xn(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const r=t!=="Offline";return(!this.options.ka||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=xn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==bo.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(e){this.key=e}}class gd{constructor(e){this.key=e}}class Xy{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=G(),this.mutatedKeys=G(),this.Xa=Oh(e),this.eu=new Cn(this.Xa)}get tu(){return this.Ha}nu(e,t){const r=t?t.ru:new Gl,s=t?t.eu:this.eu;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,c=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal(((f,m)=>{const g=s.get(f),R=ri(this.query,m)?m:null,I=!!g&&this.mutatedKeys.has(g.key),N=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let C=!1;g&&R?g.data.isEqual(R.data)?I!==N&&(r.track({type:3,doc:R}),C=!0):this.iu(g,R)||(r.track({type:2,doc:R}),C=!0,(u&&this.Xa(R,u)>0||d&&this.Xa(R,d)<0)&&(c=!0)):!g&&R?(r.track({type:0,doc:R}),C=!0):g&&!R&&(r.track({type:1,doc:g}),C=!0,(u||d)&&(c=!0)),C&&(R?(a=a.add(R),i=N?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),r.track({type:1,doc:f})}return{eu:a,ru:r,Ds:c,mutatedKeys:i}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const a=e.ru.pa();a.sort(((f,m)=>(function(R,I){const N=C=>{switch(C){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return $(20277,{At:C})}};return N(R)-N(I)})(f.type,m.type)||this.Xa(f.doc,m.doc))),this.su(r),s=s!=null&&s;const c=t&&!s?this.ou():[],u=this.Za.size===0&&this.current&&!s?1:0,d=u!==this.Ya;return this.Ya=u,a.length!==0||d?{snapshot:new xn(this.query,e.eu,i,a,e.mutatedKeys,u===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),_u:c}:{_u:c}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Gl,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=G(),this.eu.forEach((r=>{this.au(r.key)&&(this.Za=this.Za.add(r.key))}));const t=[];return e.forEach((r=>{this.Za.has(r)||t.push(new gd(r))})),this.Za.forEach((r=>{e.has(r)||t.push(new md(r))})),t}uu(e){this.Ha=e.qs,this.Za=G();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return xn.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const fa="SyncEngine";class Zy{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class ew{constructor(e){this.key=e,this.lu=!1}}class tw{constructor(e,t,r,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.hu={},this.Pu=new pn((c=>Vh(c)),ni),this.Tu=new Map,this.Iu=new Set,this.du=new re(U.comparator),this.Eu=new Map,this.Au=new Zo,this.Ru={},this.Vu=new Map,this.mu=Dn.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function nw(n,e,t=!0){const r=Td(n);let s;const i=r.Pu.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.cu()):s=await _d(r,e,t,!0),s}async function rw(n,e){const t=Td(n);await _d(t,e,!0,!1)}async function _d(n,e,t,r){const s=await Iy(n.localStore,Ze(e)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let c;return r&&(c=await sw(n,e,i,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&ld(n.remoteStore,s),c}async function sw(n,e,t,r,s){n.gu=(m,g,R)=>(async function(N,C,O,F){let M=C.view.nu(O);M.Ds&&(M=await $l(N.localStore,C.query,!1).then((({documents:E})=>C.view.nu(E,M))));const q=F&&F.targetChanges.get(C.targetId),oe=F&&F.targetMismatches.get(C.targetId)!=null,ee=C.view.applyChanges(M,N.isPrimaryClient,q,oe);return Yl(N,C.targetId,ee._u),ee.snapshot})(n,m,g,R);const i=await $l(n.localStore,e,!0),a=new Xy(e,i.qs),c=a.nu(i.documents),u=Lr.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(c,n.isPrimaryClient,u);Yl(n,t,d._u);const f=new Zy(e,t,a);return n.Pu.set(e,f),n.Tu.has(t)?n.Tu.get(t).push(e):n.Tu.set(t,[e]),d.snapshot}async function iw(n,e,t){const r=H(n),s=r.Pu.get(e),i=r.Tu.get(s.targetId);if(i.length>1)return r.Tu.set(s.targetId,i.filter((a=>!ni(a,e)))),void r.Pu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await To(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&ra(r.remoteStore,s.targetId),Ao(r,s.targetId)})).catch(Mn)):(Ao(r,s.targetId),await To(r.localStore,s.targetId,!0))}async function ow(n,e){const t=H(n),r=t.Pu.get(e),s=t.Tu.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),ra(t.remoteStore,r.targetId))}async function aw(n,e,t){const r=pw(n);try{const s=await(function(a,c){const u=H(a),d=ne.now(),f=c.reduce(((R,I)=>R.add(I.key)),G());let m,g;return u.persistence.runTransaction("Locally write mutations","readwrite",(R=>{let I=_t(),N=G();return u.Os.getEntries(R,f).next((C=>{I=C,I.forEach(((O,F)=>{F.isValidDocument()||(N=N.add(O))}))})).next((()=>u.localDocuments.getOverlayedDocuments(R,I))).next((C=>{m=C;const O=[];for(const F of c){const M=Iv(F,m.get(F.key).overlayedDocument);M!=null&&O.push(new Kt(F.key,M,Rh(M.value.mapValue),He.exists(!0)))}return u.mutationQueue.addMutationBatch(R,d,O,c)})).next((C=>{g=C;const O=C.applyToLocalDocumentSet(m,N);return u.documentOverlayCache.saveOverlays(R,C.batchId,O)}))})).then((()=>({batchId:g.batchId,changes:Mh(m)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),(function(a,c,u){let d=a.Ru[a.currentUser.toKey()];d||(d=new re(z)),d=d.insert(c,u),a.Ru[a.currentUser.toKey()]=d})(r,s.batchId,t),await Ur(r,s.changes),await li(r.remoteStore)}catch(s){const i=ca(s,"Failed to persist write");t.reject(i)}}async function vd(n,e){const t=H(n);try{const r=await wy(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const a=t.Eu.get(i);a&&(J(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.lu=!0:s.modifiedDocuments.size>0?J(a.lu,14607):s.removedDocuments.size>0&&(J(a.lu,42227),a.lu=!1))})),await Ur(t,r,e)}catch(r){await Mn(r)}}function Jl(n,e,t){const r=H(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Pu.forEach(((i,a)=>{const c=a.view.va(e);c.snapshot&&s.push(c.snapshot)})),(function(a,c){const u=H(a);u.onlineState=c;let d=!1;u.queries.forEach(((f,m)=>{for(const g of m.wa)g.va(c)&&(d=!0)})),d&&ha(u)})(r.eventManager,e),s.length&&r.hu.J_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function cw(n,e,t){const r=H(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Eu.get(e),i=s&&s.key;if(i){let a=new re(U.comparator);a=a.insert(i,Se.newNoDocument(i,j.min()));const c=G().add(i),u=new oi(j.min(),new Map,new re(z),a,c);await vd(r,u),r.du=r.du.remove(i),r.Eu.delete(e),pa(r)}else await To(r.localStore,e,!1).then((()=>Ao(r,e,t))).catch(Mn)}async function lw(n,e){const t=H(n),r=e.batch.batchId;try{const s=await yy(t.localStore,e);wd(t,r,null),yd(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Ur(t,s)}catch(s){await Mn(s)}}async function uw(n,e,t){const r=H(n);try{const s=await(function(a,c){const u=H(a);return u.persistence.runTransaction("Reject batch","readwrite-primary",(d=>{let f;return u.mutationQueue.lookupMutationBatch(d,c).next((m=>(J(m!==null,37113),f=m.keys(),u.mutationQueue.removeMutationBatch(d,m)))).next((()=>u.mutationQueue.performConsistencyCheck(d))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(d,f,c))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f))).next((()=>u.localDocuments.getDocuments(d,f)))}))})(r.localStore,e);wd(r,e,t),yd(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Ur(r,s)}catch(s){await Mn(s)}}function yd(n,e){(n.Vu.get(e)||[]).forEach((t=>{t.resolve()})),n.Vu.delete(e)}function wd(n,e,t){const r=H(n);let s=r.Ru[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.Ru[r.currentUser.toKey()]=s}}function Ao(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Tu.get(e))n.Pu.delete(r),t&&n.hu.pu(r,t);n.Tu.delete(e),n.isPrimaryClient&&n.Au.zr(e).forEach((r=>{n.Au.containsKey(r)||Ed(n,r)}))}function Ed(n,e){n.Iu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(ra(n.remoteStore,t),n.du=n.du.remove(e),n.Eu.delete(t),pa(n))}function Yl(n,e,t){for(const r of t)r instanceof md?(n.Au.addReference(r.key,e),hw(n,r)):r instanceof gd?(V(fa,"Document no longer in limbo: "+r.key),n.Au.removeReference(r.key,e),n.Au.containsKey(r.key)||Ed(n,r.key)):$(19791,{yu:r})}function hw(n,e){const t=e.key,r=t.path.canonicalString();n.du.get(t)||n.Iu.has(r)||(V(fa,"New document in limbo: "+t),n.Iu.add(r),pa(n))}function pa(n){for(;n.Iu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new U(X.fromString(e)),r=n.mu.next();n.Eu.set(r,new ew(t)),n.du=n.du.insert(t,r),ld(n.remoteStore,new Ct(Ze(ti(t.path)),r,"TargetPurposeLimboResolution",Xs.ue))}}async function Ur(n,e,t){const r=H(n),s=[],i=[],a=[];r.Pu.isEmpty()||(r.Pu.forEach(((c,u)=>{a.push(r.gu(u,e,t).then((d=>{var f;if((d||t)&&r.isPrimaryClient){const m=d?!d.fromCache:(f=t==null?void 0:t.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(d){s.push(d);const m=ta.Es(u.targetId,d);i.push(m)}})))})),await Promise.all(a),r.hu.J_(s),await(async function(u,d){const f=H(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(m=>k.forEach(d,(g=>k.forEach(g.Is,(R=>f.persistence.referenceDelegate.addReference(m,g.targetId,R))).next((()=>k.forEach(g.ds,(R=>f.persistence.referenceDelegate.removeReference(m,g.targetId,R)))))))))}catch(m){if(!Un(m))throw m;V(na,"Failed to update sequence numbers: "+m)}for(const m of d){const g=m.targetId;if(!m.fromCache){const R=f.Fs.get(g),I=R.snapshotVersion,N=R.withLastLimboFreeSnapshotVersion(I);f.Fs=f.Fs.insert(g,N)}}})(r.localStore,i))}async function dw(n,e){const t=H(n);if(!t.currentUser.isEqual(e)){V(fa,"User change. New user:",e.toKey());const r=await id(t.localStore,e);t.currentUser=e,(function(i,a){i.Vu.forEach((c=>{c.forEach((u=>{u.reject(new x(P.CANCELLED,a))}))})),i.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Ur(t,r.Bs)}}function fw(n,e){const t=H(n),r=t.Eu.get(e);if(r&&r.lu)return G().add(r.key);{let s=G();const i=t.Tu.get(e);if(!i)return s;for(const a of i){const c=t.Pu.get(a);s=s.unionWith(c.view.tu)}return s}}function Td(n){const e=H(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=vd.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=fw.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=cw.bind(null,e),e.hu.J_=Jy.bind(null,e.eventManager),e.hu.pu=Yy.bind(null,e.eventManager),e}function pw(n){const e=H(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=lw.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=uw.bind(null,e),e}class Bs{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ai(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return vy(this.persistence,new my,e.initialUser,this.serializer)}Du(e){return new sd(ea.Vi,this.serializer)}bu(e){return new Ay}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Bs.provider={build:()=>new Bs};class mw extends Bs{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){J(this.persistence.referenceDelegate instanceof Us,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new ey(r,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?De.withCacheSize(this.cacheSizeBytes):De.DEFAULT;return new sd((r=>Us.Vi(r,t)),this.serializer)}}class Ro{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Jl(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=dw.bind(null,this.syncEngine),await Gy(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Qy})()}createDatastore(e){const t=ai(e.databaseInfo.databaseId),r=(function(i){return new ky(i)})(e.databaseInfo);return(function(i,a,c,u){return new Vy(i,a,c,u)})(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,a,c){return new Ly(r,s,i,a,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>Jl(this.syncEngine,t,0)),(function(){return Hl.C()?new Hl:new Ry})())}createSyncEngine(e,t){return(function(s,i,a,c,u,d,f){const m=new tw(s,i,a,c,u,d);return f&&(m.fu=!0),m})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=H(s);V(un,"RemoteStore shutting down."),i.Ia.add(5),await Mr(i),i.Ea.shutdown(),i.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Ro.provider={build:()=>new Ro};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):gt("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qt="FirestoreClient";class gw{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=Re.UNAUTHENTICATED,this.clientId=jo.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async a=>{V(qt,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(r,(a=>(V(qt,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ft;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=ca(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function Zi(n,e){n.asyncQueue.verifyOperationInProgress(),V(qt,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await id(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>{Lt("Terminating Firestore due to IndexedDb database deletion"),n.terminate().then((()=>{V("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((s=>{Lt("Terminating Firestore due to IndexedDb database deletion failed",s)}))})),n._offlineComponents=e}async function Xl(n,e){n.asyncQueue.verifyOperationInProgress();const t=await _w(n);V(qt,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>Wl(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>Wl(e.remoteStore,s))),n._onlineComponents=e}async function _w(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){V(qt,"Using user provided OfflineComponentProvider");try{await Zi(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===P.FAILED_PRECONDITION||s.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;Lt("Error using user provided cache. Falling back to memory cache: "+t),await Zi(n,new Bs)}}else V(qt,"Using default OfflineComponentProvider"),await Zi(n,new mw(void 0));return n._offlineComponents}async function Id(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(V(qt,"Using user provided OnlineComponentProvider"),await Xl(n,n._uninitializedComponentsProvider._online)):(V(qt,"Using default OnlineComponentProvider"),await Xl(n,new Ro))),n._onlineComponents}function vw(n){return Id(n).then((e=>e.syncEngine))}async function $s(n){const e=await Id(n),t=e.eventManager;return t.onListen=nw.bind(null,e.syncEngine),t.onUnlisten=iw.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=rw.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=ow.bind(null,e.syncEngine),t}function yw(n,e,t={}){const r=new ft;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,c,u,d){const f=new ma({next:g=>{f.Ou(),a.enqueueAndForget((()=>ua(i,m)));const R=g.docs.has(c);!R&&g.fromCache?d.reject(new x(P.UNAVAILABLE,"Failed to get document because the client is offline.")):R&&g.fromCache&&u&&u.source==="server"?d.reject(new x(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(g)},error:g=>d.reject(g)}),m=new da(ti(c.path),f,{includeMetadataChanges:!0,ka:!0});return la(i,m)})(await $s(n),n.asyncQueue,e,t,r))),r.promise}function ww(n,e,t={}){const r=new ft;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,c,u,d){const f=new ma({next:g=>{f.Ou(),a.enqueueAndForget((()=>ua(i,m))),g.fromCache&&u.source==="server"?d.reject(new x(P.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(g)},error:g=>d.reject(g)}),m=new da(c,f,{includeMetadataChanges:!0,ka:!0});return la(i,m)})(await $s(n),n.asyncQueue,e,t,r))),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bd(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zl=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ad="firestore.googleapis.com",eu=!0;class tu{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new x(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Ad,this.ssl=eu}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:eu;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=rd;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Xv)throw new x(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}L_("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=bd((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),(function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new x(P.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new x(P.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new x(P.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ui{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new tu({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new x(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new x(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new tu(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new S_;switch(r.type){case"firstParty":return new N_(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new x(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=Zl.get(t);r&&(V("ComponentProvider","Removing Datastore"),Zl.delete(t),r.terminate())})(this),Promise.resolve()}}function Ew(n,e,t,r={}){var s;n=Me(n,ui);const i=hn(e),a=n._getSettings(),c=Object.assign(Object.assign({},a),{emulatorOptions:n._getEmulatorOptions()}),u=`${e}:${t}`;i&&(Co(`https://${u}`),Po("Firestore",!0)),a.host!==Ad&&a.host!==u&&Lt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const d=Object.assign(Object.assign({},a),{host:u,ssl:i,emulatorOptions:r});if(!sn(d,c)&&(n._setSettings(d),r.mockUserToken)){let f,m;if(typeof r.mockUserToken=="string")f=r.mockUserToken,m=Re.MOCK_USER;else{f=wu(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const g=r.mockUserToken.sub||r.mockUserToken.user_id;if(!g)throw new x(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new Re(g)}n._authCredentials=new C_(new fh(f,m))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new vt(this.firestore,e,this._query)}}class ie{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new xt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ie(this.firestore,e,this._key)}toJSON(){return{type:ie._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(Vr(t,ie._jsonSchema))return new ie(e,r||null,new U(X.fromString(t.referencePath)))}}ie._jsonSchemaVersion="firestore/documentReference/1.0",ie._jsonSchema={type:ue("string",ie._jsonSchemaVersion),referencePath:ue("string")};class xt extends vt{constructor(e,t,r){super(e,t,ti(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ie(this.firestore,null,new U(e))}withConverter(e){return new xt(this.firestore,e,this._path)}}function Vt(n,e,...t){if(n=he(n),mh("collection","path",e),n instanceof ui){const r=X.fromString(e,...t);return pl(r),new xt(n,null,r)}{if(!(n instanceof ie||n instanceof xt))throw new x(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(X.fromString(e,...t));return pl(r),new xt(n.firestore,null,r)}}function qe(n,e,...t){if(n=he(n),arguments.length===1&&(e=jo.newId()),mh("doc","path",e),n instanceof ui){const r=X.fromString(e,...t);return fl(r),new ie(n,null,new U(r))}{if(!(n instanceof ie||n instanceof xt))throw new x(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(X.fromString(e,...t));return fl(r),new ie(n.firestore,n instanceof xt?n.converter:null,new U(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nu="AsyncQueue";class ru{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new ad(this,"async_queue_retry"),this.oc=()=>{const r=Xi();r&&V(nu,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this._c=e;const t=Xi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Xi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new ft;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Un(e))throw e;V(nu,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((r=>{throw this.tc=r,this.nc=!1,gt("INTERNAL UNHANDLED ERROR: ",su(r)),r})).then((r=>(this.nc=!1,r))))));return this._c=t,t}enqueueAfterDelay(e,t,r){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const s=aa.createAndSchedule(this,e,t,r,(i=>this.lc(i)));return this.ec.push(s),s}ac(){this.tc&&$(47125,{hc:su(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function su(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iu(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of r)if(i in s&&typeof s[i]=="function")return!0;return!1})(n,["next","error","complete"])}class jt extends ui{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new ru,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new ru(e),this._firestoreClient=void 0,await e}}}function Tw(n,e){const t=typeof n=="object"?n:Do(),r=typeof n=="string"?n:Ds,s=Gs(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=_u("firestore");i&&Ew(s,...i)}return s}function hi(n){if(n._terminated)throw new x(P.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Iw(n),n._firestoreClient}function Iw(n){var e,t,r;const s=n._freezeSettings(),i=(function(c,u,d,f){return new G_(c,u,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,bd(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)})(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new gw(n._authCredentials,n._appCheckCredentials,n._queue,i,n._componentsProvider&&(function(c){const u=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(u),_online:u}})(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ue(we.fromBase64String(e))}catch(t){throw new x(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ue(we.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Ue._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Vr(e,Ue._jsonSchema))return Ue.fromBase64String(e.bytes)}}Ue._jsonSchemaVersion="firestore/bytes/1.0",Ue._jsonSchema={type:ue("string",Ue._jsonSchemaVersion),bytes:ue("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class di{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new x(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ye(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fi{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new x(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new x(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return z(this._lat,e._lat)||z(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:tt._jsonSchemaVersion}}static fromJSON(e){if(Vr(e,tt._jsonSchema))return new tt(e.latitude,e.longitude)}}tt._jsonSchemaVersion="firestore/geoPoint/1.0",tt._jsonSchema={type:ue("string",tt._jsonSchemaVersion),latitude:ue("number"),longitude:ue("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:nt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Vr(e,nt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new nt(e.vectorValues);throw new x(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}nt._jsonSchemaVersion="firestore/vectorValue/1.0",nt._jsonSchema={type:ue("string",nt._jsonSchemaVersion),vectorValues:ue("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bw=/^__.*__$/;class Aw{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Kt(e,this.data,this.fieldMask,t,this.fieldTransforms):new Or(e,this.data,t,this.fieldTransforms)}}class Rd{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Kt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Sd(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw $(40011,{Ec:n})}}class ga{constructor(e,t,r,s,i,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.Ac(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new ga(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Rc({path:r,mc:!1});return s.fc(e),s}gc(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Rc({path:r,mc:!1});return s.Ac(),s}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return qs(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(Sd(this.Ec)&&bw.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class Rw{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||ai(e)}Dc(e,t,r,s=!1){return new ga({Ec:e,methodName:t,bc:r,path:ye.emptyPath(),mc:!1,Sc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function pi(n){const e=n._freezeSettings(),t=ai(n._databaseId);return new Rw(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Cd(n,e,t,r,s,i={}){const a=n.Dc(i.merge||i.mergeFields?2:0,e,t,s);va("Data must be an object, but it was:",a,r);const c=Pd(r,a);let u,d;if(i.merge)u=new Le(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const g=So(e,m,t);if(!a.contains(g))throw new x(P.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);Nd(f,g)||f.push(g)}u=new Le(f),d=a.fieldTransforms.filter((m=>u.covers(m.field)))}else u=null,d=a.fieldTransforms;return new Aw(new xe(c),u,d)}class mi extends fi{_toFieldTransform(e){if(e.Ec!==2)throw e.Ec===1?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof mi}}class _a extends fi{_toFieldTransform(e){return new yv(e.path,new br)}isEqual(e){return e instanceof _a}}function Sw(n,e,t,r){const s=n.Dc(1,e,t);va("Data must be an object, but it was:",s,r);const i=[],a=xe.empty();Gt(r,((u,d)=>{const f=ya(e,u,t);d=he(d);const m=s.gc(f);if(d instanceof mi)i.push(f);else{const g=Fr(d,m);g!=null&&(i.push(f),a.set(f,g))}}));const c=new Le(i);return new Rd(a,c,s.fieldTransforms)}function Cw(n,e,t,r,s,i){const a=n.Dc(1,e,t),c=[So(e,r,t)],u=[s];if(i.length%2!=0)throw new x(P.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)c.push(So(e,i[g])),u.push(i[g+1]);const d=[],f=xe.empty();for(let g=c.length-1;g>=0;--g)if(!Nd(d,c[g])){const R=c[g];let I=u[g];I=he(I);const N=a.gc(R);if(I instanceof mi)d.push(R);else{const C=Fr(I,N);C!=null&&(d.push(R),f.set(R,C))}}const m=new Le(d);return new Rd(f,m,a.fieldTransforms)}function Pw(n,e,t,r=!1){return Fr(t,n.Dc(r?4:3,e))}function Fr(n,e){if(kd(n=he(n)))return va("Unsupported field value:",e,n),Pd(n,e);if(n instanceof fi)return(function(r,s){if(!Sd(s.Ec))throw s.wc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.wc(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(r,s){const i=[];let a=0;for(const c of r){let u=Fr(c,s.yc(a));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),a++}return{arrayValue:{values:i}}})(n,e)}return(function(r,s){if((r=he(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return gv(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=ne.fromDate(r);return{timestampValue:Ms(s.serializer,i)}}if(r instanceof ne){const i=new ne(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Ms(s.serializer,i)}}if(r instanceof tt)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Ue)return{bytesValue:Jh(s.serializer,r._byteString)};if(r instanceof ie){const i=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(i))throw s.wc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Xo(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof nt)return(function(a,c){return{mapValue:{fields:{[bh]:{stringValue:Ah},[xs]:{arrayValue:{values:a.toArray().map((d=>{if(typeof d!="number")throw c.wc("VectorValues must only contain numeric values.");return Qo(c.serializer,d)}))}}}}}})(r,s);throw s.wc(`Unsupported field value: ${Ys(r)}`)})(n,e)}function Pd(n,e){const t={};return vh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Gt(n,((r,s)=>{const i=Fr(s,e.Vc(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function kd(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ne||n instanceof tt||n instanceof Ue||n instanceof ie||n instanceof fi||n instanceof nt)}function va(n,e,t){if(!kd(t)||!gh(t)){const r=Ys(t);throw r==="an object"?e.wc(n+" a custom object"):e.wc(n+" "+r)}}function So(n,e,t){if((e=he(e))instanceof di)return e._internalPath;if(typeof e=="string")return ya(n,e);throw qs("Field path arguments must be of type string or ",n,!1,void 0,t)}const kw=new RegExp("[~\\*/\\[\\]]");function ya(n,e,t){if(e.search(kw)>=0)throw qs(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new di(...e.split("."))._internalPath}catch{throw qs(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function qs(n,e,t,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(i||a)&&(u+=" (found",i&&(u+=` in field ${r}`),a&&(u+=` in document ${s}`),u+=")"),new x(P.INVALID_ARGUMENT,c+n+u)}function Nd(n,e){return n.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dd{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ie(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Nw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(gi("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Nw extends Dd{data(){return super.data()}}function gi(n,e){return typeof e=="string"?ya(n,e):e instanceof di?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xd(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new x(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class wa{}class Ea extends wa{}function Ta(n,e,...t){let r=[];e instanceof wa&&r.push(e),r=r.concat(t),(function(i){const a=i.filter((u=>u instanceof Ia)).length,c=i.filter((u=>u instanceof _i)).length;if(a>1||a>0&&c>0)throw new x(P.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const s of r)n=s._apply(n);return n}class _i extends Ea{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new _i(e,t,r)}_apply(e){const t=this._parse(e);return Od(e._query,t),new vt(e.firestore,e.converter,_o(e._query,t))}_parse(e){const t=pi(e.firestore);return(function(i,a,c,u,d,f,m){let g;if(d.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new x(P.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){au(m,f);const I=[];for(const N of m)I.push(ou(u,i,N));g={arrayValue:{values:I}}}else g=ou(u,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||au(m,f),g=Pw(c,a,m,f==="in"||f==="not-in");return le.create(d,f,g)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Vd(n,e,t){const r=e,s=gi("where",n);return _i._create(s,r,t)}class Ia extends wa{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Ia(e,t)}_parse(e){const t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:We.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let a=s;const c=i.getFlattenedFilters();for(const u of c)Od(a,u),a=_o(a,u)})(e._query,t),new vt(e.firestore,e.converter,_o(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class ba extends Ea{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new ba(e,t)}_apply(e){const t=(function(s,i,a){if(s.startAt!==null)throw new x(P.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new x(P.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ir(i,a)})(e._query,this._field,this._direction);return new vt(e.firestore,e.converter,(function(s,i){const a=s.explicitOrderBy.concat([i]);return new Fn(s.path,s.collectionGroup,a,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)})(e._query,t))}}function Dw(n,e="asc"){const t=e,r=gi("orderBy",n);return ba._create(r,t)}class Aa extends Ea{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new Aa(e,t,r)}_apply(e){return new vt(e.firestore,e.converter,Os(e._query,this._limit,this._limitType))}}function xw(n){return Aa._create("limit",n,"F")}function ou(n,e,t){if(typeof(t=he(t))=="string"){if(t==="")throw new x(P.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!xh(e)&&t.indexOf("/")!==-1)throw new x(P.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(X.fromString(t));if(!U.isDocumentKey(r))throw new x(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Tl(n,new U(r))}if(t instanceof ie)return Tl(n,t._key);throw new x(P.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ys(t)}.`)}function au(n,e){if(!Array.isArray(n)||n.length===0)throw new x(P.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Od(n,e){const t=(function(s,i){for(const a of s)for(const c of a.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new x(P.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new x(P.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class Vw{convertValue(e,t="none"){switch(Bt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ae(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ft(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw $(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Gt(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){var t,r,s;const i=(s=(r=(t=e.fields)===null||t===void 0?void 0:t[xs].arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map((a=>ae(a.doubleValue)));return new nt(i)}convertGeoPoint(e){return new tt(ae(e.latitude),ae(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=ei(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(wr(e));default:return null}}convertTimestamp(e){const t=Ut(e);return new ne(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=X.fromString(e);J(nd(r),9688,{name:e});const s=new Er(r.get(1),r.get(3)),i=new U(r.popFirst(5));return s.isEqual(t)||gt(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ld(n,e,t){let r;return r=n?n.toFirestore(e):e,r}class lr{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class tn extends Dd{constructor(e,t,r,s,i,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ts(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(gi("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new x(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=tn._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}tn._jsonSchemaVersion="firestore/documentSnapshot/1.0",tn._jsonSchema={type:ue("string",tn._jsonSchemaVersion),bundleSource:ue("string","DocumentSnapshot"),bundleName:ue("string"),bundle:ue("string")};class Ts extends tn{data(e={}){return super.data(e)}}class nn{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new lr(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new Ts(this._firestore,this._userDataWriter,r.key,r,new lr(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new x(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((c=>{const u=new Ts(s._firestore,s._userDataWriter,c.doc.key,c.doc,new lr(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{const u=new Ts(s._firestore,s._userDataWriter,c.doc.key,c.doc,new lr(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,f=-1;return c.type!==0&&(d=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),f=a.indexOf(c.doc.key)),{type:Ow(c.type),doc:u,oldIndex:d,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new x(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=nn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=jo.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Ow(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return $(61501,{type:n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ra(n){n=Me(n,ie);const e=Me(n.firestore,jt);return yw(hi(e),n._key).then((t=>Ud(e,n,t)))}nn._jsonSchemaVersion="firestore/querySnapshot/1.0",nn._jsonSchema={type:ue("string",nn._jsonSchemaVersion),bundleSource:ue("string","QuerySnapshot"),bundleName:ue("string"),bundle:ue("string")};class Sa extends Vw{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ue(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ie(this.firestore,null,t)}}function Ca(n){n=Me(n,vt);const e=Me(n.firestore,jt),t=hi(e),r=new Sa(e);return xd(n._query),ww(t,n._query).then((s=>new nn(e,r,n,s)))}function Lw(n,e,t){n=Me(n,ie);const r=Me(n.firestore,jt),s=Ld(n.converter,e);return Pa(r,[Cd(pi(r),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,He.none())])}function js(n,e,t,...r){n=Me(n,ie);const s=Me(n.firestore,jt),i=pi(s);let a;return a=typeof(e=he(e))=="string"||e instanceof di?Cw(i,"updateDoc",n._key,e,t,r):Sw(i,"updateDoc",n._key,e),Pa(s,[a.toMutation(n._key,He.exists(!0))])}function Md(n,e){const t=Me(n.firestore,jt),r=qe(n),s=Ld(n.converter,e);return Pa(t,[Cd(pi(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,He.exists(!1))]).then((()=>r))}function Sr(n,...e){var t,r,s;n=he(n);let i={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||iu(e[a])||(i=e[a++]);const c={includeMetadataChanges:i.includeMetadataChanges,source:i.source};if(iu(e[a])){const m=e[a];e[a]=(t=m.next)===null||t===void 0?void 0:t.bind(m),e[a+1]=(r=m.error)===null||r===void 0?void 0:r.bind(m),e[a+2]=(s=m.complete)===null||s===void 0?void 0:s.bind(m)}let u,d,f;if(n instanceof ie)d=Me(n.firestore,jt),f=ti(n._key.path),u={next:m=>{e[a]&&e[a](Ud(d,n,m))},error:e[a+1],complete:e[a+2]};else{const m=Me(n,vt);d=Me(m.firestore,jt),f=m._query;const g=new Sa(d);u={next:R=>{e[a]&&e[a](new nn(d,g,m,R))},error:e[a+1],complete:e[a+2]},xd(n._query)}return(function(g,R,I,N){const C=new ma(N),O=new da(R,C,I);return g.asyncQueue.enqueueAndForget((async()=>la(await $s(g),O))),()=>{C.Ou(),g.asyncQueue.enqueueAndForget((async()=>ua(await $s(g),O)))}})(hi(d),f,c,u)}function Pa(n,e){return(function(r,s){const i=new ft;return r.asyncQueue.enqueueAndForget((async()=>aw(await vw(r),s,i))),i.promise})(hi(n),e)}function Ud(n,e,t){const r=t.docs.get(e._key),s=new Sa(n);return new tn(n,s,e._key,r,new lr(t.hasPendingWrites,t.fromCache),e.converter)}function Pt(){return new _a("serverTimestamp")}(function(e,t=!0){(function(s){Ln=s})(dn),on(new Ot("firestore",((r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),c=new jt(new P_(r.getProvider("auth-internal")),new D_(a,r.getProvider("app-check-internal")),(function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new x(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Er(d.options.projectId,f)})(a,s),a);return i=Object.assign({useFetchStreams:t},i),c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),Je(cl,ll,e),Je(cl,ll,"esm2017")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fd="firebasestorage.googleapis.com",Mw="storageBucket",Uw=120*1e3,Fw=600*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot extends it{constructor(e,t,r=0){super(eo(e),`Firebase Storage: ${t} (${eo(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,ot.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return eo(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var st;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(st||(st={}));function eo(n){return"storage/"+n}function Bw(){const n="An unknown error occurred, please check the error payload for server response.";return new ot(st.UNKNOWN,n)}function $w(){return new ot(st.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function qw(){return new ot(st.CANCELED,"User canceled the upload/download.")}function jw(n){return new ot(st.INVALID_URL,"Invalid URL '"+n+"'.")}function Hw(n){return new ot(st.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function cu(n){return new ot(st.INVALID_ARGUMENT,n)}function Bd(){return new ot(st.APP_DELETED,"The Firebase app was deleted.")}function zw(n){return new ot(st.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=je.makeFromUrl(e,t)}catch{return new je(e,"")}if(r.path==="")return r;throw Hw(e)}static makeFromUrl(e,t){let r=null;const s="([A-Za-z0-9.\\-_]+)";function i(q){q.path.charAt(q.path.length-1)==="/"&&(q.path_=q.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+s+a,"i"),u={bucket:1,path:3};function d(q){q.path_=decodeURIComponent(q.path)}const f="v[A-Za-z0-9_]+",m=t.replace(/[.]/g,"\\."),g="(/([^?#]*).*)?$",R=new RegExp(`^https?://${m}/${f}/b/${s}/o${g}`,"i"),I={bucket:1,path:3},N=t===Fd?"(?:storage.googleapis.com|storage.cloud.google.com)":t,C="([^?#]*)",O=new RegExp(`^https?://${N}/${s}/${C}`,"i"),M=[{regex:c,indices:u,postModify:i},{regex:R,indices:I,postModify:d},{regex:O,indices:{bucket:1,path:2},postModify:d}];for(let q=0;q<M.length;q++){const oe=M[q],ee=oe.regex.exec(e);if(ee){const E=ee[oe.indices.bucket];let _=ee[oe.indices.path];_||(_=""),r=new je(E,_),oe.postModify(r);break}}if(r==null)throw jw(e);return r}}class Ww{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gw(n,e,t){let r=1,s=null,i=null,a=!1,c=0;function u(){return c===2}let d=!1;function f(...C){d||(d=!0,e.apply(null,C))}function m(C){s=setTimeout(()=>{s=null,n(R,u())},C)}function g(){i&&clearTimeout(i)}function R(C,...O){if(d){g();return}if(C){g(),f.call(null,C,...O);return}if(u()||a){g(),f.call(null,C,...O);return}r<64&&(r*=2);let M;c===1?(c=2,M=0):M=(r+Math.random())*1e3,m(M)}let I=!1;function N(C){I||(I=!0,g(),!d&&(s!==null?(C||(c=2),clearTimeout(s),m(0)):C||(c=1)))}return m(0),i=setTimeout(()=>{a=!0,N(!0)},t),N}function Kw(n){n(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qw(n){return n!==void 0}function lu(n,e,t,r){if(r<e)throw cu(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw cu(`Invalid value for '${n}'. Expected ${t} or less.`)}function Jw(n){const e=encodeURIComponent;let t="?";for(const r in n)if(n.hasOwnProperty(r)){const s=e(r)+"="+e(n[r]);t=t+s+"&"}return t=t.slice(0,-1),t}var Hs;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(Hs||(Hs={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yw(n,e){const t=n>=500&&n<600,s=[408,429].indexOf(n)!==-1,i=e.indexOf(n)!==-1;return t||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xw{constructor(e,t,r,s,i,a,c,u,d,f,m,g=!0,R=!1){this.url_=e,this.method_=t,this.headers_=r,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=u,this.timeout_=d,this.progressCallback_=f,this.connectionFactory_=m,this.retry=g,this.isUsingEmulator=R,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((I,N)=>{this.resolve_=I,this.reject_=N,this.start_()})}start_(){const e=(r,s)=>{if(s){r(!1,new ds(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const a=c=>{const u=c.loaded,d=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,d)};this.progressCallback_!==null&&i.addUploadProgressListener(a),i.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(a),this.pendingConnection_=null;const c=i.getErrorCode()===Hs.NO_ERROR,u=i.getStatus();if(!c||Yw(u,this.additionalRetryCodes_)&&this.retry){const f=i.getErrorCode()===Hs.ABORT;r(!1,new ds(!1,null,f));return}const d=this.successCodes_.indexOf(u)!==-1;r(!0,new ds(d,i))})},t=(r,s)=>{const i=this.resolve_,a=this.reject_,c=s.connection;if(s.wasSuccessCode)try{const u=this.callback_(c,c.getResponse());Qw(u)?i(u):i()}catch(u){a(u)}else if(c!==null){const u=Bw();u.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,u)):a(u)}else if(s.canceled){const u=this.appDelete_?Bd():qw();a(u)}else{const u=$w();a(u)}};this.canceled_?t(!1,new ds(!1,null,!0)):this.backoffId_=Gw(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&Kw(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class ds{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function Zw(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function eE(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function tE(n,e){e&&(n["X-Firebase-GMPID"]=e)}function nE(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function rE(n,e,t,r,s,i,a=!0,c=!1){const u=Jw(n.urlParams),d=n.url+u,f=Object.assign({},n.headers);return tE(f,e),Zw(f,t),eE(f,i),nE(f,r),new Xw(d,n.method,f,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,s,a,c)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sE(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function iE(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(e,t){this._service=e,t instanceof je?this._location=t:this._location=je.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new zs(e,t)}get root(){const e=new je(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return iE(this._location.path)}get storage(){return this._service}get parent(){const e=sE(this._location.path);if(e===null)return null;const t=new je(this._location.bucket,e);return new zs(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw zw(e)}}function uu(n,e){const t=e==null?void 0:e[Mw];return t==null?null:je.makeFromBucketSpec(t,n)}function oE(n,e,t,r={}){n.host=`${e}:${t}`;const s=hn(e);s&&(Co(`https://${n.host}/b`),Po("Storage",!0)),n._isUsingEmulator=!0,n._protocol=s?"https":"http";const{mockUserToken:i}=r;i&&(n._overrideAuthToken=typeof i=="string"?i:wu(i,n.app.options.projectId))}class aE{constructor(e,t,r,s,i,a=!1){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=s,this._firebaseVersion=i,this._isUsingEmulator=a,this._bucket=null,this._host=Fd,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Uw,this._maxUploadRetryTime=Fw,this._requests=new Set,s!=null?this._bucket=je.makeFromBucketSpec(s,this._host):this._bucket=uu(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=je.makeFromBucketSpec(this._url,e):this._bucket=uu(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){lu("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){lu("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(Oe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new zs(this,e)}_makeRequest(e,t,r,s,i=!0){if(this._deleted)return new Ww(Bd());{const a=rE(e,this._appId,r,s,t,this._firebaseVersion,i,this._isUsingEmulator);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){const[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,s).getPromise()}}const hu="@firebase/storage",du="0.13.14";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $d="storage";function cE(n=Do(),e){n=he(n);const r=Gs(n,$d).getImmediate({identifier:e}),s=_u("storage");return s&&lE(r,...s),r}function lE(n,e,t,r={}){oE(n,e,t,r)}function uE(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),s=n.getProvider("app-check-internal");return new aE(t,r,s,e,dn)}function hE(){on(new Ot($d,uE,"PUBLIC").setMultipleInstances(!0)),Je(hu,du,""),Je(hu,du,"esm2017")}hE();const dE={apiKey:"AIzaSyCfmAn2qjdNd_iyCS4wqYniDj6m9bO5Aqc",authDomain:"moveit-v2-e8079.firebaseapp.com",projectId:"moveit-v2-e8079",storageBucket:"moveit-v2-e8079.firebasestorage.app",messagingSenderId:"853397289334",appId:"1:853397289334:web:a7e127f9c0d67637786257",measurementId:"G-7J8C632N8S"},ka=Iu(dE),de=A_(ka),me=Tw(ka);cE(ka);class Pe{static async login(e,t){try{return(await ug(de,e,t)).user}catch(r){throw console.error("Login error:",r),this.formatError(r)}}static async signup(e,t,r){try{const i=(await lg(de,t,r)).user;return await Lw(qe(me,"users",i.uid),{role:"customer",displayName:e,email:t,createdAt:Pt(),totalEarningsPiastres:0}),i}catch(s){throw console.error("Signup error:",s),this.formatError(s)}}static async logout(){await fg(de)}static async getUserDoc(e){try{const t=qe(me,"users",e),r=await Ra(t);return r.exists()?{uid:r.id,...r.data()}:null}catch(t){return console.error("Error fetching user doc:",t),null}}static async deleteAccount(){const e=de.currentUser;e&&await pg(e)}static formatError(e){switch(e.code){case"auth/user-not-found":case"auth/wrong-password":case"auth/invalid-credential":return new Error("Invalid email or password.");case"auth/email-already-in-use":return new Error("An account with this email already exists.");case"auth/weak-password":return new Error("Password should be at least 6 characters.");case"auth/invalid-email":return new Error("Please enter a valid email address.");default:return new Error("An unexpected error occurred. Please try again.")}}}class fE{constructor(){this.routes=[],this.currentRoute=null,this.appRoot=document.getElementById("app"),window.addEventListener("hashchange",()=>this.handleRoute())}addRoute(e,t,r=null){const s=e instanceof RegExp;this.routes.push({path:e,component:t,guard:r,isRegex:s})}async handleRoute(){const e=document.getElementById("app-loader");e&&e.classList.add("fade-out");const r=(window.location.hash.slice(1)||"/").split("?")[0];let s=null,i={};for(const a of this.routes)if(a.isRegex){const c=r.match(a.path);if(c){s=a,i=c.groups||{};break}}else if(a.path===r){s=a;break}if(!s){this.navigate("/customer");return}if(!(s.guard&&!await s.guard()))try{const a=await s.component(i);this.appRoot.innerHTML="",this.appRoot.appendChild(a),window.lucide&&window.lucide.createIcons()}catch(a){console.error("Routing error:",a),this.appRoot.innerHTML=`<div class="p-xl text-center"><h2 class="text-headline">Error loading page</h2><p class="text-body">${a.message}</p></div>`}}navigate(e){window.location.hash=e}}const Z=new fE,Fe=async()=>new Promise(n=>{const e=de.onAuthStateChanged(t=>{e(),t?n(!0):(Z.navigate("/login"),n(!1))})}),qd=async()=>new Promise(n=>{const e=de.onAuthStateChanged(t=>{e(),t?(Z.navigate("/dashboard"),n(!1)):n(!0)})});class ge{static show(e,t="info",r=3e3){const s=document.getElementById("toast-container");if(!s)return;const i=document.createElement("div");i.className=`toast toast--${t}`;let a="";switch(t){case"success":a='<i data-lucide="check-circle"></i>';break;case"error":a='<i data-lucide="alert-circle"></i>';break;case"warning":a='<i data-lucide="alert-triangle"></i>';break;default:a='<i data-lucide="info"></i>';break}i.innerHTML=`
      <div class="toast__icon">${a}</div>
      <div class="toast__message">${e}</div>
      <button class="toast__close"><i data-lucide="x"></i></button>
    `,s.appendChild(i),window.lucide&&window.lucide.createIcons({root:i});const c=i.querySelector(".toast__close");let u;const d=()=>{i.classList.add("toast-exit"),setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i)},300)};c.addEventListener("click",()=>{clearTimeout(u),d()}),u=setTimeout(d,r)}static success(e,t){this.show(e,"success",t)}static error(e,t){this.show(e,"error",t)}static warning(e,t){this.show(e,"warning",t)}static info(e,t){this.show(e,"info",t)}}const pE=()=>{const n=document.createElement("div");n.className="auth-page",n.innerHTML=`
    <!-- Left Hero Side -->
    <div class="auth-hero">
      <img src="/moveit.png" alt="MoveIt" class="auth-hero__logo" />
      <h1 class="auth-hero__title">Delivery Made Simple</h1>
      <p class="auth-hero__subtitle">Egypt's premier delivery platform. Book a delivery, track your package, and get it there fast.</p>
      
      <div class="auth-hero__features">
        <div class="auth-hero__feature">
          <div class="auth-hero__feature-icon"><i data-lucide="map-pin"></i></div>
          <span>Real-time tracking of your packages</span>
        </div>
        <div class="auth-hero__feature">
          <div class="auth-hero__feature-icon"><i data-lucide="truck"></i></div>
          <span>Multiple vehicle types for any load</span>
        </div>
        <div class="auth-hero__feature">
          <div class="auth-hero__feature-icon"><i data-lucide="shield-check"></i></div>
          <span>Secure and reliable drivers</span>
        </div>
      </div>
    </div>

    <!-- Right Form Side -->
    <div class="auth-form-side">
      <div class="auth-form-container">
        <div class="auth-form-header">
          <h2 class="auth-form-header__title">Welcome Back</h2>
          <p class="auth-form-header__subtitle">Login to manage your deliveries</p>
        </div>

        <form id="login-form" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <div class="form-input-icon">
              <i data-lucide="mail"></i>
              <input type="email" id="email" class="form-input" placeholder="Enter your email" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="form-input-icon password-toggle">
              <i data-lucide="lock"></i>
              <input type="password" id="password" class="form-input" placeholder="Enter your password" required />
              <button type="button" class="password-toggle__btn" id="toggle-pwd">
                <i data-lucide="eye"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-primary-lg auth-form__submit" id="submit-btn">
            Login
          </button>
        </form>

        <div class="auth-form__divider">OR</div>

        <div class="auth-form__footer">
          Don't have an account? <a href="#/signup">Sign up</a>
        </div>
      </div>
    </div>
  `;const e=n.querySelector("#password"),t=n.querySelector("#toggle-pwd"),r=t.querySelector("i");t.addEventListener("click",()=>{e.type==="password"?(e.type="text",r.setAttribute("data-lucide","eye-off")):(e.type="password",r.setAttribute("data-lucide","eye")),window.lucide.createIcons({root:t})});const s=n.querySelector("#login-form"),i=n.querySelector("#submit-btn");return s.addEventListener("submit",async a=>{a.preventDefault();const c=s.email.value.trim(),u=s.password.value;if(!(!c||!u)){i.disabled=!0,i.innerHTML='<span class="spinner" style="width:20px;height:20px;border-width:2px"></span> Logging in...';try{const d=await Pe.login(c,u),f=await Pe.getUserDoc(d.uid);(f==null?void 0:f.role)==="admin"?(ge.success("Welcome back, Admin!"),Z.navigate("/admin")):(ge.success("Login successful!"),Z.navigate("/customer"))}catch(d){ge.error(d.message),i.disabled=!1,i.innerHTML="Login"}}}),n},mE=()=>{const n=document.createElement("div");n.className="auth-page",n.innerHTML=`
    <!-- Left Hero Side -->
    <div class="auth-hero">
      <img src="/moveit.png" alt="MoveIt" class="auth-hero__logo" />
      <h1 class="auth-hero__title">Join MoveIt Today</h1>
      <p class="auth-hero__subtitle">Create an account to start booking deliveries instantly.</p>
      
      <div class="auth-hero__features">
        <div class="auth-hero__feature">
          <div class="auth-hero__feature-icon"><i data-lucide="zap"></i></div>
          <span>Instant quotes and booking</span>
        </div>
        <div class="auth-hero__feature">
          <div class="auth-hero__feature-icon"><i data-lucide="credit-card"></i></div>
          <span>Transparent pricing with no hidden fees</span>
        </div>
      </div>
    </div>

    <!-- Right Form Side -->
    <div class="auth-form-side">
      <div class="auth-form-container">
        <div class="auth-form-header">
          <h2 class="auth-form-header__title">Create Account</h2>
          <p class="auth-form-header__subtitle">Sign up as a customer</p>
        </div>

        <form id="signup-form" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="name">Full Name</label>
            <div class="form-input-icon">
              <i data-lucide="user"></i>
              <input type="text" id="name" class="form-input" placeholder="Enter your full name" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <div class="form-input-icon">
              <i data-lucide="mail"></i>
              <input type="email" id="email" class="form-input" placeholder="Enter your email" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="form-input-icon password-toggle">
              <i data-lucide="lock"></i>
              <input type="password" id="password" class="form-input" placeholder="Create a password (min 6 chars)" minlength="6" required />
              <button type="button" class="password-toggle__btn toggle-pwd">
                <i data-lucide="eye"></i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="confirm-password">Confirm Password</label>
            <div class="form-input-icon password-toggle">
              <i data-lucide="lock"></i>
              <input type="password" id="confirm-password" class="form-input" placeholder="Confirm your password" minlength="6" required />
              <button type="button" class="password-toggle__btn toggle-pwd">
                <i data-lucide="eye"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-primary-lg auth-form__submit" id="submit-btn">
            Create Account
          </button>
        </form>

        <div class="auth-form__divider">OR</div>

        <div class="auth-form__footer">
          Already have an account? <a href="#/login">Login</a>
        </div>
      </div>
    </div>
  `,n.querySelectorAll(".toggle-pwd").forEach(s=>{s.addEventListener("click",()=>{const i=s.previousElementSibling,a=s.querySelector("i");i.type==="password"?(i.type="text",a.setAttribute("data-lucide","eye-off")):(i.type="password",a.setAttribute("data-lucide","eye")),window.lucide.createIcons({root:s})})});const t=n.querySelector("#signup-form"),r=n.querySelector("#submit-btn");return t.addEventListener("submit",async s=>{s.preventDefault();const i=t.name.value.trim(),a=t.email.value.trim(),c=t.password.value,u=t["confirm-password"].value;if(c!==u){ge.error("Passwords do not match");return}r.disabled=!0,r.innerHTML='<span class="spinner" style="width:20px;height:20px;border-width:2px"></span> Creating...';try{await Pe.signup(i,a,c),ge.success("Account created successfully!"),Z.navigate("/customer")}catch(d){ge.error(d.message),r.disabled=!1,r.innerHTML="Create Account"}}),n};class rn{static async createJob(e){try{return(await Md(Vt(me,this.collectionName),{...e,createdAt:Pt()})).id}catch(t){throw console.error("Error creating job:",t),new Error("Failed to create job")}}static async getJobById(e){try{const t=qe(me,this.collectionName,e),r=await Ra(t);return r.exists()?{id:r.id,...r.data()}:null}catch(t){throw console.error("Error fetching job:",t),new Error("Failed to fetch job details")}}static subscribeToCustomerJobs(e,t){const r=Ta(Vt(me,this.collectionName),Vd("customerId","==",e));return Sr(r,s=>{const i=[];s.forEach(a=>i.push({id:a.id,...a.data()})),i.sort((a,c)=>{var f,m;const u=((f=a.createdAt)==null?void 0:f.toMillis())||0;return(((m=c.createdAt)==null?void 0:m.toMillis())||0)-u}),t(i)},s=>{console.error("Error subscribing to jobs:",s)})}static subscribeToJob(e,t){return Sr(qe(me,this.collectionName,e),r=>{r.exists()&&t({id:r.id,...r.data()})})}static async cancelJob(e){try{await js(qe(me,this.collectionName,e),{status:"cancelled",updatedAt:Pt()})}catch(t){throw console.error("Error cancelling job:",t),new Error("Failed to cancel job")}}static async repostJob(e){try{await js(qe(me,this.collectionName,e),{status:"pending",driverId:null,updatedAt:Pt()})}catch(t){throw console.error("Error reposting job:",t),new Error("Failed to repost job")}}static async getAllJobs(e={}){try{let t=Vt(me,this.collectionName);const r=await Ca(t);let s=[];return r.forEach(i=>s.push({id:i.id,...i.data()})),e.status&&e.status!=="all"&&(s=s.filter(i=>i.status===e.status)),s.sort((i,a)=>{var d,f;const c=((d=i.createdAt)==null?void 0:d.toMillis())||0;return(((f=a.createdAt)==null?void 0:f.toMillis())||0)-c}),s}catch(t){throw console.error("Error fetching all jobs:",t),new Error("Failed to fetch jobs")}}}is(rn,"collectionName","jobs");const Ge=n=>{const e=(n==null?void 0:n.role)==="customer",t=(n==null?void 0:n.role)==="admin",r=document.createElement("nav");r.className="navbar";const s=n!=null&&n.displayName?n.displayName.charAt(0).toUpperCase():"U";r.innerHTML=`
    <div class="flex items-center gap-md">
      <button class="mobile-menu-btn" id="mobile-menu-toggle">
        <i data-lucide="menu"></i>
      </button>
      <a href="#/${e?"customer":"admin"}" class="navbar__brand">
        <span class="navbar__title">Move<span style="color: var(--brand-orange)">It</span></span>
      </a>
    </div>

    <div class="navbar__actions">
      ${e?`
        <a href="#/customer/post-job" class="btn btn-sm btn-primary hidden-mobile">
          <i data-lucide="plus"></i> Post Job
        </a>
      `:""}
      
      <div class="navbar__user" id="user-menu-toggle">
        <div class="navbar__avatar ${t?"bg-navy":""}">${s}</div>
        <span class="navbar__username">${(n==null?void 0:n.displayName)||"User"}</span>
        <i data-lucide="chevron-down" style="width: 16px; height: 16px"></i>
        
        <div class="navbar__dropdown hidden" id="user-dropdown">
          <div class="p-sm px-md text-caption">Signed in as <br/><strong>${n==null?void 0:n.email}</strong></div>
          <div class="navbar__dropdown-divider"></div>
          ${e?`
            <a href="#/customer/profile" class="navbar__dropdown-item">
              <i data-lucide="user"></i> Profile
            </a>
            <a href="#/customer/settings" class="navbar__dropdown-item">
              <i data-lucide="settings"></i> Settings
            </a>
          `:""}
          <div class="navbar__dropdown-divider"></div>
          <button class="navbar__dropdown-item navbar__dropdown-item--danger" onclick="window.logout()">
            <i data-lucide="log-out"></i> Logout
          </button>
        </div>
      </div>
    </div>
  `;const i=r.querySelector("#user-menu-toggle"),a=r.querySelector("#user-dropdown");i.addEventListener("click",u=>{u.stopPropagation(),a.classList.toggle("hidden")}),document.addEventListener("click",u=>{i.contains(u.target)||a.classList.add("hidden")});const c=r.querySelector("#mobile-menu-toggle");return c==null||c.addEventListener("click",()=>{const u=document.querySelector(".sidebar");u&&u.classList.toggle("open")}),r},Ke=(n,e)=>{const t=document.createElement("aside");t.className="sidebar";const a=n==="customer"?[{path:"/customer",icon:"home",label:"Dashboard"},{path:"/customer/jobs",icon:"list",label:"Active Jobs"},{path:"/customer/history",icon:"clock",label:"History"},{path:"/customer/reports",icon:"message-square",label:"My Reports"},{path:"/customer/wallet",icon:"wallet",label:"Wallet"},{path:"/customer/profile",icon:"user",label:"Profile"},{path:"/",icon:"globe",label:"MoveIt Website"}]:[{path:"/admin",icon:"layout-dashboard",label:"Overview"},{path:"/admin/reports",icon:"flag",label:"Reports"},{path:"/admin/jobs",icon:"package",label:"Jobs"},{path:"/admin/users",icon:"users",label:"Users"},{path:"/",icon:"globe",label:"MoveIt Website"}];let c="";return a.forEach(u=>{const d=u.path===`/${n}`?e===u.path:e.startsWith(u.path);c+=`
      <a href="#${u.path}" class="sidebar__link ${d?"active":""}">
        <i data-lucide="${u.icon}"></i>
        <span>${u.label}</span>
      </a>
    `}),t.innerHTML=`
    <div class="sidebar__nav">
      <div class="sidebar__section-title">Menu</div>
      ${c}
    </div>
    <div class="sidebar__footer">
      <div class="text-caption text-center">MoveIt v1.0.0</div>
    </div>
  `,t.querySelectorAll(".sidebar__link").forEach(u=>{u.addEventListener("click",()=>{window.innerWidth<=768&&t.classList.remove("open")})}),t},gE=async()=>{const n=de.currentUser,e=await Pe.getUserDoc(n.uid),t=document.createElement("div");t.className="admin-layout flex h-full",t.appendChild(Ke("customer","/customer"));const r=document.createElement("div");r.className="main-content w-full flex-col",r.appendChild(Ge(e));const s=document.createElement("div");return s.className="p-xl stagger-children",s.innerHTML=`
    <div class="welcome-banner">
      <div class="welcome-banner__text">
        <div class="welcome-banner__greeting">Good morning,</div>
        <div class="welcome-banner__name">${e.displayName}</div>
        <div class="welcome-banner__subtitle">What would you like to deliver today?</div>
      </div>
    </div>

    <div class="dashboard-grid dashboard-grid--wide mt-xl">
      <!-- Wallet & Promo -->
      <div class="flex flex-col gap-lg">
        <div class="wallet-card">
          <div class="wallet-card__label">PayIt Balance</div>
          <div class="wallet-card__balance">0.00 <span class="wallet-card__currency">EGP</span></div>
          <div class="wallet-card__actions">
            <a href="#/customer/wallet" class="wallet-action-btn">
              <i data-lucide="plus"></i> Top Up
            </a>
            <a href="#/customer/wallet" class="wallet-action-btn">
              <i data-lucide="credit-card"></i> Manage
            </a>
          </div>
        </div>

        <div class="card card-gradient-blue card-interactive" onclick="alert('Please download the MoveIt mobile app to post jobs and access all features.')">
          <div class="card-body">
            <h3 class="text-title mb-sm">MoveIt Business</h3>
            <p class="text-body-sm opacity-80 mb-md">Need regular logistics for your store? Apply for a business account.</p>
            <button class="btn btn-sm bg-white text-brand-sky-blue w-full">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  `,r.appendChild(s),t.appendChild(r),setTimeout(()=>{window.lucide&&window.lucide.createIcons({root:t})},0),t},_E=async()=>{const n=de.currentUser,e=await Pe.getUserDoc(n.uid),t=document.createElement("div");t.className="admin-layout flex h-full",t.appendChild(Ke("customer","/customer/wallet"));const r=document.createElement("div");r.className="main-content w-full flex-col",r.appendChild(Ge(e));const s=document.createElement("div");return s.className="p-xl stagger-children",s.style.maxWidth="800px",s.style.margin="0 auto",s.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">PayIt Wallet</h1>
      <p class="page-subtitle">Manage your payment methods and balance</p>
    </div>

    <div class="wallet-card mb-xl">
      <div class="wallet-card__label">Current Balance</div>
      <div class="wallet-card__balance">0.00 <span class="wallet-card__currency">EGP</span></div>
      <div class="wallet-card__actions">
        <button class="wallet-action-btn" id="topup-btn">
          <i data-lucide="plus"></i> Top Up
        </button>
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-header">
        <h3 class="card-title">Payment Methods</h3>
        <button class="btn btn-sm btn-ghost" id="add-card-btn">
          <i data-lucide="plus"></i> Add Card
        </button>
      </div>
      <div class="card-body">
        <div class="flex flex-col gap-sm">
          <div class="p-md border rounded flex items-center justify-between" style="border-color: var(--brand-sky-blue); background: rgba(var(--brand-sky-blue-rgb), 0.05)">
            <div class="flex items-center gap-md">
              <i data-lucide="banknote" class="text-brand-sky-blue"></i>
              <div>
                <div class="font-bold">Cash on Delivery</div>
                <div class="text-caption">Default payment method</div>
              </div>
            </div>
            <i data-lucide="check-circle" class="text-brand-sky-blue"></i>
          </div>
          
          <div class="p-md border rounded flex items-center justify-between text-secondary">
            <div class="flex items-center gap-md">
              <i data-lucide="credit-card"></i>
              <div>
                <div class="font-bold">Visa •••• 4242</div>
                <div class="text-caption">Expires 12/28</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,r.appendChild(s),t.appendChild(r),setTimeout(()=>{window.lucide&&window.lucide.createIcons({root:t}),t.querySelector("#topup-btn").addEventListener("click",()=>{ge.info("Top up functionality coming soon.")}),t.querySelector("#add-card-btn").addEventListener("click",()=>{ge.info("Card addition coming soon.")})},0),t},vE=async()=>{const n=de.currentUser;let e=await Pe.getUserDoc(n.uid);const t=document.createElement("div");t.className="admin-layout flex h-full",t.appendChild(Ke("customer","/customer/profile"));const r=document.createElement("div");r.className="main-content w-full flex-col";const s=Ge(e);r.appendChild(s);const i=document.createElement("div");i.className="p-xl stagger-children",i.style.maxWidth="800px",i.style.margin="0 auto";const a=e.displayName?e.displayName.charAt(0).toUpperCase():"U";return i.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">My Profile</h1>
    </div>

    <div class="profile-header">
      <div class="profile-avatar">${a}</div>
      <div class="profile-info">
        <div class="flex items-center gap-sm mb-xs">
          <h2 class="profile-name m-0" id="display-name-text">${e.displayName}</h2>
          <span class="badge badge-customer">Customer</span>
        </div>
        <div class="profile-email">${e.email}</div>
        <button class="btn btn-sm btn-secondary" id="edit-profile-btn">Edit Profile</button>
      </div>
    </div>

    <div class="card" id="edit-form-card" style="display: none; margin-bottom: var(--space-xl)">
      <div class="card-header">
        <h3 class="card-title">Edit Profile</h3>
      </div>
      <div class="card-body">
        <form id="edit-profile-form">
          <div class="form-group mb-md">
            <label class="form-label">Display Name</label>
            <input type="text" id="edit-name" class="form-input" value="${e.displayName}" required />
          </div>
          <div class="form-group mb-md">
            <label class="form-label">Email (Read-only)</label>
            <input type="email" class="form-input" value="${e.email}" disabled />
          </div>
          <div class="flex justify-end gap-sm mt-md">
            <button type="button" class="btn btn-ghost" id="cancel-edit-btn">Cancel</button>
            <button type="submit" class="btn btn-primary" id="save-profile-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

    <h3 class="text-title mb-md">Account Settings</h3>
    <div class="profile-menu">
      <a href="#/customer/wallet" class="profile-menu-item">
        <div class="profile-menu-item__left">
          <div class="profile-menu-item__icon"><i data-lucide="wallet"></i></div>
          <span class="profile-menu-item__label">Wallet & Payments</span>
        </div>
        <i data-lucide="chevron-right" class="profile-menu-item__chevron"></i>
      </a>
      <a href="#/customer/reports" class="profile-menu-item">
        <div class="profile-menu-item__left">
          <div class="profile-menu-item__icon"><i data-lucide="message-square"></i></div>
          <span class="profile-menu-item__label">My Reports</span>
        </div>
        <i data-lucide="chevron-right" class="profile-menu-item__chevron"></i>
      </a>
      <a href="#/customer/settings" class="profile-menu-item">
        <div class="profile-menu-item__left">
          <div class="profile-menu-item__icon"><i data-lucide="settings"></i></div>
          <span class="profile-menu-item__label">Preferences</span>
        </div>
        <i data-lucide="chevron-right" class="profile-menu-item__chevron"></i>
      </a>
    </div>
  `,r.appendChild(i),t.appendChild(r),setTimeout(()=>{window.lucide&&window.lucide.createIcons({root:t});const c=t.querySelector("#edit-profile-btn"),u=t.querySelector("#cancel-edit-btn"),d=t.querySelector("#edit-form-card"),f=t.querySelector("#edit-profile-form"),m=t.querySelector("#save-profile-btn"),g=t.querySelector("#display-name-text");c.addEventListener("click",()=>{d.style.display="block",c.style.display="none"}),u.addEventListener("click",()=>{d.style.display="none",c.style.display="block"}),f.addEventListener("submit",async R=>{R.preventDefault();const I=f.querySelector("#edit-name").value.trim();if(I){m.disabled=!0,m.innerHTML='<span class="spinner" style="width:20px;height:20px;border-width:2px"></span>';try{await js(qe(me,"users",n.uid),{displayName:I}),g.textContent=I,e.displayName=I;const N=I.charAt(0).toUpperCase();s.querySelector(".navbar__avatar").textContent=N,s.querySelector(".navbar__username").textContent=I,t.querySelector(".profile-avatar").textContent=N,ge.success("Profile updated successfully"),d.style.display="none",c.style.display="block"}catch(N){ge.error("Failed to update profile"),console.error(N)}finally{m.disabled=!1,m.textContent="Save Changes"}}})},0),t},yE=async()=>{const n=de.currentUser,e=await Pe.getUserDoc(n.uid),t=document.createElement("div");t.className="admin-layout flex h-full",t.appendChild(Ke("customer","/customer/settings"));const r=document.createElement("div");r.className="main-content w-full flex-col",r.appendChild(Ge(e));const s=document.createElement("div");return s.className="p-xl stagger-children",s.style.maxWidth="800px",s.style.margin="0 auto",s.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your application preferences</p>
    </div>

    <div class="settings-section">
      <div class="settings-section__title">Notifications</div>
      
      <div class="settings-item">
        <div>
          <div class="font-bold mb-xs">Push Notifications</div>
          <div class="text-caption text-secondary">Receive updates about your delivery status</div>
        </div>
        <label class="switch">
          <input type="checkbox" checked>
          <span class="slider round"></span>
        </label>
      </div>

      <div class="settings-item">
        <div>
          <div class="font-bold mb-xs">Email Receipts</div>
          <div class="text-caption text-secondary">Send invoice to email after delivery</div>
        </div>
        <label class="switch">
          <input type="checkbox" checked>
          <span class="slider round"></span>
        </label>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section__title">Language & Region</div>
      
      <div class="settings-item">
        <div>
          <div class="font-bold mb-xs">Language</div>
        </div>
        <select class="form-input" style="width: auto">
          <option value="en">English</option>
          <option value="ar">العربية (Arabic)</option>
        </select>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section__title">Danger Zone</div>
      
      <div class="settings-item">
        <div>
          <div class="font-bold text-error mb-xs">Delete Account</div>
          <div class="text-caption text-secondary">Permanently delete your account and all data</div>
        </div>
        <button class="btn btn-sm btn-ghost" style="color: var(--brand-error); border-color: var(--brand-error)" id="delete-account-btn">
          Delete Account
        </button>
      </div>
    </div>
  `,r.appendChild(s),t.appendChild(r),setTimeout(()=>{window.lucide&&window.lucide.createIcons({root:t}),t.querySelector("#delete-account-btn").addEventListener("click",()=>{confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")&&alert("Account deletion requires contacting support in this version.")})},0),t},Ht=n=>{let e=n,t="",r=`badge badge-${n}`;switch(n){case"pending":e="Pending",t="clock";break;case"accepted":e="Accepted",t="check-circle";break;case"in_transit":e="In Transit",t="truck",r="badge badge-in-transit";break;case"delivered":e="Delivered",t="check-circle-2";break;case"cancelled":e="Cancelled",t="x-circle";break;case"in_review":e="In Review",t="eye",r="badge badge-in-review";break;case"resolved":e="Resolved",t="check-circle";break;case"dismissed":e="Dismissed",t="slash";break;default:e=n.replace("_"," "),t="info";break}return`
    <span class="${r}">
      <i data-lucide="${t}" style="width: 14px; height: 14px"></i>
      ${e}
    </span>
  `},wE=(n,e)=>{const t=document.createElement("div");t.className="job-card",e&&t.addEventListener("click",e);const r=n.createdAt?new Intl.DateTimeFormat("en-EG",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(n.createdAt.toDate()):"Just now",s=(n.pricePiastres/100).toFixed(2);return t.innerHTML=`
    <div class="job-card__header">
      <div class="job-card__vehicle">
        <img src="/vehicles/${EE(n.vehicleTypeRequired)}" alt="${n.vehicleTypeRequired}" class="job-card__vehicle-icon" />
        <span class="truncate" style="max-width: 150px">${n.itemDescription}</span>
      </div>
      ${Ht(n.status)}
    </div>

    <div class="job-card__route">
      <div class="job-card__location job-card__location--pickup">
        <div class="job-card__location-dot"></div>
        <div class="truncate text-body-sm">${n.pickupAddress}</div>
      </div>
      <div class="job-card__location job-card__location--dropoff">
        <div class="job-card__location-dot"></div>
        <div class="truncate text-body-sm">${n.dropoffAddress}</div>
      </div>
    </div>

    <div class="job-card__footer">
      <div class="job-card__date">${r}</div>
      <div class="job-card__price">${s} EGP</div>
    </div>
  `,t};function EE(n){switch(n.toLowerCase()){case"motorcycle":return"gofast.jpeg";case"car":case"van":return"trucksend.jpeg";case"truck":return"heavyload.jpeg";default:return"easygo.jpeg"}}const vi=(n,e,t="inbox")=>`
    <div class="empty-state">
      <i data-lucide="${t}" class="empty-state__icon"></i>
      <h3 class="empty-state__title">${n}</h3>
      <p class="empty-state__text">${e}</p>
    </div>
  `,jd=async(n,e=!1)=>{const t=de.currentUser,r=await Pe.getUserDoc(t.uid),s=document.createElement("div");s.className="admin-layout flex h-full";const i=e?"/customer/history":"/customer/jobs";s.appendChild(Ke("customer",i));const a=document.createElement("div");a.className="main-content w-full flex-col",a.appendChild(Ge(r));const c=document.createElement("div");c.className="p-xl flex-col h-full",c.style.maxWidth="1000px",c.style.margin="0 auto",c.innerHTML=`
    <div class="page-header flex justify-between items-center">
      <div>
        <h1 class="page-title">${e?"Job History":"Active Jobs"}</h1>
        <p class="page-subtitle">${e?"Past deliveries and cancelled jobs":"Currently pending and active deliveries"}</p>
      </div>
      ${e?"":`
        <a href="#/customer/post-job" class="btn btn-primary">
          <i data-lucide="plus"></i> New Job
        </a>
      `}
    </div>

    <div id="jobs-container" class="job-list stagger-children">
      <!-- Jobs will be rendered here -->
      <div class="spinner"></div>
    </div>
  `,a.appendChild(c),s.appendChild(a);const u=rn.subscribeToCustomerJobs(t.uid,f=>{const m=s.querySelector("#jobs-container");m.innerHTML="";const g=["pending","accepted","in_transit"],R=f.filter(I=>e?!g.includes(I.status):g.includes(I.status));R.length===0?m.innerHTML=vi("No Jobs Found",e?"You do not have any past jobs yet.":"You do not have any active jobs right now.","package"):R.forEach(I=>{const N=wE(I,()=>{Z.navigate(`/customer/job/${I.id}`)});m.appendChild(N)}),window.lucide&&window.lucide.createIcons({root:m})}),d=()=>{u(),window.removeEventListener("hashchange",d)};return window.addEventListener("hashchange",d),setTimeout(()=>{window.lucide&&window.lucide.createIcons({root:s})},0),s};class Hd{static watchDriverLocation(e,t){const r=qe(me,this.collectionName,e);return Sr(r,s=>{s.exists()?t(s.data()):t(null)},s=>{console.error("Error watching tracking:",s)})}}is(Hd,"collectionName","tracking");class TE{constructor(e,t={}){this.containerId=e,this.map=null,this.markers={},this.polyline=null,this.defaultCenter=t.center||[30.0444,31.2357],this.defaultZoom=t.zoom||13,this.isInteractive=t.interactive!==!1,this.onClick=t.onClick||null}async init(){window.L||await new Promise(e=>setTimeout(e,500)),this.map=L.map(this.containerId,{zoomControl:this.isInteractive,dragging:this.isInteractive,scrollWheelZoom:this.isInteractive,doubleClickZoom:this.isInteractive}).setView(this.defaultCenter,this.defaultZoom),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors",maxZoom:19}).addTo(this.map),this.onClick&&this.map.on("click",e=>this.onClick(e.latlng.lat,e.latlng.lng)),this.icons={pickup:L.divIcon({className:"custom-div-icon",html:'<div style="background-color:#2E7D32;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>',iconSize:[16,16],iconAnchor:[8,8]}),dropoff:L.divIcon({className:"custom-div-icon",html:'<div style="background-color:#D32F2F;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>',iconSize:[16,16],iconAnchor:[8,8]}),driver:L.divIcon({className:"custom-div-icon",html:'<div style="background-color:#F79529;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>',iconSize:[20,20],iconAnchor:[10,10]})}}setMarker(e,t,r,s="pickup",i=null){if(this.map)if(this.markers[e])this.markers[e].setLatLng([t,r]),i&&this.markers[e].setPopupContent(i);else{const a=L.marker([t,r],{icon:this.icons[s]||this.icons.pickup}).addTo(this.map);i&&a.bindPopup(i),this.markers[e]=a}}removeMarker(e){this.markers[e]&&(this.map.removeLayer(this.markers[e]),delete this.markers[e])}drawRoute(e){this.map&&(this.polyline&&this.map.removeLayer(this.polyline),this.polyline=L.polyline(e,{color:"#F79529",weight:4,opacity:.8,dashArray:"8, 8"}).addTo(this.map))}fitBoundsToRoute(){this.polyline&&this.map&&this.map.fitBounds(this.polyline.getBounds(),{padding:[50,50]})}fitBoundsToMarkers(){if(!this.map)return;const e=new L.featureGroup(Object.values(this.markers));e.getLayers().length>0&&this.map.fitBounds(e.getBounds(),{padding:[50,50],maxZoom:16})}centerOn(e,t,r=15){this.map&&this.map.setView([e,t],r)}destroy(){this.map&&(this.map.remove(),this.map=null)}}const IE=async n=>{const e=n.id;if(!e)return document.createElement("div");const t=de.currentUser,r=await Pe.getUserDoc(t.uid),s=document.createElement("div");s.className="admin-layout flex h-full",s.appendChild(Ke("customer","/customer/jobs"));const i=document.createElement("div");i.className="main-content w-full flex-col",i.appendChild(Ge(r));const a=document.createElement("div");a.className="p-xl",a.innerHTML='<div class="spinner"></div>',i.appendChild(a),s.appendChild(i);let c=null,u=null;const d=I=>{u=I;const N=(I.pricePiastres/100).toFixed(2),C=I.createdAt?new Intl.DateTimeFormat("en-EG",{month:"long",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(I.createdAt.toDate()):"",O=I.status==="pending",F=I.status==="delivered"||I.status==="cancelled";a.innerHTML=`
      <div class="page-header flex justify-between items-center mb-xl">
        <div>
          <div class="flex items-center gap-md mb-xs">
            <h1 class="page-title m-0">Job Details</h1>
            <div id="status-badge-container">${Ht(I.status)}</div>
          </div>
          <p class="page-subtitle">ID: ${I.id}</p>
        </div>
        <div class="flex gap-sm">
          ${O?'<button class="btn btn-outline" id="btn-cancel" style="color: var(--brand-error); border-color: var(--brand-error)">Cancel Job</button>':""}
          ${F?'<button class="btn btn-primary" id="btn-rebook"><i data-lucide="refresh-cw"></i> Rebook</button>':""}
        </div>
      </div>

      <div class="job-detail">
        <div class="job-detail__map map-container" id="job-map"></div>
        
        <div class="job-detail__info">
          <!-- Status Tracker -->
          <div class="job-detail__status-stepper">
            <h3 class="text-title mb-md">Tracking</h3>
            ${f(I.status)}
          </div>

          <!-- Driver Info (if accepted) -->
          ${I.driverId?`
            <div class="job-detail__driver-card">
              <div class="job-detail__driver-avatar">
                ${I.driverName?I.driverName.charAt(0).toUpperCase():"D"}
              </div>
              <div>
                <div class="job-detail__driver-name">${I.driverName||"Your Driver"}</div>
                <div class="job-detail__driver-vehicle">${I.driverPhone||""}</div>
              </div>
            </div>
          `:`
            <div class="card p-lg text-center bg-grey-50">
              <div class="spinner spinner-sm mb-sm mx-auto"></div>
              <p class="text-secondary text-sm">Searching for nearby drivers...</p>
            </div>
          `}

          <!-- Details -->
          <div class="card p-lg">
            <h3 class="text-title mb-md">Order Info</h3>
            
            <div class="review-row">
              <div class="review-row__label">Date</div>
              <div class="review-row__value">${C}</div>
            </div>
            <div class="review-row">
              <div class="review-row__label">Vehicle</div>
              <div class="review-row__value" style="text-transform: capitalize">${I.vehicleTypeRequired}</div>
            </div>
            <div class="review-row">
              <div class="review-row__label">Item</div>
              <div class="review-row__value">${I.itemDescription}</div>
            </div>
            <div class="review-row">
              <div class="review-row__label">Notes</div>
              <div class="review-row__value text-right" style="max-width: 60%">${I.notes||"-"}</div>
            </div>
            <div class="review-row">
              <div class="review-row__label">Payment</div>
              <div class="review-row__value text-success">Cash on Delivery</div>
            </div>
            <div class="review-row review-row--total">
              <div class="review-row__label">Total Price</div>
              <div class="review-row__value">${N} EGP</div>
            </div>
          </div>
        </div>
      </div>
    `,window.lucide&&window.lucide.createIcons({root:a}),c||(c=new TE("job-map",{interactive:!0}),c.init().then(()=>{c.setMarker("pickup",I.pickupLat,I.pickupLng,"pickup","Pickup Location"),c.setMarker("dropoff",I.dropoffLat,I.dropoffLng,"dropoff","Dropoff Location"),c.fitBoundsToMarkers()}));const M=a.querySelector("#btn-cancel");M&&M.addEventListener("click",async()=>{if(confirm("Are you sure you want to cancel this job?"))try{await rn.cancelJob(I.id),ge.success("Job cancelled successfully")}catch(oe){ge.error(oe.message)}});const q=a.querySelector("#btn-rebook");q&&q.addEventListener("click",async()=>{try{await rn.repostJob(I.id),ge.success("Job rebooked successfully")}catch(oe){ge.error(oe.message)}})},f=I=>{const N=[{id:"pending",label:"Searching"},{id:"accepted",label:"Driver Assigned"},{id:"in_transit",label:"In Transit"},{id:"delivered",label:"Delivered"}];if(I==="cancelled")return'<div class="text-error font-bold text-center py-md">This job was cancelled.</div>';let C=N.findIndex(F=>F.id===I);C===-1&&(C=0);let O='<div class="wizard-stepper" style="margin:0; padding:0">';return N.forEach((F,M)=>{let q="upcoming";M<C&&(q="completed"),M===C&&(q="active"),O+=`
        <div class="wizard-step wizard-step--${q}" ${M===N.length-1?'style="flex:0"':""}>
          <div class="wizard-step__number">
            ${q==="completed"?'<i data-lucide="check" style="width:14px;height:14px"></i>':M+1}
          </div>
          <div class="wizard-step__connector"></div>
        </div>
      `}),O+="</div>",O+='<div class="flex justify-between mt-sm">',N.forEach((F,M)=>{let q=M<=C?"text-primary font-bold":"text-secondary";O+=`<div class="text-xs ${q}" style="text-align: center; width: 40px; margin-left: ${M===0?"-10px":M===N.length-1?"-20px":"-10px"}">${F.label}</div>`}),O+="</div>",O};let m=null;const g=rn.subscribeToJob(e,I=>{const N=!u,C=u&&u.status!==I.status;if(N||C)d(I);else{const O=a.querySelector("#status-badge-container");O&&(O.innerHTML=Ht(I.status))}I.status==="accepted"||I.status==="in_transit"?m||(m=Hd.watchDriverLocation(I.id,O=>{O&&c&&c.setMarker("driver",O.lat,O.lng,"driver","Driver Location")})):(m&&(m(),m=null),c&&c.removeMarker("driver"))}),R=()=>{g(),m&&m(),c&&c.destroy(),window.removeEventListener("hashchange",R)};return window.addEventListener("hashchange",R),s};class Vn{static async createReport(e){try{return(await Md(Vt(me,this.collectionName),{...e,status:"pending",createdAt:Pt(),updatedAt:Pt()})).id}catch(t){throw console.error("Error creating report:",t),new Error("Failed to submit report")}}static subscribeToUserReports(e,t){const r=Ta(Vt(me,this.collectionName),Vd("reporterId","==",e));return Sr(r,s=>{const i=[];s.forEach(a=>i.push({id:a.id,...a.data()})),i.sort((a,c)=>{var f,m;const u=((f=a.createdAt)==null?void 0:f.toMillis())||0;return(((m=c.createdAt)==null?void 0:m.toMillis())||0)-u}),t(i)},s=>{console.error("Error subscribing to reports:",s)})}static async getReportById(e){try{const t=qe(me,this.collectionName,e),r=await Ra(t);return r.exists()?{id:r.id,...r.data()}:null}catch(t){throw console.error("Error fetching report:",t),new Error("Failed to fetch report details")}}static subscribeToAllReports(e){const t=Vt(me,this.collectionName);return Sr(t,r=>{const s=[];r.forEach(i=>s.push({id:i.id,...i.data()})),s.sort((i,a)=>{var d,f;const c=((d=i.createdAt)==null?void 0:d.toMillis())||0;return(((f=a.createdAt)==null?void 0:f.toMillis())||0)-c}),e(s)},r=>{console.error("Error subscribing to all reports:",r)})}static async updateReportStatus(e,t,r=null,s=null,i=null){try{const a={status:t,updatedAt:Pt()};r!==null&&(a.adminResponse=r),s&&(a.adminId=s),i&&(a.adminName=i),(t==="resolved"||t==="dismissed")&&(a.resolvedAt=Pt()),await js(qe(me,this.collectionName,e),a)}catch(a){throw console.error("Error updating report status:",a),new Error("Failed to update report")}}}is(Vn,"collectionName","reports");class bE{static show({title:e,content:t,actions:r=[]}){const s=document.getElementById("modal-root");if(!s)return null;const i=document.createElement("div");i.className="modal-backdrop";let a="";r.length>0&&(a=`
        <div class="modal__footer">
          ${r.map((u,d)=>`
            <button class="btn ${u.primary?"btn-primary":"btn-ghost"}" id="modal-action-${d}">
              ${u.label}
            </button>
          `).join("")}
        </div>
      `),i.innerHTML=`
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">${e}</h3>
          <button class="btn-icon" id="modal-close"><i data-lucide="x"></i></button>
        </div>
        <div class="modal__body">
          ${typeof t=="string"?t:""}
        </div>
        ${a}
      </div>
    `,typeof t!="string"&&i.querySelector(".modal__body").appendChild(t),s.appendChild(i),window.lucide&&window.lucide.createIcons({root:i});const c=()=>{i.style.animation="fadeOut 0.2s ease forwards",i.querySelector(".modal").style.animation="scaleOut 0.2s ease forwards",setTimeout(()=>{i.parentNode&&s.removeChild(i)},200)};return i.querySelector("#modal-close").addEventListener("click",c),i.addEventListener("click",u=>{u.target===i&&c()}),r.forEach((u,d)=>{i.querySelector(`#modal-action-${d}`).addEventListener("click",()=>{u.onClick(c)})}),{close:c}}}const AE=async()=>{const n=de.currentUser,e=await Pe.getUserDoc(n.uid),t=document.createElement("div");t.className="admin-layout flex h-full",t.appendChild(Ke("customer","/customer/reports"));const r=document.createElement("div");r.className="main-content w-full flex-col",r.appendChild(Ge(e));const s=document.createElement("div");s.className="p-xl flex-col h-full",s.style.maxWidth="1000px",s.style.margin="0 auto",s.innerHTML=`
    <div class="page-header flex justify-between items-center mb-xl">
      <div>
        <h1 class="page-title">My Reports</h1>
        <p class="page-subtitle">Submit and track your support requests</p>
      </div>
      <button class="btn btn-primary" id="new-report-btn">
        <i data-lucide="plus"></i> New Report
      </button>
    </div>

    <div class="card p-0 hidden" id="new-report-form" style="margin-bottom: var(--space-xl)">
      <div class="card-header border-b border-light p-lg">
        <h3 class="card-title">Submit a New Report</h3>
      </div>
      <div class="card-body p-lg">
        <form id="submit-report-form">
          <div class="form-group mb-md">
            <label class="form-label">Subject</label>
            <input type="text" id="report-subject" class="form-input" placeholder="What is this about?" required />
          </div>
          <div class="form-group mb-md">
            <label class="form-label">Related Job ID (Optional)</label>
            <input type="text" id="report-jobid" class="form-input" placeholder="e.g. jHk92nSm..." />
          </div>
          <div class="form-group mb-md">
            <label class="form-label">Description</label>
            <textarea id="report-desc" class="form-input" rows="4" placeholder="Please describe your issue in detail..." required></textarea>
          </div>
          <div class="flex justify-end gap-sm mt-lg">
            <button type="button" class="btn btn-ghost" id="cancel-report-btn">Cancel</button>
            <button type="submit" class="btn btn-primary" id="save-report-btn">Submit Report</button>
          </div>
        </form>
      </div>
    </div>

    <div id="reports-container" class="report-list stagger-children">
      <div class="spinner"></div>
    </div>
  `,r.appendChild(s),t.appendChild(r);const i=t.querySelector("#new-report-btn"),a=t.querySelector("#cancel-report-btn"),c=t.querySelector("#new-report-form"),u=t.querySelector("#submit-report-form"),d=t.querySelector("#save-report-btn");i.addEventListener("click",()=>{c.classList.remove("hidden"),i.style.display="none"}),a.addEventListener("click",()=>{c.classList.add("hidden"),i.style.display="flex",u.reset()}),u.addEventListener("submit",async R=>{R.preventDefault();const I=u.querySelector("#report-subject").value.trim(),N=u.querySelector("#report-jobid").value.trim(),C=u.querySelector("#report-desc").value.trim();if(!(!I||!C)){d.disabled=!0,d.innerHTML='<span class="spinner" style="width:20px;height:20px;border-width:2px"></span>';try{await Vn.createReport({reporterId:n.uid,reporterName:e.displayName,reporterEmail:e.email,reporterRole:"customer",subject:I,description:C,jobId:N||null,priority:"medium"}),ge.success("Report submitted successfully"),u.reset(),c.classList.add("hidden"),i.style.display="flex"}catch{ge.error("Failed to submit report")}finally{d.disabled=!1,d.textContent="Submit Report"}}});const f=R=>{const I=document.createElement("div");I.className="report-card";const N=R.createdAt?new Intl.DateTimeFormat("en-EG",{month:"short",day:"numeric",year:"numeric"}).format(R.createdAt.toDate()):"";let C="";return R.adminResponse&&(C=`
        <div class="mt-md p-md bg-grey-50 rounded border border-light">
          <div class="text-caption text-secondary mb-xs font-bold">Admin Response</div>
          <div class="text-body-sm">${R.adminResponse}</div>
        </div>
      `),I.innerHTML=`
      <div class="report-card__priority report-card__priority--${R.priority}"></div>
      <div class="report-card__content">
        <div class="report-card__title">
          ${R.subject}
        </div>
        <div class="report-card__meta">
          <span><i data-lucide="clock" style="width:12px;height:12px"></i> ${N}</span>
          ${R.jobId?`<span><i data-lucide="package" style="width:12px;height:12px"></i> Job: ${R.jobId.substring(0,8)}</span>`:""}
        </div>
      </div>
      <div class="report-card__status">
        ${Ht(R.status)}
      </div>
    `,I.addEventListener("click",()=>{bE.show({title:"Report Details",content:`
          <div class="flex flex-col gap-sm">
            <div class="flex justify-between items-center mb-md">
              <h4 class="font-bold text-lg">${R.subject}</h4>
              ${Ht(R.status)}
            </div>
            <div class="text-secondary text-sm mb-md">Submitted on ${N}</div>
            
            <div class="p-md bg-grey-50 rounded border border-light text-body whitespace-pre-wrap">${R.description}</div>
            
            ${C}
          </div>
        `,actions:[{label:"Close",onClick:O=>O()}]})}),I},m=Vn.subscribeToUserReports(n.uid,R=>{const I=document.getElementById("reports-container");I&&(I.innerHTML="",R.length===0?I.innerHTML=vi("No Reports","You have not submitted any reports yet.","message-square"):R.forEach(N=>{I.appendChild(f(N))}),window.lucide&&window.lucide.createIcons({root:I}))}),g=()=>{m(),window.removeEventListener("hashchange",g)};return window.addEventListener("hashchange",g),setTimeout(()=>{window.lucide&&window.lucide.createIcons({root:t})},0),t},RE=async()=>{const n=de.currentUser,e=await Pe.getUserDoc(n.uid),t=document.createElement("div");t.className="admin-layout flex h-full",t.appendChild(Ke("admin","/admin"));const r=document.createElement("div");r.className="main-content w-full flex-col",r.appendChild(Ge(e));const s=document.createElement("div");return s.className="p-xl stagger-children",s.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">Admin Overview</h1>
      <p class="page-subtitle">Platform statistics and operations center</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
      <div class="card p-lg">
        <div class="text-caption text-secondary font-bold uppercase tracking-wider mb-xs">Total Users</div>
        <div class="text-headline" id="stat-users"><div class="spinner spinner-sm"></div></div>
      </div>
      <div class="card p-lg">
        <div class="text-caption text-secondary font-bold uppercase tracking-wider mb-xs">Active Jobs</div>
        <div class="text-headline" id="stat-jobs"><div class="spinner spinner-sm"></div></div>
      </div>
      <div class="card p-lg" style="border-left: 4px solid var(--brand-error)">
        <div class="text-caption text-secondary font-bold uppercase tracking-wider mb-xs">Open Reports</div>
        <div class="text-headline text-error" id="stat-reports"><div class="spinner spinner-sm"></div></div>
      </div>
      <div class="card p-lg bg-navy text-white">
        <div class="text-caption font-bold uppercase tracking-wider mb-xs opacity-70">Revenue (MTD)</div>
        <div class="text-headline">-- EGP</div>
      </div>
    </div>

    <div class="admin-dashboard">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        
        <!-- Recent Reports -->
        <div class="admin-widget">
          <div class="admin-widget__header">
            <h3 class="admin-widget__title">Recent Reports</h3>
            <a href="#/admin/reports" class="admin-widget__action">View All</a>
          </div>
          <div class="report-list" id="dashboard-reports">
            <div class="spinner mx-auto my-md"></div>
          </div>
        </div>

        <!-- Recent Jobs -->
        <div class="admin-widget">
          <div class="admin-widget__header">
            <h3 class="admin-widget__title">Live Jobs</h3>
            <a href="#/admin/jobs" class="admin-widget__action">View All</a>
          </div>
          <div class="job-list" id="dashboard-jobs">
            <div class="spinner mx-auto my-md"></div>
          </div>
        </div>
      </div>
    </div>
  `,r.appendChild(s),t.appendChild(r),setTimeout(async()=>{window.lucide&&window.lucide.createIcons({root:t});try{const i=await Ca(Vt(me,"users"));t.querySelector("#stat-users").textContent=i.size.toLocaleString();const c=(await rn.getAllJobs()).filter(d=>["pending","accepted","in_transit"].includes(d.status));t.querySelector("#stat-jobs").textContent=c.length.toLocaleString();const u=t.querySelector("#dashboard-jobs");u.innerHTML="",c.length===0?u.innerHTML='<div class="p-md text-center text-secondary">No active jobs</div>':c.slice(0,4).forEach(d=>{u.innerHTML+=`
            <div class="flex items-center justify-between p-sm border-b border-light">
              <div>
                <div class="font-bold text-sm">${d.vehicleTypeRequired.toUpperCase()}</div>
                <div class="text-xs text-secondary truncate" style="max-width:200px">${d.pickupAddress}</div>
              </div>
              <span class="badge badge-${d.status}">${d.status}</span>
            </div>
          `}),Vn.subscribeToAllReports(d=>{const f=d.filter(g=>g.status==="pending"||g.status==="in_review");t.querySelector("#stat-reports").textContent=f.length.toLocaleString();const m=t.querySelector("#dashboard-reports");m.innerHTML="",f.length===0?m.innerHTML='<div class="p-md text-center text-secondary">No open reports</div>':f.slice(0,4).forEach(g=>{m.innerHTML+=`
              <div class="report-card" onclick="window.location.hash='#/admin/reports'">
                <div class="report-card__priority report-card__priority--${g.priority}"></div>
                <div class="report-card__content">
                  <div class="report-card__title">${g.subject}</div>
                  <div class="report-card__meta">From: ${g.reporterEmail}</div>
                </div>
                <span class="badge badge-${g.status}">${g.status}</span>
              </div>
            `})})}catch(i){console.error("Error loading dashboard stats:",i)}},0),t},SE=async()=>{const n=de.currentUser,e=await Pe.getUserDoc(n.uid),t=document.createElement("div");t.className="admin-layout flex h-full",t.appendChild(Ke("admin","/admin/reports"));const r=document.createElement("div");r.className="main-content w-full flex-col",r.appendChild(Ge(e));const s=document.createElement("div");s.className="p-xl h-full flex flex-col",s.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">Report Management</h1>
      <p class="page-subtitle">Handle customer and driver reports</p>
    </div>

    <div class="report-detail h-full">
      <!-- List View -->
      <div class="card p-0 flex flex-col h-full" style="max-height: calc(100vh - 180px); overflow-y: auto;">
        <div class="p-md border-b border-light bg-grey-50 sticky top-0 z-10 flex gap-sm">
          <select class="form-input" id="filter-status">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div id="reports-list" class="report-list p-md">
          <div class="spinner mx-auto my-xl"></div>
        </div>
      </div>

      <!-- Detail View -->
      <div class="card h-full" id="report-detail-view" style="display: none; max-height: calc(100vh - 180px); overflow-y: auto;">
        <!-- Details injected dynamically -->
      </div>
      <div id="report-detail-empty" class="card flex items-center justify-center text-secondary h-full" style="max-height: calc(100vh - 180px);">
        Select a report to view details
      </div>
    </div>
  `,r.appendChild(s),t.appendChild(r);let i=[],a=null;const c=(m="all")=>{const g=t.querySelector("#reports-list");g.innerHTML="";const R=m==="all"?i:i.filter(I=>I.status===m);if(R.length===0){g.innerHTML=vi("No reports found","Adjust filters to see more results.","inbox");return}R.forEach(I=>{const N=I.createdAt?new Intl.DateTimeFormat("en-GB").format(I.createdAt.toDate()):"",C=document.createElement("div");C.className=`report-card ${a===I.id?"border-brand-sky-blue bg-grey-50":""}`,C.innerHTML=`
        <div class="report-card__priority report-card__priority--${I.priority}"></div>
        <div class="report-card__content">
          <div class="report-card__title">${I.subject}</div>
          <div class="report-card__meta">
            <span>${I.reporterEmail}</span>
            <span>•</span>
            <span>${N}</span>
          </div>
        </div>
        <div class="report-card__status">
          ${Ht(I.status)}
        </div>
      `,C.addEventListener("click",()=>{a=I.id,c(m),u(I)}),g.appendChild(g),g.appendChild(C)})},u=m=>{t.querySelector("#report-detail-empty").style.display="none";const g=t.querySelector("#report-detail-view");g.style.display="block";const R=m.createdAt?new Intl.DateTimeFormat("en-GB",{dateStyle:"long",timeStyle:"short"}).format(m.createdAt.toDate()):"";g.innerHTML=`
      <div class="flex justify-between items-start mb-lg border-b border-light pb-md">
        <div>
          <h2 class="text-headline mb-xs">${m.subject}</h2>
          <div class="text-caption text-secondary">ID: ${m.id}</div>
        </div>
        ${Ht(m.status)}
      </div>

      <div class="grid grid-cols-2 gap-md mb-lg">
        <div class="p-md bg-grey-50 rounded">
          <div class="text-caption font-bold mb-xs">Reporter</div>
          <div class="text-sm">${m.reporterName}</div>
          <div class="text-sm text-secondary">${m.reporterEmail}</div>
          <div class="text-xs mt-xs badge badge-customer inline-block">${m.reporterRole}</div>
        </div>
        <div class="p-md bg-grey-50 rounded">
          <div class="text-caption font-bold mb-xs">Job Reference</div>
          <div class="text-sm">${m.jobId||"None"}</div>
          <div class="text-caption font-bold mt-sm mb-xs">Date Submitted</div>
          <div class="text-sm">${R}</div>
        </div>
      </div>

      <div class="mb-xl">
        <h3 class="text-title mb-sm">Description</h3>
        <p class="text-body whitespace-pre-wrap">${m.description}</p>
      </div>

      <div class="border-t border-light pt-lg mt-auto">
        <h3 class="text-title mb-md">Admin Actions</h3>
        
        <div class="form-group mb-md">
          <label class="form-label">Response / Resolution Notes (visible to user)</label>
          <textarea id="admin-notes" class="form-input" rows="3">${m.adminResponse||""}</textarea>
        </div>

        <div class="flex gap-sm">
          ${m.status==="pending"?`
            <button class="btn btn-primary flex-1" id="btn-review">Mark In Review</button>
          `:""}
          ${m.status!=="resolved"?`
            <button class="btn btn-success flex-1" id="btn-resolve">Resolve</button>
          `:""}
          ${m.status!=="dismissed"?`
            <button class="btn btn-outline flex-1" id="btn-dismiss">Dismiss</button>
          `:""}
        </div>
      </div>
    `;const I=()=>g.querySelector("#admin-notes").value.trim(),N=async M=>{try{await Vn.updateReportStatus(m.id,M,I(),n.uid,e.displayName),ge.success(`Report marked as ${M}`)}catch{ge.error("Failed to update report")}},C=g.querySelector("#btn-review");C&&C.addEventListener("click",()=>N("in_review"));const O=g.querySelector("#btn-resolve");O&&O.addEventListener("click",()=>N("resolved"));const F=g.querySelector("#btn-dismiss");F&&F.addEventListener("click",()=>N("dismissed"))},d=Vn.subscribeToAllReports(m=>{i=m;const g=t.querySelector("#filter-status").value;if(c(g),a){const R=i.find(I=>I.id===a);R&&u(R)}});setTimeout(()=>{t.querySelector("#filter-status").addEventListener("change",g=>{c(g.target.value)})},0);const f=()=>{d(),window.removeEventListener("hashchange",f)};return window.addEventListener("hashchange",f),t},CE=async()=>{const n=de.currentUser,e=await Pe.getUserDoc(n.uid),t=document.createElement("div");t.className="admin-layout flex h-full",t.appendChild(Ke("admin","/admin/jobs"));const r=document.createElement("div");r.className="main-content w-full flex-col",r.appendChild(Ge(e));const s=document.createElement("div");s.className="p-xl flex-col h-full",s.style.maxWidth="1200px",s.style.margin="0 auto",s.innerHTML=`
    <div class="page-header flex justify-between items-center mb-xl">
      <div>
        <h1 class="page-title">All Jobs</h1>
        <p class="page-subtitle">Monitor all system deliveries</p>
      </div>
      <div class="flex gap-sm items-center">
        <label class="text-sm font-bold">Status:</label>
        <select class="form-input w-auto" id="job-status-filter">
          <option value="all">All Jobs</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div class="card p-0" style="overflow-x: auto;">
      <table class="w-full text-left" style="min-width: 800px">
        <thead class="bg-grey-50 border-b border-light text-sm text-secondary">
          <tr>
            <th class="p-md font-bold">ID / Date</th>
            <th class="p-md font-bold">Customer</th>
            <th class="p-md font-bold">Route</th>
            <th class="p-md font-bold">Vehicle / Price</th>
            <th class="p-md font-bold text-center">Status</th>
          </tr>
        </thead>
        <tbody id="jobs-table-body">
          <tr><td colspan="5" class="p-xl text-center"><div class="spinner mx-auto"></div></td></tr>
        </tbody>
      </table>
    </div>
  `,r.appendChild(s),t.appendChild(r);const i=async(a="all")=>{const c=t.querySelector("#jobs-table-body");c.innerHTML='<tr><td colspan="5" class="p-xl text-center"><div class="spinner mx-auto"></div></td></tr>';try{const u=await rn.getAllJobs({status:a});if(u.length===0){c.innerHTML=`<tr><td colspan="5" class="p-xl">${vi("No jobs found","Try changing your filter.","package")}</td></tr>`;return}c.innerHTML="",u.forEach(d=>{const f=d.createdAt?new Intl.DateTimeFormat("en-GB",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(d.createdAt.toDate()):"",m=(d.pricePiastres/100).toFixed(2);c.innerHTML+=`
          <tr class="border-b border-light hover:bg-grey-50 transition-colors">
            <td class="p-md align-top">
              <div class="font-bold text-sm" style="font-family: monospace">${d.id.substring(0,8)}</div>
              <div class="text-xs text-secondary mt-xs">${f}</div>
            </td>
            <td class="p-md align-top">
              <div class="font-bold text-sm">${d.customerName||"Unknown"}</div>
              <div class="text-xs text-secondary mt-xs">${d.customerPhone||""}</div>
            </td>
            <td class="p-md align-top">
              <div class="flex items-start gap-sm mb-xs">
                <div class="w-2 h-2 rounded-full bg-brand-success mt-1"></div>
                <div class="text-xs truncate" style="max-width: 250px" title="${d.pickupAddress}">${d.pickupAddress}</div>
              </div>
              <div class="flex items-start gap-sm">
                <div class="w-2 h-2 rounded-full bg-brand-error mt-1"></div>
                <div class="text-xs truncate" style="max-width: 250px" title="${d.dropoffAddress}">${d.dropoffAddress}</div>
              </div>
            </td>
            <td class="p-md align-top">
              <div class="font-bold text-sm capitalize">${d.vehicleTypeRequired}</div>
              <div class="text-sm mt-xs">${m} EGP</div>
            </td>
            <td class="p-md align-top text-center">
              ${Ht(d.status)}
            </td>
          </tr>
        `})}catch{c.innerHTML='<tr><td colspan="5" class="p-xl text-center text-error">Failed to load jobs</td></tr>'}};return setTimeout(()=>{window.lucide&&window.lucide.createIcons({root:t}),i(),t.querySelector("#job-status-filter").addEventListener("change",c=>i(c.target.value))},0),t},PE=async()=>{const n=de.currentUser,e=await Pe.getUserDoc(n.uid),t=document.createElement("div");t.className="admin-layout flex h-full",t.appendChild(Ke("admin","/admin/users"));const r=document.createElement("div");r.className="main-content w-full flex-col",r.appendChild(Ge(e));const s=document.createElement("div");s.className="p-xl flex-col h-full",s.style.maxWidth="1000px",s.style.margin="0 auto",s.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">Users Directory</h1>
      <p class="page-subtitle">View customers, drivers, and admins</p>
    </div>

    <div class="card p-0" style="overflow-x: auto;">
      <table class="w-full text-left">
        <thead class="bg-grey-50 border-b border-light text-sm text-secondary">
          <tr>
            <th class="p-md font-bold">User</th>
            <th class="p-md font-bold">Role</th>
            <th class="p-md font-bold">Joined</th>
            <th class="p-md font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody id="users-table-body">
          <tr><td colspan="4" class="p-xl text-center"><div class="spinner mx-auto"></div></td></tr>
        </tbody>
      </table>
    </div>
  `,r.appendChild(s),t.appendChild(r);const i=async()=>{const a=t.querySelector("#users-table-body");try{const c=Ta(Vt(me,"users"),Dw("createdAt","desc"),xw(50)),u=await Ca(c);if(a.innerHTML="",u.empty){a.innerHTML='<tr><td colspan="4" class="p-xl text-center text-secondary">No users found</td></tr>';return}u.forEach(d=>{const f=d.data(),m=f.createdAt?new Intl.DateTimeFormat("en-GB",{month:"short",day:"numeric",year:"numeric"}).format(f.createdAt.toDate()):"Unknown";let g=f.displayName?f.displayName.charAt(0).toUpperCase():"U";a.innerHTML+=`
          <tr class="border-b border-light hover:bg-grey-50 transition-colors">
            <td class="p-md">
              <div class="user-row">
                <div class="user-row__avatar user-row__avatar--${f.role||"customer"}">${g}</div>
                <div class="user-row__info">
                  <div class="user-row__name">${f.displayName||"No Name"}</div>
                  <div class="user-row__email">${f.email||"No Email"}</div>
                </div>
              </div>
            </td>
            <td class="p-md">
              <span class="badge badge-${f.role||"customer"} capitalize">${f.role||"Customer"}</span>
            </td>
            <td class="p-md text-sm text-secondary">
              ${m}
            </td>
            <td class="p-md text-right">
              <button class="btn btn-sm btn-ghost" onclick="alert('User editing not implemented in prototype')">View</button>
            </td>
          </tr>
        `})}catch(c){console.error(c),a.innerHTML='<tr><td colspan="4" class="p-xl text-center text-error">Failed to load users</td></tr>'}};return setTimeout(()=>{window.lucide&&window.lucide.createIcons({root:t}),i()},0),t},kE=()=>{const n=document.createElement("div");return n.className="landing-page",n.innerHTML=`
    <!-- Navbar -->
    <nav class="landing-nav">
      <div class="landing-nav__logo">
        <img src="/logo.png" alt="MoveIt Logo" />
        <span>MoveIt</span>
      </div>
      <div class="landing-nav__links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it Works</a>
        <a href="#driver">Become a Driver</a>
        <a href="#/login" class="btn btn-primary landing-nav__login">Portal Login</a>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-content">
        <span class="hero-badge">Egypt's Premier Delivery Network</span>
        <h1 class="hero-title">Delivery Made <span class="text-gradient">Simple & Fast</span></h1>
        <p class="hero-subtitle">
          Book a delivery, track your package in real-time, and get it there safely. 
          MoveIt connects you with a fleet of verified drivers instantly.
        </p>
        <div class="hero-actions">
          <a href="#/signup" class="btn btn-primary btn-large">
            <i data-lucide="smartphone"></i> Get the App
          </a>
          <a href="#/login" class="btn btn-outline btn-large">
            <i data-lucide="layout-dashboard"></i> Web Portal
          </a>
        </div>
      </div>
      <div class="hero-image-wrapper">
        <img src="/hero_delivery.png" alt="MoveIt Delivery" class="hero-image floating" />
      </div>
    </header>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="section-header text-center">
        <h2>Why Choose MoveIt?</h2>
        <p>We built our platform from the ground up to ensure reliability and speed.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon"><i data-lucide="map"></i></div>
          <h3>Real-time Tracking</h3>
          <p>Watch your delivery move on the map from pickup to dropoff with zero delay.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i data-lucide="shield-check"></i></div>
          <h3>Verified Drivers</h3>
          <p>Every driver undergoes a strict KYC check, verifying their national ID and vehicle license.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i data-lucide="wallet"></i></div>
          <h3>Transparent Pricing</h3>
          <p>Know exactly what you'll pay before you book. No hidden fees or surprise surges.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i data-lucide="clock"></i></div>
          <h3>Instant Matching</h3>
          <p>Our algorithm finds the nearest available driver to pick up your package in minutes.</p>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section id="how-it-works" class="how-it-works-section">
      <div class="section-header text-center">
        <h2>How It Works</h2>
      </div>
      <div class="steps-container">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>Request</h3>
          <p>Enter your pickup and dropoff locations, select the vehicle type, and get a quote instantly.</p>
        </div>
        <div class="step-connector"><i data-lucide="arrow-right"></i></div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h3>Match</h3>
          <p>We'll ping nearby verified drivers. Once accepted, you'll see their details and ETA.</p>
        </div>
        <div class="step-connector"><i data-lucide="arrow-right"></i></div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h3>Deliver</h3>
          <p>Track the journey live. Pay securely once the package arrives safely at its destination.</p>
        </div>
      </div>
    </section>

    <!-- Driver Recruitment Section -->
    <section id="driver" class="driver-cta-section">
      <div class="driver-cta-content">
        <h2>Drive with MoveIt</h2>
        <p>Set your own schedule, earn competitive payouts, and join Egypt's fastest-growing delivery network.</p>
        <ul class="driver-benefits">
          <li><i data-lucide="check-circle-2"></i> Low 3% Platform Fee</li>
          <li><i data-lucide="check-circle-2"></i> Instant Payouts</li>
          <li><i data-lucide="check-circle-2"></i> Flexible Hours</li>
        </ul>
        <button class="btn btn-primary btn-large mt-lg">Download Driver App</button>
      </div>
      <div class="driver-cta-image">
        <div class="mockup-frame">
          <!-- Placeholder for driver app mockup -->
          <i data-lucide="truck" size="64" class="text-primary opacity-50"></i>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="landing-nav__logo mb-sm">
            <img src="/logo.png" alt="MoveIt Logo" />
            <span class="text-white">MoveIt</span>
          </div>
          <p class="text-muted">Delivering excellence across Egypt, one package at a time.</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div class="link-group">
            <h4>Legal</h4>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Driver Agreement</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} MoveIt. All rights reserved.</p>
      </div>
    </footer>
  `,n};Z.addRoute("/",kE);Z.addRoute("/login",pE,qd);Z.addRoute("/signup",mE,qd);Z.addRoute("/dashboard",async()=>{const n=de.currentUser;if(!n)return document.createElement("div");const e=await Pe.getUserDoc(n.uid);return(e==null?void 0:e.role)==="admin"?Z.navigate("/admin"):Z.navigate("/customer"),document.createElement("div")});Z.addRoute("/customer",gE,Fe);Z.addRoute("/customer/wallet",_E,Fe);Z.addRoute("/customer/profile",vE,Fe);Z.addRoute("/customer/settings",yE,Fe);Z.addRoute("/customer/jobs",()=>jd({},!1),Fe);Z.addRoute("/customer/history",()=>jd({},!0),Fe);Z.addRoute("/customer/reports",AE,Fe);Z.addRoute(/(?:\/customer\/job\/)(?<id>[a-zA-Z0-9_-]+)/,IE,Fe);Z.addRoute("/admin",RE,Fe);Z.addRoute("/admin/reports",SE,Fe);Z.addRoute("/admin/jobs",CE,Fe);Z.addRoute("/admin/users",PE,Fe);window.logout=async()=>{await Pe.logout(),Z.navigate("/login")};document.addEventListener("DOMContentLoaded",()=>{const n=de.onAuthStateChanged(e=>{n(),Z.handleRoute()})});
