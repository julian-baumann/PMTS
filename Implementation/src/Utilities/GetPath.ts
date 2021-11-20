import electron from "electron";
import path from "path";

export function GetPath(fileName: string): string
{
    let filePath: string = fileName;

    if (fileName.startsWith("$AppData/"))
    {
        const userDataPath: string = (electron.app || electron.remote.app).getPath("userData");

        let rootDirectory: string;

        if (process.env.APP_DEV)
        {
            rootDirectory = path.dirname(require.main.filename);
        }
        else
        {
            rootDirectory = userDataPath;
        }

        filePath = `${rootDirectory}/${fileName.split("$AppData/")[1]}`;
    }

    return filePath;
}