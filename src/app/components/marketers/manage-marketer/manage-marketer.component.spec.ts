import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMarketerComponent } from './manage-marketer.component';

describe('ManageMarketerComponent', () => {
  let component: ManageMarketerComponent;
  let fixture: ComponentFixture<ManageMarketerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMarketerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageMarketerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
