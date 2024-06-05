import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AdditionalsService {
  additionals$ = new BehaviorSubject<Additionals | null>(null);

  constructor() {}

  setAdditionals(additionals: Additionals) {
    console.log('additionals', additionals);
    this.additionals$.next(additionals);
  }

  resetAdditionals() {
    this.additionals$.next(null);
  }
}

export class Additionals {
  hasInnerFloor: boolean;
  hasOuterFloor: boolean;
  hasCarry: boolean;
  hasInstallation: boolean;
}
