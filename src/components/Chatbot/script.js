const script = () => {
  (function (w, d, s, o, f, js, fjs) {
    w.botsonic_widget = o;
    w[o] =
      w[o] ||
      function () {
        // eslint-disable-next-line
      (w[o].q = w[o].q || []).push(arguments);
      }; // eslint-disable-next-line
  (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
    js.id = o;
    js.src = f;
    js.async = 1;
    fjs.parentNode.insertBefore(js, fjs);
  })(
    window,
    document,
    'script',
    'Botsonic',
    'https://widget.writesonic.com/CDN/botsonic.min.js'
  ); // eslint-disable-next-line
  Botsonic("init", {
    serviceBaseUrl: 'https://api.botsonic.ai',
    token: '32bc4ca3-70f4-46f3-9a00-a74924fad548',
  });
};

export default script;
