(function () {
  'use strict';

  // Configuring the Courses Admin module
  
  angular
    .module('courses.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Courses',
      state: 'admin.courses.list'
    });
  }
}());
