///<reference path="jquery-3.3.1.min.js" />
'use strict';

Array.prototype.unique = function () {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
};

var done = true, handler, pageMessage, pageStyle = null;
var selectors = [
  'div',
  'span', 'i', 'strong',
  'button',
  'a',
  'td', 'th',
  'dd', 'dl',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p',
  'input', 'select', 'textarea',
  'address', 'b'
], notIn = [], not = [], customSelectors = false;

function scanElems(next) {
  if (!done || !pageMessage) return;
  done = false;
  try {
    if (pageMessage.active) {
      var sels = (() => {
        if (notIn.length)
          return notIn.map(ni => selectors.map(x => (not.length) ? not.map(n => `body :not(${ni}) ${x}:not(${n},.fontIran)`).join(',') : `body :not(${ni}) ${x}:not(.fontIran)`).join(',') + ',body').join(',')
        else
          return selectors.map((x) => not.length ? not.map(n => `body ${x}:not(${n},.fontIran)`).join(',') : `body ${x}:not(.fontIran)`).join(',') + ',body'
      })();
      for (var el of $(sels)) {
        if ($(el).attr('originalStyle') == null) $(el).attr('originalStyle', $(el).attr('style'));
        if ($(el).attr('originalFontFamily') == null) $(el).attr('originalFontFamily', $(el).css('font-family'));
        if ($(el).attr('originalFontSize') == null) $(el).attr('originalFontSize', $(el).css('font-size'));
        if ($(el).attr('originalLineHeight') == null) $(el).attr('originalLineHeight', $(el).css('line-height'));
      };
      for (var el of $(sels)) {
        el.style.setProperty('font-family', `var(--fontIranFont), ${$(el).attr('originalFontFamily')}`, 'important');
        el.style.setProperty('font-size', `calc(var(--fontIranFontSize) * ${$(el).attr('originalFontSize')})`, 'important')
        el.style.setProperty('line-height', 'var(--fontIranLineHeight)', 'important');

        $(el).addClass('fontIran');
      }
    }
    else {
      for (var el of $(selectors.map((x) => `body ${x}.fontIran`).join(',') + ',body')) {
        $(el).css('font-family', $(el).attr('originalFontFamily'))

        $(el).css('font-size', $(el).attr('originalFontSize'))
        $(el).css('line-height', $(el).attr('originalLineHeight'))
        $(el).attr('style', $(el).attr('originalStyle') ? $(el).attr('originalStyle') : '');
        $(el).removeClass('fontIran');
      }
    }
  } catch (error) {
    done = true
  }
  done = true;
}
handler = setInterval(scanElems, 1000)


chrome || (chrome = browser);
chrome.runtime.onMessage.addListener(function (message, sender) {
  // Specific
  if (!sender.tab && message.t === 'Specific') {
    pageMessage = message;
    var styleTag = $('#FontIranFonts').length > 0;
    if (styleTag) $('#FontIranFonts').text('');
    if (message.active) {
      var messageFontFamily = message.website.style['font-family'],
        defaultFontFamily = message.def['font-family'],
        selectedFontFamily = messageFontFamily == 'default' ? defaultFontFamily : messageFontFamily;
      if (!styleTag)
        $('head').append($(`
        <style id="FontIranFonts">
          :root {
            --fontIranFont: ${selectedFontFamily};
            --fontIranLineHeight: ${message.website.style['line-height']};
            --fontIranFontSize: ${message.website.style['font-size']};
          }
        </style>`));
      else
        $('#FontIranFonts').text(`
          :root {
            --fontIranFont: ${selectedFontFamily};
            --fontIranLineHeight: ${message.website.style['line-height']};
            --fontIranFontSize: ${message.website.style['font-size']};
          }`);
      if (message.website.selectors) {
        selectors = message.website.selectors;
        customSelectors = true;
      }
      else {
        customSelectors = false;
      }
      if (message.website.notIn) notIn = message.website.notIn;
      if (message.website.not) not = message.website.not;
    }
  }

  //General
  // if (!sender.tab && message.t === 'Default') {
  //   $('#FontIranFonts').remove();
  //   $('head').append($(`<style id="FontIranFonts">
  //     :root {
  //       --fontIranFont: ${message.setting['font-family']}
  //     }
  //   </style>`))
  //   pageStyle = message.setting;
  // }
});