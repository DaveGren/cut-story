import { Injectable } from '@angular/core';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { environment } from '../envirements/environment';
import { BehaviorSubject, Subject, filter } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  user$ = new BehaviorSubject<User | null>(null)
  title$: Subject<string> = new Subject();
  
  constructor(private router: Router) {
    this.supabase = createClient(environment.supabase.url, environment.supabase.key)
    
    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationStart)
    )
    .subscribe(
      (data: any) => {
        this.title$.next(this.pareRouterUrlToPolishTitle(data.url));
      }
    )

    this.supabase.auth.onAuthStateChange((event, session) => {  
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.user$.next(session!.user)
        this.router.navigate(['/warehouse'])
      } else {
        this.user$.next(null)
      }
    })
  }

  async signInWithEmail(email: string, password: string) {
    await this.supabase.auth.signInWithPassword({
      email,
      password
    })
  }

  async createUser(email: string, password: string) {
    await this.supabase.auth.signUp({
      email,
      password
    })
  }

  async singOut() {
    this.router.navigate(['/login'])
    this.user$.next(null);
    await this.supabase.auth.signOut();
  }

  get currentUser() {
    return this.user$.asObservable();
  }

  private pareRouterUrlToPolishTitle(url: string): string {
    switch(url) {
      case '/warehouse':
        return 'Magazyn'
      case '/entries':
        return 'Wpisy'
      case '/form':
        return 'Dodaj wpis'
      default:
        return 'Coś';
    }
  }
}
