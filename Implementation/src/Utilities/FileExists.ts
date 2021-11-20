import fs from "fs";

import { GetPath } from "./GetPath";


export function FileExists(fileName: string): boolean
{
    const filePath: string = GetPath(fileName);

    const response: boolean = fs.existsSync(filePath);


    return response;
}