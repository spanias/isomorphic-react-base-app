/**
 * Created by Turmoil on 01/11/2015.
 */
var dateAdd = function(date, interval, units)
{
    var ret = new Date(date); //don't change original date
    switch (interval.toLowerCase()) {
        case 'year'   :
            ret.setFullYear(ret.getFullYear() + units);
            break;
        case 'quarter':
            ret.setMonth(ret.getMonth() + 3 * units);
            break;
        case 'month'  :
            ret.setMonth(ret.getMonth() + units);
            break;
        case 'week'   :
            ret.setDate(ret.getDate() + 7 * units);
            break;
        case 'day'    :
            ret.setDate(ret.getDate() + units);
            break;
        case 'hour'   :
            ret.setTime(ret.getTime() + units * 3600000);
            break;
        case 'minute' :
            ret.setTime(ret.getTime() + units * 60000);
            break;
        case 'second' :
            ret.setTime(ret.getTime() + units * 1000);
            break;
        default       :
            ret = undefined;
            break;
    }
    return ret;
}
export {dateAdd as DateAdd}

var millisecondDifference = function(date1, date2){
    return Math.abs(date2.getTime() - date1.getTime());
}
export {millisecondDifference as MillisecondDifference}