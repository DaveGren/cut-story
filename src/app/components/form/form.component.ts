import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  entryForm: FormGroup;
  sheetTypes: Array<string> = [];
  sheetSizes: Array<{view: string, value: string}> = [];

  constructor(private service: DataService, 
    private formBuilder: FormBuilder,
    private data: DataService
  ) {
    this.entryForm = this.formBuilder.group({
      docType: ['', [Validators.required]],
      thickness: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      quantity: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      size: ['', [Validators.required]],
      type: ['', [Validators.required]],
      externalDocument: ['']
    });
  }

  ngOnInit(): void {
    const data = this.data.fetchFormDataFromWarehouse();

    this.sheetSizes = this.data.getSheetSizes();
    this.sheetTypes = this.data.getSheetTypes();

    this.entryForm.patchValue({
      'docType': data?.docType,
      'thickness': data?.thickness,
      'size': data?.size,
      'type': data?.type,
      'externalDocument': data?.externalDocument 
    });

    this.data.clearFormData();
  }

  async onSubmit() {
    await this.service.addEntry(this.entryForm.value);
  }
}
