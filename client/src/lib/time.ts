export function extractDay(inputDate: Date | string | number) {
  const date = new Date(inputDate);
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];

  return daysOfWeek[date.getDay()];
}

export function extractMonth(inputDate: Date | string | number) {
  const date = new Date(inputDate);
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  return months[date.getMonth()];
}

export const formatDate = (inputDate: Date | string | number) => {
  if (!inputDate) return "";

  const date = new Date(inputDate);
  if (isNaN(date.getTime())) return "";

  const monthAbbr = extractMonth(date);
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${day} ${monthAbbr}, ${year}`;
};

export const formatDateWithRelative = (inputDate: Date | string | number) => {
  if (!inputDate) return "";

  const date = new Date(inputDate);
  if (isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) return "Hôm nay";
  if (isSameDay(date, yesterday)) return "Hôm qua";

  return formatDate(date);
};

export function timeAgo(inputDate: Date | string | number): string {
  const date = new Date(inputDate);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(seconds / 31536000);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

export function extractTime(inputDate: Date | string | number): string {
  if (!inputDate) return "";

  const date = new Date(inputDate);
  if (isNaN(date.getTime())) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}
