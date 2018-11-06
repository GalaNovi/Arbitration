var INCREASE_MINUTES = 1;
var dateNow = new Date(Date.now());

var toIncreaseTime = function (date) {
  date.setMinutes(date.getMinutes() + INCREASE_MINUTES);
  date = date.toLocaleString().replace(",", "").replace(/\./g, "/");
  var dateArr = date.split('');
  var temp = [dateArr[0], dateArr[1]];
  dateArr[0] = dateArr[3];
  dateArr[1] = dateArr[4];
  dateArr[3] = temp[0];
  dateArr[4] = temp[1];
  date = dateArr.join('');
  return date;
}

$('.countdown').downCount({
  date: toIncreaseTime(dateNow),
  offset: +3,
}, function () {
  var message = document.querySelector('.download__alert');
  message.textContent = 'К сожалению, акция закончилась... ¯\\_(ツ)_/¯';
});
