import { ActionProvider } from '@/providers';
import { InternalCalendarEvent } from '@/types';
import { ReactNode } from 'react';
import { act } from 'react-test-renderer';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useActions } from '@/hooks';

const testEvents: InternalCalendarEvent[] = [
  {
    id: '123-abc',
    start: new Date(),
    end: new Date(),
    summary: 'testEvent',
    color: 'red',
    visible: false,
  },
];

const onEventClickHandler = jest.fn((event: InternalCalendarEvent) => null);
let onMonthChangeClickHandler = jest.fn(
  (firstOfMonth: Date, lastOfMonth: Date) => null
);
let onMoreEventClickHandler = jest.fn((event: InternalCalendarEvent[]) => null);

const wrapper = ({ children }: { children: ReactNode }) => (
  <ActionProvider
    actions={{
      onEventClick: onEventClickHandler,
      onMonthChangeClick: onMonthChangeClickHandler,
      onMoreEventClick: onMoreEventClickHandler,
    }}
  >
    {children}
  </ActionProvider>
);

describe('useActions', () => {
  const {
    result: {
      current: { onEventClick, onMonthChangeClick, onMoreEventClick },
    },
  } = renderHook(() => useActions(), { wrapper });

  describe('onEventClick', () => {
    onEventClick(testEvents[0]);

    it('invokes correct function', () => {
      expect(onEventClickHandler).toHaveBeenCalled();
    });

    it('passes correct args', () =>
      expect(onEventClickHandler.mock.calls[0][0]).toEqual(testEvents[0]));
  });

  describe('onMonthChangeClick', () => {
    const monthStart = new Date(2000, 1, 1);
    const monthEnd = new Date(2000, 2, 1);

    onMonthChangeClick(monthStart, monthEnd);

    it('invokes correct function', () => {
      expect(onMonthChangeClickHandler).toHaveBeenCalled();
    });

    it('passes correct args', () => {
      expect(onMonthChangeClickHandler.mock.calls[0][0]).toEqual(monthStart);
      expect(onMonthChangeClickHandler.mock.calls[0][1]).toEqual(monthEnd);
    });
  });

  describe('onMoreEventClick', () => {
    describe('when defined', () => {
      onMoreEventClick(testEvents);

      it('invokes correct function', () => {
        expect(onMoreEventClickHandler).toHaveBeenCalled();
      });

      it('passes correct args', () =>
        expect(onMoreEventClickHandler.mock.calls[0][0]).toEqual(testEvents));
    });
  });

  it('throws when called outside of provider', () => {
    const ExceptionWrapper = () => {
      expect(useActions).toThrowError(/must be used within/);
      return <></>;
    };
    render(<ExceptionWrapper />);
  });

  describe('if Action undefined', () => {
    const emptyWrapper = ({ children }: { children: ReactNode }) => (
      <ActionProvider>{children}</ActionProvider>
    );

    const {
      result: {
        current: { onEventClick, onMonthChangeClick, onMoreEventClick },
      },
    } = renderHook(() => useActions(), { wrapper: emptyWrapper });

    beforeEach(() => {
      onMoreEventClickHandler.mockClear();
      onEventClickHandler.mockClear();
      onMonthChangeClickHandler.mockClear();
    });

    it('does not invoke onMoreEventClick if not defined', () => {
      onMoreEventClick(testEvents);
      expect(onMoreEventClickHandler).not.toHaveBeenCalled();
    });

    it('does not invoke onEventClick if not defined', () => {
      onEventClick(testEvents[0]);
      expect(onEventClickHandler).not.toHaveBeenCalled();
    });

    it('does not invoke onMonthChangeClick if not defined', () => {
      onMonthChangeClick(new Date(), new Date());
      expect(onMonthChangeClickHandler).not.toHaveBeenCalled();
    });
  });
});