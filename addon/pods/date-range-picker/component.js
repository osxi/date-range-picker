import Ember from 'ember';
import layout from './template';
import ClickOutside from 'date-range-picker/mixins/click-outside';
import Picker from 'date-range-picker/mixins/picker';
import Clearable from 'date-range-picker/mixins/clearable';
import PickerActions from 'date-range-picker/mixins/picker-actions';
import moment from 'moment';

const {
  computed,
  run,
  Component,
} = Ember;

export default Component.extend(ClickOutside, Picker, Clearable, PickerActions, {
  endMonth: moment().startOf('month'),
  layout,
  startMonth: moment().startOf('month'),

  didInsertElement() {
    let {
      startDate,
      endDate,
      startMonth,
      endMonth
    } = this.getProperties('startDate', 'endDate', 'startMonth', 'endMonth');

    this.setProperties({
      initialStartDate: startDate,
      initialEndDate: endDate,
      initialStartMonth: startMonth,
      initialEndMonth: endMonth
    });

    run.next(this, () => {
      this.notifyPropertyChange('startDate');
      this.notifyPropertyChange('endDate');
    });
  },

  rangeFormatted: computed('startDate', 'endDate', function() {
    let startDate = this.get('startDate').format('MM/DD/YYYY');
    let endDate = this.get('endDate').format('MM/DD/YYYY');

    return `${startDate} - ${endDate}`;
  }),

  actions: {
    apply() {
      this.send('toggleIsExpanded');
      this.sendAction('apply', this.get('startDate'), this.get('endDate'));
    },

    endSelected(day) {
      let startDate = this.get('startDate');

      if (day.isBefore(startDate)) {
        this.set('startDate', day);
      }

      this.set('endDate', day);
    },

    nextEndMonth() {
      this.set('endMonth', this.get('endMonth').add(1, 'month').clone());
    },

    nextStartMonth() {
      this.set('startMonth', this.get('startMonth').add(1, 'month').clone());
    },

    parseInput() {
      let [ start, end ] = this.get('rangeFormatted').split(' - ');

      this.setProperties({
        startDate: moment(start, 'MM/DD/YYYY'),
        endDate: moment(end, 'MM/DD/YYYY'),
        startMonth: moment(start, 'MM/DD/YYYY'),
        endMonth: moment(end, 'MM/DD/YYYY'),
      });
    },

    prevEndMonth() {
      this.set('endMonth', this.get('endMonth').add(-1, 'month').clone());
    },

    prevStartMonth() {
      this.set('startMonth', this.get('startMonth').add(-1, 'month').clone());
    },

    startSelected(day) {
      let endDate = this.get('endDate');

      if (day.isAfter(endDate)) {
        this.set('endDate', day);
      }

      this.set('startDate', day);
    },
  }
});