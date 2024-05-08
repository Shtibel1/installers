import { WorkersService } from './../../../core/services/workers.service';
import { CategoriesService } from './../../../core/services/categories.service';
import { ProductsService } from './../../../core/services/products.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { Assignment } from 'src/app/core/models/assignment.model';
import { AssignmentsService } from 'src/app/core/services/assignments.service';

@Injectable({ providedIn: 'root' })
export class AssignmentResolver implements Resolve<Assignment> {
  constructor(
    private assignmentService: AssignmentsService,
    private ProductsService: ProductsService,
    private CategoriesService: CategoriesService,
    private WorkersService: WorkersService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Assignment> {
    const id = route.paramMap.get('id');
    if (id) {
      return this.ProductsService.getProducts().pipe(
        switchMap(() => {
          return this.CategoriesService.getCategories().pipe(
            switchMap(() => {
              return this.WorkersService.getInstallers().pipe(
                switchMap(() => {
                  return this.assignmentService.getAssignment(+id).pipe(
                    tap((assignment) => {
                      assignment.installer =
                        this.WorkersService.installersChain.value?.find(
                          (inst) => inst.id === assignment.installer.id
                        );
                    })
                  );
                })
              );
            })
          );
        })
      );
    } else {
      console.error('No id provided');
      return null;
    }
  }
}
