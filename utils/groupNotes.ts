import { Note } from "./storage";

export interface NoteSection {
  title: string;
  data: Note[];
}

const getDateCategory = (timestamp: number): string => {
  const now = new Date();
  const noteDate = new Date(timestamp);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const noteDateOnly = new Date(
    noteDate.getFullYear(),
    noteDate.getMonth(),
    noteDate.getDate()
  );

  if (noteDateOnly.getTime() === today.getTime()) {
    return "Today";
  }

  if (noteDateOnly.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  if (noteDate >= sevenDaysAgo && noteDate < yesterday) {
    return "Previous 7 Days";
  }

  if (noteDate >= thirtyDaysAgo && noteDate < sevenDaysAgo) {
    return "Previous 30 Days";
  }

  // For older dates, group by month and year
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = monthNames[noteDate.getMonth()];
  const year = noteDate.getFullYear();

  // If it's from the current year, just show month
  if (year === now.getFullYear()) {
    return month;
  }

  // Otherwise show year
  return year.toString();
};

export const groupNotesByTime = (notes: Note[]): NoteSection[] => {
  // Separate pinned notes
  const pinnedNotes = notes.filter((note) => note.pinned ?? false);
  const unpinnedNotes = notes.filter((note) => !(note.pinned ?? false));

  // Sort unpinned notes by updatedAt (newest first)
  const sortedUnpinned = [...unpinnedNotes].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  // Group unpinned notes by time category
  const grouped = new Map<string, Note[]>();

  sortedUnpinned.forEach((note) => {
    const category = getDateCategory(note.updatedAt);
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(note);
  });

  // Build sections array
  const sections: NoteSection[] = [];

  // Add Pinned section if there are pinned notes
  if (pinnedNotes.length > 0) {
    sections.push({
      title: "Pinned",
      data: pinnedNotes.sort((a, b) => b.updatedAt - a.updatedAt),
    });
  }

  // Define order for time-based sections
  const timeOrder = [
    "Today",
    "Yesterday",
    "Previous 7 Days",
    "Previous 30 Days",
  ];

  // Add time-based sections in order
  timeOrder.forEach((category) => {
    if (grouped.has(category)) {
      sections.push({
        title: category,
        data: grouped.get(category)!,
      });
      grouped.delete(category);
    }
  });

  // Add month sections (current year first, then older)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Add months from current year (from current month backwards)
  for (let i = currentMonth; i >= 0; i--) {
    const month = monthNames[i];
    if (grouped.has(month)) {
      sections.push({
        title: month,
        data: grouped.get(month)!,
      });
      grouped.delete(month);
    }
  }

  // Add remaining months from previous years
  for (let i = 11; i > currentMonth; i--) {
    const month = monthNames[i];
    if (grouped.has(month)) {
      sections.push({
        title: month,
        data: grouped.get(month)!,
      });
      grouped.delete(month);
    }
  }

  // Add year sections (newest first)
  const years = Array.from(grouped.keys())
    .filter((key) => /^\d{4}$/.test(key))
    .map((key) => parseInt(key, 10))
    .sort((a, b) => b - a);

  years.forEach((year) => {
    sections.push({
      title: year.toString(),
      data: grouped.get(year.toString())!,
    });
  });

  return sections;
};

