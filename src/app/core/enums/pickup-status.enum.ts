export enum PickupStatus {
  NotReady,
  Ready,
  Taken,
  Returned,
}
export const PickupStatusDescriptions = {
  [PickupStatus.NotReady]: 'לא מוכן',
  [PickupStatus.Ready]: 'מוכן',
  [PickupStatus.Taken]: 'נלקח',
  [PickupStatus.Returned]: 'הוחזר',
};
