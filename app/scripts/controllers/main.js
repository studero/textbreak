'use strict';

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

/**
 * @ngdoc function
 * @name textbreakApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the textbreakApp
 */
angular.module('textbreakApp')
  .controller('MainCtrl', function ($scope, $http, $window) {    
    $scope.pagesHeight = $window.innerHeight - 36;    

    $scope.elements = [
      {
        id: 0,
        title: 'elem 1 - 1/3 page',
        grid: 3,
        background: '#ababab',
        size: 3,
        layout: []
      },
      {
        id: 1,
        title: 'elem 2 - 1 page',
        grid: 1,
        background: '#ababab',
        size: 1,
        layout: []
      },
      {
        id: 2,
        title: 'elem 3 - 1 1/4 page',
        grid: 4,
        background: '#ababab',
        size: 5,
        layout: []
      },
      {
        id: 3,
        title: 'elem 4 - 2/3 page',
        grid: 3,
        size: 6,
        background: '#cdcdcd',
        position: {
          page: 1,
          column: 0,
          row: 0
        },
        layout: [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: 1
          },
          {
            x: 0,
            y: 2
          },
          {
            x: 1,
            y: 0
          },
          {
            x: 1,
            y: 1
          },
          {
            x: 1,
            y: 2
          }
        ]
      },
      {
        id: 4,
        title: 'elem 5 - 1/4 page',
        grid: 4,
        size: 4,
        background: '#ababab',
        position: {
          page: 2,
          column: 1,
          row: 1
        },
        layout: [
          {
            x: 0,
            y: 0
          },
          {
            x: 1,
            y: 0
          },
          {
            x: 0,
            y: 1
          },
          {
            x: 0,
            y: 2
          }
        ]
      },
      {
        id: 5,
        title: 'elem 6 - 1/8 page',
        grid: 4,
        size: 2,
        background: '#ababab',
        layout: [
          {
            x: 0,
            y: 0
          },
          {
            x: 1,
            y: 0
          }
        ]
      }
    ];

    $scope.pages = [
      {
        id: 0,
        title: 'page title 1',
        collapsed: false,
        height: 300,
        width: 200,
        grid: 4
      },
      {
        id: 1,
        title: 'page title 2',
        collapsed: false,
        height: 300,
        width: 200,
        grid: 3
      },
      {
        id: 2,
        title: 'page title 3',
        collapsed: false,
        height: 300,
        width: 200,
        grid: 4
      }
    ];

    $scope.onDropComplete = function (data, evt, page, x, y) {
      console.log("onDropComplete", data, evt);
      data.position = {
        page: page.id,
        column: x,
        row: y
      };
      console.log("new element", data);
    }
    
    $scope.toggleLayout = function (x, y) {
      console.log(x, y);
      var exist = $scope.currentElement.layout.find(function(element, index, array) { return element.x == x && element.y == y; });
      if(exist != undefined){
        $scope.currentElement.layout.splice($scope.currentElement.layout.indexOf(exist), 1);
      } else {
        var newLayout = {x: x, y: y};
        $scope.currentElement.layout.push(newLayout);
      }
    }
    
    $scope.layoutClass = function (x, y) {
      var c = 'layout-inactive';
      $scope.currentElement.layout.forEach(function(l){
        if(l.x == x && l.y == y){
          c = 'layout-active';          
        }
      });
      return c;
    }

    $scope.editElement = function (element) {
      $scope.currentElement = element;      
      $(".colorpicker").colorpicker().on('changeColor.colorpicker', function (event) {
        $scope.currentElement.background = event.color.toHex();
        $scope.$digest();
      });
      $scope.layoutEditorGrid = Array.apply(null, { length: element.layout.length + 1 }).map(Number.call, Number);
    }

    $scope.onDragSuccess = function (data, evt) {
      console.log("onDragSuccess", data, evt);
      /*var index = $scope.droppedObjects1.indexOf(data);
      if (index > -1) {
        $scope.droppedObjects1.splice(index, 1);
      }*/
    }

    $scope.withoutPosition = function (element) {
      if (element === undefined) {
        return false;
      }
      return element.position === undefined;
    }
    
    $scope.layoutEditorGridSize = 16;    

    $scope.setGrid = function (page, grid) {
      page.grid = grid;
    }

    $scope.addPageBefore = function (page) {
      addNewPage($scope.pages.indexOf(page));
    }

    $scope.addPageAfter = function (page) {
      addNewPage($scope.pages.indexOf(page) + 1);
    }

    $scope.removeElement = function (element) {
      element.position = undefined;
    }
    
    $scope.$watch('elements', function(value){
      $scope.elementsJson = angular.toJson($scope.elements, true);
    }, true);
    
    $scope.$watch('pages', function(value){
      $scope.pagesJson = angular.toJson($scope.pages, true);
    }, true);
    
    $scope.elementsJsonKeyUp = function(){
      $scope.elements = angular.fromJson($scope.elementsJson);
    }
    
    $scope.pagesJsonKeyUp = function(){
      $scope.pages = angular.fromJson($scope.pagesJson);
    }

    $scope.addElement = function () {
      var newId = maxId($scope.elements) + 1;
      var newElement = { id: newId, position: undefined, title: 'new element ' + newId, grid: 3, background: '#ababab' };
      console.log("newId", newId);
      $scope.elements.push(newElement);
      console.log("elements size", $scope.elements.length);
    }

    function addNewPage(idx) {
      var newId = maxId($scope.pages) + 1;
      var newPage = { id: newId, grid: 3, height: 300, width: 200 };
      console.log("newId", newId);
      $scope.pages.insert(idx, newPage);
    }

    function maxId(items) {
      var id = 0;
      items.forEach(function (item) {
        if (item.id > id) {
          id = item.id;
        }
      });
      return id;
    }

    $scope.withinPage = function (page) {
      return function (element) {
        if (element === undefined) {
          return false;
        }
        if (element.position === undefined) {
          return false;
        }
        return element.position.page == page.id;
      };
    }

    $scope.getGrid = function (gridSize) {
      return Array.apply(null, { length: gridSize }).map(Number.call, Number);
    }

  });
