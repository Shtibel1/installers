import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMarketerComponent } from './select-marketer.component';

describe('SelectMarketerComponent', () => {
  let component: SelectMarketerComponent;
  let fixture: ComponentFixture<SelectMarketerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMarketerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectMarketerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
