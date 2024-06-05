export enum Status {
  new,
  scheduled,
  done,
}

export const StatusDescriptions = {
  [Status.new]: 'חדש',
  [Status.scheduled]: 'נקבע',
  [Status.done]: 'בוצע',
};
