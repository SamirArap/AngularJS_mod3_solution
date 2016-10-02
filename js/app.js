(function(){
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .directive('foundItems', FoundItems);
  

  function FoundItems() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&',
        error: '<'
      }
    };

    return ddo;
  }


  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
    menu.shortName="";
    menu.error="";

    menu.getMatchedMenuItems = function(searchTerm) {
      if(searchTerm ==="" || searchTerm === undefined) {
        menu.error= "Nothing found!"
      }
      else {
        menu.error = "";
        var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
        promise.then(function (response) {
          menu.found = [];
          menu.found = response;
          
          if(menu.found.length === 0){
            menu.error = "Nothing found";
          }
          console.log(menu.error);
          console.log(menu.shortName);
          console.log(searchTerm);
        })
        .catch(function (error) {
          console.log("Something went terribly wrong.");
        });
      }
    }
    menu.removeItem = function(itemIndex){
      MenuSearchService.removeItem(itemIndex);
      console.log("item removed");
      console.log(menu.found.length);
    }
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
    var menuItems = [];
    var matchedItems = [];
  
    service.getMatchedMenuItems = function(searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      matchedItems = [];
      console.log(searchTerm);
      return $http({
         method: "GET",
         url: (ApiBasePath + "/menu_items.json")
       }).then(function (result) {
      
        // process result and only keep items that match
        menuItems = result.data;
        menuItems = menuItems.menu_items;

        console.log(menuItems[0].description);

        for(var i = 0 ; i <= menuItems.length-1; i++){
          var itemdesc = menuItems[i].description;
          if(itemdesc.toLowerCase().indexOf(searchTerm) !== -1 ){
            matchedItems.push(menuItems[i]);
          }
        }
      
      console.log("Matched Items: ", matchedItems, matchedItems.length);
      console.log(menuItems.length);
      
      // return processed items
      return matchedItems;

      });
    };

    service.removeItem = function (itemIndex) {
      matchedItems.splice(itemIndex, 1);
    };
  }

})();
