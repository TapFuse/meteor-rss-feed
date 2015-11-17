Package.describe({
  name: 'tapfuse:meteor-rss-feed',
  version: '0.0.1',
  summary: 'RSS feed caching',
  git: 'https://github.com/TapFuse/meteor-rss-feed.git',
  documentation: 'README.md'
});

var S = 'server';
var C = 'client';
var CS = [C, S];

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  //Dependency
  api.use('tapfuse:collection-global@1.0.0');
  api.use('mongo');
  //Files
  api.addFiles('meteor-rss-feed.js', S);
  api.addFiles('globals-client.js', C);
  api.addFiles('globals-server.js', S);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('tapfuse:meteor-rss-feed');
  api.addFiles('meteor-rss-feed-tests.js');
});
