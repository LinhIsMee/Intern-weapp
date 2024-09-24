  import {Component, Input, OnChanges, EventEmitter, Output, SimpleChanges} from '@angular/core';

  @Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
  })
  export class PaginationComponent implements OnChanges {
    @Input() totalItems = 0;
    @Input() pageSize = 5;
    @Input() pageIndex = 1;
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    Math = Math;

    totalPages = 0;
    pages: number[] = [];

    // tslint:disable-next-line:typedef
    ngOnChanges(changes: SimpleChanges) {
      if (changes.totalItems || changes.pageSize) {
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      }
    }
    // tslint:disable-next-line:typedef
    onChangePage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.pageIndex = page - 1;
        this.pageChange.emit(this.pageIndex);
      }
    }
  }
