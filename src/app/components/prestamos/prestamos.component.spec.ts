import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prestamos } from './prestamos.component';

describe('Prestamos', () => {
  let component: Prestamos;
  let fixture: ComponentFixture<Prestamos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prestamos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prestamos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
