/// <reference path="../MasterController.ts"/>
/// <reference path="../../view/IView.ts"/>
/// <reference path="../../router/IRouter.ts"/>

/// <reference path="../../../98-frameworks/cordova/plugins/AppVersion.d.ts"/>
/// <reference path="../../../98-frameworks/cordova/plugins/InAppBrowser.d.ts"/>
/// <reference path="../../../98-frameworks/cordova/plugins/CordovaPluginEmailComposer.d.ts"/>

namespace freeradios.presentation.controller.home {
  export class InfoController extends MasterController {
    constructor(view?: view.IView, masterView?: view.IView) {
      super('Info', 'templates/home/info.html', view, masterView);
    }

    public createView(callback: (view: view.IView) => any) {
      super.createView(function(view: view.IView) {
        view.assign('versionNumber', AppVersion.version);
        view.assign('buildNumber', AppVersion.build);
        callback(view);
      });
    }

    public destroyView() {
      super.destroyView();
    }

    public onready() {
      super.onready();
      $('*[data-open-in-browser]').each(function() {
        utilities.runtime.PlatformEvent.bindClickListenerJQuery($(this), function() {
          if (navigator.userAgent.match(/android/i)) {
            navigator.app.loadUrl('http://www.freie-radios.de/', { openExternal: true });
          } else {
            window.open('http://www.freie-radios.de/', '_system');
          }
        });
      });
      $('*[data-email-link]').each(function() {
        utilities.runtime.PlatformEvent.bindClickListenerJQuery($(this), function() {
          cordova.plugins.email.open({ to: ['freieradioapp@freefm.de'] });
        });
      });
    }
  }
}
