(function() {
    'use strict';
    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItemsDirective);

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                myTitle: '@title',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'foundList',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {
        var foundList = this;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var narrowdown = this;
        narrowdown.searchTerm = "";
        narrowdown.foundItems = "";
        narrowdown.search = function() {
            narrowdown.nothingFound = "";
            if (narrowdown.searchTerm) {
                var promise = MenuSearchService.getMatchedMenuItems(narrowdown.searchTerm.toLowerCase());
                promise.then(function(foundItems) {
                    if (foundItems.length == 0) {
                        narrowdown.nothingFound = "Nothing found";
                    }
                    narrowdown.foundItems = foundItems;
                })

            } else {
                narrowdown.nothingFound = "Nothing found";
                narrowdown.foundItems = "";
            }
        };
        narrowdown.removeItem = function(itemIndex) {
            narrowdown.foundItems.splice(itemIndex, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath']

    function MenuSearchService($http, ApiBasePath) {
        var service = this;
        service.getMatchedMenuItems = function(searchTerm) {
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            });

            return response.then(function(result) {
                var menuData = result.data;
                var foundItems = [];
                menuData.menu_items.forEach(function(item) {
                    if (item.description.indexOf(searchTerm) != -1) {
                        foundItems.push({
                            name: item.name,
                            short_name: item.short_name,
                            description: item.description
                        });
                    }
                });
                return foundItems;
            });
        };
    }

})();
