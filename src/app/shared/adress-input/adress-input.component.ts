import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adress-input',
  templateUrl: './adress-input.component.html',
  styleUrls: ['./adress-input.component.scss'],
})
export class AdressInputComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

// const fetchCities = async (resourceId) => {
//   let offset = 0;
//   const limit = 100;
//   let hasMore = true;
//   let allCities = new Set();

//   while (hasMore) {
//     const url = `https://data.gov.il/api/3/action/datastore_search`;
//     const params = new URLSearchParams({
//       resource_id: resourceId,
//       limit: limit.toString(),
//       offset: offset.toString(),
//       sort: 'שם_ישוב asc',
//     });

//     const response = await fetch(`${url}?${params}`).then((res) => res.json());
//     const records = response.result.records;

//     records.forEach((record) => {
//       if (record['שם_ישוב'] && !allCities.has(record['שם_ישוב'])) {
//         allCities.add(record['שם_ישוב']);
//       }
//     });

//     if (records.length < limit) {
//       hasMore = false;
//     } else {
//       offset += limit;
//     }
//   }

//   console.log('All distinct cities:', Array.from(allCities));
// };
