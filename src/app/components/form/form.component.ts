import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  entryForm: FormGroup;
  
  constructor(private service: DataService, 
    private formBuilder: FormBuilder,
    private data: DataService
  ) {
    this.entryForm = this.formBuilder.group({
      docType: ['', [Validators.required]],
      thickness: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      quantity: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      size: ['', [Validators.required]],
      sheetType: ['', [Validators.required]],
      externalDocument: ['']
    });
  }

  ngOnInit(): void {
    const data = this.data.fetchFormDataFromWarehouse();

    this.entryForm.patchValue({
      'docType': data?.docType,
      'thickness': data?.thickness,
      'size': data?.size,
      'sheetType': data?.sheetType,
      'externalDocument': data?.externalDocument 
    });

    this.data.clearFormData();
  }

  async onSubmit() {
    await this.service.addEntry(this.entryForm.value);
  }
}
