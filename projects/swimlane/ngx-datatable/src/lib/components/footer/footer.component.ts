import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  inject,
  Output,
  OnChanges
} from '@angular/core';
import { DatatableFooterDirective } from './footer.directive';
import { PagerPageEvent } from '../../types/public.types';
import { DataTablePagerComponent } from './pager.component';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
@Component({
  selector: 'datatable-footer',
  template: `
    <div
      class="datatable-footer-inner"
      [ngClass]="{ 'selected-count': selectedMessage }"
      [style.height.px]="footerHeight"
    >
      <ng-container *ngIf="footerTemplate?.template; else defaultFooter">
        <ng-template
          [ngTemplateOutlet]="footerTemplate!.template!"
          [ngTemplateOutletContext]="{
            rowCount: rowCount,
            pageSize: pageSize,
            selectedCount: selectedCount,
            curPage: curPage,
            offset: offset
          }"
        >
        </ng-template>
      </ng-container>
      <ng-template #defaultFooter>
        <div class="page-count">
          <span *ngIf="selectedMessage">
            {{ selectedCount?.toLocaleString() }} {{ selectedMessage }} /
          </span>
          {{ rowCount?.toLocaleString() }} {{ totalMessage }}
        </div>
        <datatable-pager
          *ngIf="isVisible"
          [pagerLeftArrowIcon]="pagerLeftArrowIcon"
          [pagerRightArrowIcon]="pagerRightArrowIcon"
          [pagerPreviousIcon]="pagerPreviousIcon"
          [pagerNextIcon]="pagerNextIcon"
          [page]="curPage"
          [size]="pageSize"
          [count]="rowCount"
          (change)="page.emit($event)"
        >
        </datatable-pager>
      </ng-template>
    </div>
  `,
  host: {
    class: 'datatable-footer'
  },
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NgClass, NgIf, NgTemplateOutlet, DataTablePagerComponent]
})
export class DataTableFooterComponent implements OnChanges {
  private cd = inject(ChangeDetectorRef);
  @Input() footerHeight!: number;
  @Input() rowCount!: number;
  @Input() pageSize!: number;
  @Input() offset!: number;
  @Input() pagerLeftArrowIcon?: string;
  @Input() pagerRightArrowIcon?: string;
  @Input() pagerPreviousIcon?: string;
  @Input() pagerNextIcon?: string;
  @Input() totalMessage!: string;
  @Input() footerTemplate?: DatatableFooterDirective;

  @Input() selectedCount = 0;
  @Input() selectedMessage?: string | boolean;

  @Output() page: EventEmitter<PagerPageEvent> = new EventEmitter();

  get isVisible(): boolean {
    return this.rowCount / this.pageSize > 1;
  }

  get curPage(): number {
    return this.offset + 1;
  }

  ngOnChanges(): void {
    this.cd.markForCheck();
  }
}
