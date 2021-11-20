import fs from "fs";

import { GetPath } from "./GetPath";


export function ReadFile(fileName: string, parse?: boolean): any
{
    const filePath: string = GetPath(fileName);
    let result: any;

    const response: any = fs.readFileSync(filePath, "utf8");

    if (parse)
    {
        result = JSON.parse(response);
    }
    else
    {
        result = response;
    }

    return result;
}