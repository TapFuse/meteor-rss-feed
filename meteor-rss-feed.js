// Meteor.startup(function () {
//   tp_rssQueries.find({}, {limit: 1}).observe({
//     added: function(doc) {
//       Meteor.call('getRssFeedByQueryId', doc.queryId);
//     }
//   });
// });

//Insert used to cache items from RSS feed.
const wrappedRssFeedInsert = Meteor.bindEnvironment(function(item, queryId) {
  tp_rssCache.upsert({link: item.link, queryId: queryId}, {$set: {
    queryId: queryId,
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
  getRssFeedByQueryId: function(queryId) {
    const link = tp_rssQueries.findOne({queryId: queryId});
    if(link) {
      const feedData = Scrape.feed(link.link);
      if (feedData) {
        for (const item of feedData.items) {
          wrappedRssFeedInsert(item, link.queryId);
        }
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
            wrappedRssFeedInsert(item, link.queryId);
          }
        }
      }
    }
  },
  addRssFeedQuery: function(queryId, link) {
    tp_rssQueries.insert({
      queryId: queryId,
      link: link
    });
  }
});