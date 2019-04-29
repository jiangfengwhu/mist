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
import { FormControl, Validators } from '@angular/forms';

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
  listTitle = new FormControl('', Validators.required);
  dataSource: MatTableDataSource<any>;
  columnsDef = ['cover', 'title', 'playlist', 'view', 'date'];
  selection = new SelectionModel<any>(true, []);
  playLists = [];

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
      this.dataSource = new MatTableDataSource(data.videos.map(val => {
        if (val.playlist) {
          val.playlist = val.listdoc.title;
        }
        return val;
      }));
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
  getList(tpl: any) {
    this.route.parent.paramMap.subscribe((pars) => {
      this.user.mylist(pars.get('id')).subscribe((re: any) => {
        this.playLists = re || [];
        this._msg.openDialog(tpl, {
          autoFocus: false
        });
      });
    });
  }
  newList() {
    this.user.addList({ title: this.listTitle.value }).subscribe(re => {
      if (re['status']) {
        this.playLists.push(re['list']);
        this.listTitle.setValue('');
      }
    });
  }
  addToList(id: string) {
    this.user.addToList({
      id: id,
      videos: this.selection.selected.map(val => val.id)
    }).subscribe(re => {
      if (re['status']) {
        this._msg.dialogRef.close();
        this.selection.selected.forEach(val => {
          this.playLists.forEach(li => {
            if (li.id === id) {
              val.playlist = li.title;
              return;
            }
          });
        });
        this.selection.clear();
        this.columnsDef.shift();
      }
    });
  }
  removeFromList() {
    this.user.removeFromList({
      videos: this.selection.selected.map(val => val.id)
    }).subscribe(re => {
      if (re['status']) {
        this._msg.dialogRef.close();
        this.selection.selected.map(val => {
          val.playlist = null;
          val.listdoc = null;
          return val;
        });
        this.selection.clear();
        this.columnsDef.shift();
      }
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
          this.columnsDef.shift();
        }
      })
    );
  }
}
