import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketersComponent } from './marketers.component';

describe('MarketersComponent', () => {
  let component: MarketersComponent;
  let fixture: ComponentFixture<MarketersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
