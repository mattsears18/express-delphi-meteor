import Pairs from './Pairs';
import { jStat } from 'jStat';

Pairs.helpers({
  alternative() {
    return Alternatives.findOne(this.alternativeId);
  },
  criterion() {
    return Criteria.findOne(this.criterionId);
  },
  currentUserRating() {
    return Ratings.findOne({
      pairId: this._id,
      userId: Meteor.user()._id,
    });
  },
  ratings() {
    return Ratings.find({
      pairId: this._id,
    });
  },
  ratingsWithComments() {
    return ratings = Ratings.find({
      pairId: this._id,
      comment: {$exists: true},
    });
  },
  ratingValues() {
    ratings = this.ratings();

    ratingValues = [];
    ratings.forEach(function(rating){
      ratingValues.push(rating.value);
    });

    return ratingValues;
  },
  ratingMin() {
    return jStat.min(this.ratingValues());
  },
  ratingMax() {
    return jStat.max(this.ratingValues());
  },
  ratingRange() {
    return jStat.range(this.ratingValues());
  },
  ratingMean() {
    return jStat.mean(this.ratingValues());
  },
  ratingMeanRounded() {
    return Math.round(this.ratingMean() * 1000) / 1000;
  },
  ratingMedian() {
    return jStat.median(this.ratingValues());
  },
  ratingMedianRounded() {
    return Math.round(this.ratingMedian() * 1000) / 1000;
  },
  minDash() {
    if(this.ratingMedian() % 1 != 0) {
      return pair.ratingMedian() - 1;
    } else {
      return pair.ratingMedian() - 1.5;
    }
  },
  maxDash() {
    if(this.ratingMedian() % 1 != 0) {
      return pair.ratingMedian() + 1;
    } else {
      return pair.ratingMedian() + 1.5;
    }
  },
  weightedRatingMedian() {
    criterion = Criteria.findOne({_id: this.criterionId});
    return this.ratingMedian() * criterion.weightNormalized() / 100;
  },
  weightedRatingMedianRounded() {
    return Math.round(this.weightedRatingMedian() * 1000) / 1000;
  },
  weightedRatingMean() {
    criterion = Criteria.findOne({_id: this.criterionId});
    return this.ratingMean() * criterion.weightNormalized() / 100;
  },
  weightedRatingMeanRounded() {
    return Math.round(this.weightedRatingMean() * 1000) / 1000;
  },
  ratingMode() {
    return jStat.mode(this.ratingValues());
  },
  ratingMeddev() {
    return jStat.meddev(this.ratingValues());
  },
  ratingMeddevRounded() {
    return Math.round(this.ratingMeddev() * 1000) / 1000;
  },
  ratingMaxdev() {
    pair = this;
    maxDev = 0;
    pair.ratingValues().forEach(function(val) {
      dev = Math.abs(val - pair.ratingMedian());
      if(dev > maxDev) {
        maxDev = dev;
      }
    })
    return maxDev;
  },
  ratingMaxdevRounded() {
    return Math.round(this.ratingMaxdev() * 1000) / 1000;
  },
  ratingMeandev() {
    return jStat.meandev(this.ratingValues());
  },
  ratingMeandevRounded() {
    return Math.round(this.ratingMeandev() * 1000) / 1000;
  },
  ratingMaxCount() {
    var store = this.ratingValues();
    var frequency = {};
    var max = 0;  // holds the max frequency.
    var result;   // holds the max frequency element.
    for(var v in this.ratingValues()) {
      frequency[store[v]]=(frequency[store[v]] || 0)+1; // increment frequency.
      if(frequency[store[v]] > max) { // is this frequency > max so far ?
        max = frequency[store[v]];  // update max.
        result = store[v];          // update result.
      }
    }

    return max;
  },
  placeholderRange() {
    return this.minVal + ' to ' + this.maxVal + ' Allowed this Round';
  },
  previousRoundPair() {
    return Pairs.findOne({
      studyId: this.studyId,
      alternativeId: this.alternativeId,
      criterionId: this.criterionId,
      round: (this.round - 1)
    });
  },
});
