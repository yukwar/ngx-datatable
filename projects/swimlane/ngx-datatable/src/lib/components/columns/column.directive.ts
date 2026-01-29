import {
  booleanAttribute,
  ContentChild,
  Directive,
  DoCheck,
  inject,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  numberAttribute,
  PipeTransform,
  TemplateRef
} from '@angular/core';
import { DataTableColumnHeaderDirective } from './column-header.directive';
import { DataTableColumnCellDirective } from './column-cell.directive';
import { DataTableColumnCellTreeToggle } from './tree.directive';
import { ColumnChangesService } from '../../services/column-changes.service';
import { TableColumn, TableColumnProp } from '../../types/table-column.type';
import { DataTableColumnGhostCellDirective } from './column-ghost-cell.directive';
import { CellContext, HeaderCellContext, Row } from '../../types/public.types';

@Directive({
  selector: 'ngx-datatable-column'
})
export class DataTableColumnDirective<TRow extends Row> implements TableColumn, DoCheck {
  private columnChangesService = inject(ColumnChangesService);
  private inputChangesDiffer: KeyValueDiffer<string, unknown> = inject(KeyValueDiffers)
    .find({})
    .create();
  private inputChangeInitialized = false;
  @Input() name?: string;
  @Input() prop?: TableColumnProp;
  @Input({ transform: booleanAttribute }) bindAsUnsafeHtml?: boolean;
  @Input({ transform: booleanAttribute }) frozenLeft?: boolean;
  @Input({ transform: booleanAttribute }) frozenRight?: boolean;
  @Input({ transform: numberAttribute }) flexGrow?: number;
  @Input({ transform: booleanAttribute }) resizeable?: boolean;
  @Input() comparator?: (
    valueA: any,
    valueB: any,
    rowA: TRow,
    rowB: TRow,
    sortDir: 'desc' | 'asc'
  ) => number;
  @Input() pipe?: PipeTransform;
  @Input({ transform: booleanAttribute }) sortable?: boolean;
  @Input({ transform: booleanAttribute }) draggable?: boolean;
  @Input({ transform: booleanAttribute }) canAutoResize?: boolean;
  @Input({ transform: numberAttribute }) minWidth?: number;
  @Input({ transform: numberAttribute }) width?: number;
  @Input({ transform: numberAttribute }) maxWidth?: number;
  @Input({ transform: booleanAttribute }) checkboxable?: boolean;
  @Input({ transform: booleanAttribute }) headerCheckboxable?: boolean;
  @Input() headerClass?:
    | string
    | ((data: { column: TableColumn }) => string | Record<string, boolean>);
  @Input() cellClass?:
    | string
    | ((data: {
        row: TRow;
        group?: TRow[];
        column: TableColumn<TRow>;
        value: any;
        rowHeight: number;
      }) => string | Record<string, boolean>);
  @Input({ transform: booleanAttribute }) isTreeColumn?: boolean;
  @Input() treeLevelIndent?: number;
  @Input() summaryFunc?: (cells: any[]) => any;
  @Input() summaryTemplate?: TemplateRef<any>;

  @Input('cellTemplate')
  _cellTemplateInput?: TemplateRef<CellContext<TRow>>;

  @ContentChild(DataTableColumnCellDirective, { read: TemplateRef, static: true })
  _cellTemplateQuery?: TemplateRef<CellContext<TRow>>;

  get cellTemplate(): TemplateRef<CellContext<TRow>> | undefined {
    return this._cellTemplateInput || this._cellTemplateQuery;
  }

  @Input('headerTemplate')
  _headerTemplateInput?: TemplateRef<HeaderCellContext>;

  @ContentChild(DataTableColumnHeaderDirective, { read: TemplateRef, static: true })
  _headerTemplateQuery?: TemplateRef<HeaderCellContext>;

  get headerTemplate(): TemplateRef<HeaderCellContext> | undefined {
    return this._headerTemplateInput || this._headerTemplateQuery;
  }

  @Input('treeToggleTemplate')
  _treeToggleTemplateInput?: TemplateRef<any>;

  @ContentChild(DataTableColumnCellTreeToggle, { read: TemplateRef, static: true })
  _treeToggleTemplateQuery?: TemplateRef<any>;

  get treeToggleTemplate(): TemplateRef<any> | undefined {
    return this._treeToggleTemplateInput || this._treeToggleTemplateQuery;
  }

  @Input('ghostCellTemplate')
  _ghostCellTemplateInput?: TemplateRef<void>;

  @ContentChild(DataTableColumnGhostCellDirective, { read: TemplateRef, static: true })
  _ghostCellTemplateQuery?: TemplateRef<void>;

  get ghostCellTemplate(): TemplateRef<void> | undefined {
    return this._ghostCellTemplateInput || this._ghostCellTemplateQuery;
  }

  ngDoCheck() {
    const changes = this.inputChangesDiffer.diff(this.getInputSnapshot());
    if (!changes) {
      return;
    }
    if (this.inputChangeInitialized) {
      this.columnChangesService.onInputChange();
    } else {
      this.inputChangeInitialized = true;
    }
  }

  private getInputSnapshot(): Record<string, unknown> {
    return {
      name: this.name,
      prop: this.prop,
      bindAsUnsafeHtml: this.bindAsUnsafeHtml,
      frozenLeft: this.frozenLeft,
      frozenRight: this.frozenRight,
      flexGrow: this.flexGrow,
      resizeable: this.resizeable,
      comparator: this.comparator,
      pipe: this.pipe,
      sortable: this.sortable,
      draggable: this.draggable,
      canAutoResize: this.canAutoResize,
      minWidth: this.minWidth,
      width: this.width,
      maxWidth: this.maxWidth,
      checkboxable: this.checkboxable,
      headerCheckboxable: this.headerCheckboxable,
      headerClass: this.headerClass,
      cellClass: this.cellClass,
      isTreeColumn: this.isTreeColumn,
      treeLevelIndent: this.treeLevelIndent,
      summaryFunc: this.summaryFunc,
      summaryTemplate: this.summaryTemplate,
      cellTemplate: this._cellTemplateInput,
      headerTemplate: this._headerTemplateInput,
      treeToggleTemplate: this._treeToggleTemplateInput,
      ghostCellTemplate: this._ghostCellTemplateInput
    };
  }
}
