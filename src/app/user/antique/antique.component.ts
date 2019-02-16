import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from 'src/app/screen.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from '../user.service';
import { MessageService } from 'src/app/message.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'mist-antique',
  templateUrl: './antique.component.html',
  styleUrls: ['./antique.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AntiqueComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showUser: any;
  dataSource: MatTableDataSource<any>;
  columnsDef = ['cover', 'title', 'view', 'date'];
  selection = new SelectionModel<any>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  constructor(
    private route: ActivatedRoute,
    public screen: ScreenService,
    private user: UserService,
    public _msg: MessageService,
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe((data: any) => {
      this.showUser = data.user;
    });
    this.route.data.subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.videos);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  edit() {
    this.selection.clear();
    this.columnsDef[0] === 'select'
      ? this.columnsDef.shift()
      : this.columnsDef.unshift('select');
  }
  delete() {
    const form = new FormData();
    this.selection.selected.forEach(ele => {
      form.append('ids', ele.id);
    });
    return this.user.delvideos(form).pipe(
      tap(re => {
        if (re['status']) {
          this.dataSource.data = this.dataSource.data.filter(ele => {
            for (let i = 0; i < this.selection.selected.length; ++i) {
              if (ele.id === this.selection.selected[i].id) {
                return false;
              }
            }
            return true;
          });
          this.selection.clear();
        }
      })
    );
  }
}
