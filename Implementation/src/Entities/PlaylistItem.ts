import { MediaType } from "./FileType";

export interface PlaylistItem
{
    Name?: string;
    Type?: MediaType;
    Data?: string;
    Link?: string;
    Path?: string;
}