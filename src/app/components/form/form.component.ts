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
  isSheet: boolean = true;
  isOurMaterial: boolean = true;

  constructor(private service: DataService, 
    private formBuilder: FormBuilder,
    private data: DataService
  ) {
    this.entryForm = this.formBuilder.group({
      docType: ['', [Validators.required]],
      thickness: [''],
      materialOwner: ['CUT-STORY', Validators.required],
      quality: 1,
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

    if (Number(data?.thickness) === -1){
      this.isSheet = false;
    }

    if (data?.materialOwner !== 'CUT-STORY' && !!data?.materialOwner){
      this.isOurMaterial = false;
    }
    
    this.entryForm.patchValue({
      'docType': data?.docType,
      'thickness': data?.thickness_name,
      'materialOwner': !!data?.materialOwner ? data.materialOwner : 'CUT-STORY',
      'quantity': data?.total_quantity,
      'size': data?.size_name,
      'type': data?.type_name,
      'externalDocument': data?.externalDocument 
    });

    this.data.clearFormData();
  }

  async onSubmit() {
    if (!this.entryForm.controls['thickness'].value) {
      this.entryForm.controls['thickness'].setValue('-1')
    }
    await this.data.addEntry(this.entryForm.value);
  }
}
