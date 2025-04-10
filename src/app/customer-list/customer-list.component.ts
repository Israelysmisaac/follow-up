import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService, Customer } from '../services/customer.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers$: Observable<Customer[]>;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {
    this.customers$ = this.customerService.getCustomers();
  }

  ngOnInit(): void {
    // Component initialization logic
  }

  editCustomer(id: string): void {
    this.router.navigate(['/customer/edit', id]);
  }

  deleteCustomer(id: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id);
    }
  }
}