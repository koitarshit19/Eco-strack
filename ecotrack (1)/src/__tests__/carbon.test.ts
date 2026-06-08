import { describe, it, expect } from 'vitest';
import { CARBON_ACTIONS, MONTHLY_TREND_DATA, YEARLY_TREND_DATA } from '../data';

describe('Carbon Footprint Habit Tracker Constants & Math Specs', () => {
  it('should have all standard carbon savings actions defined with valid positive multipliers', () => {
    expect(CARBON_ACTIONS).toBeDefined();
    expect(CARBON_ACTIONS.length).toBeGreaterThan(0);
    
    CARBON_ACTIONS.forEach(action => {
      expect(action.name).toBeTypeOf('string');
      expect(action.category).toMatch(/Transport|Food|Energy/);
      expect(action.savedPerUnit).toBeGreaterThan(0);
      expect(action.unit).toBeTypeOf('string');
    });
  });

  it('should calculate correct offsets for a typical set of user activities', () => {
    const walkAction = CARBON_ACTIONS.find(a => a.name === 'Walking');
    const bikeAction = CARBON_ACTIONS.find(a => a.name === 'Biking');
    const mealAction = CARBON_ACTIONS.find(a => a.name === 'Plant-based Meal');

    expect(walkAction).toBeDefined();
    expect(bikeAction).toBeDefined();
    expect(mealAction).toBeDefined();

    if (walkAction && bikeAction && mealAction) {
      // Test cumulative walking formula: 5km walk
      const walkSaved = 5 * walkAction.savedPerUnit;
      expect(walkSaved).toBeCloseTo(2.0, 5);

      // Test cumulative biking formula: 10km bike ride
      const bikeSaved = 10 * bikeAction.savedPerUnit;
      expect(bikeSaved).toBeCloseTo(3.0, 5);

      // Test dietary shift formula: 3 plant-based meals
      const mealSaved = 3 * mealAction.savedPerUnit;
      expect(mealSaved).toBeCloseTo(6.3, 5);

      // Combined total savings check
      const totalSaved = walkSaved + bikeSaved + mealSaved;
      expect(totalSaved).toBeCloseTo(11.3, 5);
    }
  });

  it('should contain valid historical trend statistics showing descending monthly footprints', () => {
    expect(MONTHLY_TREND_DATA).toBeDefined();
    expect(MONTHLY_TREND_DATA.length).toBe(6);

    // Verify each month's values are valid positive numbers
    MONTHLY_TREND_DATA.forEach(item => {
      expect(item.month).toBeTypeOf('string');
      expect(item.footprint).toBeGreaterThan(0);
      expect(item.saved).toBeGreaterThan(0);
    });

    // Check downward trend assertion on footprint: January to June footprint should decrease
    const janFootprint = MONTHLY_TREND_DATA[0].footprint;
    const junFootprint = MONTHLY_TREND_DATA[5].footprint;
    expect(junFootprint).toBeLessThan(janFootprint);
  });

  it('should contain valid historical trend statistics showing descending yearly footprints', () => {
    expect(YEARLY_TREND_DATA).toBeDefined();
    expect(YEARLY_TREND_DATA.length).toBe(6);

    YEARLY_TREND_DATA.forEach(item => {
      expect(item.month).toBeTypeOf('string'); // represents year
      expect(item.footprint).toBeGreaterThan(0);
      expect(item.saved).toBeGreaterThan(0);
    });

    const yr2021Footprint = YEARLY_TREND_DATA[0].footprint;
    const yr2026Footprint = YEARLY_TREND_DATA[5].footprint;
    expect(yr2026Footprint).toBeLessThan(yr2021Footprint);
  });
});
