
// 👉 LA seule ligne à modifier quand tu veux forcer un rechargement du cache
window.SITE_VERSION = 68;

(function () {
  function vAsset(path) {
    var v = window.SITE_VERSION;
    var sep = path.indexOf('?') === -1 ? '?' : '&';
    var url = path + sep + 'v=' + v;

    if (/\.css(\?|$)/i.test(path)) {
      document.write('<link rel="stylesheet" href="' + url + '">');
    } else {
      document.write('<script src="' + url + '"><' + '/script>');
    }
  }

  // Petit helper pour le pattern "chargement asynchrone séquentiel"
  // déjà utilisé sur index.html (await load(...)). Renvoie une Promise.
  function loadAsync(path) {
    var v = window.SITE_VERSION;
    var sep = path.indexOf('?') === -1 ? '?' : '&';
    var url = path + sep + 'v=' + v;
    return new Promise(function (res) {
      var s = document.createElement('script');
      s.src = url;
      s.onload = res;
      s.onerror = res;
      document.body.appendChild(s);
    });
  }

  window.vAsset = vAsset;
  window.loadAsync = loadAsync;
})();
