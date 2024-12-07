import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-card-details-modal',
  templateUrl: './card-details-modal.component.html',
  styleUrls: ['./card-details-modal.component.scss'],
})

export class CardDetailsModalComponent {
  @Input() card: any;

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }
}