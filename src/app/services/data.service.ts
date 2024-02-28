import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../envirements/environment';
import { Sheet } from '../models/sheet';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private supabase: SupabaseClient;
  private userEmail: string | undefined = "";
  private formData: Sheet | null = null;

  constructor(
    private auth: AuthService,
    private _snackBar: MatSnackBar
    ) { 
    this.supabase = createClient(environment.supabase.url, environment.supabase.key);
    this.auth.user$.subscribe((data) =>
      this.userEmail = data?.email
    )
  }

  async getEntries() {
    const { data, error } = await this.supabase
      .from('entries')
      .select('*')
    
             
    return { data, error }
  }

  async getWarehouse() {
    const { data, error } = await this.supabase
      .from('entries')
      .select()
        
    return { data, error }
  }

  async addEntry(data: Sheet) {
    await this.supabase
      .from('entries')
      .insert(this.perpareDateToSend(data))
      .select()
      .then(
        () => {
          this._snackBar.open('Test')
          this.clearFormData();
        }
      )
  }

  setFormDataFromWarehouse(data: Sheet): void {
    this.formData = data;
  }

  clearFormData(): void {
    this.formData = null;
  }

  fetchFormDataFromWarehouse(): Sheet | null {
    return this.formData;
  }

  perpareDateToSend(data: Sheet) {
    let changedData = {...data, entryDate: new Date(), userEntry: this.userEmail};

    if (data.docType === "WZ") {
      changedData = {...data, quantity: -data.quantity}
    }

    return changedData;
  }
}
