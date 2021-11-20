import { BrowserWindow } from "electron";
import { Observable, Subscriber } from "rxjs";

export class WebPlayer
{
    private _window: Electron.BrowserWindow;

    private _onCloseSubscriber: Subscriber<void>;

    public OnClose: Observable<void> = new Observable<void>((subscriber: Subscriber<void>) => this._onCloseSubscriber = subscriber);

    constructor(url: string)
    {
        this.CreateWindow(url);
    }

    private CreateWindow(url: string): void
    {
        this._window = new BrowserWindow({
            width: 800,
            height: 600,
            fullscreen: true
        });

        this._window.loadURL(url);

        this._window.on("close", () =>
        {
            if (this._onCloseSubscriber)
            {
                this._onCloseSubscriber.next();
            }
        });
    }

    public Close(): void
    {
        this._window.close();
        this._window.destroy();
    }
}