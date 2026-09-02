const APP_TIME_ZONE = "America/New_York";

const taskDeadlineFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: APP_TIME_ZONE,
});

export function formatTaskDeadline(value: string) {
  return taskDeadlineFormatter.format(new Date(value));
}
