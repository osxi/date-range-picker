import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

moduleForComponent('date-range-picker', 'Integration | Component | date range picker', {
  integration: true
});

const monthFormat = 'MMM';

const yearFormat = 'YYYY';

const format = 'MM/DD/YYYY';

const startDate = moment().startOf('month');

const endDate = moment().endOf('month');

test('it renders', function(assert) {
  let today = moment('2016-03-11', 'YYYY-MM-DD');

  this.set('today', today);

  this.render(hbs`{{date-range-picker startDate=today
                                      endDate=today
                                      initiallyOpened=true}}`);

  let calendar_days = this.$(".dp-calendar-body").text().trim();
  assert.equal(calendar_days.match(new RegExp('[0-9]{1,2}', 'g')).length, 84, 'Has 84 days represented');

  let calendar_header = this.$(".dp-calendar-header").text().trim();
  assert.equal(calendar_header.match(new RegExp('[0-9]{4}', 'g')).length, 2, 'Has two years represented');
});

test('will accept strings as startDate and endDate', function(assert) {
  this.setProperties({startDate, endDate});

  this.render(hbs`{{date-range-picker startDate=startDate
                                      endDate=endDate
                                      initiallyOpened=true}}`);

  let dateInput = this.$('input.dp-date-input').val();
  let expectedDateRangeText = `${startDate.format(format)}—${endDate.format(format)}`;

  assert.equal(dateInput, expectedDateRangeText, 'displays correct range in range input');
});

test('prev/next buttons travel through time', function(assert) {
  this.setProperties({startDate, endDate});

  this.render(hbs`{{date-range-picker startDate=startDate
                                      endDate=endDate
                                      initiallyOpened=true}}`);

  let $leftCal = this.$('.dp-display-calendar:first');
  let $rightCal = this.$('.dp-display-calendar:last');
  let [ leftMonth, leftYear, rightMonth, rightYear ] = allText($leftCal, $rightCal);

  assert.equal(leftMonth, startDate.format(monthFormat), 'startDate month is initial value.');
  assert.equal(leftYear, startDate.format(yearFormat), 'startDate year is initial value.');
  assert.equal(rightMonth, endDate.format(monthFormat), 'endDate month is initial value.');
  assert.equal(rightYear, endDate.format(yearFormat), 'endDate year is intitial value.');

  $leftCal.find('.dp-previous-month').click();

  [ leftMonth, leftYear, rightMonth, rightYear ] = allText($leftCal, $rightCal);
  assert.equal(leftMonth, lastMonth(startDate, monthFormat), 'startDate month should be decremented by one.');
  assert.equal(leftYear, lastMonth(startDate, yearFormat), 'startDate year should be decermented by one.');
  assert.equal(rightMonth, endDate.format(monthFormat), 'endDate month should not change.');
  assert.equal(rightYear, endDate.format(yearFormat), 'endDate year should not change.');

  $leftCal.find('.dp-next-month').click();

  [ leftMonth, leftYear, rightMonth, rightYear ] = allText($leftCal, $rightCal);
  assert.equal(leftMonth, startDate.format(monthFormat), 'startDate month is initial value.');
  assert.equal(leftYear, startDate.format(yearFormat), 'startDate year is initial value.');
  assert.equal(rightMonth, endDate.format(monthFormat), 'endDate month is initial value.');
  assert.equal(rightYear, endDate.format(yearFormat), 'endDate year is intitial value.');

  $rightCal.find('.dp-next-month').click();

  [ leftMonth, leftYear, rightMonth, rightYear ] = allText($leftCal, $rightCal);
  assert.equal(leftMonth, startDate.format(monthFormat), 'startDate month should not change.');
  assert.equal(leftYear, startDate.format(yearFormat), 'startDate year should not change.');
  assert.equal(rightMonth, nextMonth(endDate, monthFormat), 'endDate month should be incremented by one.');
  assert.equal(rightYear, nextMonth(endDate, yearFormat), 'endDate year should be incremented by one.');

  $rightCal.find('.dp-previous-month').click();

  [ leftMonth, leftYear, rightMonth, rightYear ] = allText($leftCal, $rightCal);
  assert.equal(leftMonth, startDate.format(monthFormat), 'startDate month is initial value.');
  assert.equal(leftYear, startDate.format(yearFormat), 'startDate year is initial value.');
  assert.equal(rightMonth, endDate.format(monthFormat), 'endDate month is initial value.');
  assert.equal(rightYear, endDate.format(yearFormat), 'endDate year is intitial value.');
});

test('has a default date of today', function(assert) {
  let today = moment().startOf('day').format("MM/DD/YYYY");

  this.render(hbs`{{date-range-picker initiallyOpened=true}}`);
  let text = this.$('.dp-date-input')[0].value.trim();
  assert.equal(text.match(new RegExp(today, 'g')).length, 2, 'startDate and endDate defaults to today');
});

