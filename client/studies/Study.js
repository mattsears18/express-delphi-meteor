Template.Study.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var studyId = FlowRouter.getParam('studyId');
    self.subscribe('currentStudy', studyId);
    self.subscribe('alternatives', studyId);
    self.subscribe('criteria', studyId);
    self.subscribe('roundRatings', studyId);
  });
});

Template.Study.helpers({
  study: () =>      { return Studies.findOne(); },
  alternatives: () => { return Alternatives.find(); },
  criteria: () => { return Criteria.find(); },

  pairsSelector: function() {
    study = Studies.findOne({_id: FlowRouter.getParam('studyId')});
    if(study) {
      return {
        studyId: FlowRouter.getParam('studyId'),
        round: study.currentRound,
      };
    }
  },
});


Template.Study.events({
  'click .next-round': function() {
    Meteor.call('studies.startNextRound', {
      studyId: FlowRouter.getParam('studyId'),
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        FlowRouter.go('rate', {studyId: FlowRouter.getParam('studyId')});
      }
    });
  },
  'click .fa-pencil': function() {
    Session.set('updateStudy', true);
  },
});


Template.Study.destroyed = function(){
  Session.set('updateStudy', false);
}
