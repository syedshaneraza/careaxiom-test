const async = require("async");
const http = require("http");
const url = require("url");
const rp = require("request-promise");

function isURL(str) {
  var urlRegex =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var url = new RegExp(urlRegex);
  return url.test(str);
}

function renderSuccess(res, titles) {
  const titleArray = titles.map((title) => `<li>${title}</li>`);
  res.write(`<html>
<head></head>
<body>

    <h1> Following are titles of the given websites: </h1>
    <ul>
       ${titleArray}
    </ul>
</body>
</html>`);
  res.end();
}

function renderInvalidUrls(res, titles) {
  res.write(`<html>
<head></head>
<body>

    <ul>
       ${titles}
    </ul>
</body>
</html>`);
  res.end();
}

exports.getTitles = function (req, res) {
  var pathname = url.parse(req.url).pathname;

  if (pathname === "/task-1/I/want/title/") {
    var queryString = url.parse(req.url).query;
    var queryParams = queryString.split("&");
    var urlsToVisit = queryParams.map((item) => item.split("=")[1]);

    urlsToVisit = urlsToVisit.map((url) => {
      if (url.includes("http://") && url.includes("www")) {
        return url;
      }
      if (url.includes("http://") && !url.includes("www")) {
        const urlLastPart = url.split("//").pop();
        return `http://www.${urlLastPart}`;
      }
      if (!url.includes("http://") && url.includes("www")) {
        return "http://" + url;
      }
      return "http://www." + url;
    });

    // validation
    var invalidUrls = urlsToVisit.filter((url) => {
      if (isURL(url)) {
        return url;
      }
    });
    if (invalidUrls.length) {
      return renderInvalidUrls(
        res,
        invalidUrls.map((item) => `${item.split("//").pop()} - NO RESPONSE`)
      );
    }

    var noOfPagesFetched = 0;
    var extractedTitles = [];

    function processPage(url) {
      http.get(url, (resp) => {
        resp.setEncoding("utf8");
        let body = "";
        resp.on("data", (data) => {
          body += data;
        });
        resp.on("end", () => {
          noOfPagesFetched++;
          var titleText = /\<title\>(.*)\<\/title\>/gi.exec(body);
          if (titleText) {
            url = url.split("//").pop();
            extractedTitles.push(`${url} - "${titleText[1]}"`);
          } else {
            extractedTitles.push(url + " - NO TITLE SPECIFIED ON THIS SITE");
          }

          if (noOfPagesFetched == urlsToVisit.length) {
            renderSuccess(res, extractedTitles);
          }
        });
      });
    }

    for (var i = 0; i < urlsToVisit.length; i++) {
      processPage(urlsToVisit[i]);
    }
  } else {
    res.write("404 NOT FOUND");
    res.end();
  }
};

exports.getAsyncTitles = function (req, res) {
  var pathname = url.parse(req.url).pathname;

  if (pathname === "/task-2/I/want/title/") {
    var queryString = url.parse(req.url).query;
    var queryParams = queryString.split("&");
    var urlsToVisit = queryParams.map((item) => item.split("=")[1]);

    urlsToVisit = urlsToVisit.map((url) => {
      if (url.includes("http://") && url.includes("www")) {
        return url;
      }
      if (url.includes("http://") && !url.includes("www")) {
        const urlLastPart = url.split("//").pop();
        return `http://www.${urlLastPart}`;
      }
      if (!url.includes("http://") && url.includes("www")) {
        return "http://" + url;
      }
      return "http://www." + url;
    });

    // validation
    var invalidUrls = urlsToVisit.filter((url) => {
      if (isURL(url)) {
        return url;
      }
    });
    if (invalidUrls.length) {
      return renderInvalidUrls(
        res,
        invalidUrls.map((item) => `${item.split("//").pop()} - NO RESPONSE`)
      );
    }

    var noOfPagesFetched = 0;
    var extractedTitles = [];

    function processPage(url) {
      http.get(url, (resp) => {
        resp.setEncoding("utf8");
        let body = "";
        resp.on("data", (data) => {
          body += data;
        });
        resp.on("end", () => {
          noOfPagesFetched++;
          var titleText = /\<title\>(.*)\<\/title\>/gi.exec(body);
          if (titleText) {
            url = url.split("//").pop();
            extractedTitles.push(`${url} - "${titleText[1]}"`);
          } else {
            extractedTitles.push(url + " - NO TITLE SPECIFIED ON THIS SITE");
          }

          if (noOfPagesFetched == urlsToVisit.length) {
            renderSuccess(res, extractedTitles);
          }
        });
      });
    }

    async.each(urlsToVisit, processPage, function (err) {
      renderSuccess(res, extractedTitles);
    });
  } else {
    res.write("404 NOT FOUND");
    res.end();
  }
};

exports.getPromiseTitles = function (req, res) {
  var pathname = url.parse(req.url).pathname;

  if (pathname === "/task-3/I/want/title/") {
    var queryString = url.parse(req.url).query;
    var queryParams = queryString.split("&");
    var urlsToVisit = queryParams.map((item) => item.split("=")[1]);

    urlsToVisit = urlsToVisit.map((url) => {
      if (url.includes("http://") && url.includes("www")) {
        return url;
      }
      if (url.includes("http://") && !url.includes("www")) {
        const urlLastPart = url.split("//").pop();
        return `http://www.${urlLastPart}`;
      }
      if (!url.includes("http://") && url.includes("www")) {
        return "http://" + url;
      }
      return "http://www." + url;
    });

    // validation
    var invalidUrls = urlsToVisit.filter((url) => {
      if (isURL(url)) {
        return url;
      }
    });
    if (invalidUrls.length) {
      return renderInvalidUrls(
        res,
        invalidUrls.map((item) => `${item.split("//").pop()} - NO RESPONSE`)
      );
    }

    var extractedTitles = [];
    var promises = urlsToVisit.map((url) => rp(url));

    const allPromise = Promise.all(promises);
    allPromise.then((pages) => {
      pages.forEach((page) => {
        var titleText = /\<title\>(.*)\<\/title\>/i.exec(page);
        if (titleText) {
          urlsToVisit = urlsToVisit[0].split("//").pop();
          extractedTitles.push(`${urlsToVisit} - "${titleText[1]}"`);
        } else {
          extractedTitles.push(
            urlsToVisit + " - NO TITLE SPECIFIED ON THIS SITE"
          );
        }
      });
      renderSuccess(res, extractedTitles);
    });
  } else {
    res.write("404 NOT FOUND");
    res.end();
  }
};
