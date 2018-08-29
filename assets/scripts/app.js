// ///<reference path="angular.min.js" />

app = angular.module('fontIranApp', []);

app.service('_messaging', messaging);
app.service('_settings', settings);
app.controller('bodyCtrl', bodyCtrl);


bodyCtrl.$inject = ['$scope', '_settings', '_messaging'];
function bodyCtrl($scope, _settings, _messaging) {
  $scope.addCurrentBtnVis = false;

  $scope.settings = _settings.init((callbackSettings) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      var splitted = tabs[0].url.split('/')
      var ca = $scope.currentAddress = splitted[0] + '//' + splitted[2] + '/';
      if (!ca.includes('google.com') &&
        !ca.includes('twitter.com') &&
        !ca.includes('wikipedia.org') &&
        !ca.includes('linkedin.com') &&
        !ca.includes('telegram.org') &&
        !ca.includes('instagram.com') &&
        !ca.includes('facebook.com') &&
        !ca.includes('trello.com') &&
        !ca.includes('whatsapp.com') &&
        callbackSettings.websites.findIndex(w => w.urls.includes(ca+'*')) == -1) {
          console.log('x', ca + '*')
          console.log('xx', callbackSettings.websites)
          console.log('xxx', callbackSettings.websites.findIndex(w => true))
          $scope.addCurrentBtnVis = true;
        }
      $scope.$apply();
    })
  });


  $scope.update = function () {
    _settings.save($scope.settings);
  }

  $scope.addWebsite = function (address) {
    var title = address.replace(/https?:\/\//, '').replace('/', '');
    var model = {
      id: Math.max.apply(null, $scope.settings.websites.map(x => x.id)) + 1,
      title: title,
      urls: [`${address}*`],
      active: true,
      deletable: true,
      style: {
        'font-family': 'default',
        'font-size': 1,
        'line-height': 1.7
      }
    }

    var ind = $scope.settings.websites.findIndex(x => x.title == title);
    if (ind == -1) {
      $scope.settings.websites.push(model);
      _settings.save($scope.settings);
    }

    $scope.newSite = '';
    $scope.addCurrentBtnVis = false;
  };

  $scope.remove = function (w, ev) {
    ev.preventDefault();
    var ind = $scope.settings.websites.findIndex(function (x) { return x === w });
    // $scope.settings.websites.splice(ind, 1);
    $scope.settings.websites[ind].active = false;
    $scope.settings.websites[ind].hide = true;
    _settings.save($scope.settings);
  }

  $scope.expand = function (s) {
    if (s.expanded) s.expanded = false;
    else {
      $scope.settings.websites.forEach(function (x) { x.expanded = false; })
      s.expanded = true;
    }
    _settings.save($scope.settings);
  }
}

function messaging() {
  var service = {
    send: function (settings) {
      var toBeRemovedWebsites = [];
      for (var websiteInd = 0 ; websiteInd < settings.websites.length; websiteInd++) {
        var website = settings.websites[websiteInd];
        if (website.hide) toBeRemovedWebsites.push(websiteInd);
        (function (active, website, def) {
          chrome.tabs.query({ url: website.urls }, function (tabs) {
            for (var tab of tabs) {
              chrome.tabs.sendMessage(tab.id, { t: 'Specific', active, website, def })
            }
          });
        })(website.active, website, settings.default)
      }

      toBeRemovedWebsites.forEach(i => {
        settings.websites.splice(i, 1);
      });

      // chrome.tabs.query({ url: '*://*/*' }, function (tabs) {
      //   for (var tab of tabs) {
      //     var tDomain = tab.url.split('//')[1].split('/')[0];
      //     var specificDomains = settings.websites
      //       .map((x) => x.urls)
      //       .reduce((a, c) => a.concat(c))
      //       .map((x) => x.split('//')[1].split('/')[0]);

      //     if (!specificDomains.includes(tDomain))
      //       chrome.tabs.sendMessage(tab.id, {
      //         t: 'Default',
      //         setting: settings.default
      //       })
      //   }
      // });
    }
  }

  return service;
}

settings.$inject = ['_messaging'];
function settings(_messaging) {
  var service = {
    settings: null,
    init: function (callback) {
      var settings = JSON.parse(localStorage.getItem('fontIranSettings_v2'));
      var defaultSettings = {
        default: {
          'font-family': 'hamcker_IRANSans',
          'font-size': 1,
          'line-height': 1.7
        },
        websites: [
          {
            id: 1,
            title: "Google",
            active: true,
            urls: ['https://www.google.com/*'],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            }/*,
            selectors: [
              '.wf-b #cnt',
              '.wf-b #cnt .g',
              '.wf-b #cnt .std',
              '.wf-b #cnt h1',
              '.wf-b #cnt input',
              '.wf-b #cnt select',
              '.wf-b .g-bbl-container'
            ]*/
          }, {
            id: 2,
            title: "Twitter",
            active: true,
            urls: ['https://twitter.com/*', 'https://tweetdeck.twitter.com/'],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            }
          }, {
            id: 3,
            title: "Google Translate",
            active: true,
            urls: ["https://translate.google.com/*"],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            },
            not : [
              '#gt-tl-gms',
              '#gt-sl-gms',
              '.jfk-button'
            ]
          }, {
            id: 4,
            title: "GMail",
            active: true,
            urls: ["https://mail.google.com/*"],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            },
            selectors: [
              ".ICsgXc",
              '.Mu',
              '.yP',
              '.y6',
              '.y2',
              '.hP',
              '.hI .iA',
              '.ii',
              '.nr',
              '.gsfs',
              '.asor_f',
              '#gbqfq',
              '.TsiDff',
              '.ng',
              '.Bb .ng',
              '#gbqfqb',
              '#gbqfqc',
              '.gbqfif',
              '.gbqfsf',
              '.gssb_m',
              '.nH.bkK.nn .gmail_default',
              '.nH.bkK.nn .MsoNormal',
              '.a3s',
              '.hx .gD',
              '.zF',
              '.yX.xY'
            ],
            notIn: [
              '.cf.An'
            ]
          }, {
            id: 5,
            title: "Wikipedia",
            active: true,
            urls: ["https://fa.wikipedia.org/*"],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            }
          }, {
            id: 6,
            title: "LinkedIn",
            active: true,
            urls: ["https://www.linkedin.com/*"],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            }
          }, {
            id: 7,
            title: "Google+",
            active: true,
            urls: ["https://plus.google.com/*"],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            }
          }, {
            id: 8,
            title: "Telegram",
            active: true,
            urls: ["https://web.telegram.org/*"],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            }
          }, {
            id: 9,
            title: "Instagram",
            active: true,
            urls: ["https://www.instagram.com/*"],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            }
          }, {
            id: 10,
            title: "Facebook",
            active: true,
            urls: ["https://www.facebook.com/*"],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            }
          }, {
            id: 11,
            title: "Trello",
            active: true,
            urls: ["https://trello.com/*"],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            }
          }, {
            id: 12,
            title: "Whatsapp",
            active: true,
            urls: ["https://web.whatsapp.com/*"],
            style: {
              'font-family': 'default',
              'line-height': 1.7,
              'font-size': 1
            }
          }
        ]
      };

      if (!settings)
        localStorage.setItem('fontIranSettings_v2', JSON.stringify(defaultSettings));

      var outlet = JSON.parse(localStorage.getItem('fontIranSettings_v2'));
      callback && callback(outlet)
      return outlet;
    },
    save: function (settings) {
      localStorage.setItem('fontIranSettings_v2', JSON.stringify(settings));
      _messaging.send(settings);
    }
  }

  return service;
}