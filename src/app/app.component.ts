import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './elements/header/header.component';
import {FooterComponent} from './elements/footer/footer.component';
import {ProductControllerService} from './openapi-client';

@Component({
  selector: 'pm-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'product-manager-frontend';
  productService = inject(ProductControllerService);

  constructor() {
    this.productService.getAllProducts().subscribe((val) => {
      console.log(val);
    })
  }
}
