import { Component, OnInit } from '@angular/core';
import { Sheet } from '../../models/sheet';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.scss'
})
export class EntriesComponent implements OnInit {
  sheets: Sheet[] | any = [];
  displayedColumns = ['docType', 'thickness', 'quantity', 'type', 'externalDocument', 'entryDate', 'userEntry'];

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.data.getEntries()
      .then(response => {
        this.sheets = response.data;
    })
  }
}
