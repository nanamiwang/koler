angular.module('starter')
  .directive('videoView', function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      template: '<div class="video-container"></div>',
      replace: true,
      link: function (scope, element, attrs) {
        function updatePosition() {
          if(window.cordova)
            window.cordova.plugins.phonertc.setVideoView({
              container: element[0],
              local: {
                position: [240, 240],
                size: [50, 50]
              }
            });
        }

        $timeout(updatePosition, 500);
        $rootScope.$on('videoView.updatePosition', updatePosition);
      }
    }
  });