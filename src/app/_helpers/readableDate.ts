export function readableDate(date: Date | undefined): string {
  return date ?
    date.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).replace(",", "").replace(/(\d+)\s(\w+),/, "$1 $2,")
    :
    "";
}