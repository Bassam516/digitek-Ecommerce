import { Component } from '@angular/core';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ScrollTopModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
