import { BrowserWindow } from "electron";
import { Observable, Subscriber } from "rxjs";

export class ImagePlayer
{
    private _window: Electron.BrowserWindow;

    private _onCloseSubscriber: Subscriber<void>;

    public OnClose: Observable<void> = new Observable<void>((subscriber: Subscriber<void>) => this._onCloseSubscriber = subscriber);

    constructor(base64Data: string)
    {
        this.CreateWindow(base64Data);
    }

    private CreateWindow(base64Data: string): void
    {
        this._window = new BrowserWindow({
            width: 800,
            height: 600,
            fullscreen: true,
            webPreferences: {
                nodeIntegration: true
            }
        });

        this._window.loadFile(`${__dirname}/Views/ImagePlayer/index.html`);

        this._window.on("close", () =>
        {
            if (this._onCloseSubscriber)
            {
                this._onCloseSubscriber.next();
            }
        });

        this._window.webContents.on("did-finish-load", () =>
        {
            this._window.webContents.send("data", base64Data);
        });
    }

    public Close(): void
    {
        this._window.close();
        this._window.destroy();
    }
}