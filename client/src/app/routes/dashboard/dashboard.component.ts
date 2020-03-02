import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { STColumn } from '@delon/abc';
import { format } from 'date-fns'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  isVisible = false;
  currentMeter = {
    "_id": "",
    "created_at": "",
    "updated_at": "",
    "description": "",
    "manufacturer_id": "",
    "serial":"",
  }
  ps = 20;
  total = 200; // mock total
  args: any = { _allow_anonymous: true };
  url = `https://api.randomuser.me/?results=20`;
  smartmeters: any[] = [];
  scroll = { y: '330px' };
  columns: STColumn[] = [
    { title: 'id', index: '_id', type: 'checkbox' },
    // { title: 'Avatar', index: 'picture.thumbnail', type: 'img', width: 80 },
    {
      title: 'Serial',
      index: 'serial',
      width: 150,
      // format: item => `${item.name.first} ${item.name.last}`,
      // type: 'link',
      // click: item => this.message.info(`${item.name.first}`),
    },
    { title: 'ManufactureId', index: 'manufacturer_id' },
    {
      title: 'Description',
      index: 'description',
      // type: 'yn',
      // yn: {
      //   truth: 'female',
      //   yes: '男',
      //   no: '女',
      //   mode: 'text',
      // },
      width: 120,
    },
    // { title: 'CreatedAt', index: 'created_at',type: 'date'},
    { title: 'Last Updated', index: 'updated_at', type: 'date'},
    {
      title: 'Actions',
      // width: 120,
      buttons: [
        {
          text: 'Edit',
          click: item => this.showModal(item),
          if: item => item.gender === 'female',
        },
        {
          text: 'Delete',
          type: 'del',
          click: item => this.message.info(`deleted [${item.id.value}]`),
        },
      ],
    },
  ];
  validateForm: FormGroup;
  constructor(
    public http: _HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      serialno: [null, [Validators.required]],
      description: [null, [Validators.required]],
      manufacturer_id: [null]
    });
    this.fetchMeters()
  }

  fullChange(val: boolean) {
    this.scroll = val ? { y: '350px' } : { y: '230px' };
  }
  showModal(item): void {
    this.currentMeter = item
    this.validateForm.controls.serialno.setValue(item.serial)
    this.validateForm.controls.description.setValue(item.description)
    this.validateForm.controls.manufacturer_id.setValue(item.manufacturer_id)
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // Fetch all Smart Meters
  fetchMeters() {
    this.http.get('http://localhost:3001/v1/smart-devices/').subscribe((res: any[]) => {
    // console.log(res)
    this.smartmeters = res
  });

  }
}
