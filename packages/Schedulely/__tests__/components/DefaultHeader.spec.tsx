import { DefaultHeader } from '@/components';
import { HeaderComponentProps } from '@/types';
import { RenderResult, fireEvent, render } from '@testing-library/react';
import chance from 'chance';

const onNextMonthHandler = jest.fn(() => null);
const onNextYearHandler = jest.fn(() => null);
const onPrevMonthHandler = jest.fn(() => null);
const onPrevYearHandler = jest.fn(() => null);

const defaults: HeaderComponentProps = {
  month: chance().month(),
  year: Number.parseInt(chance().year()),
  isCurrentMonth: true,
  onNextMonth: onNextMonthHandler,
  onNextYear: onNextYearHandler,
  onPrevMonth: onPrevMonthHandler,
  onPrevYear: onPrevYearHandler,
  componentSize: 'large',
};

describe('DefaultHeader', () => {
  describe('header text', () => {
    it('displays correct text', () => {
      var testObject = render(<DefaultHeader {...defaults} />);

      expect(testObject.getByRole('heading').textContent).toEqual(
        `${defaults.month} - ${defaults.year}`
      );
    });

    it('displays correct text size for large display', () => {
      var testObject = render(<DefaultHeader {...defaults} />);
      expect(testObject.getByRole('heading').style.fontSize).toEqual('1.5em');
    });

    it('displays correct text size for medium display', () => {
      var testObject = render(
        <DefaultHeader {...defaults} componentSize={'medium'} />
      );
      expect(testObject.getByRole('heading').style.fontSize).toEqual('1.3em');
    });

    it('displays correct text size for small display', () => {
      var testObject = render(
        <DefaultHeader {...defaults} componentSize={'small'} />
      );
      expect(testObject.getByRole('heading').style.fontSize).toEqual('1.1em');
    });
  });

  describe('isCurrentMonth', () => {
    describe('is true', () => {
      let testObject: RenderResult;

      beforeEach(() => {
        testObject = render(<DefaultHeader {...defaults} />);
      });

      it('indicator is rendered', () =>
        expect(testObject.getByRole('alert')).not.toBeNull());
    });

    describe('is false', () => {
      let testObject: RenderResult;

      beforeEach(
        () =>
          (testObject = render(
            <DefaultHeader {...defaults} isCurrentMonth={false} />
          ))
      );

      it('indicator is rendered', () =>
        expect(testObject.queryByRole('alert')).toBeNull());
    });

    describe('onClick', () => {
      let testObject: RenderResult;

      beforeEach(() => (testObject = render(<DefaultHeader {...defaults} />)));

      it('for previous month calls handler', () => {
        fireEvent.click(testObject.getByTitle('Previous Month'));
        expect(onPrevMonthHandler).toHaveBeenCalled();
      });

      it('for next month calls handler', () => {
        fireEvent.click(testObject.getByTitle('Next Month'));
        expect(onNextMonthHandler).toHaveBeenCalled();
      });

      it('for previous year calls handler', () => {
        fireEvent.click(testObject.getByTitle('Previous Year'));
        expect(onPrevYearHandler).toHaveBeenCalled();
      });

      it('for next year calls handler', () => {
        fireEvent.click(testObject.getByTitle('Next Year'));
        expect(onNextYearHandler).toHaveBeenCalled();
      });
    });
  });
});