#!/usr/bin/python3.9
import sys
import datetime
import yfinance as yf
import matplotlib.pyplot as plt
import random, string

def price(ticker: str, _period: str = '1mo', _interval: str = '1d'):
    stock = yf.Ticker(ticker)
    hist = stock.history(period = _period, debug = False, interval = _interval)
    if hist.empty:
        raise Exception('No ticker info')
    
    #print(hist)
    openCloseData = hist[['Open', 'Close']]
    # print(openCloseData)
    
    plt.style.use('dark_background')
    fig, ax = plt.subplots()
    ax.plot(hist[['Open']], color = '#8BBF56', linewidth = 1, markersize = 0, label = 'Open')
    ax.plot(hist[['Close']], color = '#BF8B56', linewidth = 1, markersize = 0, linestyle = 'dashed', label = 'Close')
    leg = ax.legend(frameon = False)
    ax.patch.set_alpha(0)
    
    plt.title(f"{ticker.upper()}")
    plt.xticks(rotation=45)
    plt.legend()
    # plt.show()
    plt.tight_layout()
    name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)) + '.png'
    fig.savefig(name, transparent = True)
    print(name)

def main():
    if len(sys.argv) == 2:
        price(sys.argv[1], _period = '5d', _interval = '1h')
    if len(sys.argv) == 3:
        if sys.argv[2] == 'default':
            price(sys.argv[1])
        else:
            price(sys.argv[1], _period = sys.argv[2], _interval = '1d')
    if len(sys.argv) == 4:
        price(sys.argv[1], _period = sys.argv[2], _interval = sys.argv[3])

if __name__ == "__main__":
    main()