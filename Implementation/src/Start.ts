import { app, BrowserWindow } from "electron";

import { Config } from "./Config";
import { QRCodeWindow } from "./QRCodeWindow";
import { Server } from "./Server";
import { FileExists } from "./Utilities/FileExists";
import { MoveFilesToAppData } from "./Utilities/MoveFilesToAppData";



export class MainWindow
{
    private _window: BrowserWindow;
    private _server: Server;

    constructor()
    {
        this.MoveConfig();
        app.whenReady().then(this.CreateWindow.bind(this));

        app.on("window-all-closed", () =>
        {
            if (process.platform !== "darwin")
            {
                app.quit();
            }
        });

        app.on("quit", () =>
        {
            this._window.webContents.send("stop-server");
        });

        app.on("activate", () =>
        {
            if (BrowserWindow.getAllWindows().length === 0)
            {
                this.CreateWindow();
                this._window.show();
            }
            else if (this._window)
            {
                this._window.show();
            }
        });

        this._server = new Server();

        app.on("quit", () =>
        {
            this._server.Quit();
        });
    }

    private MoveConfig(): void
    {
        if (!FileExists("$AppData/Resources/Config.json"))
        {
            // Move config file to the app-data directory for write-access
            MoveFilesToAppData("$ExtraResources/Resources/Config.json");
        }
    }

    private CreateWindow(): void
    {
        this._window = new BrowserWindow({
            width: 350,
            height: 300,
            minHeight: 300,
            minWidth: 350,
            show: true,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            }
        });

        this._window.loadURL(`file:///${__dirname}/Views/MainView/index.html?ip=${Server.IpAddress}&port=${Server.Port}`);
        // this._window.webContents.openDevTools();
        this._window.hide();

        if (Config?.qrCodeWindow?.show)
        {
            new QRCodeWindow(Server.IpAddress, Server.Port);
        }
    }
}

new MainWindow();