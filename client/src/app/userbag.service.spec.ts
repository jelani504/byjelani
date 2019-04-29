import { TestBed } from '@angular/core/testing';

import { UserbagService } from './userbag.service';

describe('UserbagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserbagService = TestBed.get(UserbagService);
    expect(service).toBeTruthy();
  });
});
