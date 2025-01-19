export enum Status {
  new,
  scheduled,
  done,
  canceled,
}

export const StatusDescriptions = {
  [Status.new]: 'חדש',
  [Status.scheduled]: 'נקבע',
  [Status.done]: 'בוצע',
  [Status.canceled]: 'בוטל',
};
