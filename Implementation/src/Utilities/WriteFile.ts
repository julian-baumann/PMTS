import fs from "fs";

import { GetPath } from "./GetPath";


export async function WriteFile(fileName: string, rawContent: any): Promise<any>
{
    const filePath: string = GetPath(fileName);
    let content: string;

    if (typeof rawContent === "string")
    {
        content = rawContent;
    }
    else
    {
        content = JSON.stringify(rawContent, null, 4);
    }

    return (await fs.promises.writeFile(filePath, content));
}