import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProposPage } from './propos.page';

describe('ProposPage', () => {
  let component: ProposPage;
  let fixture: ComponentFixture<ProposPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
