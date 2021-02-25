import { Injectable } from '@angular/core';
import { FormStructerDataCellDto } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class FormDesignerService {
  private _dimensionsHierarchy: { [key: string]: string[]; };
  set dimensionsHierarchy(dim) {
    this._dimensionsHierarchy = dim;
  }
  get dimensionsHierarchy() {
    return this._dimensionsHierarchy;
  }
  constructor() { }

  getTypeId(cells, bindSource) {
    return cells ? cells.find(cell => cell.columnBindSource == bindSource) : null;
  }
  fillCells(formColumns, formIndicator) {
    let cells: FormStructerDataCellDto[] = [];
    if (formColumns) {
      formColumns.forEach(col => {
        let cell = formIndicator?.find(x => x.columnBindSource == col.bindSource && (x.formColumnId == col.id));
        debugger;
        if (!cell) {
          cell = new FormStructerDataCellDto();
          cell.typeId = 1;
          cell.structureId = 0;
          cell.columnBindSource = col.bindSource;
          cell.formColumnId = (col.id == null) ? 0 : col.id;
          cell.isDeleted = col.isDeleted;
        }
        cells.push(cell);
      });
    }
    return cells;
  }
}
