import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipToTerritoryComponent } from './zip-to-territory.component';

describe('ZipToTerritoryComponent', () => {
  let component: ZipToTerritoryComponent;
  let fixture: ComponentFixture<ZipToTerritoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZipToTerritoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZipToTerritoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
