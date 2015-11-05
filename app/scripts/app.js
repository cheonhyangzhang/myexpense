/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  app.ready = false;
  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!document.querySelector('platinum-sw-cache').disabled) {
      document.querySelector('#caching-complete').show();
    }
  };
  app.onDataRouteClick = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  addEventListener('paper-header-transform', function(e) {
    var appName = document.querySelector('#mainToolbar .app-name');
    var middleContainer = document.querySelector('#mainToolbar .middle-container');
    var bottomContainer = document.querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1-maxMiddleScale))  + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onDataRouteClick = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.getElementById('mainContainer').scrollTop = 0;
  };


  app.services = {
    getAllExpenses: function(){
      console.log(this);
      app.api.expenseList(null, null, function(resp){
        console.log("getAllExpenses");
        console.log(resp);
      }); 
    }
  }

  app.ajax = function(method, theUrl,data, callback)
  {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4)
            callback(JSON.parse(xmlHttp.response));
    }
    xmlHttp.open(method, theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.setRequestHeader("x-access-token", app.api.token);
    xmlHttp.send(data);
  }

  app.api_url = 'http://localhost:8080/api/';
  app.api = {
    token:"",
    isReady:false,
    user:{},
    _serialize:function(obj) {
      var str = [];
      for(var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    },
    authenticate:function(from, userid, token, callback){
      var api = this;
      app.ajax("POST", app.api_url + "authenticate", "from=Google&userid="+userid+"&token="+token, function(resp){
        api.token = resp.token;
        api.user = resp.user;
        api.isReady = true;
        callback(resp);
      });
    },
    expenseListMonth:function(period, callback){
      console.log("expenseListMonth");
      var after = period + "/1";
      var year = period.split("/")[0]; 
      var month  = period.split("/")[0]; 
      var beforeTime = new Date(year, month, 1);
      beforeTime.setMonth(month + 1);
      var before = beforeTime.getFullYear() + "/" + beforeTime.getMonth() + "/1";
      this.expensesList(after, before, callback);
    },
    expenseListRemoveMonth:function(period, callback){
      console.log("expenseListMonth");
      console.log("period");
      console.log(period);
      var after = period + "/1";
      var year = period.split("/")[0]; 
      var month  = period.split("/")[1]; 
      console.log(year);
      console.log(month);
      var beforeTime = new Date(year, month, 1);
      console.log(beforeTime);
      // beforeTime.setMonth(month + 1);
      var before = beforeTime.getFullYear() + "/" + (beforeTime.getMonth() + 1) + "/1";
      console.log(before);
      this.expenseListRemove(after, before, callback);
    },
    expenseListRemove:function(after, before, callback){
      console.log("expenseListRemove");
      console.log(after);
      console.log(before);
      var query = "?holder=holder";
      if (after){
        query += "&after=" + after;
      }
      if (before){
        query += "&before=" + before;
      }
      app.ajax("DELETE", app.api_url + "expenses" + query, "", function(resp){
        callback(resp);
      });
    },
    expenseList:function(after, before, callback){
      console.log("expenseList");
      var query = "?username="+this.user.username;
      if (after){
        query += "&after=" + after;
      }
      if (before){
        query += "&before=" + before;
      }
      app.ajax("GET", app.api_url + "expenses" + query, "", function(resp){
        callback(resp);
      });
    },
    expenseCreate:function(newExpense, callback){
      var newExpenseUrlData = this._serialize(newExpense);
      app.ajax("POST", app.api_url + "expenses", newExpenseUrlData, function(resp){
        console.log("js ajax call POST /expenses");
        callback(resp);
      });

    },
    userCreate:function(username, from, fromName, displayName, token, callback){
      console.log("userCreate");
      app.ajax("POST", app.api_url + "users", "username="+username + "&from="+from+"&fromName="+fromName+"&displayName="+displayName+"&token="+token, function(resp){
        console.log("js ajax call resp");
        console.log(typeof(resp));
        console.log(resp);
        callback(resp);
      });

    }
  }

})(document);
