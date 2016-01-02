"use strict";angular.module("appApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngMaterial","underscore","leaflet"]).config(["$routeProvider","$logProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).otherwise({redirectTo:"/"}),b.debugEnabled(!1)}]),angular.module("appApp").controller("MainCtrl",["$scope","$http","$mdSidenav","$mdDialog",function(a,b,c,d){d.show({template:'<div aria-label="loading" layout="column" layout-align="center center">    <md-progress-circular md-mode="indeterminate"></md-progress-circular></div>',parent:angular.element(document.body),clickOutsideToClose:!1}),a.config={controlsOpen:!1},a.datasets={languages:void 0,countries:void 0,regions:void 0},b.get("/data/index.json").then(function(b){a.datasets.languages=b.data,console.log("Languages",a.datasets.languages)}),b.get("/data/countries.json").then(function(b){a.datasets.countries=b.data,console.log("Countries",a.datasets.countries)}),a.toggleSideNav=function(){c("right").toggle()}}]),angular.module("appApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("appApp").directive("markerLegend",function(){return{templateUrl:"views/marker-legend.html",restrict:"E",scope:{colours:"="},link:function(a,b,c){}}}),angular.module("appApp").directive("browse",["$http","$mdSidenav","configuration",function(a,b,c){return{templateUrl:"views/browse.html",restrict:"E",scope:{countries:"=",languages:"=",isVisible:"="},link:function(d,e,f){d.$watch("isVisible",function(){d.isVisible&&(c.selectedLanguage?(d.show("language",{code:c.selectedLanguage}),delete c.selectedLanguage):d.browseCountries())}),d.show=function(b,c){"country"===b?(d.showBreadcrumb=!0,d.country=c.name,d.title="Browse languages in "+d.country,d.items={list:_.sortBy(d.countries[d.country].language_data,function(a){return a.name}),what:"language"},d.error=!1):"language"===b&&a.get("/data/"+c.code+".json").then(function(a){d.title="";a.data;d.languageData=a.data,d.error=!1},function(a){delete d.languageData,d.error=!0})},d.browseCountries=function(){d.showBreadcrumb=!1,d.country=null,delete d.languageData,d.title="Browse countries",d.items={list:_.sortBy(d.countries,function(a){return a.name}),what:"country"}},d.browseLanguages=function(){d.title="Browse languages in "+d.country,delete d.languageData},d.back=function(){d.languageData?d.browseLanguages():d.country&&d.browseCountries()},d.close=function(){b("right").toggle()}}}}]),angular.module("underscore",[]).factory("_",function(){return window._}),angular.module("leaflet",[]).factory("leaflet",function(){return window.L}),angular.module("appApp").directive("leaflet",["leaflet","_","configuration","$compile","$mdDialog","$window","$mdSidenav",function(a,b,c,d,e,f,g){return{template:'<div id="map"></div>',restrict:"E",scope:{languages:"="},link:function(a,h,i){angular.element(document.getElementById("map"))[0].style.height=.9*f.innerHeight+"px";var j=L.map("map",{minZoom:1}).setView([0,0],2);L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',noWrap:!0}).addTo(j);var k=b.compact(b.map(a.languages,function(e){if(parseFloat(e.coords[0])&&parseFloat(e.coords[2])){var f=0;b.each(e.resources,function(a){f+=a});var g;g=20>f?c.markerColours[0]:150>f?c.markerColours[1]:c.markerColours[2];var h=d("<span><h4>"+e.name+"<br/> ("+f+" resources)</h4><br/><a href='' ng-click='moreInfo(\""+e.code+"\")'>more information</a></span>")(a),i=L.marker(new L.LatLng(parseFloat(e.coords[0]),parseFloat(e.coords[2])),{clickable:!0,icon:L.MakiMarkers.icon({icon:"marker",color:g,size:"l"})});return i.bindPopup(h[0]),i}})),l=L.markerClusterGroup();l.addLayers(k),j.addLayer(l),e.cancel(),a.moreInfo=function(a){c.selectedLanguage=a,g("right").toggle()}}}}]),angular.module("appApp").constant("configuration",{languageArchives:"http://www.language-archives.org",map:{width:"100%",height:.95*window.innerHeight},markerColours:["#ea1540","#ff8c00","#2eb82e"]}),angular.module("appApp").directive("resourceRenderer",["$timeout","$rootScope","configuration",function(a,b,c){return{templateUrl:"views/resource-renderer.html",restrict:"E",scope:{title:"@",resources:"="},link:function(d,e,f){d.resources=_.map(d.resources,function(a,b){return a.replace("/item/",c.languageArchives+"/item/")}),d.config={pageSize:10,start:0,numberFrom:1,hide:!0,enablePagination:!1,me:!1},d.$on("close-item",function(){d.config.me||(d.config.hide=!0),d.config.me=!1}),d.$watch("searchResults",function(){d.searchResults&&(d.resources=d.searchResults),d.updateSet()},!0),d.resources.length>d.config.pageSize?(d.resourceSet=d.resources.slice(0,d.config.pageSize),d.enablePagination=!0):d.resourceSet=d.resources,d.updateSet=function(){d.config.numberFrom=d.config.start+1,d.resourceSet=d.resources.slice(d.config.start,d.config.start+d.config.pageSize)},d.jumpToStart=function(){d.config.start=0,d.updateSet()},d.back=function(){d.config.start-=d.config.pageSize,d.config.start<0&&(d.config.start=0),d.updateSet()},d.forward=function(){d.config.start<d.resources.length-d.config.pageSize&&(d.config.start+=d.config.pageSize),d.updateSet()},d.jumpToEnd=function(){d.config.start=d.resources.length-d.config.pageSize,d.updateSet()},d.toggleItem=function(){d.config.me=!0,b.$broadcast("close-item"),a(function(){d.config.hide=!d.config.hide},10)}}}}]),angular.module("appApp").directive("searchResources",function(){return{templateUrl:"views/search-resources.html",restrict:"E",scope:{resources:"=",searchResults:"="},link:function(a,b,c){a.originalResources=a.resources,a.search=function(){a.what.length<3?a.searchResults=a.originalResources:a.what.length>2&&(a.searchResults=_.compact(_.map(a.originalResources,function(b){var c=(a.what,RegExp(a.what,"im")),d=b.search(c);return-1!=d?b:void 0})))},a.reset=function(){delete a.what,a.searchResults=a.originalResources}}}}),angular.module("appApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/browse.html",'<md-toolbar layout="row" class="md-padding"> <md-button class="md-primary" ng-click="back()" ng-if="country">back</md-button> <h5>{{title}}</h5> <span flex></span> <md-button class="md-primary" ng-click="close()">close</md-button> </md-toolbar> <md-content ng-if="!languageData"> <md-list> <md-list-item ng-click="show(items.what, item)" ng-repeat="item in items.list"> {{item.name}}<span ng-if="item.count">&nbsp;({{item.count}} languages)</span> </md-list-item> </md-list> </md-content> <md-content ng-if="languageData"> <h4 class="md-title"><span ng-if="country">{{country}}:</span> {{languageData.name}}</h4> <p> <a href="{{languageData.url}}" target="_blank">{{languageData.url}}</a> </p> <md-list> <span ng-if="languageData.resources[\'Primary texts\']"> <resource-renderer title="Primary Texts" resources="languageData.resources[\'Primary texts\'].resources"></resource-renderer> </span> <span ng-if="languageData.resources[\'Lexical resources\']"> <resource-renderer title="Lexical Resources" resources="languageData.resources[\'Lexical resources\'].resources"></resource-renderer> </span> <span ng-if="languageData.resources[\'Language descriptions\']"> <resource-renderer title="Language Descriptions" resources="languageData.resources[\'Language descriptions\'].resources"></resource-renderer> </span> <span ng-if="languageData.resources[\'Other resources about the language\']"> <resource-renderer title="Other resources about the language" resources="languageData.resources[\'Other resources about the language\'].resources"></resource-renderer> </span> </md-list> </md-content> <md-content ng-if="error" layout="column" layout-align="center center"> <img src="images/error.6d052d18.svg"> Whatever your language and however you say it it doesn\'t change the fact that something went wrong trying to get the data for that language! </md-content>'),a.put("views/main.html",'<div layout="column" ng-if="datasets.languages"> <md-content> <md-card> <md-card-content> <leaflet languages="datasets.languages" ng-if="datasets.languages"></leaflet> </md-card-content> </md-card> </md-content> <md-fab-speed-dial class="md-fab-bottom-right" style="z-index: 10000"> <md-fab-trigger> <md-button aria-label="menu" class="md-fab md-warn" ng-click="toggleSideNav()"> <i class="material-icons md-48">add</i> </md-button> </md-fab-trigger> </md-fab-speed-dial> </div> <md-sidenav class="md-sidenav-right md-whiteframe-z2" md-component-id="right" style="z-index: 10000" md-is-open="config.controlsOpen"> <md-content> <div layout="column" layout-padding> <md-content flex="50" layout-padding> <browse countries="datasets.countries" languages="datasets.languages" is-visible="config.controlsOpen"></browse> </md-content> </div> </md-content> </md-sidenav>'),a.put("views/marker-legend.html",'<div layout="row" class="legendOverlay"> <span ng-repeat="colour in colours"> <div style="background-color: {{colour}}; width: 40px; height: 40px"></div> </span> </div>'),a.put("views/resource-renderer.html",'<div layout="column"> <md-list-item ng-click="toggleItem()"> {{title}} ({{resources.length}}) </md-list-item> <span ng-hide="config.hide"> <md-divider></md-divider> <search-resources resources="resources" search-results="searchResults"></search-resources> <div layout="column"> <ol class="no-margin" start="{{config.numberFrom}}"> <span ng-repeat="resource in resourceSet"> <p ng-bind-html="resource"></p> </span> </ol> </div> <div class="" layout="row" layout-align="center center" ng-if="enablePagination" flex> <md-button class="md-primary" ng-click="jumpToStart()"><i class="material-icons">fast_rewind</i></md-button> <md-button class="md-primary" ng-click="back()"><i class="material-icons">skip_previous</i></md-button> <md-button class="md-primary" ng-click="forward()"><i class="material-icons">skip_next</i></md-button> <md-button class="md-primary" ng-click="jumpToEnd()"><i class="material-icons">fast_forward</i></md-button> </div> <md-divider></md-divider> </span> </div>'),a.put("views/search-resources.html",'<div layout="row"> <md-input-container flex> <label>Filter the resources</label> <input type="text" ng-model="what" ng-change="search()"> </md-input-container> <md-button ng-click="reset()" class="md-primary">Reset</md-button> </div>')}]);