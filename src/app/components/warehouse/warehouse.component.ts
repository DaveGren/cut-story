import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { Sheet } from '../../models/sheet';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent implements OnInit {
  displayedColumns = ['size', 'thickness', 'quantity', 'type', 'materialOwner', 'quality', 'surface', 'reloadToForm'];
  dataSource: MatTableDataSource<Sheet> = new MatTableDataSource<Sheet>;
  thicknessList: string[] = [];
  typeList: string[] = [];
  materialOwnerList: string[] = [];

  readonly formControl;

  constructor(
    private data: DataService,
    private router: Router,
    public formBuilder: FormBuilder
    ) {
      this.formControl = formBuilder.group({
        type_name: '',
        thickness_name: '',
        material_owner_name: ''
      });

      this.dataSource.filterPredicate = ((data: Sheet, filter: {thickness_name: string, type_name: string, material_owner_name: string}) => {
        const a = !filter.thickness_name || data.thickness_name === filter.thickness_name;
        const b = !filter.type_name || data.type_name === filter.type_name;
        const c = !filter.material_owner_name || data.material_owner_name === filter.material_owner_name;
        return a && b && c;
      }) as () => boolean;

      this.formControl.valueChanges.subscribe(value => {
        const filter = {...value, name: value} as string | any;
        this.dataSource.filter = filter;
      });
    }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.data.getWarehouse()
      .then(response => {
        this.dataSource.data = response.data;
        const thicknesses: string[] = this.dataSource.data
          .map((sheet: Sheet) => sheet.thickness_name);
        const type: string[] = this.dataSource.data
          .map((sheet: Sheet) => sheet.type_name);
        const owner: string[] = this.dataSource.data
          .map((sheet: Sheet) => sheet.material_owner_name);
          
        this.thicknessList = [...new Set(thicknesses)];
        this.typeList = [...new Set(type)];
        this.materialOwnerList = [...new Set(owner)];

      });
  }

  reloadToForm(data: Sheet) {
    this.router.navigate(['/form']);
    this.data.setFormDataFromWarehouse(data);
  }

  applyFilter(value: any, type: string) {
    this.dataSource.filter = `${type}: ${value}`;
  }

  removeFilter(type: any) {
    if (type === 'thickness_name') {
      this.formControl.controls['thickness_name'].setValue('');
    }
    if (type === 'type_name') {
      this.formControl.controls['type_name'].setValue('');
    }
    if (type === 'material_owner_name') {
      this.formControl.controls['material_owner_name'].setValue('');
    }
  }
}
