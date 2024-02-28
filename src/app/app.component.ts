import { Component, OnInit } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, of } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  user$!: Observable<User | null>;
  title$: Observable<string> = of();
  isMenuOpen: boolean = false;

  constructor(private service: AuthService){
  }
  
  ngOnInit(): void {
    this.user$ = this.service.user$;
  }
}
