export default function displayTime(time: number) {
  const date = new Date(time);
  if (date.getFullYear() !== new Date().getFullYear()) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } else {
    if (date.getDate() === new Date().getDate()) {
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    } else if (date.getDate() === new Date().getDate() - 1) {
      return 'Yesterday';
    } else if (date.getDate() > new Date().getDate() - 7) {
      return date.toLocaleString('en-US', {
        weekday: 'long',
      });
    } else if (date.getDate() !== new Date().getDate()) {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  }
}