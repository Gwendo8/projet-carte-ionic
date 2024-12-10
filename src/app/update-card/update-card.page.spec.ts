import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCardPage } from './update-card.page';

describe('UpdateCardPage', () => {
  let component: UpdateCardPage;
  let fixture: ComponentFixture<UpdateCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
