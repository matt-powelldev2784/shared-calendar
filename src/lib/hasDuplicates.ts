export const hasDuplicates = (array: string[]) => {
  return new Set(array).size !== array.length;
};
