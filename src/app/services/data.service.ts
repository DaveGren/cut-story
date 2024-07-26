import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../envirements/environment';
import { Sheet } from '../models/sheet';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
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
    'INOX 1.4301', 'INOX 1.4404', 'INOX 1.4541', 'INOX 1.4828', 'ALU', 'ALU Ryfel', 'DC01'];

  constructor(
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private toaster: ToastrService
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
      .limit(1000)
    
    const sortedData = data?.sort((a,b) => (new Date(b.entryDate) as any) - (new Date(a.entryDate) as any));

    return { data: sortedData, error: error }
  }

  async deleteEntry(key: any) {
    await this.supabase
      .from('entries')
      .delete()
      .eq('id', key)
      .then(({error}) => {
        if(!error) {
          this.toaster.success('Usunięto wpis');
          this.router.navigate(['/warehouse']);
        } else {
          this.toaster.error('Wystąpił błąd')
        }
      });
  }

  async getReservations() {
    const { data, error } = await this.supabase
      .rpc('get_reservations')
      
    
             
    return { data, error }
  }

  async getWarehouse() {
    const { data, error } = await this.supabase
      .rpc('get_warehouse')
      
    return { data, error }
  }

  async takeToProduction(element: any) {
    this.supabase
      .from('entries')
      .update({docType: 'MM'})
      .eq('id', element.id_key)
      .then(
        ({error}) => {
          if (!error) {
            this.toaster.success('Zrealizowano rezerwację')
          } else {
            this.toaster.error('Wystąpił błąd wprowadzania danych.')
          }
        }
      );
  }

  async returnToWarehouse(element: any) {
    this.supabase
      .from('entries')
      .update({quantity: 0})
      .eq('id', element.id_key)
      .then(
        ({error}) => {
          if (!error) {
            this.toaster.success('Materiał wrócił na magazyn')
          } else {
            this.toaster.error('Wystąpił błąd wprowadzania danych.')
          }
        }
      )
  }

  async addEntry(data: Sheet) {
    const preparedData: Sheet = {
      ...data,
      docType: data.docType.trim(),
      thickness: data.thickness,
      materialOwner: data.materialOwner.trim().toUpperCase(),
      quantity: data.quantity,
      quality: 1,
      size: data.size.trim().toLocaleLowerCase(),
      type: data.type.trim(),
      externalDocument: data.externalDocument?.trim()
    }
    await this.supabase
      .from('entries')
      .insert(this.perpareDateToSend(preparedData))
      .select()
      .then(
        ({error}) => {
          if (!error) {
            this.clearFormData();
            this.toaster.success('Dodano wpis')
            this.router.navigate(['/warehouse']);
          } else {
            this.toaster.error('Wystąpił błąd wprowadzania danych.')
          }
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

  getUserEmail(): string | undefined {
    return this.userEmail;
  }

  perpareDateToSend(data: Sheet) {
    let changedData = {
      ...data, 
      size: this.prepareCorrectSizeInput(data),
      thickness: data.thickness.length > 0 ? data.thickness.replace(',','.') : data.thickness,
      entryDate: new Date(), 
      userEntry: this.userEmail
    };

    if (data.docType === "REZ") {
      changedData = {...changedData, quantity: -data.quantity}
    }

    return changedData;
  }

  prepareCorrectSizeInput({size, thickness}: Sheet): string {
    if (thickness == '-1') {
      return size;
    } else {
      return size
        .toLocaleLowerCase()
        .split('x')
        .sort((a, b) => Number(a) < Number(b) ? -1 : 1
        ).join('x');
    }
  }
}
