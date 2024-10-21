import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewReleasesPage } from './new-releases.page';

describe('NewReleasesPage', () => {
  let component: NewReleasesPage;
  let fixture: ComponentFixture<NewReleasesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReleasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
