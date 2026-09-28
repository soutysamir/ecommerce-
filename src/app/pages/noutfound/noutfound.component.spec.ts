import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoutfoundComponent } from './noutfound.component';

describe('NoutfoundComponent', () => {
  let component: NoutfoundComponent;
  let fixture: ComponentFixture<NoutfoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoutfoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoutfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
