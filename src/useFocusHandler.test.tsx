import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useFocusHandler } from "./useFocusHandler";

describe("useFocusHandler", () => {
  it("suspend after timeout", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useFocusHandler());
    expect(result.current.suspended).toEqual(false);
    fireEvent.blur(window);
    expect(result.current.suspended).toEqual(false);
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.suspended).toEqual(true);
  });
  it("not suspend if focus is back before timeout", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useFocusHandler());
    expect(result.current.suspended).toEqual(false);
    fireEvent.blur(window);
    fireEvent.focus(window);
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.suspended).toEqual(false);
  });
  it("continue on onContinue called", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useFocusHandler());
    fireEvent.blur(window);
    act(() => {
      jest.runAllTimers();
    });
    act(() => {
      result.current.onContinue();
    });
    expect(result.current.suspended).toEqual(false);
  });
});
