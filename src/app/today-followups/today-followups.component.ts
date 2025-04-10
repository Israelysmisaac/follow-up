import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService, Customer } from '../services/customer.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-today-followups',
  templateUrl: './today-followups.component.html',
  styleUrls: ['./today-followups.component.css']
})
export class TodayFollowupsComponent implements OnInit {
  todayFollowups$: Observable<Customer[]>;
  allCustomers$: Observable<Customer[]>;
  filteredCustomers$: Observable<Customer[]>;
  
  private searchTerms = new BehaviorSubject<string>('');
  searchValue: string = '';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {
    this.todayFollowups$ = this.customerService.getTodayFollowups();
    this.allCustomers$ = this.customerService.getCustomers();
    
    // Create the filtered customers observable
    this.filteredCustomers$ = combineLatest([
      this.allCustomers$,
      this.searchTerms
    ]).pipe(
      map(([customers, searchTerm]) => {
        if (!searchTerm.trim()) {
          return customers;
        }
        
        const term = searchTerm.toLowerCase();
        return customers.filter(customer => 
          customer.name.toLowerCase().includes(term) || 
          customer.contactInfo.toLowerCase().includes(term) ||
          (customer.notes && customer.notes.toLowerCase().includes(term))
        );
      })
    );
  }

  ngOnInit(): void {
    // Component initialization logic
  }

  search(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchValue = input.value;
    this.searchTerms.next(input.value);
  }

  clearSearch(): void {
    this.searchValue = '';
    this.searchTerms.next('');
  }

  setNextFollowup(customer: Customer, days: number): void {
    this.customerService.setFollowupDate(customer.id, days);
    // Refresh the lists
    this.todayFollowups$ = this.customerService.getTodayFollowups();
  }

  editCustomer(id: string): void {
    this.router.navigate(['/customer/edit', id]);
  }

  deleteCustomer(id: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id);
      // Refresh the lists after deletion
      this.todayFollowups$ = this.customerService.getTodayFollowups();
    }
  }
}