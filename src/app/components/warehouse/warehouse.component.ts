import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Sheet } from '../../models/sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent implements OnInit {
  displayedColumns = ['size', 'thickness', 'quantity', 'type', 'reloadToForm'];
  sheets: Sheet[] | any = [];

  constructor(
    private data: DataService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.data.getWarehouse()
      .then(response => {
        console.log(response);
        this.sheets = response.data;
    })
  }

  reloadToForm(data: Sheet) {
    this.router.navigate(['/form']);
    this.data.setFormDataFromWarehouse(data);
  }
}
