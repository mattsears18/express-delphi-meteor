import SimpleSchema from 'simpl-schema';
import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';

SimpleSchema.extendOptions(['autoform']);

Criteria = new Mongo.Collection('criteria');

Criteria.allow({
  insert: function(userId, doc) {
    return !!userId;
  },
  update: function(userId, doc) {
    return !!userId;
  },
  remove: function(userId, doc) {
    return !!userId;
  },
});

CriterionSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  desc: {
    type: String,
    label: 'Description',
    autoform: {
      rows: 8
    },
    optional: true,
  },
  weight: {
    type: Number,
    label: 'Weight',
    optional: true,
  },
  studyId: {
    type: String,
    label: 'Study',
    optional: true,
    autoform: {
      value: function() {
        return FlowRouter.getParam('studyId');
      },
      type: 'hidden'
    }
  },
  ownerId: {
    type: String,
    autoValue: function() {
      return this.userId;
    },
    autoform: {
      type: 'hidden',
    },
  },
  createdAt: {
    type: Date,
    label: 'Create At',
    autoValue: function() {
      return new Date();
    },
    autoform: {
      type: 'hidden',
    },
  },
});


Criteria.attachSchema(CriterionSchema);


CriteriaTabular = new Tabular.Table({
  name: "Criteria",
  collection: Criteria,
  columns: [
    {
       data: "name",
       title: "Name",
       render: function(data, type, row, meta){
          data = '<a href="/studies/' + FlowRouter.getParam('studyId') + '/criteria/' + row._id + '">' + data + '</a>';
          return data;
       }
    },
    {data: "desc", title: "Description"},
    {
      data: "weight",
      title: "Weight (%)",
      render: function(weight, type, criterion, meta){
        if(weight) {
          data = `${weight} <strong>(${criterion.weightNormalizedRounded()}%)</strong>`;
          return data;
        }
      }
    },
  ],
  lengthChange: false,
});

export default Criteria;
