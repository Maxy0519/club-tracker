"use client";

type LocalDateTimeProps = {
  value: string;
  variant?: "task" | "event";
};

export default function LocalDateTime({
  value,
  variant = "task",
}: LocalDateTimeProps) {
  const date = new Date(value);

  if (variant === "event") {
    return (
      <>
        {new Intl.DateTimeFormat(
          undefined,
          {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }
        ).format(date)}
      </>
    );
  }

  return (
    <>
      {new Intl.DateTimeFormat(
        undefined,
        {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      ).format(date)}
    </>
  );
}