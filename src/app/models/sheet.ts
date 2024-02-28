export interface Sheet {
    id?: string;
    docType: string;
    entryDate: Date;
    externalDocument?: string;	
    quantity: number;	
    sheetType: string;	
    size: string;
    thickness: number;
    userEntry: string;
}