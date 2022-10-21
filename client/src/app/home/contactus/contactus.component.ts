import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements AfterViewInit {
  mapIcons = {
    'hospital': 'https://img.icons8.com/office/30/000000/hospital-2.png',
    'user': 'https://img.icons8.com/color/30/000000/map-pin.png'
  }
  map: google.maps.Map | undefined;
  lat = 23.6035821;
  lng = 72.3824065;
  coordinates: google.maps.LatLng;
  mapOptions: google.maps.MapOptions;
  @ViewChild('map', { static: false }) gmap!: ElementRef;

  constructor() {
    this.coordinates = new google.maps.LatLng(this.lat, this.lng);
    this.mapOptions = {
      center: this.coordinates,
      zoom: 8
    };
  }

  ngAfterViewInit(): void {
    this.mapInitializer();
    const hospitalCoords: google.maps.LatLng = new google.maps.LatLng(this.lat, this.lng);
    this.addMarker(hospitalCoords, 'hospital');
    if(!navigator.geolocation) {
      console.log('location is not supported');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords: google.maps.LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.addMarker(coords, 'user');
        console.log(position);
      })
    }
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
  }

  addMarker(coordinates: google.maps.LatLng | google.maps.ReadonlyLatLngLiteral | undefined, icon: 'hospital' | 'user') {
    return new google.maps.Marker({
      position: coordinates,
      map: this.map,
      icon: this.mapIcons[icon],
    });
  }
}
