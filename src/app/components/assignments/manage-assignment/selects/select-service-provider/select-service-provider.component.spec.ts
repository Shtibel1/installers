import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectServiceProviderComponent } from './select-service-provider.component';

describe('SelectServiceProviderComponent', () => {
  let component: SelectServiceProviderComponent;
  let fixture: ComponentFixture<SelectServiceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectServiceProviderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
