'use strict';
chrome || (chrome = browser);

chrome.tabs.onCreated.addListener(function(tab) {
    chrome.pageAction.show(tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (!changeInfo.status == 'complete') return;

    tab.url && chrome.pageAction.show(tabId);

    var settings = JSON.parse(localStorage.getItem('fontIranSettings'));
    if (settings) {
        var styleSheet = '';
        for (var website of settings.websites) {
            (function(active, website, def) {
                chrome.tabs.query({ url: website.urls }, function(tabs) {
                    for (var tab of tabs) {
                        chrome.tabs.sendMessage(tab.id, { t: 'Specific', active, website, def })
                    }
                });
            })(website.active, website, settings.default)
        }
        // chrome.tabs.query({ url: '*://*/*' }, function(tabs) {
        //     for (var tab of tabs) {
        //         var tDomain = tab.url.split('//')[1].split('/')[0];
        //         var specificDomains = settings.websites
        //             .map((x) => x.urls)
        //             .reduce((a, c) => a.concat(c))
        //             .map((x) => x.split('//')[1].split('/')[0]);

        //         if (!specificDomains.includes(tDomain))
        //             chrome.tabs.sendMessage(tab.id, {
        //                 t: 'Default',
        //                 setting: settings.default
        //             })
        //     }
        // });
    }
});