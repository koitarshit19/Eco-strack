import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../store/useStore';
import { storedDataSchema } from '../store/schema';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      totalSaved: 0,
      currentFootprint: 100,
      footprintGoal: 80,
      loggedActivities: [],
      achievements: [],
      dailyMissionCompleted: false,
      toasts: [],
      darkMode: false,
    });
  });

  it('toggles dark mode', () => {
    const store = useStore.getState();
    expect(store.darkMode).toBe(false);
    store.setDarkMode(true);
    expect(useStore.getState().darkMode).toBe(true);
  });

  it('updates footprint goal', () => {
    useStore.getState().setFootprintGoal(120);
    expect(useStore.getState().footprintGoal).toBe(120);
  });

  it('adds and removes toast', () => {
    useStore.getState().makeToast('Walking', 2.0);
    expect(useStore.getState().toasts.length).toBe(1);
    expect(useStore.getState().toasts[0].actionName).toBe('Walking');
    
    const toastId = useStore.getState().toasts[0].id;
    useStore.getState().removeToast(toastId);
    expect(useStore.getState().toasts.length).toBe(0);
  });

  it('logs activity successfully', () => {
    useStore.getState().logActivity('Transport', 'Walking', 5, 2.0);
    
    const state = useStore.getState();
    expect(state.loggedActivities.length).toBe(1);
    expect(state.loggedActivities[0].name).toBe('Walking');
    expect(state.loggedActivities[0].value).toBe(5);
    expect(state.totalSaved).toBe(2.0);
  });

  it('handles invalid log activity data implicitly through schema fallback', () => {
    const initialSaved = useStore.getState().totalSaved;
    // @ts-ignore Let's trigger a failure for category parsing
    useStore.getState().logActivity('HackedCategory', 'Walking', -5, -4);
    
    expect(useStore.getState().loggedActivities.length).toBe(1);
    expect(useStore.getState().loggedActivities[0].category).toBe('Food'); // default
    expect(useStore.getState().loggedActivities[0].value).toBe(1); // default clamped for <0
    expect(useStore.getState().loggedActivities[0].saved).toBe(0); // default clamped for <0
  });

  it('updates Plant-based Meal achievement', () => {
    useStore.setState({
      achievements: [{
        id: 'ach-3',
        name: 'Plant-powered',
        description: 'Test',
        iconType: 'gourmet',
        savedText: 'test',
        locked: true,
        progressPercentage: 40,
        level: 1
      }]
    });
    useStore.getState().logActivity('Food', 'Plant-based Meal', 1, 2.5);
    const ach = useStore.getState().achievements.find(a => a.id === 'ach-3')!;
    expect(ach.progressPercentage).toBe(60);
    expect(ach.level).toBe(2);
  });

  it('determines correct units for activities', () => {
    useStore.getState().logActivity('Energy', 'Turn off lights', 2, 1);
    expect(useStore.getState().loggedActivities[0].unit).toBe('hrs');
    
    // @ts-ignore
    useStore.getState().logActivity('Waste', 'Recycle plastic', 1, 1);
    expect(useStore.getState().loggedActivities[0].unit).toBe('lbs');
    
    useStore.getState().logActivity('Transport', 'Unknown action', 1, 1);
    expect(useStore.getState().loggedActivities[0].unit).toBe('unit');
  });

  it('unlocks solar achievement', () => {
    useStore.setState({
      achievements: [{
        id: 'ach-1',
        name: 'Solar Energy',
        description: 'Test',
        iconType: 'solar',
        savedText: 'test',
        locked: true,
        progressPercentage: 40,
        level: 1
      }, {
        id: 'ach-X',
        name: 'Other',
        description: 'Test',
        iconType: 'solar',
        savedText: 'test',
        locked: true,
        progressPercentage: 0,
        level: 1
      }]
    });
    useStore.getState().unlockSolar();
    expect(useStore.getState().achievements[0].locked).toBe(false);
  });

  it('survives hydration schema failure', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const safeParseSpy = vi.spyOn(storedDataSchema, 'safeParse').mockImplementationOnce(() => {
      throw new Error('Simulated Hydration Failure');
    });

    const mergeFn = useStore.persist.getOptions().merge;
    if (mergeFn) {
      const currentState = useStore.getState();
      const result = mergeFn({ totalSaved: 'garbage' }, currentState);
      expect(result).toBe(currentState);
      expect(errorSpy).toHaveBeenCalledWith("Hydration validation failed:", expect.any(Error));
    }

    errorSpy.mockRestore();
    safeParseSpy.mockRestore();
  });

  it('hydrates valid state', () => {
    const mergeFn = useStore.persist.getOptions().merge;
    if (mergeFn) {
      const currentState = useStore.getState();
      const result1 = mergeFn({ totalSaved: 300, darkMode: true }, currentState) as typeof currentState;
      expect(result1.totalSaved).toBe(300);
      expect(result1.darkMode).toBe(true);

      const result2 = mergeFn({ totalSaved: 400 }, currentState) as typeof currentState;
      expect(result2.darkMode).toBe(currentState.darkMode);
    }
  });

  it('tests makeToast timeout', () => {
    vi.useFakeTimers();
    useStore.getState().makeToast("Test Action", 5);
    expect(useStore.getState().toasts).toHaveLength(1);
    vi.advanceTimersByTime(4500);
    expect(useStore.getState().toasts).toHaveLength(0);
    vi.useRealTimers();
  });

  it('logs Plant-based Meal and progresses achievement', () => {
    useStore.setState({
      achievements: [{
        id: 'ach-3',
        name: 'Green Gourmet',
        description: 'Test',
        iconType: 'gourmet',
        savedText: 'test',
        locked: false,
        progressPercentage: 40,
        level: 1
      }, 
      {
        id: 'ach-4',
        name: 'Other',
        description: 'Test',
        iconType: 'gourmet',
        savedText: 'test',
        locked: false,
        progressPercentage: 40,
        level: 1
      }]
    });
    useStore.getState().logActivity('Food', 'Plant-based Meal', 1, 2);
    const ach3 = useStore.getState().achievements.find(a => a.id === 'ach-3');
    expect(ach3?.progressPercentage).toBe(60);
    const ach4 = useStore.getState().achievements.find(a => a.id === 'ach-4');
    expect(ach4?.progressPercentage).toBe(40);
  });
});
