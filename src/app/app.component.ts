import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule, NgxSliderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title: any;
  isVisible = false;
  constructor(private flowbiteService: FlowbiteService) {}
  @HostListener('window:scroll')
  onScroll() {
    this.isVisible = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
    });
  }
}
