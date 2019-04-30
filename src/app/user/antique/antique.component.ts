import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
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
  listDesc = new FormControl('');
  dataSource: MatTableDataSource<any>;
  columnsDef = ['cover', 'title', 'playlist.title', 'view', 'date'];
  selection = new SelectionModel<any>(true, []);
  playLists = [];

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach(row => this.selection.select(row));
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
      this.dataSource.sortingDataAccessor = (item, header) => {
        switch (header) {
          case 'playlist.title':
            if (item.playlist) {
              return item.playlist.title;
            }
            return null;
          default: return item[header];
        }
      };
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
  getList(tpl: any) {
    this.route.parent.paramMap.subscribe((pars) => {
      this.user.mylist(pars.get('id')).subscribe((re: any) => {
        this.playLists = re || [];
        this._msg.openDialog(tpl, {
          autoFocus: false,
          maxHeight: '80vh'
        });
      });
    });
  }
  openAddList(tpl: any) {
    this.listTitle.setValue('');
    this.listDesc.setValue('');
    this._msg.openDialog(tpl);
  }
  openListEdit(tpl: any, ele: any) {
    this._msg.openDialog(tpl, {
      data: ele
    });
    this.listTitle.setValue(ele.playlist.title);
    this.listDesc.setValue(ele.playlist.desc);
  }
  newList() {
    this.user.addList({ title: this.listTitle.value, desc: this.listDesc.value }).subscribe(re => {
      if (re['status']) {
        this.playLists.push(re['list']);
        this._msg.dialogRef.close();
      }
    });
  }
  addToList(id: string) {
    this.user.addToList({
      id: id,
      videos: this.selection.selected.map(val => val.id)
    }).subscribe(re => {
      if (re['status']) {
        this._msg.closeAllDialog();
        this.selection.selected.forEach(val => {
          this.playLists.forEach(li => {
            if (li.id === id) {
              val.playlist = li;
              return;
            }
          });
        });
      }
      this.selection.clear();
      this.columnsDef.shift();
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
          return val;
        });
        this.selection.clear();
        this.columnsDef.shift();
      }
    });
  }
  removeList(id: string) {
    return this.user.delList(id).pipe(
      tap(re => {
        if (re['status']) {
          this._msg.dialogRef.close();
          this.playLists = this.playLists.filter(val => {
            if (val.id === id) {
              return false;
            }
            return true;
          });
          this.dataSource.data.forEach(val => {
            val.playlist = val.playlist ? (val.playlist.id === id ? null : val.playlist) : null;
          });
        }
      })
    );
  }
  updateList(id: string) {
    this.user.updateList({ id: id, title: this.listTitle.value, desc: this.listDesc.value }).subscribe(re => {
      if (re['status']) {
        console.log(re['list']);
        this._msg.dialogRef.close();
        this.playLists.forEach(val => {
          if (val.id === id) {
            val = re['list'];
          }
        });
        this.dataSource.data.forEach(val => {
          val.playlist = val.playlist ? (val.playlist.id === id ? re['list'] : val.playlist) : null;
        });
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
