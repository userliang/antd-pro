import moment from 'moment';

export function formatTime(value: string | number | Date, type: string | 's') {
  if (!value) {
    return '';
  }
  switch (type) {
    case 's':
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    case 'm':
      return moment(value).format('YYYY-MM-DD HH:mm');
    case 'H':
      return moment(value).format('YYYY-MM-DD HH');
    case 'D':
      return moment(value).format('YYYY-MM-DD');
    case 'M':
      return moment(value).format('YYYY-MM');
    case 'Y':
      return moment(value).format('YYYY');
    default:
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }
}
