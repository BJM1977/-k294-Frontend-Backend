import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatAnchor} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuPanel, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'pm-header',
  imports: [
    MatToolbar,
    MatAnchor,
    RouterLink,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  selectedProductId: number | null = null; // ✅ Hier wird die ID gespeichert

  constructor(private router: Router) {}

  // ✅ Produkt-ID setzen, wenn das Menü geöffnet wird
  setProductId(productId: number) {
    this.selectedProductId = productId;
  }

  // ✅ Navigieren zur Bearbeitungsseite
  navigateToModify() {
    if (this.selectedProductId !== null) {
      this.router.navigate(['/products/modify', this.selectedProductId]);
    } else {
      alert('Kein Produkt ausgewählt!');
    }
  }
}
