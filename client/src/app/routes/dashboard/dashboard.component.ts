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
  currentMeter: {}
  ps = 20;
  total = 200; // mock total
  args: any = { _allow_anonymous: true };
  url = `https://api.randomuser.me/?results=20`;
  events: any[] = [];
  scroll = { y: '230px' };
  columns: STColumn[] = [
    { title: 'id', index: 'id.value', type: 'checkbox' },
    { title: 'Avatar', index: 'picture.thumbnail', type: 'img', width: 80 },
    {
      title: 'Serial',
      index: 'name.first',
      width: 150,
      format: item => `${item.name.first} ${item.name.last}`,
      type: 'link',
      click: item => this.message.info(`${item.name.first}`),
    },
    { title: 'Manufacture Id', index: 'email' },
    {
      title: 'Description',
      index: 'gender',
      type: 'yn',
      yn: {
        truth: 'female',
        yes: '男',
        no: '女',
        mode: 'text',
      },
      width: 120,
    },
    { title: 'CreatedAt', render: 'events', width: 90 },
    { title: 'UpdatedAt', index: 'registered.date', type: 'date', width: 170 },
    {
      title: 'Actions',
      width: 120,
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
    ) {}

  ngOnInit(): void {
    const beginDay = new Date().getTime();
    for (let i = 0; i < 7; i += 1) {
      this.events.push({
        x: format(new Date(beginDay + (1000 * 60 * 60 * 24 * i)), 'YYYY-MM-DD'),
        y: Math.floor(Math.random() * 100) + 10,
      });
    }
    this.validateForm = this.fb.group({
      serialno: [null, [Validators.required]],
      description: [null, [Validators.required]],
      manufacturer_id: [null, [Validators.required]]
    });
  }

  fullChange(val: boolean) {
    this.scroll = val ? { y: '350px' } : { y: '230px' };
  }
  showModal(item): void {
    this.currentMeter = item
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
