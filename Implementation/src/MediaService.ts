import childProcess from "child_process";
import fileUpload from "express-fileupload";

import { MediaType } from "./Entities/FileType";
import { PlaylistItem } from "./Entities/PlaylistItem";
import { ImagePlayer } from "./ImagePlayer";
import { Server } from "./Server";
import { VideoPlayer } from "./VideoPlayer";
import { WebPlayer } from "./WebPlayer";


export class MediaService
{
    // Singleton
    private static _instance: MediaService;
    public static get Instance(): MediaService
    {
        if (!MediaService._instance)
        {
            MediaService._instance = new MediaService();
        }

        return MediaService._instance;
    }

    private _youtubeRegex: RegExp = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;

    private _commandInstance: childProcess.ChildProcess;
    private _playerInstance: WebPlayer | VideoPlayer | ImagePlayer;

    public IsPlaying: boolean = false;
    public Playlist: Array<PlaylistItem> = [];

    constructor()
    {
        this.PlayMedia();
    }

    private GetMimeTypeFromBase64(encodedBase64: string): string
    {
        let result: string;

        const mime: RegExpMatchArray = encodedBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

        if (mime && mime.length)
        {
            result = mime[1];
        }

        return result;
    }

    private GetMediaTypeFromMimeType(mimeType: string): MediaType
    {
        switch(mimeType)
        {
            case "video/mp4":
            case "video/x-flv":
            case "application/x-mpegURL":
            case "video/3gpp":
            case "video/quicktime":
            case "video/x-ms-wmv":
                return  MediaType.Video;

            case "image/png":
            case "image/jpeg":
                return MediaType.Photo;

            case "image/gif":
                return MediaType.Gif;

            default:
                return;
        }
    }


    private OnClose(media: PlaylistItem): void
    {
        const indexOfMedia: number = this.Playlist.indexOf(media);
        const spliceResult: Array<PlaylistItem> = this.Playlist.splice(indexOfMedia, 1);

        if (spliceResult?.length > 0)
        {
            Server.SendSocketMessage("IsNotPlaying");

            this.IsPlaying = false;

            if (this.Playlist.length > 0)
            {
                // Restart this method when there are videos left in the queue
                this.PlayMedia();
            }
        }
    }


    public StopPlayback(): boolean
    {
        if (this._commandInstance && this.IsPlaying)
        {
            const killResult: boolean = this._commandInstance.kill("SIGINT");

            if (killResult)
            {
                return true;
            }

        }
        else if (this._playerInstance && this.IsPlaying)
        {
            if (this._playerInstance)
            {
                this._playerInstance.Close();
            }

            return true;
        }

        return false;
    }


    public PlayMedia(): void
    {
        for (const media of this.Playlist)
        {
            if (!this.IsPlaying)
            {
                this.IsPlaying = true;

                if (media.Type == MediaType.Link)
                {
                    this._playerInstance = new WebPlayer(media.Link);
                }
                else if (media.Type == MediaType.YoutubeLink)
                {
                    const link: string = `http://www.youtube.com/embed/${media.Link}?autoplay=1`;
                    this._playerInstance = new WebPlayer(link);
                }
                else if (media.Type == MediaType.Photo || media.Type == MediaType.Gif)
                {
                    this._playerInstance = new ImagePlayer(media.Data);
                }
                else
                {
                    this._playerInstance = new VideoPlayer(media.Data);
                }

                this._playerInstance.OnClose.subscribe(this.OnClose.bind(this, media));

                Server.SendSocketMessage("IsPlaying");
            }
        }
    }

    public AddLink(link: string): void
    {
        const newPlaylistItem: PlaylistItem = {
            Link: link,
            Type: MediaType.Link
        };

        const youtubeLinkRegexOutput: any = link.match(this._youtubeRegex);

        if (youtubeLinkRegexOutput && youtubeLinkRegexOutput[1])
        {
            newPlaylistItem.Type = MediaType.YoutubeLink;
            newPlaylistItem.Link = youtubeLinkRegexOutput[1];
        }

        this.Playlist.push(newPlaylistItem);

        this.PlayMedia();
    }

    public AddBase64File(name: string, base64Data: string): void
    {
        const newPlaylistItem: PlaylistItem = {
            Name: name,
            Data: base64Data
        };

        const mimeType: string = this.GetMimeTypeFromBase64(base64Data);
        newPlaylistItem.Type = this.GetMediaTypeFromMimeType(mimeType);

        this.Playlist.push(newPlaylistItem);

        this.PlayMedia();
    }

    public AddFile(file: fileUpload.UploadedFile): void
    {
        const newPlaylistItem: PlaylistItem = {
            Name: file.name
        };

        newPlaylistItem.Type = this.GetMediaTypeFromMimeType(file.mimetype);

        newPlaylistItem.Data = `data:${file.mimetype};base64, ${file.data.toString("base64")}`;
        this.Playlist.push(newPlaylistItem);


        this.PlayMedia();
    }
}
