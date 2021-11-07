import { fireEvent } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useDimensions } from "./useDimensions";

describe("useDimensions", () => {
  test("return dimensions after debouncing", () => {
    jest.useFakeTimers();
    const targetRefMock = {
      current: {
        offsetWidth: 100,
        offsetHeight: 200,
      } as any,
    };
    const { result } = renderHook(() => useDimensions(targetRefMock));
    expect(result.current).toEqual({
      width: 100,
      height: 200,
    });
    fireEvent(window, new Event("resize"));
    targetRefMock.current.offsetWidth = 200;
    targetRefMock.current.offsetHeight = 300;
    expect(result.current).toEqual({
      width: 100,
      height: 200,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(result.current).toEqual({
      width: 200,
      height: 300,
    });
    jest.useRealTimers();
  });
});
