/* global jQuery */
/* global $ */
/* global DOM */

class JQuery {
  static setup(html) {
    if (typeof global === "undefined") {
      // Browser
      return import("jquery");
    }

    // node.js
    let promise = Promise.resolve();
    if (global.$) {
      // jQuery is already defined, can't reset the DOM because
      // import() won't re-run side-effecting dependencies such as
      // jquery so have to re-use the existing document. WARNING:
      // subtle bugs may lie ahead! :-(
      if (html) {
        let Fs;
        $("head").html("");
        promise = import("fs")
        .then(mods => Fs = mods[0].promises)
        .then(() => Fs.readFile(html))
        .then(buf => {
          // Only the body, ignore the head
          const html = buf.toString().replace(
            /.*<body[^>]*>(.*)<\/body>.*/, "$1")
          ;
          //console.debug("$HTML", html.length);
          $("body").html(html);
        });
      } else {
        $("head").html("");
        $("body").html("");
        return Promise.resolve();
      }
    }

    // jQuery not yet defined (assumes same HTML)
    return promise
    .then(() => Promise.all([
      import("jsdom"),
      import("jquery")
    ]))
    .then(mods => {
      const jsdom = mods[0];
      const jquery = mods[1].default;
      const JSDOM = jsdom.JSDOM;

      return Promise.resolve(new JSDOM(html || `<!doctype html><html></html>"`))
      .then(dom => {
        global.DOM = dom;
        global.window = dom.window;
        global.document = dom.window.document;
        global.navigator = { userAgent: "node.js" };
        global.$ = global.jQuery = jquery(window);
      });
    });
  }
}

export { JQuery };
