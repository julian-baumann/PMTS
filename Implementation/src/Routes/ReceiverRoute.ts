import express, { Request, Response, Router } from "express";
import fileUpload from "express-fileupload";

import { MediaService } from "../MediaService";

const router: Router = express.Router();

class ReceiverRoute
{
    constructor()
    {
        router.post("/", this.ReceiveMedia.bind(this));
        router.get("/link", this.ReceiveLink.bind(this));
    }

    private ReceiveMedia(request: Request, response: Response): void
    {
        if (request.files)
        {
            response.status(200).json({
                message: "ok"
            });
            const file: fileUpload.UploadedFile = request.files[Object.keys(request.files)[0]] as fileUpload.UploadedFile;
            MediaService.Instance.AddFile(file);
        }
        else if (request.body["fileName"] && request.body["base64Data"])
        {
            response.status(200).json({
                message: "ok"
            });

            MediaService.Instance.AddBase64File(request.body["fileName"], request.body["base64Data"]);
        }
        else
        {
            response.status(400).json({
                message: "No file provided"
            });
        }
    }

    private ReceiveLink(request: Request, response: Response): void
    {
        if (request.query["url"])
        {
            response.status(200).json({
                message: "ok"
            });
            MediaService.Instance.AddLink(request.query["url"] as string);
        }
        else
        {
            response.status(400).json({
                message: "No link url provided"
            });
        }
    }
}


new ReceiverRoute();
export default router;