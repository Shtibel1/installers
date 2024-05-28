import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit, AfterViewInit {
  @Input() control: FormControl;
  random = (Math.random() * 1000).toString();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const loader = new Loader({
      apiKey: 'AIzaSyAJCdvnKo9Wf2mYu5QVqfMEQQa719mZHQ8',
      libraries: ['places'],
      version: 'weekly',
    });

    loader.load().then(() => {
      const placePicker = new google.maps.places.Autocomplete(
        document.getElementById(this.random) as HTMLInputElement,
        {
          types: ['geocode'],
        }
      );

      placePicker.addListener('place_changed', () => {
        const place = placePicker.getPlace();
        console.log(place);
        if (place.formatted_address) {
          this.control.setValue(place.formatted_address);
        }
      });
    });
  }
}
