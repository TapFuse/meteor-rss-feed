Meteor.startup(function () {
  tp_rssQueries.find().observe({
    added: function(doc) {
      Meteor.call('getRssFeed', doc.link);
    }
  });
});

//Insert used to cache items from RSS feed.
const wrappedRssFeedInsert = Meteor.bindEnvironment(function(item) {
  tp_rssCache.upsert({link: item.link}, {$set: {
    title: item.title,
    description: item.description,
    pubDate: item.pubDate,
    image: item.image,
    language: item.language,
    tags: item.tags,
  }}, function(err, res) {
    if (err) {
      console.log(err);
    }
  });
}, "Failed to insert tweet into tp_rssCache collection.");

Meteor.methods({
  getRssFeed: function(link) {
    const feedData = Scrape.feed(link);
    if (feedData) {
      for (const item of feedData.items) {
        wrappedRssFeedInsert(item);
      }
    }
  },
  getRssFeedFromAllLinks: function() {
    const links = tp_rssQueries.find().fetch();
    if (links) {
      for (const link of links) {
        const feedData = Scrape.feed(link.link);
        if (feedData) {
          for (const item of feedData.items) {
            wrappedRssFeedInsert(item);
          }
        }
      }
    }
  },
  addRssFeedQuery: function(link) {
    tp_rssQueries.insert({link: link});
  }
});