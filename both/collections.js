Posts = new Mongo.Collection('posts');

Posts.attachSchema(new SimpleSchema({
  title: {
    type: String,
    max: 200,
    autoform: {
      'label-type': 'stacked'
    }
  },
  body: {
    type: String,
    autoform: {
      rows: 10,
      'label-type': 'stacked'
    }
  },
  published: {
    type: Boolean,
    defaultValue: true,
    autoform: {
      type: 'toggle'
    }
  }
}));

Rides = new Mongo.Collection('rides');

Triggers = new Mongo.Collection('triggers');

ChartData = new Mongo.Collection('chartdata');

Farmers = new Mongo.Collection('farmers');

