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
  isSuperUser: boolean = false;
  currentUser: string = '';
  emailsWithPermissions: string[] = ['d.gren@cut-story.pl', 'r.kowalczyk@cut-story.pl'];
  displayedColumns = ['docType', 'thickness', 'quantity', 'size', 'type', 'externalDocument', 'entryDate', 'userEntry'];

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.data.getEntries()
      .then(response => {
        this.sheets = response.data;
    });
    this.checkIfSuperUser(this.data.getUserEmail())
  }

  deleteEntry({id}: Sheet) {
    this.data.deleteEntry(id);
  }

  checkIfSuperUser(userEmail: any) {
    if(this.emailsWithPermissions.includes(userEmail)) {
      this.displayedColumns.push('action');
    }
  }

}
