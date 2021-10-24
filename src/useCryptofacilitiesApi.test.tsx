import { act, renderHook } from "@testing-library/react-hooks";
import { useCryptofacilitiesApi } from "./useCryptofacilitiesApi";

const actualWebSocket = WebSocket;
const mockWebSocket: any = {
  OPEN: actualWebSocket.OPEN,
  readyState: actualWebSocket.CONNECTING,
  send: jest.fn(),
  close: jest.fn(),
};

describe("useCryptofacilitiesApi", () => {
  let webSocketSpy: jest.SpyInstance | undefined;

  beforeEach(() => {
    jest.clearAllMocks();

    webSocketSpy = jest
      .spyOn(global, "WebSocket")
      .mockImplementation(() => mockWebSocket);
  });

  it("subscribe on mount and unsubscribe on unmount", () => {
    const { unmount } = renderHook(() => useCryptofacilitiesApi());
    expect(webSocketSpy).toBeCalledTimes(1);
    expect(mockWebSocket.close).toBeCalledTimes(0);
    unmount();
    expect(mockWebSocket.close).toBeCalledTimes(1);
  });

  it("send open and close messages", () => {
    const { unmount } = renderHook(() => useCryptofacilitiesApi());
    act(() => mockWebSocket.onopen());
    mockWebSocket.readyState = actualWebSocket.OPEN;
    expect(mockWebSocket.send).toBeCalledTimes(1);
    unmount();
    expect(mockWebSocket.send).toBeCalledTimes(2);
  });

  it("ignore bad message", () => {
    const { result } = renderHook(() => useCryptofacilitiesApi());
    act(() => mockWebSocket.onopen());
    mockWebSocket.readyState = actualWebSocket.OPEN;
    act(() => mockWebSocket.onmessage({ data: "" }));
    expect(result.current.loading).toEqual(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it("return error on connection error", () => {
    const { result } = renderHook(() => useCryptofacilitiesApi());
    expect(result.current.loading).toEqual(true);
    act(() => mockWebSocket.onerror(new Error("Connection Issue!")));
    mockWebSocket.readyState = actualWebSocket.CLOSED;
    expect(result.current.loading).toEqual(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });
});
