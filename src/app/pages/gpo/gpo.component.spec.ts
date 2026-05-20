import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpoComponent } from './gpo.component';

describe('GpoComponent', () => {
  let component: GpoComponent;
  let fixture: ComponentFixture<GpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
