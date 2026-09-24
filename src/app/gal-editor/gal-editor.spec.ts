import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalEditor } from './gal-editor';

describe('GalEditor', () => {
  let component: GalEditor;
  let fixture: ComponentFixture<GalEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(GalEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
