import express, { Request, Response, Router } from "express";
import QrImage from "qr-image";

import { Server } from "../Server";

const router: Router = express.Router();

class QrCodeReceiver
{
    constructor()
    {
        router.get("/", this.GetQrCode.bind(this));
    }

    private GetQrCode(_request: Request, response: Response): void
    {
        const qrCode: any = QrImage.image(`http://${Server.IpAddress}:${Server.Port}`, { type: "svg" });
        response.type("svg");
        qrCode.pipe(response);
    }
}


new QrCodeReceiver();
export default router;