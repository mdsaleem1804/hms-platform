export const EDIT_WINDOW_MESSAGE = 'Only records created today can be edited.';

export const isCreatedToday = (createdAt: string | null | undefined): boolean => {
  if (!createdAt) return false;

  const createdDate = createdAt.slice(0, 10);
  const todayUtc = new Date().toISOString().slice(0, 10);
  return createdDate === todayUtc;
};
