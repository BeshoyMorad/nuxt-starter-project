import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

export default defineNuxtPlugin(() => {
  dayjs.extend(duration);
  dayjs.extend(relativeTime);
});
