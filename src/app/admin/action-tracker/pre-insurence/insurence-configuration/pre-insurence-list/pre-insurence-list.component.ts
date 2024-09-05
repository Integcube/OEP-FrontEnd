import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-pre-insurence-list',
  templateUrl: './pre-insurence-list.component.html',
  styleUrls: ['./pre-insurence-list.component.sass']
})
export class PreInsurenceListComponent extends UnsubscribeOnDestroyAdapter implements OnInit, AfterViewInit {

  constructor()  { super() }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

}
