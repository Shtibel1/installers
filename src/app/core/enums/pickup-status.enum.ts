export enum PickupStatus {
  NotReady,
  Ready,
  Taken,
}
export const PickupStatusDescriptions = {
  [PickupStatus.NotReady]: 'לא מוכן',
  [PickupStatus.Ready]: 'מוכן',
  [PickupStatus.Taken]: 'נלקח',
};