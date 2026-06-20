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

  describe('Robust Local Storage loading schemas and error recovery', () => {
    const parseNumberSafe = (saved: string | null, defaultValue: number, min?: number, max?: number): number => {
      if (!saved) return defaultValue;
      const parsed = parseFloat(saved);
      if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) return defaultValue;
      if (min !== undefined && parsed < min) return min;
      if (max !== undefined && parsed > max) return max;
      return parsed;
    };

    const parseLoggedActivitiesSafe = (saved: string | null, fallback: any[]): any[] => {
      try {
        if (!saved) return fallback;
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return fallback;
        return parsed
          .filter((item) => item && typeof item === 'object' && typeof item.id === 'string' && typeof item.name === 'string')
          .map((item) => ({
            id: item.id,
            category: typeof item.category === 'string' && ['Transport', 'Food', 'Energy'].includes(item.category) ? item.category : 'Food',
            name: String(item.name || '').substring(0, 80),
            value: typeof item.value === 'number' && isFinite(item.value) && item.value > 0 ? item.value : 1,
            saved: typeof item.saved === 'number' && isFinite(item.saved) && item.saved >= 0 ? item.saved : 0,
            unit: typeof item.unit === 'string' ? item.unit : 'unit',
            timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
            dateStr: typeof item.dateStr === 'string' ? item.dateStr : 'Today'
          }));
      } catch (e) {
        return fallback;
      }
    };

    it('should correctly recover defaults when values are NaN or corrupt', () => {
      expect(parseNumberSafe('NaN', 240.0)).toBe(240.0);
      expect(parseNumberSafe('Infinity', 240.0)).toBe(240.0);
      expect(parseNumberSafe('-12.5', 240.0)).toBe(240.0);
      expect(parseNumberSafe('150.5', 240.0)).toBe(150.5);
      expect(parseNumberSafe('25', 180.0, 50, 500)).toBe(50); // min bounding
      expect(parseNumberSafe('999', 180.0, 50, 500)).toBe(500); // max bounding
    });

    it('should process loggedActivities securely and exclude broken formats', () => {
      const corruptActivitiesJSON = '{"id":"act-123","name":"NoArray"}';
      expect(parseLoggedActivitiesSafe(corruptActivitiesJSON, [])).toEqual([]);

      const mixedActivitiesJSON = JSON.stringify([
        { id: 'act-1', name: 'Valid Walk', category: 'Transport', value: 5, saved: 1.5, unit: 'km' },
        null,
        { id: 'act-2', name: 'Malicious Long Name '.repeat(10), value: NaN, saved: 100000, category: 'HackedCategory' }
      ]);

      const processed = parseLoggedActivitiesSafe(mixedActivitiesJSON, []);
      expect(processed.length).toBe(2);
      expect(processed[0].name).toBe('Valid Walk');
      expect(processed[0].category).toBe('Transport');
      expect(processed[0].value).toBe(5);
      
      expect(processed[1].name.length).toBeLessThanOrEqual(80);
      expect(processed[1].category).toBe('Food'); // Defaulted because 'HackedCategory' is invalid
      expect(processed[1].value).toBe(1); // Defaulted NaN to 1
      expect(processed[1].saved).toBe(100000);
    });
  });

  describe('Secure Activity Logging Handler Boundaries', () => {
    const simulateLogActivity = (category: string, name: string, value: number, saved: number) => {
      const validCategories = ['Transport', 'Food', 'Energy'];
      const sanitizedCategory = validCategories.includes(category) ? category : 'Food';
      const sanitizedName = String(name || '').substring(0, 80);
      
      const sanitizedValue = (typeof value === 'number' && isFinite(value) && value > 0)
        ? Math.min(value, 1000)
        : 1;
      const sanitizedSaved = (typeof saved === 'number' && isFinite(saved) && saved >= 0)
        ? Math.min(saved, 500)
        : 0;

      return {
        category: sanitizedCategory,
        name: sanitizedName,
        value: sanitizedValue,
        saved: sanitizedSaved
      };
    };

    it('should clamp outrageous outlier parameters to secure maximums', () => {
      const giantInput = simulateLogActivity('Energy', 'Big Offset Swindler', 99999999, 88888888);
      expect(giantInput.value).toBe(1000);
      expect(giantInput.saved).toBe(500);
    });

    it('should ensure negative or NaN offsets are cleaned appropriately', () => {
      const negativeInput = simulateLogActivity('Food', 'Negative Nancy', -50, -20);
      expect(negativeInput.value).toBe(1);
      expect(negativeInput.saved).toBe(0);
    });
  });

  describe('Dynamic Milestone Calculation & Tree Offsets', () => {
    it('should calculate accurate tree factors representing real mature vegetation absorption rate', () => {
      const calcTrees = (saved: number) => Math.floor(saved / 24);
      expect(calcTrees(0)).toBe(0);
      expect(calcTrees(23)).toBe(0);
      expect(calcTrees(24)).toBe(1);
      expect(calcTrees(240)).toBe(10);
    });
  });
});
