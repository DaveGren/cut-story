import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Output()
  toogleNavbarEmitter: EventEmitter<boolean> = new EventEmitter();

  title$: Observable<string> = of();
  isMenuOpen: boolean = false;

  constructor(
    private service: AuthService,
    private router: Router,
    ) {  }
    
  ngOnInit(): void {
    this.title$ = this.service.title$;
  }
  
  logout() {
    this.service.singOut();
  }

  toggleSidenav() {
    this.isMenuOpen = !this.isMenuOpen;
    this.toogleNavbarEmitter.emit(this.isMenuOpen);
  }

  navigate(path: string[]) {
    this.router.navigate(path)
    this.isMenuOpen = false;
  }
}
