import { DayComponentProps, InternalCalendarEvent } from '@/types';
import { DefaultDay } from '@/components';
import { RenderResult, fireEvent, render } from '@testing-library/react';
import chance from 'chance';

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
const onClickHandler = jest.fn((events: InternalCalendarEvent[]) => null);
const defaults: DayComponentProps = {
  isCurrentMonth: true,
  isOverflowed: true,
  isToday: true,
  dateNumber: chance().integer({ min: 1, max: 31 }),
  events: testEvents,
  onClick: onClickHandler,
};

describe('DefaultDay', () => {
  describe('isCurrentMonth', () => {
    it('displays correct class for current month', () => {
      const testObject = render(<DefaultDay {...defaults} />);
      expect(testObject.getByRole('cell').className).toContain(
        'default-day-current'
      );
    });

    it('displays correct class for sibling month', () => {
      const testObject = render(
        <DefaultDay {...defaults} isCurrentMonth={false} />
      );
      expect(testObject.getByRole('cell').className).toContain(
        'default-day-sibling'
      );
    });
  });

  describe('isOverflowed', () => {
    describe('is true', () => {
      let testObject: RenderResult;

      beforeEach(() => {
        testObject = render(<DefaultDay {...defaults} />);
      });

      it('renders indicator', () => {
        expect(testObject.getByRole('note')).toBeVisible();
      });

      it('indicator has help text', () => {
        expect(testObject.getByRole('note').title).not.toBeNull();
      });

      describe('onClick handler', () => {
        beforeEach(() => {
          fireEvent.click(testObject.getByRole('note'));
        });

        it('fires', () => expect(onClickHandler).toHaveBeenCalled());

        it('passes events as args', () =>
          expect(onClickHandler.mock.calls[0][0]).toEqual(testEvents));
      });
    });

    describe('is false', () => {
      let testObject: RenderResult;

      beforeEach(() => {
        testObject = render(<DefaultDay {...defaults} isOverflowed={false} />);
      });

      it('indicator not rendered', () =>
        expect(testObject.queryByRole('note')).toBeNull());
    });
  });

  describe('isToday', () => {
    describe('is true', () => {
      let testObject: RenderResult;

      beforeEach(() => {
        testObject = render(<DefaultDay {...defaults} />);
      });

      it('displays indicator', () => {
        expect(
          testObject.getByRole('heading').querySelector('div')?.className
        ).toContain('default-day-header--indicator');
      });

      it('renders date number', () => {
        expect(
          testObject.getByRole('heading').querySelector('div span')?.textContent
        ).toEqual(defaults.dateNumber.toString());
      });
    });

    describe('is false', () => {
      let testObject: RenderResult;

      beforeEach(() => {
        testObject = render(<DefaultDay {...defaults} isToday={false} />);
      });

      it('indicator not rendered if false', () =>
        expect(
          testObject.getByRole('heading').querySelector('div')
        ).toBeNull());

      it('renders date number', () =>
        expect(
          testObject.getByRole('heading').querySelector('span')?.textContent
        ).toEqual(defaults.dateNumber.toString()));
    });
  });
});
