import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../envirements/environment';
import { Sheet } from '../models/sheet';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private supabase: SupabaseClient;
  private userEmail: string | undefined = "";
  private formData: Sheet | null = null;

  sheetSizes: Array<{value: string, view: string}> = [
    {value: '1500x3000', view: 'Duży (1500x3000)'},
    {value: '1250x2500', view: 'Średni (1250x2500)'},
    {value: '1000x2000', view: 'Mały (1000x2000)'},
    {value: 'other', view: 'niestandardowy'}
  ]  

  sheetTyes: Array<string> = ['S235', 'S335', 'Ocynk', 'INOX 1.4016', 
    'INOX 1.4301', 'INOX 1.4404', 'INOX 1.4541', 'INOX 1.4828', 'ALU', 'DC01'];

  constructor(
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
    ) { 
    this.supabase = createClient(environment.supabase.url, environment.supabase.key);
    this.auth.user$.subscribe((data) =>
      this.userEmail = data?.email
    )
  }

  getSheetTypes(): Array<string> {
    return this.sheetTyes;
  }

  getSheetSizes(): Array<{value: string, view: string}> {
    return this.sheetSizes;
  }

  async getEntries() {
    const { data, error } = await this.supabase
      .from('entries')
      .select('*')
    
             
    return { data, error }
  }

  async getWarehouse() {
    const { data, error } = await this.supabase
      .rpc('get_warehouse')
      
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
          this.router.navigate(['/warehouse']);
        }
      )
  }

  setFormDataFromWarehouse(data: any): void {
    console.log(data);
    this.formData = {
      ...data,
      size: data.size_name,
      thickness: data.thickness_name,
      type: data.type_name,
    };
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
      changedData = {...changedData, quantity: -data.quantity}
    }

    return changedData;
  }
}
