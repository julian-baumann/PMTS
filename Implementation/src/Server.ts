import bodyParser from "body-parser";
import dgram from "dgram";
import express, { Express, Request, Response } from "express";
import fileUpload from "express-fileupload";
import http from "http";
import { networkInterfaces } from "os";
import WebSocket from "ws";

import { Config } from "./Config";
import { MediaService } from "./MediaService";
import QrCodeReceiver from "./Routes/QrCodeReceiver";
import ReceiverRoute from "./Routes/ReceiverRoute";
import { GetPath } from "./Utilities/GetPath";
import { MoveFilesToAppData } from "./Utilities/MoveFilesToAppData";
import { WriteFile } from "./Utilities/WriteFile";

export class Server
{
    private _app: Express = express();
    private _udpSocket: dgram.Socket;

    public static Socket: WebSocket.Server;
    public static SocketConnection: WebSocket;

    public static IpAddress: string;
    public static Port: number = Config?.port || 8010;

    constructor()
    {
        this.Start();
    }

    private Start(): void
    {
        this.StartServer();
        this.StartWebSocket();
        this.SetUpDgram();
        this.SetRoutes();
    }

    private GetIpAddress(): string
    {
        const interfaces: any = networkInterfaces();
        for (const devName in interfaces)
        {
            const iface: any = interfaces[devName];

            for (let i: number = 0; i < iface.length; i++)
            {
                const alias: any = iface[i];
                if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal)
                {
                    return alias.address;
                }
            }
        }

        return "0.0.0.0";
    }

    private async StartServer(): Promise<void>
    {
        Server.IpAddress = this.GetIpAddress();

        const server: http.Server = http.createServer(this._app);
        server.listen(Server.Port, "0.0.0.0", () =>
        {
            console.info(`ℹ️  PMTS-Server is running: http://${Server.IpAddress}:${Server.Port}`);
        });
    }

    private async SetRoutes(): Promise<void>
    {
        // Configurations
        this._app.use(fileUpload({
            createParentPath: true
        }));
        this._app.use(bodyParser.urlencoded({ limit: "1GB", extended: false }));
        this._app.use(bodyParser.json({ limit: "1GB" }));

        // Serve the client website files
        MoveFilesToAppData("$ExtraResources/Resources/ClientWebsite");
        await WriteFile("$AppData/Resources/ClientWebsite/config.js", `const serverAddress = "${Server.IpAddress}"`);
        this._app.use(express.static(GetPath("$AppData/Resources/ClientWebsite")));

        // Define routes
        this._app.use("/upload", ReceiverRoute);
        this._app.use("/qr-code", QrCodeReceiver);
        this._app.get("/stop-playback", (_request: Request, response: Response): void =>
        {
            const stopResult: boolean = MediaService.Instance.StopPlayback();
            if (stopResult)
            {
                response.status(200).json({
                    message: "ok"
                });
            }
            else
            {
                response.status(404).json({
                    message: "no playback found"
                });
            }
        });
    }

    private StartWebSocket(): void
    {
        Server.Socket = new WebSocket.Server({
            port: 8011
        });

        Server.Socket.on("connection", (connection: WebSocket) =>
        {
            Server.SocketConnection = connection;

            if (MediaService.Instance.IsPlaying)
            {
                Server.SendSocketMessage("IsPlaying");
            }
        });
    }

    private SetUpDgram(): void
    {
        // For receiving broadcasts and sending the ip of this server
        this._udpSocket = dgram.createSocket("udp4");

        this._udpSocket.on("message", (message: Buffer, client: dgram.RemoteInfo) =>
        {
            if (message.toString() == "GET_PMTS_SERVERS")
            {
                this._udpSocket.send(Server.IpAddress, client.port, client.address);
            }
        });

        this._udpSocket.bind(4212);
    }

    public static async SendSocketMessage(message: string): Promise<void>
    {
        if (Server.SocketConnection)
        {
            for (const client of Server.Socket.clients)
            {
                client.send(message);
            }
        }
    }

    public Quit(): void
    {
        this._udpSocket?.close();
        Server.Socket?.close();
    }
}
