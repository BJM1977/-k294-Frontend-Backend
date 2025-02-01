import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryModifyComponent } from './category-modify.component';

describe('CategoryModifyComponent', () => {
  let component: CategoryModifyComponent;
  let fixture: ComponentFixture<CategoryModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryModifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
