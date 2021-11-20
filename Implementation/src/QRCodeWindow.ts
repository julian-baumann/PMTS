import { BrowserWindow } from "electron";

import { Config } from "./Config";
import { WriteFile } from "./Utilities/WriteFile";

export class QRCodeWindow
{
    private _window: Electron.BrowserWindow;
    private _ipAddress: string;
    private _port: number;

    constructor(ipAddress: string, port: number)
    {
        this._ipAddress = ipAddress;
        this._port = port;

        this.CreateWindow();
    }

    private CreateWindow(): void
    {
        this._window = new BrowserWindow({
            width: Config?.qrCodeWindow?.size || 300,
            height: Config?.qrCodeWindow?.size || 300,
            x: Config?.qrCodeWindow?.x || 0,
            y: Config?.qrCodeWindow?.y || 0,
            useContentSize: true,
            alwaysOnTop: Config?.qrCodeWindow?.alwaysOnTop || true
        });

        this._window.setAspectRatio(1/1);

        this._window.on("resize", (event: any) =>
        {
            const bounds: any = event.sender.getBounds();
            Config.qrCodeWindow.size = bounds.width;

            WriteFile("$AppData/Resources/Config.json", Config);
        });

        this._window.on("move", (event: any) =>
        {
            const bounds: any = event.sender.getBounds();
            Config.qrCodeWindow.x = bounds.x;
            Config.qrCodeWindow.y = bounds.y;

            WriteFile("$AppData/Resources/Config.json", Config);
        });

        this._window.loadURL(`file:///${__dirname}/Views/QRCodeWindow/index.html?ip=${this._ipAddress}&port=${this._port}`);
    }
}