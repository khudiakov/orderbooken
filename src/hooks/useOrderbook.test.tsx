import { act, renderHook } from "@testing-library/react-hooks";
import { useOrderbook } from "./useOrderbook";

const actualWebSocket = WebSocket;
const mockWebSocket: any = {
  OPEN: actualWebSocket.OPEN,
  readyState: actualWebSocket.CONNECTING,
  send: jest.fn(),
  close: jest.fn(),
};

describe("useOrderbook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global, "WebSocket").mockImplementation(() => mockWebSocket);
  });

  it("return databook", () => {
    const { result } = renderHook(() =>
      useOrderbook({ productId: "PI_XBTUSD" })
    );
    expect(result.current).toEqual({
      ready: false,
      spread: 0,
      spreadPercentage: 0,
      asks: { offers: [], total: 0 },
      bids: { offers: [], total: 0 },
    });
    act(() => mockWebSocket.onopen());
    mockWebSocket.readyState = actualWebSocket.OPEN;
    act(() =>
      mockWebSocket.onmessage({
        data: '{"numLevels":25,"feed":"book_ui_1_snapshot","bids":[[60693.5,500],[60693,2213]],"asks":[[60708.5,500],[60716,6321]],"product_id":"PI_XBTUSD"}',
      })
    );
    expect(result.current).toEqual({
      ready: true,
      spread: 15,
      spreadPercentage: 0.02,
      asks: {
        offers: [
          { price: 60708.5, size: 500, total: 500 },
          { price: 60716, size: 6321, total: 6821 },
        ],
        total: 6821,
      },
      bids: {
        offers: [
          { price: 60693.5, size: 500, total: 500 },
          { price: 60693, size: 2213, total: 2713 },
        ],
        total: 2713,
      },
    });
    act(() =>
      mockWebSocket.onmessage({
        data: '{"feed":"book_ui_1","product_id":"PI_XBTUSD","bids":[[60693.5,0],[60693,213]],"asks":[[60708.5,0], [60709,100],[60716,321]]}',
      })
    );
    expect(result.current).toEqual({
      ready: true,
      spread: 16,
      spreadPercentage: 0.03,
      asks: {
        total: 421,
        offers: [
          { price: 60709, size: 100, total: 100 },
          { price: 60716, size: 321, total: 421 },
        ],
      },
      bids: { total: 213, offers: [{ price: 60693, size: 213, total: 213 }] },
    });
  });
});
