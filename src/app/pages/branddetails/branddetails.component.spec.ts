import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranddetailsComponent } from './branddetails.component';

describe('BranddetailsComponent', () => {
  let component: BranddetailsComponent;
  let fixture: ComponentFixture<BranddetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranddetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