test('can choose a new startDate month & year', function(assert) {
  this.setProperties({
    startDate: moment('2016-04-19', 'YYYY-MM-DD'),
    endDate: moment('2016-05-19', 'YYYY-MM-DD')
  });

  this.render(hbs`{{date-range-picker startDate=startDate
                                      endDate=endDate
                                      initiallyOpened=true}}`);

  let $leftCal = this.$('.dp-display-calendar:first');
  let $rightCal = this.$('.dp-display-calendar:last');

  // Left side

  $leftCal.find('.dp-btn-month').click();
  $leftCal.find(".dp-month-body button:contains('Mar')").click();
  assert.equal($leftCal.find(".dp-btn-month").text().trim(), 'Mar', 'Start month button displays Mar.');

  $leftCal.find('.dp-btn-year').click();
  $leftCal.find(".dp-year-body button:contains('2015')").click();
  assert.equal($leftCal.find('.dp-btn-year').html().trim(), '2015', 'Start year button display 2015.');

  $leftCal.find('.dp-btn-year').click();
  $leftCal.find(".dp-day:contains('15')").click();

  assert.equal(this.$('.dp-date-input').val(), '03/15/2015—05/19/2016', 'Outer input is updated.');
  assert.equal(this.$('.dp-presets-date-input').val(), '03/15/2015—05/19/2016', 'Inner input is updated.');
  assert.equal(this.get('startDate').format(format), '03/15/2015', 'startDate is updated.');
  assert.equal(this.get('endDate').format(format), '05/19/2016', 'endDate does not change.');

  // Right side

  $rightCal.find('.dp-btn-month').click();
  $rightCal.find(".dp-month-body button:contains('Jun')").click();
  assert.equal($rightCal.find(".dp-btn-month").text().trim(), 'Jun', 'End month button displays Jun.');

  $rightCal.find('.dp-btn-year').click();
  $rightCal.find(".dp-year-body button:contains('2017')").click();
  assert.equal($rightCal.find('.dp-btn-year').html().trim(), '2017', 'End year button display 2017.');

  $rightCal.find('.dp-btn-year').click();
  $rightCal.find(".dp-day:contains('20')").click();

  assert.equal(this.$('.dp-date-input').val(), '03/15/2015—06/20/2017', 'Outer input is updated.');
  assert.equal(this.$('.dp-presets-date-input').val(), '03/15/2015—06/20/2017', 'Outer input is updated.');
  assert.equal(this.get('startDate').format(format), '03/15/2015', 'startDate does not change.');
  assert.equal(this.get('endDate').format(format), '06/20/2017', 'endDate is updated.');
});

test('can render 12/25/2015', function(assert) {
  let today = moment('2015-12-25', 'YYYY-MM-DD');

  this.set('today', today);

  this.render(hbs`{{date-range-picker startDate=today
                                      endDate=today
                                      initiallyOpened=true}}`);

  let $leftCal = this.$('.dp-display-calendar:first');

  assert.equal($leftCal.find('.dp-day').length, 42, '12/2015 has the correct number of days');
  let firstOfMonth = $leftCal.find(".dp-day").not(".dp-other-month").filter(function() { return $(this).text().trim() === "1"; });
  assert.equal(firstOfMonth.length, 1, '12/1/2015 shows up');
  let endOfMonth = $leftCal.find(".dp-day").not(".dp-other-month").filter(function() { return $(this).text().trim() === "31"; });
  assert.equal(endOfMonth.length, 1, '12/31/2015 shows up');
});

test('can render 12/31/2017', function(assert) {
  let today = moment('2017-12-31', 'YYYY-MM-DD');

  this.set('today', today);

  this.render(hbs`{{date-range-picker startDate=today
                                      endDate=today
                                      initiallyOpened=true}}`);

  let $leftCal = this.$('.dp-display-calendar:first');

  assert.equal($leftCal.find('.dp-day').length, 42, '12/2017 has the correct number of days');
  let firstOfMonth = $leftCal.find(".dp-day").not(".dp-other-month").filter(function() { return $(this).text().trim() === "1"; });
  assert.equal(firstOfMonth.length, 1, '12/1/2017 shows up');
  let endOfMonth = $leftCal.find(".dp-day").not(".dp-other-month").filter(function() { return $(this).text().trim() === "31"; });
  assert.equal(endOfMonth.length, 1, '12/31/2017 shows up');
});

test('converts strings to moments', function(assert) {
  let dateString = '3015-01-02';
  let dateStringMoment = moment(dateString, 'YYYY-MM-DD');

  this.setProperties({
    startDate: dateString,
    endDate: dateString,
  });

  this.render(hbs`{{date-range-picker startDate=startDate
                                      endDate=startDate
                                      initiallyOpened=true}}`);

  let $leftCal = this.$('.dp-display-calendar:first');
  let $rightCal = this.$('.dp-display-calendar:last');
  let [ leftMonth, leftYear, rightMonth, rightYear ] = allText($leftCal, $rightCal);

  assert.equal(leftMonth, dateStringMoment.format(monthFormat), 'startDate month is initial value.');
  assert.equal(leftYear, dateStringMoment.format(yearFormat), 'startDate year is initial value.');
  assert.equal(rightMonth, dateStringMoment.format(monthFormat), 'endDate month is initial value.');
  assert.equal(rightYear, dateStringMoment.format(yearFormat), 'endDate year is intitial value.');
});

test('automatically scrolls to selected year', function(assert) {
  let dateString = '3015-01-02';

  this.setProperties({
    startDate: dateString,
    endDate: dateString,
  });

  this.render(hbs`{{date-range-picker startDate=startDate
                                      endDate=startDate
                                      initiallyOpened=true}}`);

  this.$('.dp-btn-year').first().click();

  let $btn = this.$(`.dp-calendar-header:first .dp-btn-year-option:contains('3015'):visible`);
  let parentHeight = $btn.parent().height();
  let parentScrollTop = $btn.parent().scrollTop();
  assert.equal($btn.length, 1);
  assert.equal($btn.offset().top < (parentHeight + parentScrollTop), true, 'selected year is visible');
});
function allText($leftCalendar, $rightCalendar) {
  return text($leftCalendar).concat(text($rightCalendar));
}

function text($calendar) {
  return [
    $calendar.find('.dp-btn-month').text().trim(),
    $calendar.find('.dp-btn-year').text().trim()
  ];
}

function lastMonth(date, format) {
  return date.clone().subtract(1, 'month').format(format);
}

function nextMonth(date, format) {
  return date.clone().add(1, 'month').format(format);
}
